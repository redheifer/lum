import { supabase } from '@/integrations/supabase/client';

interface OnboardingState {
  isComplete: boolean;
  completedSteps: string[];
  lastViewedStep: string;
  skippedTutorial: boolean;
  criticalTasksCompleted: {
    webhookConfigured: boolean;
    teamMemberInvited: boolean;
    firstCallProcessed: boolean;
  };
  lastUpdated: string;
}

const ONBOARDING_INITIAL_STATE: OnboardingState = {
  isComplete: false,
  completedSteps: [],
  lastViewedStep: 'welcome',
  skippedTutorial: false,
  criticalTasksCompleted: {
    webhookConfigured: false,
    teamMemberInvited: false,
    firstCallProcessed: false,
  },
  lastUpdated: new Date().toISOString()
};

const TABLE_EXISTS = true; // Table exists in Supabase

export const onboardingService = {
  // Check if user should see onboarding flow
  async shouldShowOnboarding(userId: string): Promise<boolean> {
    try {
      // First check local storage for quick response
      const localState = this.getLocalOnboardingState(userId);
      if (localState && localState.isComplete) {
        return false;
      }
      
      // Skip database check if table doesn't exist
      if (!TABLE_EXISTS) {
        // For new users with no local state, show onboarding
        return !localState || !localState.isComplete;
      }
      
      // Only check database if table exists
      const { data, error } = await supabase
        .from('user_onboarding')
        .select('*')
        .eq('user_id', userId)
        .single();
        
      if (error || !data) {
        // No record found, this is a first-time user
        return true;
      }
      
      return !data.is_complete;
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      return false; // Default to not showing onboarding if there's an error
    }
  },
  
  // Check if user has admin privileges
  async isUserAdmin(userId: string): Promise<boolean> {
    // Skip database check if table doesn't exist
    if (!TABLE_EXISTS) {
      // For development, you can hardcode some user IDs as admins
      const devAdminIds = ['4b80d3fb-2703-40ec-985b-8a856234e3fa']; // Add your test user ID here
      return devAdminIds.includes(userId);
    }
    
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('id')
        .eq('id', userId)
        .single();
        
      return !!data && !error;
    } catch (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
  },
  
  // Get the user's onboarding state from database
  async getOnboardingState(userId: string): Promise<OnboardingState> {
    try {
      // First check local storage for quick response
      const localState = this.getLocalOnboardingState(userId);
      
      // Only try database if table exists
      if (TABLE_EXISTS) {
        try {
          // Get all records for this user (instead of using .single())
          const { data, error } = await supabase
            .from('user_onboarding')
            .select('*')
            .eq('user_id', userId)
            .order('last_updated', { ascending: false }); // Get most recent first
          
          if (error) {
            console.warn('Error fetching onboarding state from database:', error);
            // Fall back to localStorage
          } else if (data && data.length > 0) {
            // If we have multiple records, use the most recent one
            const mostRecentRecord = data[0];
            
            // If there are duplicates, clean them up in the background
            if (data.length > 1) {
              console.warn(`Found ${data.length} onboarding records for user. Using most recent.`);
              this.cleanupDuplicateRecords(userId, data);
            }
            
            // Update localStorage with the most recent record
            this.setLocalOnboardingState(userId, mostRecentRecord);
            return mostRecentRecord as OnboardingState;
          }
        } catch (dbError) {
          console.error('Database error in getOnboardingState:', dbError);
          // Continue to fallback
        }
      }
      
      // Fallback to localStorage or create a new state
      if (localState) {
        return localState;
      }
      
      // Create initial state if nothing found
      const initialState = { ...ONBOARDING_INITIAL_STATE };
      this.setLocalOnboardingState(userId, initialState);
      
      // Try to create record in database if table exists
      if (TABLE_EXISTS) {
        this.createOnboardingState(userId, initialState).catch(err => 
          console.error('Failed to create initial onboarding state:', err)
        );
      }
      
      return initialState;
    } catch (error) {
      console.error('Error in getOnboardingState:', error);
      
      // Return default state on error
      const initialState = { ...ONBOARDING_INITIAL_STATE };
      this.setLocalOnboardingState(userId, initialState);
      return initialState;
    }
  },
  
  // Save onboarding state to both localStorage and database
  async updateOnboardingState(userId: string, updates: Partial<OnboardingState>): Promise<void> {
    try {
      // Always update localStorage
      const currentState = await this.getOnboardingState(userId);
      const updatedState = { ...currentState, ...updates, lastUpdated: new Date().toISOString() };
      this.setLocalOnboardingState(userId, updatedState);
      
      // Skip database update if table doesn't exist
      if (!TABLE_EXISTS) return;
      
      // First get the ID of the most recent record
      const { data } = await supabase
        .from('user_onboarding')
        .select('id')
        .eq('user_id', userId)
        .order('last_updated', { ascending: false })
        .limit(1);
      
      if (data && data.length > 0) {
        // Update the most recent record
        await supabase
          .from('user_onboarding')
          .update(updatedState)
          .eq('id', data[0].id);
      } else {
        // No record found, create a new one
        await this.createOnboardingState(userId, updatedState);
      }
    } catch (error) {
      console.error('Error updating onboarding state:', error);
    }
  },
  
  // Mark onboarding as complete
  async completeOnboarding(userId: string): Promise<void> {
    await this.updateOnboardingState(userId, { 
      isComplete: true 
    });
  },
  
  // Skip the tutorial but keep tracking critical tasks
  async skipTutorial(userId: string): Promise<void> {
    await this.updateOnboardingState(userId, { 
      skippedTutorial: true,
      lastViewedStep: 'skipped' 
    });
  },
  
  // Reset onboarding for a specific user (admin function)
  async resetOnboardingForUser(targetUserId: string, adminUserId: string): Promise<boolean> {
    try {
      // First verify the requesting user is an admin
      const isAdmin = await this.isUserAdmin(adminUserId);
      if (!isAdmin) {
        throw new Error('Unauthorized: Only admins can reset onboarding for users');
      }
      
      // Always clear localStorage
      localStorage.removeItem(`lum_onboarding_${targetUserId}`);
      
      // Skip database operations if table doesn't exist
      if (!TABLE_EXISTS) {
        return true;
      }
      
      // Reset the user's onboarding state in the database
      const { error } = await supabase
        .from('user_onboarding')
        .upsert({
          user_id: targetUserId,
          is_complete: false,
          completed_steps: [],
          last_viewed_step: 'welcome',
          skipped_tutorial: false,
          critical_tasks_completed: {
            webhookConfigured: false,
            teamMemberInvited: false,
            firstCallProcessed: false,
          },
          last_updated: new Date().toISOString()
        });
        
      if (error) {
        throw error;
      }
      
      return true;
    } catch (error) {
      console.error('Error resetting onboarding:', error);
      return false;
    }
  },
  
  // Update completion status of critical tasks
  async updateCriticalTask(userId: string, task: keyof OnboardingState['criticalTasksCompleted'], completed: boolean): Promise<void> {
    const state = await this.getOnboardingState(userId);
    
    const updatedTasks = {
      ...state.criticalTasksCompleted,
      [task]: completed
    };
    
    await this.updateOnboardingState(userId, {
      criticalTasksCompleted: updatedTasks
    });
    
    // Check if all critical tasks are complete
    const allCriticalTasksComplete = Object.values(updatedTasks).every(value => value === true);
    
    // If all critical tasks are complete, mark onboarding as complete even if tutorial was skipped
    if (allCriticalTasksComplete) {
      await this.completeOnboarding(userId);
    }
  },
  
  // Helper to get state from localStorage
  getLocalOnboardingState(userId: string): OnboardingState | null {
    const stored = localStorage.getItem(`lum_onboarding_${userId}`);
    if (!stored) return null;
    
    try {
      return JSON.parse(stored) as OnboardingState;
    } catch {
      return null;
    }
  },
  
  // Helper to set state in localStorage
  setLocalOnboardingState(userId: string, state: OnboardingState): void {
    localStorage.setItem(`lum_onboarding_${userId}`, JSON.stringify(state));
  },
  
  // Helper to create onboarding state in database
  async createOnboardingState(userId: string, state: OnboardingState): Promise<void> {
    try {
      const { error } = await supabase
        .from('user_onboarding')
        .insert({
          user_id: userId,
          is_complete: state.isComplete,
          completed_steps: state.completedSteps,
          last_viewed_step: state.lastViewedStep,
          skipped_tutorial: state.skippedTutorial,
          critical_tasks_completed: state.criticalTasksCompleted,
          last_updated: state.lastUpdated
        });
        
      if (error) {
        console.error('Error creating onboarding state in database:', error);
      }
    } catch (error) {
      console.error('Exception creating onboarding state:', error);
    }
  },
  
  // Add a new method to clean up duplicate records
  async cleanupDuplicateRecords(userId: string, records: any[]): Promise<void> {
    try {
      if (records.length <= 1) return; // No duplicates to clean
      
      // Keep the most recent record
      const [mostRecent, ...duplicates] = records;
      
      // Get IDs of duplicates to delete
      const duplicateIds = duplicates.map(record => record.id);
      
      // Delete the duplicates
      const { error } = await supabase
        .from('user_onboarding')
        .delete()
        .in('id', duplicateIds);
      
      if (error) {
        console.error('Failed to clean up duplicate onboarding records:', error);
      } else {
        console.log(`Successfully cleaned up ${duplicateIds.length} duplicate onboarding records.`);
      }
    } catch (error) {
      console.error('Error cleaning up duplicate records:', error);
    }
  }
}; 