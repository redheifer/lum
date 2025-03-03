import { processWebhook } from '@/api/webhooks';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  const { workspaceId } = req.query;
  
  if (!workspaceId) {
    return res.status(400).json({ error: 'Workspace ID is required' });
  }
  
  try {
    const result = await processWebhook(workspaceId, req.body, req.headers);
    
    if (result.error) {
      return res.status(400).json({ error: result.error });
    }
    
    return res.status(200).json(result);
  } catch (error) {
    console.error('Error handling webhook:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 