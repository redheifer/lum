import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Copy, Check, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { generateUniqueId } from '@/lib/utils';

interface WebhookUrlStepProps {
  webhookConfig: any;
}

const WebhookUrlStep: React.FC<WebhookUrlStepProps> = ({ webhookConfig }) => {
  const [copied, setCopied] = useState({ url: false, secret: false });
  
  const handleCopy = (text: string, type: 'url' | 'secret') => {
    navigator.clipboard.writeText(text);
    setCopied({ ...copied, [type]: true });
    
    setTimeout(() => {
      setCopied({ ...copied, [type]: false });
    }, 2000);
    
    toast.success(`${type === 'url' ? 'Webhook URL' : 'Secret key'} copied to clipboard`);
  };
  
  const regenerateWebhookUrl = () => {
    // In a real application, this would communicate with the backend
    // to regenerate the webhook URL and update it in the database
    
    toast.info('This would regenerate your webhook URL in a production environment');
  };
  
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-xl font-semibold">Your Webhook URL</h3>
        <p className="text-gray-600 dark:text-gray-400">
          Use this custom URL to send your call recordings and data to Lum.
        </p>
      </div>
      
      <div className="space-y-6 mt-6">
        <div className="space-y-2">
          <Label htmlFor="webhook-url">Webhook URL</Label>
          <div className="flex">
            <Input
              id="webhook-url"
              value={webhookConfig.webhookUrl}
              readOnly
              className="flex-1 bg-gray-50 dark:bg-gray-800 font-mono text-sm"
            />
            <Button
              variant="outline"
              className="ml-2 px-3"
              onClick={() => handleCopy(webhookConfig.webhookUrl, 'url')}
            >
              {copied.url ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Send your HTTP POST requests to this URL.
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="webhook-secret">Webhook Secret</Label>
          <div className="flex">
            <Input
              id="webhook-secret"
              value={webhookConfig.webhookSecret}
              readOnly
              className="flex-1 bg-gray-50 dark:bg-gray-800 font-mono text-sm"
            />
            <Button
              variant="outline"
              className="ml-2 px-3"
              onClick={() => handleCopy(webhookConfig.webhookSecret, 'secret')}
            >
              {copied.secret ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Use this key to authenticate your requests. Keep it secure!
          </p>
        </div>
      </div>
      
      <div className="bg-amber-50 dark:bg-amber-900/10 p-4 rounded-lg border border-amber-100 dark:border-amber-900/30">
        <h4 className="font-medium text-amber-800 dark:text-amber-400 mb-2">Important Security Note</h4>
        <p className="text-sm text-amber-700 dark:text-amber-300">
          Your webhook secret is only shown once and cannot be retrieved later. Make sure to save it in a secure location. You can always generate a new secret if needed.
        </p>
      </div>
      
      <div className="pt-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="text-sm"
          onClick={regenerateWebhookUrl}
        >
          <RefreshCw className="h-3 w-3 mr-2" />
          Regenerate Webhook URL
        </Button>
      </div>
    </div>
  );
};

export default WebhookUrlStep; 