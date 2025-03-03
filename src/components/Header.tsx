import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Filter, Bell, Search } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';
import { Input } from '@/components/ui/input';

const Header = ({ title, onNewCampaign, onToggleFilters }) => {
  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-200 dark:bg-gray-900 dark:border-gray-800">
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          
          <div className="hidden md:flex relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search campaigns..." 
              className="pl-9 w-64 bg-gray-50 border-gray-200 focus:bg-white dark:bg-gray-800 dark:border-gray-700"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={onToggleFilters}
            className="hidden sm:flex items-center border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
          >
            <Filter className="mr-1.5 h-4 w-4" />
            Filters
          </Button>
          
          <Button 
            variant="default" 
            size="sm" 
            onClick={onNewCampaign}
            className="hidden sm:flex items-center bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-sm hover:shadow"
          >
            <Plus className="mr-1.5 h-4 w-4" />
            New Campaign
          </Button>
          
          <Button variant="ghost" size="icon" className="relative text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-amber-500 rounded-full"></span>
          </Button>
          
          <ThemeToggle />
          
          <Button variant="ghost" size="sm" className="rounded-full w-8 h-8 p-0 ml-2">
            <img 
              src="https://ui-avatars.com/api/?name=L&background=f59e0b&color=fff" 
              alt="User avatar" 
              className="rounded-full w-full h-full object-cover"
            />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header; 