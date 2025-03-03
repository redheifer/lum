import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Users, Layers, Plus, Settings } from 'lucide-react';
import { toast } from 'sonner';
import WebhooksManager from '@/components/WebhooksManager';
import WebhookManager from '@/components/WebhookManager';

const WorkspaceDetail = () => {
  const { id } = useParams();
  const [workspace, setWorkspace] = useState(null);
  const [users, setUsers] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchWorkspaceDetails(id);
    }
  }, [id]);

  const fetchWorkspaceDetails = async (workspaceId) => {
    try {
      setLoading(true);
      
      // Fetch workspace
      const { data: workspaceData, error: workspaceError } = await supabase
        .from('workspaces')
        .select('*')
        .eq('id', workspaceId)
        .single();
      
      if (workspaceError) throw workspaceError;
      setWorkspace(workspaceData);
      
      // Fetch workspace users
      const { data: usersData, error: usersError } = await supabase
        .from('workspace_users')
        .select('*, profiles(*)')
        .eq('workspace_id', workspaceId);
      
      if (usersError) throw usersError;
      setUsers(usersData || []);
      
      // Fetch workspace campaigns
      const { data: campaignsData, error: campaignsError } = await supabase
        .from('campaigns')
        .select('*')
        .eq('workspace_id', workspaceId);
      
      if (campaignsError) throw campaignsError;
      setCampaigns(campaignsData || []);
      
    } catch (error) {
      console.error('Error fetching workspace details:', error);
      toast.error('Failed to load workspace details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading workspace details...</div>;
  }

  if (!workspace) {
    return <div className="text-center py-10">Workspace not found</div>;
  }

  return (
    <div className="container py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{workspace?.name || 'Workspace'}</h1>
        <div className="flex space-x-2">
          <Button variant="outline" asChild>
            <Link to={`/admin/campaigns?workspace=${workspace.id}`}>
              <Layers className="h-4 w-4 mr-2" />
              View Campaigns
            </Link>
          </Button>
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Users</CardTitle>
                <CardDescription>Members of this workspace</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{users.length}</div>
                <Button variant="link" asChild className="p-0">
                  <Link to="#users">View all users</Link>
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Campaigns</CardTitle>
                <CardDescription>Campaigns in this workspace</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{campaigns.length}</div>
                <Button variant="link" asChild className="p-0">
                  <Link to="#campaigns">View all campaigns</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="users" id="users">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Workspace Users</CardTitle>
                <CardDescription>Manage users in this workspace</CardDescription>
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map(user => (
                    <TableRow key={user.user_id}>
                      <TableCell>{user.profiles?.first_name} {user.profiles?.last_name}</TableCell>
                      <TableCell>{user.profiles?.email}</TableCell>
                      <TableCell>
                        <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {/* Actions */}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="campaigns" id="campaigns">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Workspace Campaigns</CardTitle>
                <CardDescription>Manage campaigns in this workspace</CardDescription>
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Campaign
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {campaigns.map(campaign => (
                    <TableRow key={campaign.id}>
                      <TableCell>{campaign.name}</TableCell>
                      <TableCell>
                        <Badge variant={campaign.status === 'active' ? 'success' : 'secondary'}>
                          {campaign.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {campaign.created_at ? new Date(campaign.created_at).toLocaleDateString() : 
                         (campaign.createdat ? new Date(campaign.createdat).toLocaleDateString() : 'N/A')}
                      </TableCell>
                      <TableCell>
                        {/* Actions */}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="webhooks">
          <WebhooksManager workspaceId={id} />
        </TabsContent>
        
        <TabsContent value="settings">
          {/* Settings content */}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WorkspaceDetail; 