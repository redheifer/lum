import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import Sidebar from '@/components/Sidebar';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, CheckCircle2, Shield, Key, Smartphone } from 'lucide-react';

const SecuritySettings = () => {
  const [activeTab, setActiveTab] = useState('settings/security');
  const navigate = useNavigate();
  
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: false,
    loginNotifications: true,
    sessionTimeout: 30,
    passwordLastChanged: '2023-10-15',
    lastLogin: '2023-11-28 14:32:45',
    loginLocation: 'San Francisco, CA',
    loginDevice: 'Chrome on macOS',
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Set the active tab on component mount
  useEffect(() => {
    setActiveTab('settings/security');
  }, []);

  const handleToggle = (key: string) => {
    setSecuritySettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    
    if (key === 'twoFactorEnabled') {
      if (!securitySettings.twoFactorEnabled) {
        toast.success('Two-factor authentication enabled');
      } else {
        toast.info('Two-factor authentication disabled');
      }
    } else if (key === 'loginNotifications') {
      if (!securitySettings.loginNotifications) {
        toast.success('Login notifications enabled');
      } else {
        toast.info('Login notifications disabled');
      }
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!passwordForm.currentPassword) {
      toast.error('Please enter your current password');
      return;
    }
    
    if (passwordForm.newPassword.length < 8) {
      toast.error('New password must be at least 8 characters');
      return;
    }
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    
    // Simulate password change
    toast.success('Password changed successfully');
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    
    // Update last changed date
    setSecuritySettings(prev => ({
      ...prev,
      passwordLastChanged: new Date().toISOString().split('T')[0]
    }));
  };

  const handleTabChange = (value: string) => {
    if (value === 'profile') {
      navigate('/settings/profile');
    } else if (value === 'notifications') {
      navigate('/settings/notifications');
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-semibold mb-6">Settings</h1>
          
          <Tabs defaultValue="security" className="w-full" onValueChange={handleTabChange}>
            <TabsList className="mb-6">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>
            
            <TabsContent value="security">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center">
                      <Shield className="h-5 w-5 mr-2 text-amber-500" />
                      <CardTitle>Account Security</CardTitle>
                    </div>
                    <CardDescription>Manage your account security settings</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="twoFactorEnabled">Two-Factor Authentication</Label>
                        <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                      </div>
                      <Switch 
                        id="twoFactorEnabled" 
                        checked={securitySettings.twoFactorEnabled}
                        onCheckedChange={() => handleToggle('twoFactorEnabled')}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="loginNotifications">Login Notifications</Label>
                        <p className="text-sm text-muted-foreground">Receive notifications for new login attempts</p>
                      </div>
                      <Switch 
                        id="loginNotifications" 
                        checked={securitySettings.loginNotifications}
                        onCheckedChange={() => handleToggle('loginNotifications')}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                      <Input 
                        id="sessionTimeout" 
                        type="number" 
                        min="5" 
                        max="120" 
                        value={securitySettings.sessionTimeout}
                        onChange={(e) => setSecuritySettings(prev => ({
                          ...prev,
                          sessionTimeout: parseInt(e.target.value)
                        }))}
                      />
                      <p className="text-sm text-muted-foreground">Automatically log out after period of inactivity</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <div className="flex items-center">
                      <Key className="h-5 w-5 mr-2 text-amber-500" />
                      <CardTitle>Change Password</CardTitle>
                    </div>
                    <CardDescription>Update your account password</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handlePasswordSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <Input 
                          id="currentPassword" 
                          name="currentPassword"
                          type="password" 
                          value={passwordForm.currentPassword}
                          onChange={handlePasswordChange}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input 
                          id="newPassword" 
                          name="newPassword"
                          type="password" 
                          value={passwordForm.newPassword}
                          onChange={handlePasswordChange}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <Input 
                          id="confirmPassword" 
                          name="confirmPassword"
                          type="password" 
                          value={passwordForm.confirmPassword}
                          onChange={handlePasswordChange}
                        />
                      </div>
                      
                      <div className="pt-2">
                        <Button type="submit">Update Password</Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <div className="flex items-center">
                      <Smartphone className="h-5 w-5 mr-2 text-amber-500" />
                      <CardTitle>Recent Activity</CardTitle>
                    </div>
                    <CardDescription>Monitor recent account activity</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="border rounded-md p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium">Last successful login</p>
                            <p className="text-sm text-muted-foreground">{securitySettings.lastLogin}</p>
                            <div className="flex items-center mt-2 text-sm text-green-600">
                              <CheckCircle2 className="h-4 w-4 mr-1" />
                              <span>Successful login from {securitySettings.loginLocation}</span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">Device: {securitySettings.loginDevice}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="border rounded-md p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium">Password last changed</p>
                            <p className="text-sm text-muted-foreground">{securitySettings.passwordLastChanged}</p>
                            <div className="flex items-center mt-2 text-sm text-amber-600">
                              <AlertCircle className="h-4 w-4 mr-1" />
                              <span>We recommend changing your password every 90 days</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default SecuritySettings; 