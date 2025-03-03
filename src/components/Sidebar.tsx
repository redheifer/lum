import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { BarChart3, Phone, Layers, Settings, LogOut, HelpCircle, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import HelpMenu from './HelpMenu';
import { toast } from 'sonner';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar = ({ activeTab, setActiveTab }: SidebarProps) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    
    if (tab === 'dashboard') {
      navigate('/dashboard', { replace: true });
    } else if (tab === 'calls') {
      navigate('/calls');
    } else if (tab === 'campaigns' || tab === 'reports') {
      // These are coming soon features
      toast.info("We're working hard to bring you this feature soon! 🚀");
      navigate('/dashboard'); // Stay on dashboard
    } else if (tab === 'settings') {
      navigate('/settings');
    }
  };

  return (
    <div className="h-full flex flex-col justify-between py-6 bg-cream-100 border-r">
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
            <span className="font-bold text-xl tracking-tight text-gray-900 dark:text-white">Lum</span>
          </div>
        </div>
      </div>
      
      {/* Navigation */}
      <div className="flex-1 mt-10">
        <ul className="space-y-1 px-3">
          <li>
            <button
              onClick={() => handleTabChange('dashboard')}
              className={`w-full text-left px-3 py-2 rounded-md flex items-center ${
                activeTab === 'dashboard'
                  ? 'bg-amber-100 text-amber-900'
                  : 'hover:bg-amber-50'
              }`}
            >
              <BarChart3 className="h-5 w-5 mr-3" />
              Dashboard
            </button>
          </li>
          <li>
            <button
              onClick={() => handleTabChange('realtime-qa')}
              className={`w-full text-left px-3 py-2 rounded-md flex items-center ${
                activeTab === 'realtime-qa'
                  ? 'bg-amber-100 text-amber-900'
                  : 'hover:bg-amber-50'
              }`}
            >
              <Phone className="h-5 w-5 mr-3" />
              Real-time QA
            </button>
          </li>
          <li>
            <button
              onClick={() => handleTabChange('campaigns')}
              className={`w-full text-left px-3 py-2 rounded-md flex items-center ${
                activeTab === 'campaigns'
                  ? 'bg-amber-100 text-amber-900'
                  : 'hover:bg-amber-50'
              }`}
            >
              <Layers className="h-5 w-5 mr-3" />
              Campaigns
              <span className="ml-2 px-2 py-0.5 bg-amber-500 text-white text-xs rounded-full">Soon</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => handleTabChange('reports')}
              className={`w-full text-left px-3 py-2 rounded-md flex items-center ${
                activeTab === 'reports'
                  ? 'bg-amber-100 text-amber-900'
                  : 'hover:bg-amber-50'
              }`}
            >
              <FileText className="h-5 w-5 mr-3" />
              Reports
              <span className="ml-2 px-2 py-0.5 bg-amber-500 text-white text-xs rounded-full">Soon</span>
            </button>
          </li>
        </ul>
      </div>
      
      {/* Help and Logout section at the bottom */}
      <div className="px-3 space-y-3">
        {/* Settings now at bottom */}
        <button
          onClick={() => handleTabChange('settings')}
          className={`w-full text-left px-3 py-2 rounded-md flex items-center ${
            activeTab === 'settings'
              ? 'bg-amber-100 text-amber-900'
              : 'hover:bg-amber-50'
          }`}
        >
          <Settings className="h-5 w-5 mr-3" />
          Settings
        </button>
        
        <HelpMenu />
        
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={() => {
            logout();
            navigate('/');
          }}
        >
          <LogOut className="h-5 w-5 mr-3" />
          Sign Out
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
