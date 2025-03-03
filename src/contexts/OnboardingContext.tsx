import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { onboardingService } from '@/utils/onboardingService';
import { toast } from 'sonner';

interface OnboardingContextType {
  showOnboarding: boolean;
  isOnboardingComplete: boolean;
  onboardingState: any;
  updateOnboardingState: (state: any) => Promise<void>;
  completeOnboarding: () => Promise<void>;
  skipOnboarding: () => Promise<void>;
  resetAndShowOnboarding: () => Promise<void>;
  isAdmin: boolean;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const OnboardingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(true);
  const [onboardingState, setOnboardingState] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (!user) return;
      
      try {
        // Check if user is admin
        const adminStatus = await onboardingService.isUserAdmin(user.id);
        setIsAdmin(adminStatus);
        
        // Get onboarding state
        const state = await onboardingService.getOnboardingState(user.id);
        setOnboardingState(state);
        
        // IMPORTANT: Never automatically show onboarding
        setIsOnboardingComplete(true); // Always set this to true
        setShowOnboarding(false);  // Never automatically show onboarding
      } catch (error) {
        console.error('Error checking onboarding status:', error);
      }
    };
    
    checkOnboardingStatus();
  }, [user]);

  const updateOnboardingState = async (updates: any) => {
    if (!user?.id) return;
    await onboardingService.updateOnboardingState(user.id, updates);
    checkOnboardingStatus();
  };

  const completeOnboarding = async () => {
    if (!user) return;
    
    try {
      await onboardingService.completeOnboarding(user.id);
      setShowOnboarding(false);
      setIsOnboardingComplete(true);
      
      // Update local state
      setOnboardingState(prev => ({
        ...prev,
        isComplete: true
      }));
      
      toast.success('Onboarding completed successfully!');
    } catch (error) {
      console.error('Error completing onboarding:', error);
      toast.error('Failed to complete onboarding');
    }
  };

  const skipOnboarding = async () => {
    if (!user) return;
    
    try {
      await onboardingService.skipTutorial(user.id);
      setShowOnboarding(false);
      
      // Update local state
      setOnboardingState(prev => ({
        ...prev,
        skippedTutorial: true
      }));
      
      toast.info('Tutorial skipped. You can access it later from settings.');
    } catch (error) {
      console.error('Error skipping tutorial:', error);
      toast.error('Failed to skip tutorial');
    }
  };

  const updateCriticalTask = async (task: string, completed: boolean) => {
    if (!user) return;
    
    try {
      await onboardingService.updateCriticalTask(
        user.id, 
        task as keyof typeof onboardingState.criticalTasksCompleted, 
        completed
      );
      
      // Update local state
      setOnboardingState(prev => ({
        ...prev,
        criticalTasksCompleted: {
          ...prev.criticalTasksCompleted,
          [task]: completed
        }
      }));
      
      if (completed) {
        toast.success(`${task.charAt(0).toUpperCase() + task.slice(1).replace(/([A-Z])/g, ' $1')} completed!`);
      }
    } catch (error) {
      console.error('Error updating critical task:', error);
    }
  };

  const resetUserOnboarding = async (targetUserId: string) => {
    if (!user || !isAdmin) return false;
    
    try {
      const result = await onboardingService.resetOnboardingForUser(targetUserId, user.id);
      
      if (result) {
        toast.success('Onboarding reset successfully for user');
      } else {
        toast.error('Failed to reset onboarding');
      }
      
      return result;
    } catch (error) {
      console.error('Error resetting onboarding:', error);
      toast.error('Error resetting onboarding');
      return false;
    }
  };

  const resetAndShowOnboarding = async () => {
    if (!user) return;
    
    try {
      // Get current state first to preserve workspace name
      const currentState = await onboardingService.getOnboardingState(user.id);
      
      // Reset the onboarding state but keep the workspace name
      const initialState = {
        isComplete: false,
        completedSteps: [],
        lastViewedStep: 'welcome',
        skippedTutorial: false,
        criticalTasksCompleted: {
          webhookConfigured: false,
          teamMemberInvited: false,
          firstCallProcessed: false,
        },
        lastUpdated: new Date().toISOString(),
        workspaceName: currentState?.workspaceName || '' 
      };
      
      // Update the state in storage
      await onboardingService.updateOnboardingState(user.id, initialState);
      
      // Force show the onboarding
      setOnboardingState(initialState);
      setShowOnboarding(true); // This will show the wizard
      
      console.log('Onboarding wizard activated');
    } catch (error) {
      console.error('Error showing onboarding wizard:', error);
      toast.error('Failed to start setup wizard');
    }
  };

  return (
    <OnboardingContext.Provider value={{
      showOnboarding,
      isOnboardingComplete,
      onboardingState,
      updateOnboardingState,
      completeOnboarding,
      skipOnboarding,
      resetAndShowOnboarding,
      isAdmin
    }}>
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
}; 