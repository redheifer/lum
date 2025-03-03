import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

const WebhookDocs = () => {
  return (
    <div className="container py-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Webhook Documentation</h1>
      <p className="text-muted-foreground mb-8">
        Learn how to integrate call tracking platforms with Lum
      </p>
      
      <Tabs defaultValue="overview">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="payload">Payload Format</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="troubleshooting">Troubleshooting</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Webhook Overview</CardTitle>
              <CardDescription>
                Understanding how webhooks work with Lum
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Lum uses webhooks to receive call data from your call tracking platform. 
                When a call is completed, your call tracking platform sends the call data 
                to your unique webhook URL, which Lum processes and stores in your account.
              </p>
              
              <h3 className="text-lg font-medium mt-4">How It Works</h3>
              <ol className="list-decimal pl-5 space-y-2">
                <li>You create a webhook in your Lum workspace</li>
                <li>You configure your call tracking platform to send call data to your webhook URL</li>
                <li>When a call is completed, your call tracking platform sends the call data to Lum</li>
                <li>Lum processes the data and creates or updates campaigns based on UTM parameters</li>
                <li>The call data is stored in your Lum account for reporting and analysis</li>
              </ol>
              
              <h3 className="text-lg font-medium mt-4">Supported Platforms</h3>
              <p>Lum supports the following call tracking platforms:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Ringba</li>
                <li>Retreiver</li>
                <li>Boberdo</li>
                <li>Any platform that can send webhook data in a compatible format</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="payload">
          <Card>
            <CardHeader>
              <CardTitle>Webhook Payload Format</CardTitle>
              <CardDescription>
                The expected format for webhook payloads
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Your call tracking platform should send data in the following format:
              </p>
              
              <pre className="bg-muted p-4 rounded-md overflow-x-auto">
{`{
  "call_id": "unique-call-identifier",
  "status": "completed",
  "duration": 120,
  "caller_number": "+15551234567",
  "receiver_number": "+15559876543",
  "utm_source": "google",
  "utm_medium": "cpc",
  "utm_campaign": "spring_sale",
  "timestamp": "2023-06-15T14:30:00Z"
}`}
              </pre>
              
              <h3 className="text-lg font-medium mt-4">Field Descriptions</h3>
              <ul className="space-y-2">
                <li><strong>call_id</strong>: A unique identifier for the call</li>
                <li><strong>status</strong>: The status of the call (completed, missed, etc.)</li>
                <li><strong>duration</strong>: The duration of the call in seconds</li>
                <li><strong>caller_number</strong>: The phone number of the caller</li>
                <li><strong>receiver_number</strong>: The phone number that received the call</li>
                <li><strong>utm_source</strong>: The source of the traffic (e.g., google, facebook)</li>
                <li><strong>utm_medium</strong>: The medium of the traffic (e.g., cpc, email)</li>
                <li><strong>utm_campaign</strong>: The campaign name</li>
                <li><strong>timestamp</strong>: The date and time of the call in ISO format</li>
              </ul>
              
              <p className="text-sm text-muted-foreground mt-4">
                Note: Your call tracking platform may use different field names. Lum will attempt to map common field names to the expected format.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Webhook Security</CardTitle>
              <CardDescription>
                Securing your webhook endpoints
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Lum uses a secret key to verify that webhook requests are coming from your authorized call tracking platform.
              </p>
              
              <h3 className="text-lg font-medium mt-4">Secret Key Authentication</h3>
              <p>
                When you create a webhook, Lum generates a unique secret key. Your call tracking platform should include this secret key in the <code>x-webhook-secret</code> header of each webhook request.
              </p>
              
              <pre className="bg-muted p-4 rounded-md overflow-x-auto">
{`// Example HTTP request header
x-webhook-secret: your-secret-key`}
              </pre>
              
              <h3 className="text-lg font-medium mt-4">Best Practices</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Keep your secret key confidential</li>
                <li>Regenerate your secret key if you suspect it has been compromised</li>
                <li>Use HTTPS for all webhook communications</li>
                <li>Regularly check your webhook logs for unauthorized access attempts</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="troubleshooting">
          <Card>
            <CardHeader>
              <CardTitle>Troubleshooting</CardTitle>
              <CardDescription>
                Common issues and solutions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <h3 className="text-lg font-medium">Webhook Not Receiving Data</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Verify that your webhook URL is correctly configured in your call tracking platform</li>
                <li>Check that your webhook is active in Lum</li>
                <li>Ensure your call tracking platform is sending data in the expected format</li>
                <li>Verify that the secret key is correctly configured</li>
              </ul>
              
              <h3 className="text-lg font-medium mt-4">Data Not Appearing in Reports</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Check that your call tracking platform is sending UTM parameters</li>
                <li>Verify that calls are being completed and not just initiated</li>
                <li>Check for any error messages in your webhook logs</li>
              </ul>
              
              <h3 className="text-lg font-medium mt-4">Error Responses</h3>
              <div className="space-y-2">
                <p><strong>400 Bad Request</strong>: The webhook payload is invalid or missing required fields</p>
                <p><strong>401 Unauthorized</strong>: The secret key is invalid or missing</p>
                <p><strong>404 Not Found</strong>: The webhook URL is incorrect or the workspace does not exist</p>
                <p><strong>500 Internal Server Error</strong>: An error occurred while processing the webhook</p>
              </div>
              
              <p className="mt-4">
                If you continue to experience issues, please contact support with your webhook ID and any error messages you're receiving.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WebhookDocs; 