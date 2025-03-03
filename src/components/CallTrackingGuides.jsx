import React, { useState } from 'react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const CallTrackingGuides = ({ webhookUrl, secretKey }) => {
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  return (
    <Tabs defaultValue="ringba">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="ringba">Ringba</TabsTrigger>
        <TabsTrigger value="retreiver">Retreiver</TabsTrigger>
        <TabsTrigger value="boberdo">Boberdo</TabsTrigger>
      </TabsList>
      
      <TabsContent value="ringba">
        <Card>
          <CardHeader>
            <CardTitle>Ringba Integration</CardTitle>
            <CardDescription>
              Follow these steps to integrate Lum with Ringba
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ol className="list-decimal pl-5 space-y-3">
              <li>
                <p>Log in to your Ringba account and navigate to <strong>Account Settings</strong></p>
              </li>
              <li>
                <p>Select <strong>Webhooks</strong> from the left menu</p>
              </li>
              <li>
                <p>Click <strong>+ Add Webhook</strong></p>
              </li>
              <li>
                <p>Enter the following information:</p>
                <div className="mt-2 space-y-2">
                  <div>
                    <p className="text-sm font-medium">Name:</p>
                    <p className="text-sm">Lum Integration</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">URL:</p>
                    <div className="flex items-center mt-1">
                      <code className="text-xs bg-muted p-2 rounded">{webhookUrl}</code>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="ml-2"
                        onClick={() => copyToClipboard(webhookUrl)}
                      >
                        Copy
                      </Button>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Secret Key:</p>
                    <div className="flex items-center mt-1">
                      <code className="text-xs bg-muted p-2 rounded">{secretKey}</code>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="ml-2"
                        onClick={() => copyToClipboard(secretKey)}
                      >
                        Copy
                      </Button>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Events:</p>
                    <p className="text-sm">Select "Call Completed" at minimum</p>
                  </div>
                </div>
              </li>
              <li>
                <p>Click <strong>Save</strong> to create the webhook</p>
              </li>
              <li>
                <p>Ensure your Ringba campaigns are set up to capture UTM parameters</p>
              </li>
            </ol>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="retreiver">
        <Card>
          <CardHeader>
            <CardTitle>Retreiver Integration</CardTitle>
            <CardDescription>
              Follow these steps to integrate Lum with Retreiver
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ol className="list-decimal pl-5 space-y-3">
              <li>
                <p>Log in to your Retreiver dashboard</p>
              </li>
              <li>
                <p>Navigate to <strong>Integration > Webhooks</strong></p>
              </li>
              <li>
                <p>Click <strong>Add New Webhook</strong></p>
              </li>
              <li>
                <p>Enter the following information:</p>
                <div className="mt-2 space-y-2">
                  <div>
                    <p className="text-sm font-medium">Webhook Name:</p>
                    <p className="text-sm">Lum Integration</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Webhook URL:</p>
                    <div className="flex items-center mt-1">
                      <code className="text-xs bg-muted p-2 rounded">{webhookUrl}</code>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="ml-2"
                        onClick={() => copyToClipboard(webhookUrl)}
                      >
                        Copy
                      </Button>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Authentication:</p>
                    <p className="text-sm">Select "Header Authentication"</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Header Name:</p>
                    <p className="text-sm">x-webhook-secret</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Header Value:</p>
                    <div className="flex items-center mt-1">
                      <code className="text-xs bg-muted p-2 rounded">{secretKey}</code>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="ml-2"
                        onClick={() => copyToClipboard(secretKey)}
                      >
                        Copy
                      </Button>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Trigger Events:</p>
                    <p className="text-sm">Select "Call Completed"</p>
                  </div>
                </div>
              </li>
              <li>
                <p>Click <strong>Save Webhook</strong></p>
              </li>
              <li>
                <p>Verify that your Retreiver campaigns are configured to track UTM parameters</p>
              </li>
            </ol>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="boberdo">
        <Card>
          <CardHeader>
            <CardTitle>Boberdo Integration</CardTitle>
            <CardDescription>
              Follow these steps to integrate Lum with Boberdo
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ol className="list-decimal pl-5 space-y-3">
              <li>
                <p>Log in to your Boberdo account</p>
              </li>
              <li>
                <p>Go to <strong>Settings > API & Webhooks</strong></p>
              </li>
              <li>
                <p>In the Webhooks section, click <strong>Add New</strong></p>
              </li>
              <li>
                <p>Configure the webhook with these details:</p>
                <div className="mt-2 space-y-2">
                  <div>
                    <p className="text-sm font-medium">Name:</p>
                    <p className="text-sm">Lum Integration</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">URL:</p>
                    <div className="flex items-center mt-1">
                      <code className="text-xs bg-muted p-2 rounded">{webhookUrl}</code>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="ml-2"
                        onClick={() => copyToClipboard(webhookUrl)}
                      >
                        Copy
                      </Button>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Secret:</p>
                    <div className="flex items-center mt-1">
                      <code className="text-xs bg-muted p-2 rounded">{secretKey}</code>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="ml-2"
                        onClick={() => copyToClipboard(secretKey)}
                      >
                        Copy
                      </Button>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Events:</p>
                    <p className="text-sm">Select "Call Completed" and "Call Connected"</p>
                  </div>
                </div>
              </li>
              <li>
                <p>Click <strong>Create Webhook</strong></p>
              </li>
              <li>
                <p>Make sure your Boberdo tracking is set up to capture UTM parameters</p>
              </li>
            </ol>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default CallTrackingGuides; 