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
              <div className="ml-2 text-sm font-medium">{item.score}%</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const Index = () => {
  const [activeTab, setActiveTab] = useState('campaigns');
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [onboardingComplete, setOnboardingComplete] = useState(true);
  const { showOnboarding, onboardingState, completeOnboarding, resetAndShowOnboarding } = useOnboarding();
  
  // Add state for metrics
  const [metrics, setMetrics] = useState({
    dailyQAScore: 85,
    totalCalls: 127,
    avgCallDuration: '3m 42s',
    conversionRate: '23%'
  });
  
  // Add state for publisher quality data
  const [publisherQuality, setPublisherQuality] = useState([
    { publisher: 'Facebook', score: 87 },
    { publisher: 'Google', score: 92 },
    { publisher: 'Instagram', score: 78 },
    { publisher: 'LinkedIn', score: 94 },
    { publisher: 'Twitter', score: 81 }
  ]);
  
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Check onboarding status
        const onboardingData = await fetchOnboardingState();
        setOnboardingComplete(onboardingData.isComplete);
        
        // Load campaigns data
        const campaignsData = await fetchCampaigns();
        setCampaigns(campaignsData);
        
        // Load metrics (mock for now)
        // In a real app, you would fetch these from your backend
        // const metricsData = await fetchMetrics();
        // setMetrics(metricsData);
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
    completeOnboarding();
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
            <Button 
              onClick={resetAndShowOnboarding}
              className="bg-amber-500 hover:bg-amber-600 text-white"
            >
              <LightbulbIcon className="w-4 h-4 mr-2" />
              Setup Wizard
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
          ) : (
            <div className="space-y-6">
              {/* Dashboard Metrics */}
              <h2 className="text-xl font-semibold mb-4">Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
              
              {/* Quality by Publisher Chart */}
              <div className="mt-8">
                <QualityByPublisher data={publisherQuality} />
              </div>
              
              {/* Campaigns List */}
              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Your Campaigns</h2>
                {campaigns.length === 0 ? (
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
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
