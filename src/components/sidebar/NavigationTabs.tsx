
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Phone, MessageSquare, BarChart4 } from "lucide-react";

interface NavigationTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const NavigationTabs: React.FC<NavigationTabsProps> = ({ activeTab, setActiveTab }) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
      <div className="p-4 border-b">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="calls" className="flex items-center gap-1">
            <Phone className="h-4 w-4" />
            <span className="hidden sm:inline">Calls</span>
          </TabsTrigger>
          <TabsTrigger value="prompts" className="flex items-center gap-1">
            <MessageSquare className="h-4 w-4" />
            <span className="hidden sm:inline">Prompts</span>
          </TabsTrigger>
          <TabsTrigger value="training" className="flex items-center gap-1">
            <BarChart4 className="h-4 w-4" />
            <span className="hidden sm:inline">Training</span>
          </TabsTrigger>
        </TabsList>
      </div>
    </Tabs>
  );
};

export default NavigationTabs;
