import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { BarChart3, Phone, Layers, Settings, LogOut, HelpCircle, FileText, ChevronRight, User, Bell, Shield, Menu, ChevronLeft, Webhook } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar = ({ activeTab, setActiveTab }: SidebarProps) => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  // Set Dashboard as default tab on component mount
  useEffect(() => {
    if (!activeTab) {
      setActiveTab('dashboard');
      navigate('/dashboard', { replace: true });
    }
  }, []);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    
    if (tab === 'dashboard') {
      navigate('/dashboard', { replace: true });
    } else if (tab === 'realtime-qa') {
      navigate('/realtime-qa');
    } else if (tab === 'webhook-instructions') {
      navigate('/webhook-instructions');
    } else if (tab === 'campaigns' || tab === 'reports') {
      // These are disabled features
      toast.info("This feature is not available yet. 🚀");
      // Stay on current page
    }
  };

  const handleSettingsItemClick = (item: string) => {
    if (item === 'profile') {
      navigate('/settings/profile');
    } else if (item === 'notifications') {
      navigate('/settings/notifications');
    } else if (item === 'security') {
      navigate('/settings/security');
    } else if (item === 'signout') {
      signOut();
      navigate('/');
    }
  };

  const handleHelpClick = () => {
    window.open('https://uselum.com/get-help', '_blank');
  };

  const toggleSidebar = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <div className={`relative h-full flex flex-col justify-between py-6 bg-cream-100 border-r transition-all duration-300 ${isMinimized ? 'w-20' : 'w-64'}`}>
      {/* Toggle button */}
      <button 
        onClick={toggleSidebar}
        className="absolute -right-3 top-10 bg-white border border-gray-200 rounded-full p-1 shadow-md hover:shadow-lg z-10"
      >
        {isMinimized ? (
          <ChevronRight className="h-4 w-4 text-gray-600" />
        ) : (
          <ChevronLeft className="h-4 w-4 text-gray-600" />
        )}
      </button>
      
      {/* Logo */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 flex items-center justify-center bg-gradient-to-br from-amber-400 to-amber-600 text-white rounded-md shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
                <path d="M9 18h6" />
                <path d="M10 22h4" />
              </svg>
            </div>
            {!isMinimized && <span className="font-bold text-xl tracking-tight text-gray-900 dark:text-white">Lum</span>}
          </div>
        </div>
      </div>
      
      {/* Navigation */}
      <div className="flex-1 mt-10 overflow-y-auto">
        <ul className="space-y-1 px-3">
          <li>
            <button
              onClick={() => handleTabChange('dashboard')}
              className={`w-full text-left px-3 py-2 rounded-md flex items-center ${
                activeTab === 'dashboard'
                  ? 'bg-amber-100 text-amber-900 shadow-sm'
                  : 'hover:bg-amber-50'
              } ${isMinimized ? 'justify-center' : ''}`}
            >
              <BarChart3 className={`h-5 w-5 ${isMinimized ? '' : 'mr-3'}`} />
              {!isMinimized && <span>Dashboard</span>}
            </button>
          </li>
          <li>
            <button
              onClick={() => handleTabChange('realtime-qa')}
              className={`w-full text-left px-3 py-2 rounded-md flex items-center ${
                activeTab === 'realtime-qa'
                  ? 'bg-amber-100 text-amber-900 shadow-sm'
                  : 'hover:bg-amber-50'
              } ${isMinimized ? 'justify-center' : ''}`}
            >
              <Phone className={`h-5 w-5 ${isMinimized ? '' : 'mr-3'}`} />
              {!isMinimized && <span>Real-time QA</span>}
            </button>
          </li>
          <li>
            <button
              onClick={() => handleTabChange('webhook-instructions')}
              className={`w-full text-left px-3 py-2 rounded-md flex items-center ${
                activeTab === 'webhook-instructions'
                  ? 'bg-amber-100 text-amber-900 shadow-sm'
                  : 'hover:bg-amber-50'
              } ${isMinimized ? 'justify-center' : ''}`}
            >
              <Webhook className={`h-5 w-5 ${isMinimized ? '' : 'mr-3'}`} />
              {!isMinimized && <span>Webhook Setup</span>}
            </button>
          </li>
          <li>
            <button
              className={`w-full text-left px-3 py-2 rounded-md flex items-center text-gray-400 cursor-not-allowed ${isMinimized ? 'justify-center' : ''}`}
            >
              <Layers className={`h-5 w-5 ${isMinimized ? '' : 'mr-3'}`} />
              {!isMinimized && (
                <>
                  <span>Campaigns</span>
                  <span className="ml-2 px-2 py-0.5 bg-amber-500 text-white text-xs rounded-full">Soon</span>
                </>
              )}
            </button>
          </li>
          <li>
            <button
              className={`w-full text-left px-3 py-2 rounded-md flex items-center text-gray-400 cursor-not-allowed ${isMinimized ? 'justify-center' : ''}`}
            >
              <FileText className={`h-5 w-5 ${isMinimized ? '' : 'mr-3'}`} />
              {!isMinimized && (
                <>
                  <span>Reports</span>
                  <span className="ml-2 px-2 py-0.5 bg-amber-500 text-white text-xs rounded-full">Soon</span>
                </>
              )}
            </button>
          </li>
        </ul>
      </div>
      
      {/* Help and Settings section at the bottom */}
      <div className="px-3 space-y-3">
        {/* Settings with submenu */}
        <Collapsible
          open={isSettingsOpen && !isMinimized}
          onOpenChange={(open) => !isMinimized && setIsSettingsOpen(open)}
          className="w-full"
        >
          <CollapsibleTrigger asChild>
            <button
              className={`w-full text-left px-3 py-2 rounded-md flex items-center ${
                activeTab.startsWith('settings')
                  ? 'bg-amber-100 text-amber-900 shadow-sm'
                  : 'hover:bg-amber-50'
              } ${isMinimized ? 'justify-center' : 'justify-between'}`}
              onClick={() => {
                if (isMinimized) {
                  navigate('/settings/profile');
                }
              }}
            >
              <div className={`flex items-center ${isMinimized ? '' : ''}`}>
                <Settings className={`h-5 w-5 ${isMinimized ? '' : 'mr-3'}`} />
                {!isMinimized && <span>Settings</span>}
              </div>
              {!isMinimized && <ChevronRight className={`h-4 w-4 transition-transform ${isSettingsOpen ? 'rotate-90' : ''}`} />}
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent className="pl-8 space-y-1 mt-1">
            <button
              onClick={() => handleSettingsItemClick('profile')}
              className={`w-full text-left px-3 py-2 rounded-md flex items-center hover:bg-amber-50 ${
                activeTab === 'settings/profile' ? 'bg-amber-50 text-amber-900' : ''
              }`}
            >
              <User className="h-4 w-4 mr-2" />
              Profile
            </button>
            <button
              onClick={() => handleSettingsItemClick('notifications')}
              className={`w-full text-left px-3 py-2 rounded-md flex items-center hover:bg-amber-50 ${
                activeTab === 'settings/notifications' ? 'bg-amber-50 text-amber-900' : ''
              }`}
            >
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </button>
            <button
              onClick={() => handleSettingsItemClick('security')}
              className={`w-full text-left px-3 py-2 rounded-md flex items-center hover:bg-amber-50 ${
                activeTab === 'settings/security' ? 'bg-amber-50 text-amber-900' : ''
              }`}
            >
              <Shield className="h-4 w-4 mr-2" />
              Security
            </button>
            <button
              onClick={() => handleSettingsItemClick('signout')}
              className="w-full text-left px-3 py-2 rounded-md flex items-center text-red-500 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </button>
          </CollapsibleContent>
        </Collapsible>
        
        {/* Help & Resources */}
        <button
          onClick={handleHelpClick}
          className={`w-full text-left px-3 py-2 rounded-md flex items-center hover:bg-amber-50 ${isMinimized ? 'justify-center' : ''}`}
        >
          <HelpCircle className={`h-5 w-5 ${isMinimized ? '' : 'mr-3'}`} />
          {!isMinimized && <span>Help & Resources</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
