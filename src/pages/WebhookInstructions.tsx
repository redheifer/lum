import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import Sidebar from '@/components/Sidebar';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import ThemeToggle from '@/components/ThemeToggle';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from 'react-router-dom';

interface Workspace {
  id: string;
  name: string;
  api_key?: string;
}

const WebhookInstructions = () => {
  const [activeTab, setActiveTab] = useState('webhook-instructions');
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [apiKey, setApiKey] = useState<string>('');
  const [regeneratingKey, setRegeneratingKey] = useState(false);
  const [isCreateWorkspaceOpen, setIsCreateWorkspaceOpen] = useState(false);
  const [newWorkspace, setNewWorkspace] = useState({
    name: '',
    description: '',
  });
  const navigate = useNavigate();
  
  // Base URL for the webhook
  const baseWebhookUrl = typeof window !== 'undefined' 
    ? `${window.location.protocol}//${window.location.host}/api/webhook/qa`
    : 'https://yourdomain.com/api/webhook/qa';

  // Set the active tab on component mount
  useEffect(() => {
    setActiveTab('webhook-instructions');
    loadWorkspaces();
  }, []);
  
  // Load workspaces from Supabase
  const loadWorkspaces = async () => {
    try {
      setLoading(true);
      
      // Use a more aggressive type assertion to bypass TypeScript errors
      const { data, error } = await (supabase as any)
        .from('workspaces')
        .select('id, name, api_key');
      
      if (error) {
        throw error;
      }
      
      if (data && data.length > 0) {
        setWorkspaces(data as Workspace[]);
        setSelectedWorkspace(data[0].id);
        setApiKey(data[0].api_key || '');
      }
    } catch (error) {
      console.error('Error loading workspaces:', error);
      toast.error('Failed to load workspaces');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle workspace selection change
  const handleWorkspaceChange = (workspaceId: string) => {
    setSelectedWorkspace(workspaceId);
    const workspace = workspaces.find(w => w.id === workspaceId);
    setApiKey(workspace?.api_key || '');
  };
  
  // Navigate to admin workspace management
  const goToWorkspaceManagement = () => {
    navigate('/admin/workspaces');
  };
  
  // Generate a new API key for the selected workspace
  const regenerateApiKey = async () => {
    try {
      setRegeneratingKey(true);
      
      // Generate a random API key
      const newApiKey = Array(32)
        .fill(0)
        .map(() => Math.random().toString(36).charAt(2))
        .join('');
      
      // Update the API key in Supabase using a more aggressive type assertion
      const { error } = await (supabase as any)
        .from('workspaces')
        .update({ api_key: newApiKey })
        .eq('id', selectedWorkspace);
      
      if (error) {
        throw error;
      }
      
      // Update the local state
      setApiKey(newApiKey);
      
      // Update the workspaces array
      setWorkspaces(workspaces.map(workspace => 
        workspace.id === selectedWorkspace 
          ? { ...workspace, api_key: newApiKey } 
          : workspace
      ));
      
      toast.success('API key regenerated successfully');
    } catch (error) {
      console.error('Error regenerating API key:', error);
      toast.error('Failed to regenerate API key');
    } finally {
      setRegeneratingKey(false);
    }
  };
  
  // Copy text to clipboard
  const copyToClipboard = (text: string, message: string) => {
    navigator.clipboard.writeText(text);
    toast.success(message);
  };
  
  // Generate a webhook URL with the API key
  const getWebhookUrl = () => {
    return `${baseWebhookUrl}?api_key=${apiKey}`;
  };
  
  // Generate an example POST request
  const getExamplePostRequest = () => {
    return `curl -X POST ${baseWebhookUrl} \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: ${apiKey}" \\
  -d '{
    "inbound_call_id": "call-12345",
    "call_date": "2023-06-15T12:00:00Z",
    "caller_id": "+15551234567",
    "end_call_source": "Customer",
    "publisher": "Google",
    "campaign": "Summer Campaign",
    "target": "John Smith",
    "duration": "120",
    "revenue": "75.00",
    "payout": "25.00",
    "recording": "https://example.com/recording.mp3"
  }'`;
  };
  
  // Generate an example GET request
  const getExampleGetRequest = () => {
    return `${baseWebhookUrl}?api_key=${apiKey}&inbound_call_id=call-12345&call_date=2023-06-15T12:00:00Z&caller_id=+15551234567&end_call_source=Customer&publisher=Google&campaign=Summer%20Campaign&target=John%20Smith&duration=120&revenue=75.00&payout=25.00&recording=https://example.com/recording.mp3`;
  };
  
  // Generate example code for different platforms
  const getExampleCode = (platform: string) => {
    switch (platform) {
      case 'n8n':
        return `// N8N HTTP Request Node Configuration
{
  "url": "${baseWebhookUrl}",
  "method": "POST",
  "authentication": "headerAuth",
  "headerAuthKey": "x-api-key",
  "headerAuthValue": "${apiKey}",
  "jsonParameters": true,
  "options": {},
  "bodyParametersJson": {
    "inbound_call_id": "={{$json[\"call_id\"]}}",
    "call_date": "={{$json[\"timestamp\"]}}",
    "caller_id": "={{$json[\"caller_number\"]}}",
    "end_call_source": "={{$json[\"hung_up_by\"]}}",
    "publisher": "={{$json[\"utm_source\"]}}",
    "campaign": "={{$json[\"utm_campaign\"]}}",
    "target": "={{$json[\"agent_name\"]}}",
    "duration": "={{$json[\"duration\"]}}",
    "revenue": "={{$json[\"revenue\"]}}",
    "payout": "={{$json[\"payout\"]}}",
    "recording": "={{$json[\"recording_url\"]}}"
  }
}`;
      case 'zapier':
        return `// Zapier Webhook Configuration
1. Choose "Webhooks by Zapier" as your trigger app
2. Select "POST" as the method
3. Use this URL: ${baseWebhookUrl}
4. Add these HTTP Headers:
   - Content-Type: application/json
   - x-api-key: ${apiKey}
5. In the "Data" section, map your Zapier fields to these webhook parameters:
   - inbound_call_id: {{call_id}}
   - call_date: {{timestamp}}
   - caller_id: {{caller_number}}
   - end_call_source: {{hung_up_by}}
   - publisher: {{utm_source}}
   - campaign: {{utm_campaign}}
   - target: {{agent_name}}
   - duration: {{duration}}
   - revenue: {{revenue}}
   - payout: {{payout}}
   - recording: {{recording_url}}`;
      case 'callrail':
        return `// CallRail Webhook Configuration
1. Go to your CallRail account settings
2. Navigate to "Integrations" > "Webhooks"
3. Add a new webhook with this URL:
   ${baseWebhookUrl}?api_key=${apiKey}
4. Select "POST" as the method
5. Enable the following call events:
   - Call Completed
   - Call Marked as Conversion
6. The system will automatically map CallRail fields to our webhook parameters`;
      default:
        return `// Custom Integration
// Send a POST request to:
${baseWebhookUrl}

// Include this header for authentication:
x-api-key: ${apiKey}

// Include these parameters in your request body:
{
  "inbound_call_id": "your-call-id",
  "call_date": "ISO timestamp",
  "caller_id": "phone number",
  "end_call_source": "who hung up",
  "publisher": "traffic source",
  "campaign": "campaign name",
  "target": "agent name",
  "duration": "call duration in seconds",
  "revenue": "revenue amount",
  "payout": "payout amount",
  "recording": "recording URL"
}`;
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="flex-1 overflow-auto">
        <div className="py-4 px-6 bg-card border-b">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-semibold">Webhook Instructions</h1>
            <div className="flex gap-2 items-center">
              <ThemeToggle />
            </div>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : workspaces.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>No Workspaces Found</CardTitle>
                <CardDescription>
                  You don't have any workspaces yet. Go to the Admin section to create a workspace.
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Button onClick={goToWorkspaceManagement}>Go to Workspace Management</Button>
              </CardFooter>
            </Card>
          ) : (
            <>
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Select Workspace</label>
                <div className="flex gap-4">
                  <Select value={selectedWorkspace} onValueChange={handleWorkspaceChange}>
                    <SelectTrigger className="w-[300px]">
                      <SelectValue placeholder="Select a workspace" />
                    </SelectTrigger>
                    <SelectContent>
                      {workspaces.map((workspace) => (
                        <SelectItem key={workspace.id} value={workspace.id}>
                          {workspace.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>API Key</CardTitle>
                  <CardDescription>
                    Use this API key to authenticate webhook requests for this workspace.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 mb-4">
                    <Input 
                      value={apiKey || 'No API key generated yet'} 
                      readOnly 
                      className="font-mono"
                    />
                    {apiKey && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => copyToClipboard(apiKey, 'API key copied to clipboard')}
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy
                      </Button>
                    )}
                  </div>
                  <Button 
                    onClick={regenerateApiKey} 
                    disabled={regeneratingKey}
                  >
                    {regeneratingKey ? 'Generating...' : 'Generate New API Key'}
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Webhook URL</CardTitle>
                  <CardDescription>
                    Send data to this endpoint to populate the QA data table.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="text-sm font-medium">Webhook URL with API Key:</div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => copyToClipboard(getWebhookUrl(), 'Webhook URL copied to clipboard')}
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy URL
                      </Button>
                    </div>
                    <div className="bg-slate-100 dark:bg-slate-800 rounded-md p-2 text-sm font-mono overflow-x-auto">
                      {getWebhookUrl()}
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Tabs defaultValue="examples" className="mb-6">
                <TabsList>
                  <TabsTrigger value="examples">Example Requests</TabsTrigger>
                  <TabsTrigger value="integrations">Integration Code</TabsTrigger>
                  <TabsTrigger value="parameters">Parameters</TabsTrigger>
                </TabsList>
                
                <TabsContent value="examples">
                  <Card>
                    <CardHeader>
                      <CardTitle>Example Requests</CardTitle>
                      <CardDescription>
                        Use these examples to test your webhook integration.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium mb-2">POST Request</h3>
                        <div className="flex justify-between items-center mb-2">
                          <div className="text-sm text-muted-foreground">Using cURL:</div>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => copyToClipboard(getExamplePostRequest(), 'POST example copied to clipboard')}
                          >
                            <Copy className="h-4 w-4 mr-2" />
                            Copy
                          </Button>
                        </div>
                        <pre className="bg-slate-100 dark:bg-slate-800 rounded-md p-3 text-sm font-mono overflow-x-auto whitespace-pre-wrap">
                          {getExamplePostRequest()}
                        </pre>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium mb-2">GET Request</h3>
                        <div className="flex justify-between items-center mb-2">
                          <div className="text-sm text-muted-foreground">URL with parameters:</div>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => copyToClipboard(getExampleGetRequest(), 'GET example copied to clipboard')}
                          >
                            <Copy className="h-4 w-4 mr-2" />
                            Copy
                          </Button>
                        </div>
                        <div className="bg-slate-100 dark:bg-slate-800 rounded-md p-3 text-sm font-mono overflow-x-auto">
                          {getExampleGetRequest()}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="integrations">
                  <Card>
                    <CardHeader>
                      <CardTitle>Integration Code</CardTitle>
                      <CardDescription>
                        Example code for integrating with different platforms.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Tabs defaultValue="n8n">
                        <TabsList className="mb-4">
                          <TabsTrigger value="n8n">n8n</TabsTrigger>
                          <TabsTrigger value="zapier">Zapier</TabsTrigger>
                          <TabsTrigger value="callrail">CallRail</TabsTrigger>
                          <TabsTrigger value="custom">Custom</TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="n8n">
                          <div className="flex justify-between items-center mb-2">
                            <div className="text-sm text-muted-foreground">n8n HTTP Request Node:</div>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => copyToClipboard(getExampleCode('n8n'), 'n8n example copied to clipboard')}
                            >
                              <Copy className="h-4 w-4 mr-2" />
                              Copy
                            </Button>
                          </div>
                          <pre className="bg-slate-100 dark:bg-slate-800 rounded-md p-3 text-sm font-mono overflow-x-auto whitespace-pre-wrap">
                            {getExampleCode('n8n')}
                          </pre>
                        </TabsContent>
                        
                        <TabsContent value="zapier">
                          <div className="flex justify-between items-center mb-2">
                            <div className="text-sm text-muted-foreground">Zapier Configuration:</div>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => copyToClipboard(getExampleCode('zapier'), 'Zapier example copied to clipboard')}
                            >
                              <Copy className="h-4 w-4 mr-2" />
                              Copy
                            </Button>
                          </div>
                          <pre className="bg-slate-100 dark:bg-slate-800 rounded-md p-3 text-sm font-mono overflow-x-auto whitespace-pre-wrap">
                            {getExampleCode('zapier')}
                          </pre>
                        </TabsContent>
                        
                        <TabsContent value="callrail">
                          <div className="flex justify-between items-center mb-2">
                            <div className="text-sm text-muted-foreground">CallRail Configuration:</div>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => copyToClipboard(getExampleCode('callrail'), 'CallRail example copied to clipboard')}
                            >
                              <Copy className="h-4 w-4 mr-2" />
                              Copy
                            </Button>
                          </div>
                          <pre className="bg-slate-100 dark:bg-slate-800 rounded-md p-3 text-sm font-mono overflow-x-auto whitespace-pre-wrap">
                            {getExampleCode('callrail')}
                          </pre>
                        </TabsContent>
                        
                        <TabsContent value="custom">
                          <div className="flex justify-between items-center mb-2">
                            <div className="text-sm text-muted-foreground">Custom Integration:</div>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => copyToClipboard(getExampleCode('custom'), 'Custom example copied to clipboard')}
                            >
                              <Copy className="h-4 w-4 mr-2" />
                              Copy
                            </Button>
                          </div>
                          <pre className="bg-slate-100 dark:bg-slate-800 rounded-md p-3 text-sm font-mono overflow-x-auto whitespace-pre-wrap">
                            {getExampleCode('custom')}
                          </pre>
                        </TabsContent>
                      </Tabs>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="parameters">
                  <Card>
                    <CardHeader>
                      <CardTitle>Webhook Parameters</CardTitle>
                      <CardDescription>
                        These parameters can be included in your webhook requests.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="border rounded-md">
                        <table className="w-full">
                          <thead className="bg-muted">
                            <tr>
                              <th className="text-left p-3 font-medium">Parameter</th>
                              <th className="text-left p-3 font-medium">Description</th>
                              <th className="text-left p-3 font-medium">Required</th>
                              <th className="text-left p-3 font-medium">Alternatives</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y">
                            <tr>
                              <td className="p-3 font-mono text-sm">inbound_call_id</td>
                              <td className="p-3">Unique identifier for the call</td>
                              <td className="p-3">Yes*</td>
                              <td className="p-3 font-mono text-sm">call_uuid</td>
                            </tr>
                            <tr>
                              <td className="p-3 font-mono text-sm">call_date</td>
                              <td className="p-3">Date and time of the call (ISO format)</td>
                              <td className="p-3">No</td>
                              <td className="p-3 font-mono text-sm">call_start_time</td>
                            </tr>
                            <tr>
                              <td className="p-3 font-mono text-sm">caller_id</td>
                              <td className="p-3">Phone number of the caller</td>
                              <td className="p-3">No</td>
                              <td className="p-3">-</td>
                            </tr>
                            <tr>
                              <td className="p-3 font-mono text-sm">end_call_source</td>
                              <td className="p-3">Who ended the call</td>
                              <td className="p-3">No</td>
                              <td className="p-3 font-mono text-sm">hung_up_by</td>
                            </tr>
                            <tr>
                              <td className="p-3 font-mono text-sm">publisher</td>
                              <td className="p-3">Publisher name</td>
                              <td className="p-3">No</td>
                              <td className="p-3 font-mono text-sm">publisher_company</td>
                            </tr>
                            <tr>
                              <td className="p-3 font-mono text-sm">campaign</td>
                              <td className="p-3">Campaign name</td>
                              <td className="p-3">No</td>
                              <td className="p-3 font-mono text-sm">campaign_name</td>
                            </tr>
                            <tr>
                              <td className="p-3 font-mono text-sm">target</td>
                              <td className="p-3">Target/agent name</td>
                              <td className="p-3">No</td>
                              <td className="p-3 font-mono text-sm">buyer_name</td>
                            </tr>
                            <tr>
                              <td className="p-3 font-mono text-sm">duration</td>
                              <td className="p-3">Call duration in seconds</td>
                              <td className="p-3">No</td>
                              <td className="p-3 font-mono text-sm">call_duration</td>
                            </tr>
                            <tr>
                              <td className="p-3 font-mono text-sm">revenue</td>
                              <td className="p-3">Revenue amount</td>
                              <td className="p-3">No</td>
                              <td className="p-3">-</td>
                            </tr>
                            <tr>
                              <td className="p-3 font-mono text-sm">payout</td>
                              <td className="p-3">Payout amount</td>
                              <td className="p-3">No</td>
                              <td className="p-3">-</td>
                            </tr>
                            <tr>
                              <td className="p-3 font-mono text-sm">recording</td>
                              <td className="p-3">URL to the call recording</td>
                              <td className="p-3">No</td>
                              <td className="p-3 font-mono text-sm">call_recording_url</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <p className="text-sm text-muted-foreground mt-4">
                        * Either inbound_call_id or call_uuid is required.
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
              
              <Card>
                <CardHeader>
                  <CardTitle>View Your Data</CardTitle>
                  <CardDescription>
                    After sending data to the webhook, you can view it in the RealTimeQA page.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">
                    All data sent to your webhook will be displayed in the RealTimeQA page's "Webhook Data Table" tab.
                  </p>
                  <Button 
                    onClick={() => setActiveTab('realtime-qa')}
                    className="mr-4"
                  >
                    Go to RealTimeQA
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => window.open(`${baseWebhookUrl}?api_key=${apiKey}&inbound_call_id=test-${Date.now()}`, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Send Test Request
                  </Button>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default WebhookInstructions; 