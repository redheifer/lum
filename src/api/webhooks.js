import { supabase } from '@/integrations/supabase/client';

// This function will be called when a webhook is received
export async function processWebhook(workspaceId, payload, headers) {
  try {
    // 1. Verify the webhook secret
    const { data: webhook, error: webhookError } = await supabase
      .from('webhooks')
      .select('secret_key')
      .eq('workspace_id', workspaceId)
      .single();
      
    if (webhookError) {
      console.error('Error fetching webhook:', webhookError);
      return { error: 'Invalid webhook' };
    }
    
    // Check if the secret key matches (implementation depends on your call tracking platform)
    const providedSecret = headers['x-webhook-secret'] || '';
    if (providedSecret !== webhook.secret_key) {
      console.error('Invalid webhook secret');
      return { error: 'Invalid webhook secret' };
    }
    
    // 2. Extract UTM parameters from the payload
    // This will vary based on the call tracking platform's payload structure
    const utmSource = payload.utm_source || payload.source || '';
    const utmMedium = payload.utm_medium || payload.medium || '';
    const utmCampaign = payload.utm_campaign || payload.campaign || '';
    const callId = payload.call_id || payload.id || '';
    const callStatus = payload.status || 'unknown';
    const callDuration = payload.duration || 0;
    const callerNumber = payload.caller_number || payload.from || '';
    const receiverNumber = payload.receiver_number || payload.to || '';
    const timestamp = payload.timestamp || new Date().toISOString();
    
    // 3. Find or create a campaign based on UTM parameters
    let campaignId;
    
    // Try to find an existing campaign with these UTM parameters
    const { data: existingCampaign, error: campaignError } = await supabase
      .from('campaigns')
      .select('id')
      .eq('workspace_id', workspaceId)
      .eq('utm_source', utmSource)
      .eq('utm_medium', utmMedium)
      .eq('utm_campaign', utmCampaign)
      .single();
      
    if (existingCampaign) {
      campaignId = existingCampaign.id;
    } else {
      // Create a new campaign
      const { data: newCampaign, error: createError } = await supabase
        .from('campaigns')
        .insert({
          workspace_id: workspaceId,
          name: utmCampaign || `Campaign from ${utmSource || 'unknown source'}`,
          utm_source: utmSource,
          utm_medium: utmMedium,
          utm_campaign: utmCampaign,
          status: 'active',
          created_at: new Date().toISOString()
        })
        .select();
        
      if (createError) {
        console.error('Error creating campaign:', createError);
        return { error: 'Failed to create campaign' };
      }
      
      campaignId = newCampaign[0].id;
    }
    
    // 4. Record the call data
    const { data: callData, error: callError } = await supabase
      .from('calls')
      .insert({
        workspace_id: workspaceId,
        campaign_id: campaignId,
        call_id: callId,
        status: callStatus,
        duration: callDuration,
        caller_number: callerNumber,
        receiver_number: receiverNumber,
        utm_source: utmSource,
        utm_medium: utmMedium,
        utm_campaign: utmCampaign,
        raw_data: payload,
        created_at: timestamp
      });
      
    if (callError) {
      console.error('Error recording call:', callError);
      return { error: 'Failed to record call' };
    }
    
    // 5. Return success
    console.log(`Processing webhook for workspace ${workspaceId}`);
    console.log('Webhook payload:', JSON.stringify(payload));
    console.log('Webhook headers:', JSON.stringify(headers));
    
    return { 
      success: true, 
      message: 'Webhook processed successfully',
      campaign_id: campaignId
    };
    
  } catch (error) {
    console.error('Error processing webhook:', error);
    return { error: 'Internal server error' };
  } finally {
    console.log(`Webhook processed successfully. Campaign ID: ${campaignId}`);
  }
} 