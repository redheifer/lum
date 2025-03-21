import { supabase } from "@/integrations/supabase/client";
import { Campaign, Call, OnboardingState } from "./types";

export async function fetchCampaigns() {
  const { data, error } = await supabase
    .from('campaigns')
    .select('*')
    .order('createdat', { ascending: false });
  
  if (error) {
    console.error('Error fetching campaigns:', error);
    return [];
  }
  
  // Map database field names to our interface
  return data.map(item => ({
    id: item.id,
    name: item.name,
    platform: item.platform,
    publisher: item.publisher,
    target: item.target,
    status: item.status,
    createdAt: item.createdat
  })) as Campaign[];
}

export async function fetchCallsByCampaign(campaignId: string) {
  const { data, error } = await supabase
    .from('calls')
    .select('*')
    .eq('campaignid', campaignId)
    .order('calldate', { ascending: false });
  
  if (error) {
    console.error('Error fetching calls:', error);
    return [];
  }
  
  // Map database field names to our interface
  return data.map(item => ({
    id: item.id,
    inboundCallId: item.inboundcallid,
    campaignId: item.campaignid,
    campaignName: item.campaignname,
    platform: item.platform,
    callDate: item.calldate,
    callerId: item.callerid,
    endCallSource: item.endcallsource,
    publisher: item.publisher,
    target: item.target,
    duration: item.duration,
    revenue: item.revenue,
    payout: item.payout,
    recording: item.recording,
    transcript: item.transcript,
    rating: item.rating,
    description: item.description,
    disposition: item.disposition,
    createdAt: item.createdat,
    // Add needed fields for CallReviewCard
    status: item.disposition,
    customer: item.callerid,
    agent: item.target,
    date: item.calldate,
    tags: [],
    qaScore: item.rating || 0,
    aiAnalysis: item.description
  })) as Call[];
}

export async function fetchOnboardingState() {
  const { data, error } = await supabase
    .from('onboarding')
    .select('*')
    .single();
  
  if (error) {
    console.error('Error fetching onboarding state:', error);
    return { isComplete: false, currentStep: 1 } as OnboardingState;
  }
  
  // Map database field names to our interface and parse businessData if it exists
  return {
    id: data.id,
    isComplete: data.iscomplete,
    currentStep: data.currentstep,
    businessData: data.businessdata ? JSON.parse(JSON.stringify(data.businessdata)) : undefined
  } as OnboardingState;
}

export async function updateOnboardingState(state: OnboardingState) {
  const { error } = await supabase
    .from('onboarding')
    .upsert({
      id: state.id,
      iscomplete: state.isComplete,
      currentstep: state.currentStep,
      businessdata: state.businessData || null
    });
  
  if (error) {
    console.error('Error updating onboarding state:', error);
    return false;
  }
  
  return true;
}

export async function createCampaign(campaign: Omit<Campaign, 'id' | 'createdAt'>) {
  const { data, error } = await supabase
    .from('campaigns')
    .insert([
      { 
        name: campaign.name,
        platform: campaign.platform,
        publisher: campaign.publisher,
        target: campaign.target,
        status: campaign.status,
        createdat: new Date().toISOString()
      }
    ])
    .select();
  
  if (error) {
    console.error('Error creating campaign:', error);
    return null;
  }
  
  // Map database response to our interface
  return {
    id: data[0].id,
    name: data[0].name,
    platform: data[0].platform,
    publisher: data[0].publisher,
    target: data[0].target,
    status: data[0].status,
    createdAt: data[0].createdat
  } as Campaign;
}

export async function fetchMetrics() {
  try {
    // In a real app, this would be a Supabase call
    // For now, we're mocking the data
    return {
      dailyQAScore: 85,
      totalCalls: 127,
      avgCallDuration: '3m 42s',
      conversionRate: '23%',
      publisherQuality: [
        { publisher: 'Facebook', score: 87 },
        { publisher: 'Google', score: 92 },
        { publisher: 'Instagram', score: 78 },
        { publisher: 'LinkedIn', score: 94 },
        { publisher: 'Twitter', score: 81 }
      ]
    };
  } catch (error) {
    console.error('Error fetching metrics:', error);
    throw error;
  }
}

export async function fetchAllCalls() {
  const { data, error } = await supabase
    .from('calls')
    .select('*')
    .order('calldate', { ascending: false });
  
  if (error) {
    console.error('Error fetching calls:', error);
    return [];
  }
  
  // Map database field names to our interface
  return data.map(item => ({
    id: item.id,
    inboundCallId: item.inboundcallid,
    campaignId: item.campaignid,
    campaignName: item.campaignname,
    platform: item.platform,
    callDate: item.calldate,
    callerId: item.callerid,
    endCallSource: item.endcallsource,
    publisher: item.publisher,
    target: item.target,
    duration: item.duration,
    revenue: item.revenue,
    payout: item.payout,
    recording: item.recording,
    transcript: item.transcript,
    rating: item.rating,
    description: item.description,
    disposition: item.disposition,
    createdAt: item.createdat,
    status: item.disposition,
    customer: item.callerid,
    agent: item.target,
    date: item.calldate,
    tags: [],
    qaScore: item.rating || 0,
    aiAnalysis: item.description
  })) as Call[];
}

// New function to send QA data to Supabase
export async function sendQAData(callData: Omit<Call, 'id' | 'createdAt'>) {
  // Prepare the data for Supabase format
  const supabaseData = {
    inboundcallid: callData.inboundCallId,
    campaignid: callData.campaignId,
    campaignname: callData.campaignName,
    platform: callData.platform,
    calldate: callData.callDate,
    callerid: callData.callerId,
    endcallsource: callData.endCallSource,
    publisher: callData.publisher,
    target: callData.target,
    duration: callData.duration,
    revenue: callData.revenue,
    payout: callData.payout,
    recording: callData.recording,
    transcript: callData.transcript,
    rating: callData.qaScore,
    description: callData.aiAnalysis,
    disposition: callData.status,
    createdat: new Date().toISOString()
  };

  const { data, error } = await supabase
    .from('calls')
    .insert([supabaseData])
    .select();
  
  if (error) {
    console.error('Error sending QA data:', error);
    return null;
  }
  
  // Return the newly created call data
  return {
    id: data[0].id,
    inboundCallId: data[0].inboundcallid,
    campaignId: data[0].campaignid,
    campaignName: data[0].campaignname,
    platform: data[0].platform,
    callDate: data[0].calldate,
    callerId: data[0].callerid,
    endCallSource: data[0].endcallsource,
    publisher: data[0].publisher,
    target: data[0].target,
    duration: data[0].duration,
    revenue: data[0].revenue,
    payout: data[0].payout,
    recording: data[0].recording,
    transcript: data[0].transcript,
    rating: data[0].rating,
    description: data[0].description,
    disposition: data[0].disposition,
    createdAt: data[0].createdat,
    status: data[0].disposition,
    customer: data[0].callerid,
    agent: data[0].target,
    date: data[0].calldate,
    tags: [],
    qaScore: data[0].rating || 0,
    aiAnalysis: data[0].description
  } as Call;
}
