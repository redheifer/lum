import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

const WebhookTesting = () => {
  const [workspaceId, setWorkspaceId] = useState('');
  const [webhookUrl, setWebhookUrl] = useState('');
  const [testData, setTestData] = useState({
    callerId: '+1 (555) 123-4567',
    campaignName: 'Test Campaign',
    duration: 180,
    status: 'Completed',
    transcriptText: 'This is a sample transcript for testing purposes.'
  });
  const [activeTab, setActiveTab] = useState('simple');
  const [advancedJson, setAdvancedJson] = useState(JSON.stringify({
    call_data: {
      caller_id: '+1 (555) 123-4567',
      campaign: 'Test Campaign',
      duration_seconds: 180,
      status: 'completed',
      recording_url: 'https://example.com/recording.mp3',
      transcript: 'This is a sample transcript for testing purposes.'
    },
    workspace_id: 'your-workspace-id'
  }, null, 2));

  const handleSimpleTest = async () => {
    try {
      const response = await fetch('/api/admin/test-webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workspaceId,
          webhookUrl,
          data: {
            caller_id: testData.callerId,
            campaign: testData.campaignName,
            duration_seconds: testData.duration,
            status: testData.status.toLowerCase(),
            transcript: testData.transcriptText
          }
        })
      });
      
      if (response.ok) {
        toast.success('Test data sent successfully');
      } else {
        toast.error('Failed to send test data');
      }
    } catch (error) {
      console.error('Error sending test data:', error);
      toast.error('Error sending test data');
    }
  };

  const handleAdvancedTest = async () => {
    try {
      const parsedJson = JSON.parse(advancedJson);
      const response = await fetch('/api/admin/test-webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workspaceId,
          webhookUrl,
          data: parsedJson
        })
      });
      
      if (response.ok) {
        toast.success('Test data sent successfully');
      } else {
        toast.error('Failed to send test data');
      }
    } catch (error) {
      console.error('Error sending test data:', error);
      toast.error('Error parsing or sending test data');
    }
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Webhook Testing</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Workspace & Webhook Configuration</CardTitle>
          <CardDescription>
            Configure the workspace and webhook endpoint for testing
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Workspace ID</label>
              <Input 
                placeholder="Enter workspace ID" 
                value={workspaceId}
                onChange={(e) => setWorkspaceId(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Webhook URL (N8N or custom)</label>
              <Input 
                placeholder="https://n8n.example.com/webhook/..." 
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="simple" onValueChange={setActiveTab} value={activeTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="simple">Simple Test</TabsTrigger>
          <TabsTrigger value="advanced">Advanced JSON</TabsTrigger>
        </TabsList>
        
        <TabsContent value="simple">
          <Card>
            <CardHeader>
              <CardTitle>Simple Test Data</CardTitle>
              <CardDescription>
                Configure basic test data to send to the webhook
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Caller ID</label>
                  <Input 
                    placeholder="+1 (555) 123-4567" 
                    value={testData.callerId}
                    onChange={(e) => setTestData({...testData, callerId: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Campaign Name</label>
                  <Input 
                    placeholder="Test Campaign" 
                    value={testData.campaignName}
                    onChange={(e) => setTestData({...testData, campaignName: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Duration (seconds)</label>
                  <Input 
                    type="number"
                    placeholder="180" 
                    value={testData.duration}
                    onChange={(e) => setTestData({...testData, duration: parseInt(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <Select 
                    value={testData.status}
                    onValueChange={(value) => setTestData({...testData, status: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Completed">Completed</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Missed">Missed</SelectItem>
                      <SelectItem value="Voicemail">Voicemail</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Transcript Text</label>
                <Textarea 
                  placeholder="Enter sample transcript text..." 
                  value={testData.transcriptText}
                  onChange={(e) => setTestData({...testData, transcriptText: e.target.value})}
                  rows={4}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSimpleTest}>Send Test Data</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="advanced">
          <Card>
            <CardHeader>
              <CardTitle>Advanced JSON Payload</CardTitle>
              <CardDescription>
                Configure a custom JSON payload to send to the webhook
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea 
                className="font-mono text-sm"
                value={advancedJson}
                onChange={(e) => setAdvancedJson(e.target.value)}
                rows={15}
              />
            </CardContent>
            <CardFooter>
              <Button onClick={handleAdvancedTest}>Send Advanced Payload</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WebhookTesting; 