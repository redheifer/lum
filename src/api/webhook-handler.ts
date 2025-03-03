// This would be implemented on your backend
import { Request, Response } from 'express';

interface WebhookConfig {
  webhookId: string;
  workspaceId: string;
  selectedFields: string[];
  n8nEndpoint: string;
}

const webhookConfigs = new Map<string, WebhookConfig>();

// Register a new webhook
export const registerWebhook = (workspaceId: string, selectedFields: string[]): string => {
  const webhookId = generateUniqueId();
  
  webhookConfigs.set(webhookId, {
    webhookId,
    workspaceId,
    selectedFields,
    n8nEndpoint: `https://n8n.internal.lumai.com/webhook/${webhookId}`
  });
  
  return webhookId;
};

// Handle incoming webhook calls
export const handleWebhookRequest = async (req: Request, res: Response) => {
  const webhookId = req.params.webhookId;
  const config = webhookConfigs.get(webhookId);
  
  if (!config) {
    return res.status(404).json({ error: 'Webhook not found' });
  }
  
  try {
    // Validate the required fields
    const requiredFields = ['campaign_name', 'campaign_id', 'recording_url'];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ error: `Missing required field: ${field}` });
      }
    }
    
    // Forward the request to n8n
    const response = await fetch(config.n8nEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body)
    });
    
    if (!response.ok) {
      throw new Error(`n8n responded with status: ${response.status}`);
    }
    
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return res.status(500).json({ error: 'Failed to process webhook' });
  }
};

function generateUniqueId(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
} 