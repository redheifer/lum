import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import Sidebar from '@/components/Sidebar';
import { useNavigate } from 'react-router-dom';

const NotificationSettings = () => {
  const [activeTab, setActiveTab] = useState('settings/notifications');
  const navigate = useNavigate();
  
  const [notifications, setNotifications] = useState({
    emailSummary: true,
    newCalls: true,
    missedCalls: true,
    qaAlerts: true,
    campaignUpdates: false,
    productNews: true,
    marketingEmails: false,
    desktopNotifications: true,
    browserNotifications: false,
    mobileNotifications: true
  });

  // Set the active tab on component mount
  useEffect(() => {
    setActiveTab('settings/notifications');
  }, []);

  const handleToggle = (key: string) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    toast.success('Notification preference updated');
  };

  const handleTabChange = (value: string) => {
    if (value === 'profile') {
      navigate('/settings/profile');
    } else if (value === 'security') {
      navigate('/settings/security');
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-semibold mb-6">Settings</h1>
          
          <Tabs defaultValue="notifications" className="w-full" onValueChange={handleTabChange}>
            <TabsList className="mb-6">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>
            
            <TabsContent value="notifications">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Email Notifications</CardTitle>
                    <CardDescription>Manage the emails you want to receive</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="emailSummary">Daily Summary</Label>
                        <p className="text-sm text-muted-foreground">Receive a daily summary of your call activity</p>
                      </div>
                      <Switch 
                        id="emailSummary" 
                        checked={notifications.emailSummary}
                        onCheckedChange={() => handleToggle('emailSummary')}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="newCalls">New Calls</Label>
                        <p className="text-sm text-muted-foreground">Get notified when new calls are received</p>
                      </div>
                      <Switch 
                        id="newCalls" 
                        checked={notifications.newCalls}
                        onCheckedChange={() => handleToggle('newCalls')}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="missedCalls">Missed Calls</Label>
                        <p className="text-sm text-muted-foreground">Get notified about missed calls</p>
                      </div>
                      <Switch 
                        id="missedCalls" 
                        checked={notifications.missedCalls}
                        onCheckedChange={() => handleToggle('missedCalls')}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="qaAlerts">QA Alerts</Label>
                        <p className="text-sm text-muted-foreground">Receive alerts when QA scores fall below threshold</p>
                      </div>
                      <Switch 
                        id="qaAlerts" 
                        checked={notifications.qaAlerts}
                        onCheckedChange={() => handleToggle('qaAlerts')}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="campaignUpdates">Campaign Updates</Label>
                        <p className="text-sm text-muted-foreground">Get notified about campaign status changes</p>
                      </div>
                      <Switch 
                        id="campaignUpdates" 
                        checked={notifications.campaignUpdates}
                        onCheckedChange={() => handleToggle('campaignUpdates')}
                      />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Marketing Communications</CardTitle>
                    <CardDescription>Control marketing and product communications</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="productNews">Product News</Label>
                        <p className="text-sm text-muted-foreground">Receive updates about new features and improvements</p>
                      </div>
                      <Switch 
                        id="productNews" 
                        checked={notifications.productNews}
                        onCheckedChange={() => handleToggle('productNews')}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="marketingEmails">Marketing Emails</Label>
                        <p className="text-sm text-muted-foreground">Receive promotional offers and marketing communications</p>
                      </div>
                      <Switch 
                        id="marketingEmails" 
                        checked={notifications.marketingEmails}
                        onCheckedChange={() => handleToggle('marketingEmails')}
                      />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Push Notifications</CardTitle>
                    <CardDescription>Manage push notifications across your devices</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="desktopNotifications">Desktop App</Label>
                        <p className="text-sm text-muted-foreground">Receive notifications in the desktop application</p>
                      </div>
                      <Switch 
                        id="desktopNotifications" 
                        checked={notifications.desktopNotifications}
                        onCheckedChange={() => handleToggle('desktopNotifications')}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="browserNotifications">Browser</Label>
                        <p className="text-sm text-muted-foreground">Receive notifications in your web browser</p>
                      </div>
                      <Switch 
                        id="browserNotifications" 
                        checked={notifications.browserNotifications}
                        onCheckedChange={() => handleToggle('browserNotifications')}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="mobileNotifications">Mobile App</Label>
                        <p className="text-sm text-muted-foreground">Receive notifications on your mobile device</p>
                      </div>
                      <Switch 
                        id="mobileNotifications" 
                        checked={notifications.mobileNotifications}
                        onCheckedChange={() => handleToggle('mobileNotifications')}
                      />
                    </div>
                  </CardContent>
                </Card>
                
                <div className="flex justify-end">
                  <Button onClick={() => toast.success('All notification settings saved')}>
                    Save All Changes
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings; 