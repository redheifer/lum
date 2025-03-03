
import React from 'react';
import { Campaign } from '@/lib/types';
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Calendar, Phone, BarChart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CampaignsListProps {
  campaigns: Campaign[];
}

const CampaignsList: React.FC<CampaignsListProps> = ({ campaigns }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {campaigns.map((campaign) => (
          <CampaignCard key={campaign.id} campaign={campaign} />
        ))}
      </div>
    </div>
  );
};

const CampaignCard: React.FC<{ campaign: Campaign }> = ({ campaign }) => {
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'active': return 'bg-green-500';
      case 'paused': return 'bg-yellow-500';
      case 'completed': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-0">
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-medium text-lg line-clamp-1">{campaign.name}</h3>
            <Badge className={getStatusColor(campaign.status)}>
              {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
            </Badge>
          </div>
          
          <div className="space-y-2 text-sm text-gray-600 mb-4">
            <div className="flex items-center gap-2">
              <span className="font-medium">Platform:</span> {campaign.platform}
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">Publisher:</span> {campaign.publisher}
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">Target:</span> {campaign.target}
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Created: {new Date(campaign.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
          
          <div className="flex gap-2 mt-4">
            <Button variant="outline" size="sm" className="flex-1">
              <Phone className="h-4 w-4 mr-1" /> View Calls
            </Button>
            <Button variant="outline" size="sm" className="flex-1">
              <BarChart className="h-4 w-4 mr-1" /> Analytics
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CampaignsList;
