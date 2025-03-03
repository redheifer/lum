
import React from 'react';
import SidebarHeader from './sidebar/SidebarHeader';
import NavigationTabs from './sidebar/NavigationTabs';
import SettingsSection from './sidebar/SettingsSection';
import AffiliateSection from './sidebar/AffiliateSection';
import HelpSection from './sidebar/HelpSection';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="h-full w-full bg-white border-r">
      <div className="flex flex-col h-full">
        <SidebarHeader />
        <NavigationTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        <SettingsSection />
        <AffiliateSection />
        <HelpSection />
      </div>
    </div>
  );
};

export default Sidebar;
