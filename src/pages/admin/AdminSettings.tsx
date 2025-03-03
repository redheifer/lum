import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Loader2, Save } from 'lucide-react';

const AdminSettings = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState({
    siteTitle: 'Call Evolution Hub',
    siteDescription: 'Call analytics and management platform',
    allowSignups: true,
    requireEmailVerification: true,
    maxCampaignsPerUser: 10,
    maxCallsPerCampaign: 1000,
    n8nWebhookUrl: '',
    adminNotificationEmail: '',
    customCss: '',
    maintenanceMode: false,
    maintenanceMessage: 'We are currently performing maintenance. Please check back later.',
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('system_settings')
        .select('*')
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          // No settings found, we'll create them when saving
          console.log('No settings found, will create on save');
        } else {
          throw error;
        }
      }
      
      if (data) {
        setSettings({
          siteTitle: data.site_title || settings.siteTitle,
          siteDescription: data.site_description || settings.siteDescription,
          allowSignups: data.allow_signups !== false,
          requireEmailVerification: data.require_email_verification !== false,
          maxCampaignsPerUser: data.max_campaigns_per_user || settings.maxCampaignsPerUser,
          maxCallsPerCampaign: data.max_calls_per_campaign || settings.maxCallsPerCampaign,
          n8nWebhookUrl: data.n8n_webhook_url || settings.n8nWebhookUrl,
          adminNotificationEmail: data.admin_notification_email || settings.adminNotificationEmail,
          customCss: data.custom_css || settings.customCss,
          maintenanceMode: data.maintenance_mode === true,
          maintenanceMessage: data.maintenance_message || settings.maintenanceMessage,
        });
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Failed to load settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      const { data, error } = await supabase
        .from('system_settings')
        .upsert({
          id: 1, // Single row for settings
          site_title: settings.siteTitle,
          site_description: settings.siteDescription,
          allow_signups: settings.allowSignups,
          require_email_verification: settings.requireEmailVerification,
          max_campaigns_per_user: settings.maxCampaignsPerUser,
          max_calls_per_campaign: settings.maxCallsPerCampaign,
          n8n_webhook_url: settings.n8nWebhookUrl,
          admin_notification_email: settings.adminNotificationEmail,
          custom_css: settings.customCss,
          maintenance_mode: settings.maintenanceMode,
          maintenance_message: settings.maintenanceMessage,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'id' });
      
      if (error) throw error;
      
      toast.success('Settings saved successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Settings</h1>
        <p className="text-muted-foreground mt-1">Configure system-wide settings and preferences.</p>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Basic configuration for your platform</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="siteTitle">Site Title</Label>
                  <Input
                    id="siteTitle"
                    value={settings.siteTitle}
                    onChange={(e) => handleChange('siteTitle', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="siteDescription">Site Description</Label>
                  <Input
                    id="siteDescription"
                    value={settings.siteDescription}
                    onChange={(e) => handleChange('siteDescription', e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="maxCampaignsPerUser">Max Campaigns Per User</Label>
                  <Input
                    id="maxCampaignsPerUser"
                    type="number"
                    value={settings.maxCampaignsPerUser}
                    onChange={(e) => handleChange('maxCampaignsPerUser', parseInt(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxCallsPerCampaign">Max Calls Per Campaign</Label>
                  <Input
                    id="maxCallsPerCampaign"
                    type="number"
                    value={settings.maxCallsPerCampaign}
                    onChange={(e) => handleChange('maxCallsPerCampaign', parseInt(e.target.value))}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="adminNotificationEmail">Admin Notification Email</Label>
                <Input
                  id="adminNotificationEmail"
                  type="email"
                  value={settings.adminNotificationEmail}
                  onChange={(e) => handleChange('adminNotificationEmail', e.target.value)}
                  placeholder="admin@example.com"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Configure security and access settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="allowSignups">Allow New Signups</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable or disable new user registrations
                  </p>
                </div>
                <Switch
                  id="allowSignups"
                  checked={settings.allowSignups}
                  onCheckedChange={(checked) => handleChange('allowSignups', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="requireEmailVerification">Require Email Verification</Label>
                  <p className="text-sm text-muted-foreground">
                    Users must verify their email before accessing the platform
                  </p>
                </div>
                <Switch
                  id="requireEmailVerification"
                  checked={settings.requireEmailVerification}
                  onCheckedChange={(checked) => handleChange('requireEmailVerification', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="integrations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Integration Settings</CardTitle>
              <CardDescription>Configure external service integrations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="n8nWebhookUrl">n8n Webhook URL</Label>
                <Input
                  id="n8nWebhookUrl"
                  value={settings.n8nWebhookUrl}
                  onChange={(e) => handleChange('n8nWebhookUrl', e.target.value)}
                  placeholder="https://n8n.example.com/webhook/..."
                />
                <p className="text-sm text-muted-foreground">
                  URL for sending call data to n8n for processing
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="appearance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
              <CardDescription>Customize the look and feel of the platform</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="customCss">Custom CSS</Label>
                <Textarea
                  id="customCss"
                  value={settings.customCss}
                  onChange={(e) => handleChange('customCss', e.target.value)}
                  placeholder="/* Add your custom CSS here */"
                  className="font-mono"
                  rows={10}
                />
                <p className="text-sm text-muted-foreground">
                  Add custom CSS to override default styles
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="maintenance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Maintenance Settings</CardTitle>
              <CardDescription>Configure maintenance mode and related settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable to show maintenance page to all non-admin users
                  </p>
                </div>
                <Switch
                  id="maintenanceMode"
                  checked={settings.maintenanceMode}
                  onCheckedChange={(checked) => handleChange('maintenanceMode', checked)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maintenanceMessage">Maintenance Message</Label>
                <Textarea
                  id="maintenanceMessage"
                  value={settings.maintenanceMessage}
                  onChange={(e) => handleChange('maintenanceMessage', e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button onClick={handleSaveSettings} disabled={isSaving} className="flex items-center gap-2">
          {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save Settings
        </Button>
      </div>
    </div>
  );
};

export default AdminSettings; 