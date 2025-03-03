import express from 'express';
import { registerWebhook, handleWebhookRequest } from './webhook-handler';

const router = express.Router();

// API endpoint to register a new webhook
router.post('/api/webhooks', (req, res) => {
  const { workspaceId, selectedFields } = req.body;
  
  if (!workspaceId) {
    return res.status(400).json({ error: 'workspaceId is required' });
  }
  
  try {
    const webhookId = registerWebhook(workspaceId, selectedFields || []);
    
    return res.status(201).json({
      webhookId,
      webhookUrl: `https://api.lumai.com/webhook/${webhookId}`
    });
  } catch (error) {
    console.error('Webhook creation error:', error);
    return res.status(500).json({ error: 'Failed to create webhook' });
  }
});

// Webhook endpoint that receives call data
router.post('/webhook/:webhookId', handleWebhookRequest);

export default router; 