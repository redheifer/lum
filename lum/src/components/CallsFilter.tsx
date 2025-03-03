
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

interface CallsFilterProps {
  onFilterChange: (filters: {
    search: string;
    status: string;
    minScore: number;
    sortBy: string;
  }) => void;
  filters: {
    search: string;
    status: string;
    minScore: number;
    sortBy: string;
  };
}

const CallsFilter: React.FC<CallsFilterProps> = ({ onFilterChange, filters }) => {
  return (
    <div className="space-y-4 p-4 bg-white rounded-md shadow-sm">
      <div>
        <Input 
          placeholder="Search by agent or customer name" 
          value={filters.search}
          onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
          className="w-full"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="status-filter">Status</Label>
          <Select 
            value={filters.status} 
            onValueChange={(value) => onFilterChange({ ...filters, status: value })}
          >
            <SelectTrigger id="status-filter">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="reviewed">Reviewed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="flagged">Flagged</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="qa-score-filter">Minimum QA Score: {filters.minScore}%</Label>
          <Slider
            id="qa-score-filter"
            min={0}
            max={100}
            step={5}
            value={[filters.minScore]}
            onValueChange={(value) => onFilterChange({ ...filters, minScore: value[0] })}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="sort-filter">Sort By</Label>
          <Select 
            value={filters.sortBy} 
            onValueChange={(value) => onFilterChange({ ...filters, sortBy: value })}
          >
            <SelectTrigger id="sort-filter">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date-desc">Date (Newest)</SelectItem>
              <SelectItem value="date-asc">Date (Oldest)</SelectItem>
              <SelectItem value="score-desc">QA Score (High-Low)</SelectItem>
              <SelectItem value="score-asc">QA Score (Low-High)</SelectItem>
              <SelectItem value="duration-desc">Duration (Longest)</SelectItem>
              <SelectItem value="duration-asc">Duration (Shortest)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default CallsFilter;
