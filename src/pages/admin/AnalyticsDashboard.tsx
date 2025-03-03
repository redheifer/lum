import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend } from 'recharts';

const AnalyticsDashboard = () => {
  const [timeRange, setTimeRange] = useState('30days');
  const [isLoading, setIsLoading] = useState(true);
  const [userStats, setUserStats] = useState([]);
  const [callStats, setCallStats] = useState([]);
  const [scoreDistribution, setScoreDistribution] = useState([]);
  const [campaignPerformance, setCampaignPerformance] = useState([]);

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  const fetchAnalyticsData = async () => {
    setIsLoading(true);
    try {
      // Calculate date range based on selected time period
      const endDate = new Date();
      const startDate = new Date();
      
      switch (timeRange) {
        case '7days':
          startDate.setDate(endDate.getDate() - 7);
          break;
        case '30days':
          startDate.setDate(endDate.getDate() - 30);
          break;
        case '90days':
          startDate.setDate(endDate.getDate() - 90);
          break;
        case '12months':
          startDate.setMonth(endDate.getMonth() - 12);
          break;
        default:
          startDate.setDate(endDate.getDate() - 30);
      }

      // Format dates for Supabase queries
      const startDateStr = startDate.toISOString();
      const endDateStr = endDate.toISOString();

      // Fetch user registration data
      await fetchUserStats(startDateStr, endDateStr);
      
      // Fetch call statistics
      await fetchCallStats(startDateStr, endDateStr);
      
      // Fetch call score distribution
      await fetchScoreDistribution(startDateStr, endDateStr);
      
      // Fetch campaign performance
      await fetchCampaignPerformance(startDateStr, endDateStr);
      
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserStats = async (startDate, endDate) => {
    try {
      // For user registrations over time, we need to group by date
      const { data, error } = await supabase.rpc('get_user_registrations_by_date', {
        start_date: startDate,
        end_date: endDate
      });
      
      if (error) throw error;
      
      // Transform data for chart
      const formattedData = data.map(item => ({
        date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        count: item.count,
      }));
      
      setUserStats(formattedData);
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  const fetchCallStats = async (startDate, endDate) => {
    try {
      // For call statistics over time
      const { data, error } = await supabase.rpc('get_calls_by_date', {
        start_date: startDate,
        end_date: endDate
      });
      
      if (error) throw error;
      
      // Transform data for chart
      const formattedData = data.map(item => ({
        date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        count: item.count,
        avg_score: item.avg_score || 0,
      }));
      
      setCallStats(formattedData);
    } catch (error) {
      console.error('Error fetching call stats:', error);
    }
  };

  const fetchScoreDistribution = async (startDate, endDate) => {
    try {
      // For call score distribution
      const { data, error } = await supabase.rpc('get_call_score_distribution', {
        start_date: startDate,
        end_date: endDate
      });
      
      if (error) throw error;
      
      // Define score ranges
      const scoreRanges = [
        { name: '0-20', range: [0, 20], color: '#ef4444' },
        { name: '21-40', range: [21, 40], color: '#f97316' },
        { name: '41-60', range: [41, 60], color: '#eab308' },
        { name: '61-80', range: [61, 80], color: '#84cc16' },
        { name: '81-100', range: [81, 100], color: '#22c55e' },
      ];
      
      // Count calls in each range
      const distribution = scoreRanges.map(range => {
        const count = data.filter(item => 
          item.score >= range.range[0] && item.score <= range.range[1]
        ).length;
        
        return {
          name: range.name,
          value: count,
          color: range.color
        };
      });
      
      setScoreDistribution(distribution);
    } catch (error) {
      console.error('Error fetching score distribution:', error);
    }
  };

  const fetchCampaignPerformance = async (startDate, endDate) => {
    try {
      // For campaign performance
      const { data, error } = await supabase.rpc('get_campaign_performance', {
        start_date: startDate,
        end_date: endDate
      });
      
      if (error) throw error;
      
      // Sort by call count descending and take top 10
      const topCampaigns = data
        .sort((a, b) => b.call_count - a.call_count)
        .slice(0, 10)
        .map(campaign => ({
          name: campaign.name.length > 20 ? campaign.name.substring(0, 20) + '...' : campaign.name,
          calls: campaign.call_count,
          avgScore: campaign.avg_score || 0,
        }));
      
      setCampaignPerformance(topCampaigns);
    } catch (error) {
      console.error('Error fetching campaign performance:', error);
    }
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
          <p className="text-muted-foreground mt-1">Insights and metrics about platform usage.</p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7days">Last 7 days</SelectItem>
            <SelectItem value="30days">Last 30 days</SelectItem>
            <SelectItem value="90days">Last 90 days</SelectItem>
            <SelectItem value="12months">Last 12 months</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="calls">Calls</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
            {/* User Registrations Chart */}
            <Card>
              <CardHeader>
                <CardTitle>User Registrations</CardTitle>
                <CardDescription>New user sign-ups over time</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                {isLoading ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={userStats} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="count" stroke="#8884d8" activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
            
            {/* Call Score Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Call Score Distribution</CardTitle>
                <CardDescription>Distribution of call scores</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                {isLoading ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={scoreDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {scoreDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Campaign Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Top Campaign Performance</CardTitle>
              <CardDescription>Call volume by campaign</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              {isLoading ? (
                <div className="h-full flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={campaignPerformance}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    layout="vertical"
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={150} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="calls" fill="#8884d8" name="Call Count" />
                    <Bar dataKey="avgScore" fill="#82ca9d" name="Avg Score" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Additional tabs content would go here */}
        <TabsContent value="users">
          {/* User-specific analytics */}
        </TabsContent>
        
        <TabsContent value="calls">
          {/* Call-specific analytics */}
        </TabsContent>
        
        <TabsContent value="campaigns">
          {/* Campaign-specific analytics */}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsDashboard; 