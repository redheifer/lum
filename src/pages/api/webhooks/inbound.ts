import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase-admin';
import { validateWebhookSignature } from '@/utils/webhook-validation';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    // Extract workspace ID from URL or header
    const workspaceId = req.query.workspaceId || req.headers['x-workspace-id'];
    
    if (!workspaceId) {
      return res.status(400).json({ error: 'Workspace ID is required' });
    }
    
    // Optional: Validate webhook signature if you implement a secret
    // const isValid = validateWebhookSignature(req);
    // if (!isValid) {
    //   return res.status(401).json({ error: 'Invalid webhook signature' });
    // }
    
    // Get the payload
    const payload = req.body;
    
    // Map N8N webhook data to your database structure
    const callData = {
      workspace_id: workspaceId,
      caller_id: payload.caller_id || payload.call_data?.caller_id,
      campaign_name: payload.campaign || payload.call_data?.campaign,
      duration: payload.duration_seconds || payload.call_data?.duration_seconds,
      status: payload.status || payload.call_data?.status,
      recording_url: payload.recording_url || payload.call_data?.recording_url,
      transcript: payload.transcript || payload.call_data?.transcript,
      created_at: new Date().toISOString(),
      qa_score: calculateQAScore(payload.transcript || payload.call_data?.transcript)
    };
    
    // Insert into Supabase
    const { data, error } = await supabase
      .from('calls')
      .insert([callData])
      .select();
    
    if (error) {
      console.error('Error saving call data:', error);
      return res.status(500).json({ error: 'Failed to save call data' });
    }
    
    // Return success response
    return res.status(200).json({ 
      success: true, 
      message: 'Call data received and processed',
      call_id: data[0].id
    });
    
  } catch (error) {
    console.error('Webhook processing error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// Simple function to calculate a mock QA score based on transcript
function calculateQAScore(transcript?: string): number {
  if (!transcript) return 0;
  
  // This would be replaced by your actual QA scoring algorithm
  // For now, we'll return a random score between 60-100
  return Math.floor(60 + Math.random() * 40);
} 