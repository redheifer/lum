import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Briefcase, Edit, Eye, Plus, Trash2, Users, Layers } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';

const WorkspacesManagement = () => {
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddWorkspaceOpen, setIsAddWorkspaceOpen] = useState(false);
  const [isEditWorkspaceOpen, setIsEditWorkspaceOpen] = useState(false);
  const [isViewWorkspaceOpen, setIsViewWorkspaceOpen] = useState(false);
  const [newWorkspace, setNewWorkspace] = useState({
    name: '',
    description: '',
  });
  const [editWorkspace, setEditWorkspace] = useState({
    id: '',
    name: '',
    description: '',
  });
  const [currentWorkspace, setCurrentWorkspace] = useState(null);
  const [workspaceUsers, setWorkspaceUsers] = useState([]);
  const [workspaceCampaigns, setWorkspaceCampaigns] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [debugInfo, setDebugInfo] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchWorkspaces();
    
    // Check admin status
    const checkAdminStatus = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        
        setDebugInfo(`Current user ID: ${user.id}`);
        
        // Try to select from admin_users table
        const { data: adminData, error: adminError } = await supabase
          .from('admin_users')
          .select('id')
          .eq('id', user.id)
          .single();
          
        if (adminData) {
          setIsAdmin(true);
          setDebugInfo(prev => `${prev}\nUser is admin: Yes`);
        } else {
          setIsAdmin(false);
          setDebugInfo(prev => `${prev}\nUser is admin: No\nError: ${adminError?.message}`);
          
          // Try to add the user as admin if they're not already
          const { error: insertError } = await supabase
            .from('admin_users')
            .insert({ id: user.id });
            
          if (insertError) {
            setDebugInfo(prev => `${prev}\nFailed to make user admin: ${insertError.message}`);
          } else {
            setDebugInfo(prev => `${prev}\nAdded user as admin successfully`);
            setIsAdmin(true);
          }
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        setDebugInfo(prev => `${prev}\nError checking admin status: ${error.message}`);
      }
    };
    
    checkAdminStatus();
  }, []);

  const fetchWorkspaces = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('workspaces')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching workspaces:', error);
        toast.error('Failed to load workspaces');
        return;
      }
      
      setWorkspaces(data || []);
    } catch (error) {
      console.error('Error in fetchWorkspaces:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const fetchWorkspaceDetails = async (workspaceId) => {
    try {
      // Fetch workspace
      const { data: workspace, error: workspaceError } = await supabase
        .from('workspaces')
        .select('*')
        .eq('id', workspaceId)
        .single();
      
      if (workspaceError) {
        console.error('Error fetching workspace:', workspaceError);
        return;
      }
      
      setCurrentWorkspace(workspace);
      
      // Fetch users in this workspace
      const { data: users, error: usersError } = await supabase
        .from('profiles')
        .select('*')
        .eq('workspace_id', workspaceId);
      
      if (usersError) {
        console.error('Error fetching workspace users:', usersError);
      } else {
        setWorkspaceUsers(users || []);
      }
      
      // Fetch campaigns in this workspace
      const { data: campaigns, error: campaignsError } = await supabase
        .from('campaigns')
        .select('*')
        .eq('workspace_id', workspaceId);
      
      if (campaignsError) {
        console.error('Error fetching workspace campaigns:', campaignsError);
      } else {
        setWorkspaceCampaigns(campaigns || []);
      }
    } catch (error) {
      console.error('Error fetching workspace details:', error);
    }
  };

  const handleAddWorkspace = async () => {
    try {
      setErrorMessage('');
      
      if (!newWorkspace.name) {
        toast.error('Workspace name is required');
        return;
      }
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('User not authenticated');
        return;
      }
      
      // Simple workspace creation
      const { data, error } = await supabase
        .from('workspaces')
        .insert({
          name: newWorkspace.name,
          description: newWorkspace.description || '',
          created_by: user.id
        })
        .select();
      
      if (error) {
        console.error('Error creating workspace:', error);
        setErrorMessage(error.message);
        toast.error(`Failed to create workspace: ${error.message}`);
        return;
      }
      
      // Successfully created the workspace
      const workspaceId = data[0].id;
      
      // Add current user as workspace admin
      const { error: memberError } = await supabase
        .from('workspace_users')
        .insert({
          workspace_id: workspaceId,
          user_id: user.id,
          role: 'admin'
        });
      
      if (memberError) {
        console.error('Error adding user as workspace admin:', memberError);
        toast.warning('Workspace created but there was an issue setting you as admin');
      }
      
      toast.success('Workspace created successfully!');
      setIsAddWorkspaceOpen(false);
      setNewWorkspace({
        name: '',
        description: '',
      });
      fetchWorkspaces();
    } catch (error) {
      console.error('Error in handleAddWorkspace:', error);
      toast.error(`An unexpected error occurred: ${error.message}`);
    }
  };

  const handleEditWorkspace = async () => {
    try {
      if (!editWorkspace.name) {
        toast.error('Workspace name is required');
        return;
      }
      
      const { error } = await supabase
        .from('workspaces')
        .update({ 
          name: editWorkspace.name,
          description: editWorkspace.description,
          updated_at: new Date().toISOString()
        })
        .eq('id', editWorkspace.id);
      
      if (error) {
        console.error('Error updating workspace:', error);
        toast.error('Failed to update workspace');
        return;
      }
      
      toast.success('Workspace updated successfully!');
      setIsEditWorkspaceOpen(false);
      fetchWorkspaces();
    } catch (error) {
      console.error('Error in handleEditWorkspace:', error);
      toast.error('An unexpected error occurred');
    }
  };

  const handleDeleteWorkspace = async (id) => {
    if (confirm('Are you sure you want to delete this workspace? This will also delete all associated campaigns and remove users from this workspace.')) {
      try {
        const { error } = await supabase
          .from('workspaces')
          .delete()
          .eq('id', id);
        
        if (error) {
          console.error('Error deleting workspace:', error);
          toast.error('Failed to delete workspace');
          return;
        }
        
        toast.success('Workspace deleted successfully!');
        fetchWorkspaces();
      } catch (error) {
        console.error('Error in handleDeleteWorkspace:', error);
        toast.error('An unexpected error occurred');
      }
    }
  };

  const openViewWorkspace = (workspace) => {
    fetchWorkspaceDetails(workspace.id);
    setIsViewWorkspaceOpen(true);
  };

  const openEditWorkspace = (workspace) => {
    setEditWorkspace({
      id: workspace.id,
      name: workspace.name,
      description: workspace.description
    });
    setIsEditWorkspaceOpen(true);
  };

  const viewWorkspaceCampaigns = (workspaceId) => {
    navigate(`/admin/campaigns?workspace=${workspaceId}`);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Workspaces Management</h1>
        <Button onClick={() => setIsAddWorkspaceOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Workspace
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Workspaces</CardTitle>
          <CardDescription>
            Manage your organization's workspaces. Each workspace can have multiple campaigns and users.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center p-4">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : workspaces.length === 0 ? (
            <div className="text-center py-8">
              <Briefcase className="h-12 w-12 mx-auto text-gray-400" />
              <p className="mt-2 text-lg font-medium">No workspaces found</p>
              <p className="text-sm text-muted-foreground">Create a workspace to get started</p>
              <Button className="mt-4" onClick={() => setIsAddWorkspaceOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Workspace
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {workspaces.map((workspace) => (
                    <TableRow key={workspace.id}>
                      <TableCell className="font-medium">{workspace.name}</TableCell>
                      <TableCell>{workspace.description || '-'}</TableCell>
                      <TableCell>{new Date(workspace.created_at).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" size="icon" onClick={() => openViewWorkspace(workspace)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="icon" onClick={() => openEditWorkspace(workspace)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="icon" className="text-red-500" onClick={() => handleDeleteWorkspace(workspace.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline"
                            onClick={() => viewWorkspaceCampaigns(workspace.id)}
                            className="ml-2"
                          >
                            <Layers className="h-4 w-4 mr-2" />
                            View Campaigns
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Workspace Dialog */}
      <Dialog open={isAddWorkspaceOpen} onOpenChange={setIsAddWorkspaceOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Workspace</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {errorMessage && (
              <div className="bg-red-50 p-3 rounded-md text-red-800 text-sm">
                <p className="font-semibold">Error:</p>
                <p>{errorMessage}</p>
              </div>
            )}
            
            <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md text-xs font-mono overflow-auto max-h-32">
              <p className="font-semibold">Debug Info:</p>
              <pre>{debugInfo}</pre>
              <p className="mt-2">Admin Status: {isAdmin ? 'Yes' : 'No'}</p>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="name">Workspace Name</Label>
              <Input
                id="name"
                value={newWorkspace.name}
                onChange={(e) => setNewWorkspace({ ...newWorkspace, name: e.target.value })}
                placeholder="Enter workspace name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newWorkspace.description}
                onChange={(e) => setNewWorkspace({ ...newWorkspace, description: e.target.value })}
                placeholder="Describe this workspace (optional)"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddWorkspaceOpen(false)}>Cancel</Button>
            <Button onClick={handleAddWorkspace}>Create Workspace</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Workspace Dialog */}
      <Dialog open={isEditWorkspaceOpen} onOpenChange={setIsEditWorkspaceOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Workspace</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Workspace Name</Label>
              <Input
                id="edit-name"
                value={editWorkspace.name}
                onChange={(e) => setEditWorkspace({ ...editWorkspace, name: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={editWorkspace.description}
                onChange={(e) => setEditWorkspace({ ...editWorkspace, description: e.target.value })}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditWorkspaceOpen(false)}>Cancel</Button>
            <Button onClick={handleEditWorkspace}>Update Workspace</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Workspace Dialog */}
      <Dialog open={isViewWorkspaceOpen} onOpenChange={setIsViewWorkspaceOpen} className="sm:max-w-3xl">
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {currentWorkspace?.name}
            </DialogTitle>
          </DialogHeader>
          
          {currentWorkspace && (
            <Tabs defaultValue="campaigns">
              <TabsList className="mb-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
                <TabsTrigger value="users">Users</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
                    <p className="mt-1">{currentWorkspace.description || 'No description provided'}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Created</h3>
                      <p className="mt-1">{new Date(currentWorkspace.created_at).toLocaleString()}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Last Updated</h3>
                      <p className="mt-1">{new Date(currentWorkspace.updated_at || currentWorkspace.created_at).toLocaleString()}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Campaigns</h3>
                      <p className="mt-1">{workspaceCampaigns.length}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Users</h3>
                      <p className="mt-1">{workspaceUsers.length}</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="campaigns">
                {workspaceCampaigns.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground">No campaigns in this workspace</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Created</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {workspaceCampaigns.map(campaign => (
                          <TableRow key={campaign.id}>
                            <TableCell>{campaign.name}</TableCell>
                            <TableCell>
                              <Badge variant={campaign.status === 'active' ? 'success' : 'secondary'}>
                                {campaign.status}
                              </Badge>
                            </TableCell>
                            <TableCell>{new Date(campaign.createdat).toLocaleDateString()}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="users">
                {workspaceUsers.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground">No users in this workspace</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Role</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {workspaceUsers.map(user => (
                          <TableRow key={user.id}>
                            <TableCell>{`${user.first_name || ''} ${user.last_name || ''}`}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.role || 'Member'}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WorkspacesManagement; 