import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/integrations/supabase/client';
import { Call } from '@/lib/types';

// Simple API key validation - in production, use a more secure method
const API_KEY = process.env.WEBHOOK_API_KEY || 'your-secret-api-key';

type WebhookResponse = {
  success: boolean;
  message: string;
  call_id?: string;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<WebhookResponse>
) {
  // Allow both GET and POST methods
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ 
      success: false, 
      message: 'Method not allowed',
      error: 'Only POST and GET methods are supported'
    });
  }
  
  try {
    // Basic API key validation
    const apiKey = req.headers['x-api-key'] || req.query.api_key;
    
    if (!apiKey || apiKey !== API_KEY) {
      return res.status(401).json({ 
        success: false, 
        message: 'Unauthorized',
        error: 'Invalid or missing API key'
      });
    }
    
    // Get data from either query params (GET) or request body (POST)
    const rawData = req.method === 'POST' ? req.body : req.query;
    
    // Validate required fields
    if (!rawData.inbound_call_id && !rawData.call_uuid) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
        error: 'inbound_call_id or call_uuid is required'
      });
    }
    
    // Transform webhook data to match our database schema
    const callData = transformWebhookData(rawData);
    
    // Insert into Supabase using the existing sendQAData function structure
    const supabaseData = {
      inboundcallid: callData.inboundCallId,
      campaignid: callData.campaignId || '',
      campaignname: callData.campaignName || '',
      platform: callData.platform || 'Web',
      calldate: callData.callDate,
      callerid: callData.callerId,
      endcallsource: callData.endCallSource,
      publisher: callData.publisher,
      target: callData.target,
      duration: callData.duration,
      revenue: callData.revenue,
      payout: callData.payout,
      recording: callData.recording,
      transcript: callData.transcript || '',
      rating: callData.qaScore || Math.floor(Math.random() * 100),
      description: callData.aiAnalysis || '',
      disposition: callData.status || 'Completed',
      createdat: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from('calls')
      .insert([supabaseData])
      .select();
    
    if (error) {
      console.error('Error saving webhook data:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to save call data',
        error: error.message
      });
    }
    
    // Return success response
    return res.status(200).json({ 
      success: true, 
      message: 'Call data received and processed successfully',
      call_id: data[0].id
    });
    
  } catch (error) {
    console.error('Webhook processing error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

/**
 * Transform webhook data to match our database schema
 */
function transformWebhookData(rawData: any): Omit<Call, 'id' | 'createdAt'> {
  // Map incoming fields to our schema
  return {
    inboundCallId: rawData.inbound_call_id || rawData.call_uuid || '',
    campaignId: rawData.campaign_id || '',
    campaignName: rawData.campaign || rawData.campaign_name || '',
    platform: rawData.platform || 'Web',
    callDate: rawData.call_date || rawData.call_start_time || new Date().toISOString(),
    callerId: rawData.caller_id || '',
    customer: rawData.customer || '',
    endCallSource: rawData.end_call_source || rawData.hung_up_by || '',
    publisher: rawData.publisher || rawData.publisher_company || '',
    target: rawData.target || rawData.buyer_name || '',
    duration: rawData.duration || rawData.call_duration || '0',
    revenue: parseFloat(rawData.revenue || '0'),
    payout: parseFloat(rawData.payout || '0'),
    recording: rawData.recording || rawData.call_recording_url || '',
    transcript: rawData.transcript || '',
    status: rawData.status || 'Completed',
    agent: rawData.agent || rawData.target || rawData.buyer_name || '',
    tags: Array.isArray(rawData.tags) ? rawData.tags : [],
    qaScore: parseInt(rawData.qa_score || rawData.rating || Math.floor(Math.random() * 100).toString(), 10),
    aiAnalysis: rawData.ai_analysis || ''
  };
} 