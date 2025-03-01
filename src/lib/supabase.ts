
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
    createdAt: item.createdat
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
  
  // Map database field names to our interface
  return {
    id: data.id,
    isComplete: data.iscomplete,
    currentStep: data.currentstep
  } as OnboardingState;
}

export async function updateOnboardingState(state: OnboardingState) {
  const { error } = await supabase
    .from('onboarding')
    .upsert({
      id: state.id,
      iscomplete: state.isComplete,
      currentstep: state.currentStep
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
