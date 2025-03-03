import React from 'react';
import { formatDistance } from 'date-fns';
import { Phone, BarChart2, ExternalLink, MoreVertical } from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const CampaignCard = ({ campaign }) => {
  const statusColor = {
    active: 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/30',
    paused: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-900/30',
    ended: 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700',
    draft: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-900/30',
  };

  const getLastActivity = () => {
    if (!campaign.created_at) return 'No activity';
    return `Created ${formatDistance(new Date(campaign.created_at), new Date(), { addSuffix: true })}`;
  };

  return (
    <Card className="overflow-hidden h-full transition-all duration-200 hover:shadow-md hover:border-amber-200 dark:hover:border-amber-900/30">
      <CardHeader className="p-4 pb-0 flex flex-row items-start justify-between space-y-0">
        <div className="space-y-1.5">
          <Badge 
            variant="outline" 
            className={`capitalize px-2 py-0.5 ${statusColor[campaign.status || 'draft']}`}
          >
            {campaign.status || 'Draft'}
          </Badge>
          <h3 className="font-semibold text-lg leading-tight tracking-tight">{campaign.name}</h3>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Edit campaign</DropdownMenuItem>
            <DropdownMenuItem>View analytics</DropdownMenuItem>
            <DropdownMenuItem>Duplicate</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600 dark:text-red-400">Delete campaign</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="p-4 pt-3">
        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 min-h-[2.5rem]">
          {campaign.description || 'No description provided'}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex flex-col space-y-4">
        <div className="flex items-center justify-between w-full text-sm">
          <div className="flex items-center text-gray-500 dark:text-gray-400">
            <Phone className="h-4 w-4 mr-1.5" />
            <span>{campaign.calls_count || 0} calls</span>
          </div>
          <span className="text-xs text-gray-400 dark:text-gray-500">{getLastActivity()}</span>
        </div>
        <div className="flex items-center space-x-2 w-full">
          <Button 
            variant="default" 
            size="sm" 
            className="w-full justify-center bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-sm hover:shadow"
          >
            <Phone className="h-4 w-4 mr-1.5" />
            View Calls
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full justify-center"
          >
            <BarChart2 className="h-4 w-4 mr-1.5" />
            Analytics
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default CampaignCard; 