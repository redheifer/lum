
import React from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Phone, MessageSquare, BarChart4 } from "lucide-react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="h-full w-full bg-white border-r">
      <div className="flex flex-col h-full">
        <div className="p-4 border-b">
          <h2 className="font-semibold text-lg">Call Evolution Hub</h2>
          <p className="text-sm text-slate-500">AI-powered call quality analysis</p>
        </div>
        
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
          
          {/* Content will be rendered in the main area, not here */}
        </Tabs>
        
        <div className="mt-auto p-4 border-t">
          <Button variant="outline" className="w-full">Help & Documentation</Button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
