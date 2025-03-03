import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from '@/components/ui/card';
import { 
  Dialog, 
  DialogTrigger, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter, 
  DialogClose 
} from '@/components/ui/dialog';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { toast } from 'sonner';
import { Key, Copy, Trash, Plus, RefreshCw, Shield } from 'lucide-react';

const WebhooksManager = ({ workspaceId }) => {
  const [webhooks, setWebhooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const [newWebhook, setNewWebhook] = useState({
    name: '',
    description: '',
    event_type: 'call.completed',
    url: '',
    workspace_id: workspaceId
  });

  // Check user permissions
  useEffect(() => {
    const checkUserRole = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setUserRole('unauthorized');
          return;
        }
        
        // Get user role for this workspace
        const { data, error } = await supabase
          .from('workspace_users')
          .select('role')
          .eq('user_id', user.id)
          .eq('workspace_id', workspaceId)
          .single();
          
        if (error) {
          console.error('Error fetching user role:', error);
          setUserRole('unauthorized');
          return;
        }
        
        setUserRole(data.role);
      } catch (error) {
        console.error('Error checking permissions:', error);
        setUserRole('unauthorized');
      }
    };
    
    checkUserRole();
  }, [workspaceId]);

  // Fetch webhooks
  useEffect(() => {
    const fetchWebhooks = async () => {
      if (userRole !== 'admin' && userRole !== 'developer') {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('webhooks')
          .select('*')
          .eq('workspace_id', workspaceId)
          .order('created_at', { ascending: false });
          
        if (error) {
          console.error('Error fetching webhooks:', error);
          toast.error('Failed to load webhooks');
          return;
        }
        
        setWebhooks(data || []);
      } catch (error) {
        console.error('Error in fetchWebhooks:', error);
        toast.error('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };
    
    if (userRole) {
      fetchWebhooks();
    }
  }, [workspaceId, userRole]);

  // Create webhook
  const handleCreateWebhook = async () => {
    try {
      if (!newWebhook.name || !newWebhook.url) {
        toast.error('Name and URL are required');
        return;
      }
      
      const { data, error } = await supabase
        .from('webhooks')
        .insert({
          ...newWebhook,
          secret_key: generateId(),
          created_by: (await supabase.auth.getUser()).data.user.id,
          workspace_id: workspaceId
        })
        .select();
        
      if (error) {
        console.error('Error creating webhook:', error);
        toast.error(`Failed to create webhook: ${error.message}`);
        return;
      }
      
      toast.success('Webhook created successfully!');
      setWebhooks([data[0], ...webhooks]);
      setNewWebhook({
        name: '',
        description: '',
        event_type: 'call.completed',
        url: '',
        workspace_id: workspaceId
      });
      
      // Show the webhook secret once
      toast(
        'Webhook Secret (Save this now!)',
        {
          description: data[0].secret_key,
          action: {
            label: 'Copy',
            onClick: () => {
              navigator.clipboard.writeText(data[0].secret_key);
              toast.success('Secret copied to clipboard');
            },
          },
          duration: 10000,
        }
      );
      
    } catch (error) {
      console.error('Error in handleCreateWebhook:', error);
      toast.error('An unexpected error occurred');
    }
  };

  // Delete webhook
  const handleDeleteWebhook = async (id) => {
    try {
      const { error } = await supabase
        .from('webhooks')
        .delete()
        .eq('id', id);
        
      if (error) {
        console.error('Error deleting webhook:', error);
        toast.error(`Failed to delete webhook: ${error.message}`);
        return;
      }
      
      setWebhooks(webhooks.filter(webhook => webhook.id !== id));
      toast.success('Webhook deleted successfully');
    } catch (error) {
      console.error('Error in handleDeleteWebhook:', error);
      toast.error('An unexpected error occurred');
    }
  };

  // Copy webhook URL
  const handleCopyUrl = (url) => {
    navigator.clipboard.writeText(url);
    toast.success('URL copied to clipboard');
  };

  // Reset webhook secret
  const handleResetSecret = async (id) => {
    try {
      const newSecret = generateId();
      
      const { error } = await supabase
        .from('webhooks')
        .update({ secret_key: newSecret })
        .eq('id', id);
        
      if (error) {
        console.error('Error resetting webhook secret:', error);
        toast.error(`Failed to reset secret: ${error.message}`);
        return;
      }
      
      toast(
        'New Webhook Secret (Save this now!)',
        {
          description: newSecret,
          action: {
            label: 'Copy',
            onClick: () => {
              navigator.clipboard.writeText(newSecret);
              toast.success('Secret copied to clipboard');
            },
          },
          duration: 10000,
        }
      );
      
    } catch (error) {
      console.error('Error in handleResetSecret:', error);
      toast.error('An unexpected error occurred');
    }
  };

  const generateId = () => `webhook-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  if (userRole !== 'admin' && userRole !== 'developer') {
    return (
      <Card className="border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-900/10">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="mr-2 h-5 w-5 text-red-500" />
            Access Restricted
          </CardTitle>
          <CardDescription>
            Only workspace administrators and developers can manage webhooks.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="transition-all duration-200 border dark:border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Key className="mr-2 h-5 w-5" />
            Webhook Management
          </CardTitle>
          <CardDescription>
            Create and manage webhooks to integrate with external services.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-10">
              <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="mb-6 hover:shadow-md group dark:hover:shadow-blue-700/10 transition-all">
                    <Plus className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                    Create Webhook
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Create New Webhook</DialogTitle>
                    <DialogDescription>
                      Webhooks allow external services to receive notifications when certain events occur.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">
                        Name*
                      </Label>
                      <Input
                        id="name"
                        value={newWebhook.name}
                        onChange={(e) => setNewWebhook({...newWebhook, name: e.target.value})}
                        className="col-span-3"
                        placeholder="Order Processing Webhook"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="description" className="text-right">
                        Description
                      </Label>
                      <Input
                        id="description"
                        value={newWebhook.description}
                        onChange={(e) => setNewWebhook({...newWebhook, description: e.target.value})}
                        className="col-span-3"
                        placeholder="Processes new orders in our system"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="event" className="text-right">
                        Event Type*
                      </Label>
                      <Select 
                        value={newWebhook.event_type}
                        onValueChange={(value) => setNewWebhook({...newWebhook, event_type: value})}
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select an event type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="call.completed">Call Completed</SelectItem>
                          <SelectItem value="call.started">Call Started</SelectItem>
                          <SelectItem value="analysis.completed">Analysis Completed</SelectItem>
                          <SelectItem value="campaign.created">Campaign Created</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="url" className="text-right">
                        Destination URL*
                      </Label>
                      <Input
                        id="url"
                        value={newWebhook.url}
                        onChange={(e) => setNewWebhook({...newWebhook, url: e.target.value})}
                        className="col-span-3"
                        placeholder="https://your-server.com/webhook-endpoint"
                      />
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline" className="hover:shadow-sm transition-all">
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button onClick={handleCreateWebhook} className="hover:shadow-md transition-all">
                      Create Webhook
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {webhooks.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">
                  <p>No webhooks created yet.</p>
                  <p className="text-sm">Create a webhook to start integrating with external services.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Event Type</TableHead>
                      <TableHead>URL</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {webhooks.map((webhook) => (
                      <TableRow key={webhook.id} className="group transition-colors">
                        <TableCell className="font-medium">
                          <div>{webhook.name}</div>
                          {webhook.description && (
                            <div className="text-xs text-muted-foreground mt-1">{webhook.description}</div>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="group-hover:shadow-sm transition-all">
                            {webhook.event_type}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate">{webhook.url}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleCopyUrl(webhook.url)}
                              className="hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleResetSecret(webhook.id)}
                              className="hover:bg-amber-50 dark:hover:bg-amber-900/20 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                            >
                              <Key className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteWebhook(webhook.id)}
                              className="hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </>
          )}
        </CardContent>
        <CardFooter className="border-t dark:border-gray-800 flex flex-col items-start p-6">
          <div className="text-sm text-muted-foreground">
            <strong className="font-medium text-foreground">Security Note:</strong> Webhook secrets are only shown once during creation or reset. Make sure to save them securely.
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default WebhooksManager; 