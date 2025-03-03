import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy } from 'lucide-react';
import { toast } from 'sonner';

interface IntegrationStepProps {
  webhookConfig: any;
}

const IntegrationStep: React.FC<IntegrationStepProps> = ({ webhookConfig }) => {
  const [activeSystem, setActiveSystem] = useState('generic');
  
  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success('Code snippet copied to clipboard');
  };
  
  // Generate example payload based on selected fields
  const generateExamplePayload = () => {
    const payload = {
      // Required fields
      campaign_name: "Q4 Sales Campaign",
      campaign_id: "camp_1234567890",
      recording_url: "https://example.com/recordings/call-123.mp3",
    };
    
    // Add optional fields if selected
    if (webhookConfig.optionalFields.caller_id) {
      payload['caller_id'] = "+15551234567";
    }
    
    if (webhookConfig.optionalFields.call_duration) {
      payload['call_duration'] = 385; // seconds
    }
    
    if (webhookConfig.optionalFields.agent_id) {
      payload['agent_id'] = "agent_8675309";
    }
    
    if (webhookConfig.optionalFields.call_date) {
      payload['call_date'] = "2023-07-15";
    }
    
    if (webhookConfig.optionalFields.call_time) {
      payload['call_time'] = "14:32:45";
    }
    
    if (webhookConfig.optionalFields.disposition) {
      payload['disposition'] = "sale";
    }
    
    return JSON.stringify(payload, null, 2);
  };
  
  const examplePayload = generateExamplePayload();
  
  // Code snippets for different systems
  const curlSnippet = `curl -X POST ${webhookConfig.webhookUrl} \\
  -H "Content-Type: application/json" \\
  -H "X-Lum-Webhook-Key: ${webhookConfig.webhookSecret}" \\
  -d '${examplePayload.replace(/\n/g, "").replace(/  /g, "")}'`;
  
  const nodeSnippet = `const axios = require('axios');

axios.post('${webhookConfig.webhookUrl}', {
${examplePayload.split('\n').map(line => '  ' + line).join('\n')}
}, {
  headers: {
    'Content-Type': 'application/json',
    'X-Lum-Webhook-Key': '${webhookConfig.webhookSecret}'
  }
})
.then(response => console.log(response.data))
.catch(error => console.error(error));`;
  
  const pythonSnippet = `import requests
import json

url = "${webhookConfig.webhookUrl}"
headers = {
    "Content-Type": "application/json",
    "X-Lum-Webhook-Key": "${webhookConfig.webhookSecret}"
}
payload = ${examplePayload}

response = requests.post(url, headers=headers, data=json.dumps(payload))
print(response.text)`;
  
  const phpSnippet = `<?php
$url = "${webhookConfig.webhookUrl}";
$payload = ${examplePayload};

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
curl_setopt($ch, CURLOPT_HTTPHEADER, array(
    'Content-Type: application/json',
    'X-Lum-Webhook-Key: ${webhookConfig.webhookSecret}'
));

$response = curl_exec($ch);
curl_close($ch);

echo $response;
?>`;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-xl font-semibold">Integration Instructions</h3>
        <p className="text-gray-600 dark:text-gray-400">
          Follow these steps to integrate Lum with your existing phone system.
        </p>
      </div>
      
      <div className="space-y-6">
        <Tabs defaultValue="generic" value={activeSystem} onValueChange={setActiveSystem}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
            <h4 className="font-medium text-gray-800 dark:text-gray-200">Select your system:</h4>
            <TabsList className="bg-gray-100 dark:bg-gray-800">
              <TabsTrigger value="generic">Generic HTTP</TabsTrigger>
              <TabsTrigger value="node">Node.js</TabsTrigger>
              <TabsTrigger value="python">Python</TabsTrigger>
              <TabsTrigger value="php">PHP</TabsTrigger>
            </TabsList>
          </div>
          
          <div className="border border-gray-200 dark:border-gray-800 rounded-md overflow-hidden">
            <div className="bg-gray-50 dark:bg-gray-900 py-2 px-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs bg-amber-50 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400 border-amber-200 dark:border-amber-800/30">
                  {activeSystem === 'generic' ? 'cURL' : activeSystem === 'node' ? 'Node.js' : activeSystem === 'python' ? 'Python' : 'PHP'}
                </Badge>
                <span className="text-sm text-gray-600 dark:text-gray-400">Code Snippet</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7"
                onClick={() => handleCopyCode(
                  activeSystem === 'generic' ? curlSnippet : 
                  activeSystem === 'node' ? nodeSnippet : 
                  activeSystem === 'python' ? pythonSnippet : phpSnippet
                )}
              >
                <Copy className="h-3.5 w-3.5 mr-1" />
                Copy
              </Button>
            </div>
            
            <TabsContent value="generic" className="m-0">
              <pre className="bg-gray-900 text-gray-100 p-4 overflow-x-auto text-sm font-mono">
                {curlSnippet}
              </pre>
            </TabsContent>
            
            <TabsContent value="node" className="m-0">
              <pre className="bg-gray-900 text-gray-100 p-4 overflow-x-auto text-sm font-mono">
                {nodeSnippet}
              </pre>
            </TabsContent>
            
            <TabsContent value="python" className="m-0">
              <pre className="bg-gray-900 text-gray-100 p-4 overflow-x-auto text-sm font-mono">
                {pythonSnippet}
              </pre>
            </TabsContent>
            
            <TabsContent value="php" className="m-0">
              <pre className="bg-gray-900 text-gray-100 p-4 overflow-x-auto text-sm font-mono">
                {phpSnippet}
              </pre>
            </TabsContent>
          </div>
        </Tabs>
        
        <div className="space-y-4">
          <h4 className="font-medium text-gray-800 dark:text-gray-200">Integration Steps:</h4>
          <ol className="space-y-3 ml-6 list-decimal">
            <li className="text-gray-700 dark:text-gray-300">
              Configure your phone system to capture call recordings
            </li>
            <li className="text-gray-700 dark:text-gray-300">
              Set up a webhook trigger to send recordings to Lum when calls end
            </li>
            <li className="text-gray-700 dark:text-gray-300">
              Use the code snippet above to format your webhook request
            </li>
            <li className="text-gray-700 dark:text-gray-300">
              Ensure all required fields are included in your payload
            </li>
            <li className="text-gray-700 dark:text-gray-300">
              Test the integration by making a sample call
            </li>
          </ol>
        </div>
      </div>
      
      <div className="bg-green-50 dark:bg-green-900/10 p-4 rounded-lg border border-green-100 dark:border-green-900/30">
        <h4 className="font-medium text-green-800 dark:text-green-400 mb-1">Need help with integration?</h4>
        <p className="text-sm text-green-700 dark:text-green-300">
          Our support team is available to help you set up your integration. 
          <a href="#" className="underline ml-1 font-medium">Contact support</a>
        </p>
      </div>
    </div>
  );
};

export default IntegrationStep; 