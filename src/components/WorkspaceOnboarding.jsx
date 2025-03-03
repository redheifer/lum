import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import WebhookOnboarding from '@/components/WebhookOnboarding';

const WorkspaceOnboarding = ({ workspaceId }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [workspaceName, setWorkspaceName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateWorkspace = async () => {
    if (!workspaceName.trim()) {
      toast.error('Please enter a workspace name');
      return;
    }

    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('You must be logged in to create a workspace');
        navigate('/login');
        return;
      }
      
      // Create the workspace
      const { data: workspace, error } = await supabase
        .from('workspaces')
        .insert({
          name: workspaceName,
          created_by: user.id
        })
        .select()
        .single();
        
      if (error) {
        throw error;
      }
      
      // Add the user as the workspace owner
      const { error: memberError } = await supabase
        .from('workspace_users')
        .insert({
          workspace_id: workspace.id,
          user_id: user.id,
          role: 'owner'
        });
        
      if (memberError) {
        throw memberError;
      }
      
      toast.success('Workspace created successfully!');
      setStep(2);
      
    } catch (error) {
      console.error('Error creating workspace:', error);
      toast.error('Failed to create workspace');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container max-w-4xl mx-auto py-8">
      {step === 1 ? (
        <Card>
          <CardHeader>
            <CardTitle>Create Your Workspace</CardTitle>
            <CardDescription>
              Let's start by setting up your workspace
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Workspace Name</Label>
                <Input
                  id="name"
                  placeholder="Enter workspace name"
                  value={workspaceName}
                  onChange={(e) => setWorkspaceName(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={handleCreateWorkspace} 
              disabled={isLoading}
            >
              {isLoading ? 'Creating...' : 'Create Workspace'}
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <WebhookOnboarding workspaceId={workspaceId} />
      )}
    </div>
  );
};

export default WorkspaceOnboarding; 