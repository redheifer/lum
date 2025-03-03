import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Filter, Layers, Plus, Trash2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useSearchParams } from 'react-router-dom';

const CampaignsManagement = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddCampaignOpen, setIsAddCampaignOpen] = useState(false);
  const [isEditCampaignOpen, setIsEditCampaignOpen] = useState(false);
  const [newCampaign, setNewCampaign] = useState({
    name: '',
    description: '',
    status: 'draft',
    workspace_id: '',
    isActive: true
  });
  const [editCampaign, setEditCampaign] = useState({
    id: '',
    name: '',
    description: '',
    status: '',
    workspace_id: '',
    isActive: true
  });
  const [filterWorkspace, setFilterWorkspace] = useState('all');
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const workspaceParam = searchParams.get('workspace');
    
    // Only set the filter from URL params on initial load
    if (workspaceParam) {
      console.log(`Setting workspace filter from URL: ${workspaceParam}`);
      setFilterWorkspace(workspaceParam);
    }
    
    // Always fetch workspaces for the dropdown
    fetchWorkspaces();
    
    // Fetch campaigns based on current filter
    fetchCampaigns();
  }, [searchParams]); // Only re-run when search params change

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      console.log(`Fetching campaigns with workspace filter: ${filterWorkspace}`);
      
      let query = supabase
        .from('campaigns')
        .select('*, workspaces(name)')
        .order('createdat', { ascending: false });
      
      if (filterWorkspace !== 'all') {
        console.log(`Filtering by workspace_id: ${filterWorkspace}`);
        query = query.eq('workspace_id', filterWorkspace);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching campaigns:', error);
        toast.error('Failed to load campaigns');
        return;
      }
      
      console.log('Fetched campaigns:', data);
      
      setCampaigns(data || []);
    } catch (error) {
      console.error('Error in fetchCampaigns:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const fetchWorkspaces = async () => {
    try {
      const { data, error } = await supabase
        .from('workspaces')
        .select('*')
        .order('name');
      
      if (error) {
        console.error('Error fetching workspaces:', error);
        return;
      }
      
      setWorkspaces(data || []);
    } catch (error) {
      console.error('Error in fetchWorkspaces:', error);
    }
  };

  const handleAddCampaign = async () => {
    try {
      if (!newCampaign.name || !newCampaign.workspace_id) {
        toast.error('Campaign name and workspace are required');
        return;
      }
      
      console.log('Attempting to create campaign with:', newCampaign);
      
      // Simplified campaign object with all lowercase field names
      const campaignData = {
        name: newCampaign.name,
        description: newCampaign.description || '',
        status: newCampaign.status || 'draft',
        workspace_id: newCampaign.workspace_id,
        isactive: newCampaign.isActive
      };
      
      const { data, error } = await supabase
        .from('campaigns')
        .insert(campaignData)
        .select();
      
      if (error) {
        console.error('Error creating campaign:', error);
        toast.error(`Failed to create campaign: ${error.message}`);
        return;
      }
      
      toast.success('Campaign created successfully!');
      setIsAddCampaignOpen(false);
      setNewCampaign({
        name: '',
        description: '',
        status: 'draft',
        workspace_id: '',
        isActive: true
      });
      fetchCampaigns();
    } catch (error) {
      console.error('Error in handleAddCampaign:', error);
      toast.error(`An unexpected error occurred: ${error.message}`);
    }
  };

  const handleEditCampaign = async () => {
    try {
      if (!editCampaign.name || !editCampaign.workspace_id) {
        toast.error('Campaign name and workspace are required');
        return;
      }
      
      const { error } = await supabase
        .from('campaigns')
        .update({ 
          name: editCampaign.name,
          description: editCampaign.description,
          status: editCampaign.status,
          workspace_id: editCampaign.workspace_id,
          isactive: editCampaign.isActive
        })
        .eq('id', editCampaign.id);
      
      if (error) {
        console.error('Error updating campaign:', error);
        toast.error('Failed to update campaign');
        return;
      }
      
      toast.success('Campaign updated successfully!');
      setIsEditCampaignOpen(false);
      fetchCampaigns();
    } catch (error) {
      console.error('Error in handleEditCampaign:', error);
      toast.error('An unexpected error occurred');
    }
  };

  const handleDeleteCampaign = async (id) => {
    if (!confirm('Are you sure you want to delete this campaign?')) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('campaigns')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting campaign:', error);
        toast.error('Failed to delete campaign');
        return;
      }
      
      toast.success('Campaign deleted successfully!');
      fetchCampaigns();
    } catch (error) {
      console.error('Error in handleDeleteCampaign:', error);
      toast.error('An unexpected error occurred');
    }
  };

  const handleEditClick = (campaign) => {
    setEditCampaign({
      id: campaign.id,
      name: campaign.name,
      description: campaign.description,
      status: campaign.status || 'draft',
      workspace_id: campaign.workspace_id,
      isActive: campaign.isActive
    });
    setIsEditCampaignOpen(true);
  };

  const handleFilterChange = async (value) => {
    // Update filter state
    setFilterWorkspace(value);
    
    // Important: Set loading state
    setLoading(true);
    
    try {
      console.log(`Filter changed to: ${value}`);
      
      // Construct the query based on the selected filter
      let query = supabase
        .from('campaigns')
        .select('*, workspaces(name)')
        .order('createdat', { ascending: false });
      
      if (value !== 'all') {
        query = query.eq('workspace_id', value);
      }
      
      // Execute the query
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching filtered campaigns:', error);
        toast.error('Failed to filter campaigns');
        return;
      }
      
      console.log('Filtered campaigns:', data);
      setCampaigns(data || []);
    } catch (error) {
      console.error('Error filtering campaigns:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Campaigns Management</h1>
        <Button onClick={() => setIsAddCampaignOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Campaign
        </Button>
      </div>

      <div className="flex mb-6 items-center justify-between">
        <div className="flex items-center gap-2 mb-4">
          <span className="font-medium">Filter by Workspace:</span>
          <Select 
            value={filterWorkspace} 
            onValueChange={handleFilterChange}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select workspace" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Workspaces</SelectItem>
              {workspaces.map(workspace => (
                <SelectItem key={workspace.id} value={workspace.id}>
                  {workspace.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Campaigns</CardTitle>
          <CardDescription>
            Manage your campaigns across all workspaces.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center p-4">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : campaigns.length === 0 ? (
            <div className="text-center py-8">
              <Layers className="h-12 w-12 mx-auto text-gray-400" />
              <p className="mt-2 text-lg font-medium">No campaigns found</p>
              <p className="text-sm text-muted-foreground">Create a campaign to get started</p>
              <Button className="mt-4" onClick={() => setIsAddCampaignOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Campaign
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Workspace</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {campaigns.map((campaign) => (
                  <TableRow key={campaign.id}>
                    <TableCell className="font-medium">{campaign.name}</TableCell>
                    <TableCell>{campaign.workspaces?.name || 'Unknown'}</TableCell>
                    <TableCell>
                      <Badge variant={campaign.isActive ? 'default' : 'secondary'}>
                        {campaign.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(campaign.createdat).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleEditClick(campaign)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-500" onClick={() => handleDeleteCampaign(campaign.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Add Campaign Dialog */}
      <Dialog open={isAddCampaignOpen} onOpenChange={setIsAddCampaignOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Campaign</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Campaign Name</Label>
              <Input
                id="name"
                value={newCampaign.name}
                onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
                placeholder="Enter campaign name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newCampaign.description}
                onChange={(e) => setNewCampaign({ ...newCampaign, description: e.target.value })}
                placeholder="Enter campaign description"
                rows={3}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="workspace">Workspace</Label>
              <Select 
                value={newCampaign.workspace_id} 
                onValueChange={(value) => setNewCampaign({ ...newCampaign, workspace_id: value })}
              >
                <SelectTrigger id="workspace">
                  <SelectValue placeholder="Select workspace" />
                </SelectTrigger>
                <SelectContent>
                  {workspaces.map(workspace => (
                    <SelectItem key={workspace.id} value={workspace.id}>
                      {workspace.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select 
                value={newCampaign.status} 
                onValueChange={(value) => setNewCampaign({ ...newCampaign, status: value })}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={newCampaign.isActive}
                onCheckedChange={(checked) => setNewCampaign({ ...newCampaign, isActive: checked })}
              />
              <Label htmlFor="isActive">Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddCampaignOpen(false)}>Cancel</Button>
            <Button onClick={handleAddCampaign}>Create Campaign</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Campaign Dialog */}
      <Dialog open={isEditCampaignOpen} onOpenChange={setIsEditCampaignOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Campaign</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Campaign Name</Label>
              <Input
                id="edit-name"
                value={editCampaign.name}
                onChange={(e) => setEditCampaign({ ...editCampaign, name: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={editCampaign.description}
                onChange={(e) => setEditCampaign({ ...editCampaign, description: e.target.value })}
                rows={3}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-workspace">Workspace</Label>
              <Select 
                value={editCampaign.workspace_id} 
                onValueChange={(value) => setEditCampaign({ ...editCampaign, workspace_id: value })}
              >
                <SelectTrigger id="edit-workspace">
                  <SelectValue placeholder="Select workspace" />
                </SelectTrigger>
                <SelectContent>
                  {workspaces.map(workspace => (
                    <SelectItem key={workspace.id} value={workspace.id}>
                      {workspace.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-status">Status</Label>
              <Select 
                value={editCampaign.status} 
                onValueChange={(value) => setEditCampaign({ ...editCampaign, status: value })}
              >
                <SelectTrigger id="edit-status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="edit-isActive"
                checked={editCampaign.isActive}
                onCheckedChange={(checked) => setEditCampaign({ ...editCampaign, isActive: checked })}
              />
              <Label htmlFor="edit-isActive">Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditCampaignOpen(false)}>Cancel</Button>
            <Button onClick={handleEditCampaign}>Update Campaign</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CampaignsManagement; 