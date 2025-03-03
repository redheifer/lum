import React, { useState, useEffect } from 'react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { RotateCcw, Search, Check, X } from 'lucide-react';
import { toast } from 'sonner';

interface TeamMember {
  id: string;
  email: string;
  full_name: string;
  onboarding_complete: boolean;
  last_active: string;
}

const TeamOnboardingManager: React.FC = () => {
  const { resetUserOnboarding, isAdmin } = useOnboarding();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    fetchTeamMembers();
  }, []);
  
  const fetchTeamMembers = async () => {
    if (!isAdmin) return;
    
    setIsLoading(true);
    try {
      // Get all team members with their onboarding status
      const { data, error } = await supabase
        .from('users')
        .select(`
          id,
          email,
          full_name,
          user_onboarding(is_complete, last_updated),
          user_activity(last_active)
        `);
        
      if (error) throw error;
      
      // Transform the data
      const members = data.map(user => ({
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        onboarding_complete: user.user_onboarding?.is_complete || false,
        last_active: user.user_activity?.last_active || 'Never'
      }));
      
      setTeamMembers(members);
    } catch (error) {
      console.error('Error fetching team members:', error);
      toast.error('Failed to load team members');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleResetOnboarding = async (userId: string) => {
    if (!isAdmin) return;
    
    const success = await resetUserOnboarding(userId);
    
    if (success) {
      // Update the local state
      setTeamMembers(prevMembers => 
        prevMembers.map(member => 
          member.id === userId 
            ? { ...member, onboarding_complete: false }
            : member
        )
      );
    }
  };
  
  const filteredMembers = teamMembers.filter(member => 
    member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.full_name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  if (!isAdmin) {
    return <div>You need administrator privileges to access this feature.</div>;
  }
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Team Onboarding Management</h2>
        <Button 
          variant="outline" 
          onClick={fetchTeamMembers}
          disabled={isLoading}
        >
          <RotateCcw className="h-4 w-4 mr-2" /> Refresh
        </Button>
      </div>
      
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search by name or email..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Onboarding Status</TableHead>
              <TableHead>Last Active</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6">
                  Loading team members...
                </TableCell>
              </TableRow>
            ) : filteredMembers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6">
                  No team members found
                </TableCell>
              </TableRow>
            ) : (
              filteredMembers.map(member => (
                <TableRow key={member.id}>
                  <TableCell className="font-medium">{member.full_name}</TableCell>
                  <TableCell>{member.email}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {member.onboarding_complete ? (
                        <>
                          <Check className="h-4 w-4 text-green-600 mr-1" />
                          <span>Completed</span>
                        </>
                      ) : (
                        <>
                          <X className="h-4 w-4 text-amber-600 mr-1" />
                          <span>Incomplete</span>
                        </>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{new Date(member.last_active).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleResetOnboarding(member.id)}
                      disabled={!member.onboarding_complete}
                    >
                      Reset Onboarding
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TeamOnboardingManager; 