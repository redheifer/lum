
import React, { useState } from 'react';
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

interface FilterPanelProps {
  onClose: () => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ onClose }) => {
  const [filters, setFilters] = useState({
    search: '',
    platform: 'all',
    status: 'all',
    dateRange: [0, 30] // days
  });
  
  const handleReset = () => {
    setFilters({
      search: '',
      platform: 'all',
      status: 'all',
      dateRange: [0, 30]
    });
  };
  
  const handleApply = () => {
    // Logic to apply filters
    console.log('Applied filters:', filters);
    onClose();
  };

  return (
    <div className="absolute left-0 top-0 bottom-0 w-80 bg-white shadow-lg z-10 border-r overflow-auto">
      <div className="p-4 border-b flex justify-between items-center">
        <h3 className="font-semibold text-lg">Filters</h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="p-4 space-y-6">
        <div className="space-y-2">
          <Label htmlFor="search">Search</Label>
          <Input 
            id="search"
            placeholder="Search campaigns..."
            value={filters.search}
            onChange={(e) => setFilters({...filters, search: e.target.value})}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="platform">Platform</Label>
          <Select 
            value={filters.platform} 
            onValueChange={(value) => setFilters({...filters, platform: value})}
          >
            <SelectTrigger id="platform">
              <SelectValue placeholder="Select a platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Platforms</SelectItem>
              <SelectItem value="Retreaver">Retreaver</SelectItem>
              <SelectItem value="Invoca">Invoca</SelectItem>
              <SelectItem value="CallRail">CallRail</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select 
            value={filters.status} 
            onValueChange={(value) => setFilters({...filters, status: value})}
          >
            <SelectTrigger id="status">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="paused">Paused</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label>Date Range (Last 30 Days)</Label>
          <Slider 
            defaultValue={[0, 30]} 
            max={30} 
            step={1}
            onValueChange={(value) => setFilters({...filters, dateRange: value as [number, number]})}
          />
          <div className="flex justify-between text-sm text-gray-500 mt-1">
            <span>Today</span>
            <span>30 days ago</span>
          </div>
        </div>
        
        <div className="flex gap-2 pt-4">
          <Button variant="outline" className="flex-1" onClick={handleReset}>
            Reset
          </Button>
          <Button className="flex-1" onClick={handleApply}>
            Apply Filters
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
