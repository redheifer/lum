
import React, { useState, useEffect } from 'react';
import { Campaign } from '@/lib/types';
import { fetchCampaigns, fetchOnboardingState } from '@/lib/supabase';
import Sidebar from '@/components/Sidebar';
import CampaignsList from '@/components/CampaignsList';
import FilterPanel from '@/components/FilterPanel';
import EmptyState from '@/components/EmptyState';
import OnboardingWizard from '@/components/OnboardingWizard';
import ThemeToggle from '@/components/ThemeToggle';
import { Button } from "@/components/ui/button";
import { Plus, Filter } from "lucide-react";
import { toast } from "sonner";

const Index = () => {
  const [activeTab, setActiveTab] = useState('campaigns');
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [onboardingComplete, setOnboardingComplete] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingState, setOnboardingState] = useState(null);
  
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Check onboarding status
        const onboardingData = await fetchOnboardingState();
        setOnboardingState(onboardingData);
        setOnboardingComplete(onboardingData.isComplete);
        
        // If onboarding is not complete and there are no campaigns, show onboarding
        const campaignsData = await fetchCampaigns();
        setCampaigns(campaignsData);
        
        if (!onboardingData.isComplete && campaignsData.length === 0) {
          setShowOnboarding(true);
        }
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  const handleCreateCampaign = () => {
    // Navigate to campaign creation
    toast.info('Campaign creation coming soon');
  };
  
  const handleOnboardingComplete = () => {
    setOnboardingComplete(true);
    setShowOnboarding(false);
    toast.success('Onboarding completed!');
  };

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden transition-colors duration-300">
      {/* Sidebar */}
      <div className="w-64 flex-shrink-0 h-full">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Filter Panel - Slides in from left */}
        {showFilters && (
          <FilterPanel onClose={() => setShowFilters(false)} />
        )}
        
        {/* Header */}
        <div className="py-4 px-6 bg-card border-b flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Campaign Dashboard</h1>
          <div className="flex gap-2 items-center">
            <ThemeToggle />
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowFilters(!showFilters)}
              className="transition-all hover:shadow-sm"
            >
              <Filter className="mr-1 h-4 w-4" />
              Filters
            </Button>
            <Button 
              size="sm" 
              onClick={handleCreateCampaign}
              className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary transition-all hover:shadow-md"
            >
              <Plus className="mr-1 h-4 w-4" />
              New Campaign
            </Button>
          </div>
        </div>
        
        {/* Main Content Area */}
        <div className="flex-1 overflow-auto p-6 bg-background transition-colors duration-300">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : showOnboarding ? (
            <OnboardingWizard 
              onComplete={handleOnboardingComplete} 
              initialState={onboardingState}
            />
          ) : campaigns.length === 0 ? (
            <EmptyState 
              title="No Campaigns Found"
              description="Get started by creating your first campaign to track calls and performance."
              actionLabel="Create Campaign"
              onAction={handleCreateCampaign}
            />
          ) : (
            <CampaignsList campaigns={campaigns} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
