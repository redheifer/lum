import React, { useState, useEffect } from 'react';
import { Campaign } from '@/lib/types';
import { fetchCampaigns, fetchOnboardingState, fetchMetrics } from '@/lib/supabase';
import Sidebar from '@/components/Sidebar';
import CampaignsList from '@/components/CampaignsList';
import FilterPanel from '@/components/FilterPanel';
import EmptyState from '@/components/EmptyState';
import OnboardingWizard from '@/components/OnboardingWizard';
import ThemeToggle from '@/components/ThemeToggle';
import { Button } from "@/components/ui/button";
import { Plus, Filter, LightbulbIcon, BarChart3, Phone, Users } from "lucide-react";
import { toast } from "sonner";
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Create a Dashboard Metric Card component
const MetricCard = ({ title, value, description, icon }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

// Create a Quality By Publisher Chart component
const QualityByPublisher = ({ data }) => {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Quality by Publisher</CardTitle>
        <CardDescription>Average quality score across all publishers</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
          {/* If you're using a chart library, render the chart here */}
          {data.map((item, i) => (
            <div key={i} className="flex items-center justify-between mb-2">
              <div className="flex-1">
                <div className="text-sm font-medium">{item.publisher}</div>
              </div>
              <div className="w-2/3 bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                <div 
                  className="bg-primary h-4 rounded-full" 
                  style={{ width: `${item.score}%` }}
                ></div>
              </div>
              <div className="ml-4 text-sm font-medium">{item.score}%</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [metrics, setMetrics] = useState({
    dailyQAScore: 0,
    totalCalls: 0,
    avgCallDuration: '0m 0s',
    conversionRate: '0%',
    publisherQuality: []
  });
  
  const { showOnboarding, setShowOnboarding, onboardingStep, setOnboardingStep } = useOnboarding();
  
  // Set the active tab on component mount
  useEffect(() => {
    setActiveTab('dashboard');
  }, []);

  // Load campaigns and onboarding state
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Fetch campaigns
      const campaignsData = await fetchCampaigns();
      setCampaigns(campaignsData);
      
      // Fetch onboarding state
      const onboardingState = await fetchOnboardingState();
      
      // Check if onboarding is complete
      if (!onboardingState.isComplete) {
        setShowOnboarding(true);
        setOnboardingStep(onboardingState.currentStep);
      }
      
      // Fetch metrics
      const metricsData = await fetchMetrics();
      setMetrics(metricsData);
      
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCampaign = () => {
    // This would typically open a modal or navigate to a create campaign page
    toast.info("Campaign creation is coming soon!");
  };

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    loadData(); // Reload data after onboarding
  };

  return (
    <div className="flex h-screen">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="flex-1 overflow-auto">
        <div className="py-4 px-6 bg-card border-b">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-semibold">Campaign Dashboard</h1>
            <div className="flex gap-2 items-center">
              <ThemeToggle />
              <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)}>
                <Filter className="mr-1 h-4 w-4" />
                Filters
              </Button>
              <Button size="sm" onClick={handleCreateCampaign}>
                <Plus className="mr-1 h-4 w-4" />
                New Campaign
              </Button>
              <Button variant="outline" size="sm" onClick={() => setShowOnboarding(true)}>
                <LightbulbIcon className="mr-1 h-4 w-4" />
                Setup Wizard
              </Button>
            </div>
          </div>
          
          {showFilters && <FilterPanel />}
        </div>
        
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Overview</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <MetricCard 
              title="Daily QA Score" 
              value={`${metrics.dailyQAScore}%`}
              description="Average quality score today"
              icon={<BarChart3 className="h-4 w-4 text-muted-foreground" />}
            />
            <MetricCard 
              title="Total Calls" 
              value={metrics.totalCalls}
              description="Processed in the last 24 hours"
              icon={<Phone className="h-4 w-4 text-muted-foreground" />}
            />
            <MetricCard 
              title="Avg Call Duration" 
              value={metrics.avgCallDuration}
              description="Across all campaigns"
              icon={<BarChart3 className="h-4 w-4 text-muted-foreground" />}
            />
            <MetricCard 
              title="Conversion Rate" 
              value={metrics.conversionRate}
              description="Based on call outcomes"
              icon={<Users className="h-4 w-4 text-muted-foreground" />}
            />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
            <QualityByPublisher data={metrics.publisherQuality || []} />
            
            {/* Additional dashboard widgets would go here */}
          </div>
          
          <h2 className="text-xl font-semibold mb-4">Your Campaigns</h2>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : campaigns.length === 0 ? (
            <EmptyState 
              title="No campaigns yet"
              description="Create your first campaign to start tracking calls and quality scores."
              buttonText="Create Campaign"
              buttonAction={handleCreateCampaign}
            />
          ) : (
            <CampaignsList campaigns={campaigns} />
          )}
        </div>
      </div>
      
      {showOnboarding && (
        <OnboardingWizard 
          currentStep={onboardingStep} 
          onComplete={handleOnboardingComplete}
        />
      )}
    </div>
  );
};

export default Index;
