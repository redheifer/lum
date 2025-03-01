
import { supabase } from "@/integrations/supabase/client";
import { Campaign, Call } from "./types";

export async function fetchCampaigns() {
  const { data, error } = await supabase
    .from('campaigns')
    .select('*')
    .order('createdAt', { ascending: false });
  
  if (error) {
    console.error('Error fetching campaigns:', error);
    return [];
  }
  
  return data as Campaign[];
}

export async function fetchCallsByCampaign(campaignId: string) {
  const { data, error } = await supabase
    .from('calls')
    .select('*')
    .eq('campaignId', campaignId)
    .order('callDate', { ascending: false });
  
  if (error) {
    console.error('Error fetching calls:', error);
    return [];
  }
  
  return data as Call[];
}

export async function fetchOnboardingState() {
  const { data, error } = await supabase
    .from('onboarding')
    .select('*')
    .single();
  
  if (error) {
    console.error('Error fetching onboarding state:', error);
    return { isComplete: false, currentStep: 1 };
  }
  
  return data;
}

export async function updateOnboardingState(state: { isComplete: boolean, currentStep: number }) {
  const { error } = await supabase
    .from('onboarding')
    .upsert(state);
  
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
        ...campaign, 
        createdAt: new Date().toISOString() 
      }
    ])
    .select();
  
  if (error) {
    console.error('Error creating campaign:', error);
    return null;
  }
  
  return data[0] as Campaign;
}
