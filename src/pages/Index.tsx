
import React, { useState, useEffect } from 'react';
import { Call } from '@/lib/types';
import { mockCalls } from '@/lib/mockData';
import Sidebar from '@/components/Sidebar';
import CallReviewCard from '@/components/CallReviewCard';
import CallsFilter from '@/components/CallsFilter';
import PromptEvolution from '@/components/PromptEvolution';
import AITraining from '@/components/AITraining';
import EmptyState from '@/components/EmptyState';
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

const Index = () => {
  const [activeTab, setActiveTab] = useState('calls');
  const [calls, setCalls] = useState<Call[]>(mockCalls);
  const [filteredCalls, setFilteredCalls] = useState<Call[]>(mockCalls);
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    minScore: 0,
    sortBy: 'date-desc'
  });

  useEffect(() => {
    let result = [...calls];
    
    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(call => 
        call.agent.toLowerCase().includes(searchLower) || 
        call.customer.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply status filter
    if (filters.status !== 'all') {
      result = result.filter(call => call.status === filters.status);
    }
    
    // Apply score filter
    if (filters.minScore > 0) {
      result = result.filter(call => call.qaScore >= filters.minScore);
    }
    
    // Apply sorting
    result = sortCalls(result, filters.sortBy);
    
    setFilteredCalls(result);
  }, [calls, filters]);

  const sortCalls = (callsToSort: Call[], sortBy: string): Call[] => {
    const sorted = [...callsToSort];
    
    switch (sortBy) {
      case 'date-desc':
        return sorted.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      case 'date-asc':
        return sorted.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      case 'score-desc':
        return sorted.sort((a, b) => b.qaScore - a.qaScore);
      case 'score-asc':
        return sorted.sort((a, b) => a.qaScore - b.qaScore);
      case 'duration-desc':
        return sorted.sort((a, b) => {
          const [aMin, aSec] = a.duration.split(':').map(Number);
          const [bMin, bSec] = b.duration.split(':').map(Number);
          return (bMin * 60 + bSec) - (aMin * 60 + aSec);
        });
      case 'duration-asc':
        return sorted.sort((a, b) => {
          const [aMin, aSec] = a.duration.split(':').map(Number);
          const [bMin, bSec] = b.duration.split(':').map(Number);
          return (aMin * 60 + aSec) - (bMin * 60 + bSec);
        });
      default:
        return sorted;
    }
  };

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 flex-shrink-0 h-full">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <div className="py-4 px-6 bg-white border-b">
          <h1 className="text-2xl font-semibold">
            {activeTab === 'calls' && 'Call Reviews'}
            {activeTab === 'prompts' && 'Prompt Evolution'}
            {activeTab === 'training' && 'AI Training'}
          </h1>
        </div>
        
        <div className="flex-1 overflow-hidden p-6">
          {activeTab === 'calls' && (
            <div className="h-full flex flex-col space-y-4">
              <CallsFilter onFilterChange={handleFilterChange} filters={filters} />
              
              {filteredCalls.length === 0 ? (
                <EmptyState 
                  title="No calls match your filters"
                  description="Try adjusting your filters or check back later for new calls."
                  actionLabel="Reset Filters"
                  onAction={() => setFilters({
                    search: '',
                    status: 'all',
                    minScore: 0,
                    sortBy: 'date-desc'
                  })}
                />
              ) : (
                <div className="flex flex-col bg-white rounded-md border shadow-sm overflow-hidden">
                  {/* List Header */}
                  <div className="hidden md:flex items-center border-b bg-slate-50 p-3 text-sm font-medium text-slate-500">
                    <div className="flex-1">Customer / Agent</div>
                    <div className="flex-1">Tags</div>
                    <div className="flex-1">Date / Duration</div>
                    <div className="w-24 text-right">Score</div>
                  </div>
                  
                  {/* List Body */}
                  <ScrollArea className="h-[calc(100vh-220px)]">
                    <div className="pr-4">
                      {filteredCalls.map(call => (
                        <CallReviewCard key={call.id} call={call} />
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'prompts' && (
            <ScrollArea className="h-full">
              <div className="pr-4">
                <PromptEvolution />
              </div>
            </ScrollArea>
          )}
          
          {activeTab === 'training' && (
            <AITraining />
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
