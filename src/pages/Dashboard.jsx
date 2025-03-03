import WebhookAnalytics from '@/components/WebhookAnalytics';

const Dashboard = () => {
  return (
    <div className="container py-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="calls">Call Analytics</TabsTrigger>
          {/* ... other tabs */}
        </TabsList>
        
        <TabsContent value="overview">
          {/* ... existing content */}
        </TabsContent>
        
        <TabsContent value="calls">
          <WebhookAnalytics workspaceId={activeWorkspace?.id} />
        </TabsContent>
        
        {/* ... other tab content */}
      </Tabs>
    </div>
  );
};

export default Dashboard; 