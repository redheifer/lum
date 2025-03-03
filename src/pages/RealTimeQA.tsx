import React, { useState, useEffect } from 'react';
import { fetchAllCalls } from '@/lib/supabase';
import { Call } from '@/lib/types';
import Sidebar from '@/components/Sidebar';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Filter, Search, ChevronDown, Phone, Clock, Calendar, Star, Download, Play, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import ThemeToggle from '@/components/ThemeToggle';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DateRangePicker } from "@/components/ui/date-range-picker";

const RealTimeQA = () => {
  const [activeTab, setActiveTab] = useState('realtime-qa');
  const [calls, setCalls] = useState<Call[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState({ from: new Date('2023-01-01'), to: new Date() });
  const [selectedCall, setSelectedCall] = useState<Call | null>(null);
  
  // Replace the sample data generation with this
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        // Fetch actual data from Supabase
        const callsData = await fetchAllCalls();
        setCalls(callsData);
      } catch (error) {
        console.error('Error loading calls data:', error);
        toast.error('Failed to load QA data');
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [dateRange, statusFilter]); // Re-fetch when filters change
  
  // Format duration to minutes:seconds
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Missed': return 'bg-red-100 text-red-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Voicemail': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handlePlayRecording = (call: Call) => {
    toast.info(`Playing recording for call ${call.id}`);
    // Implementation for playing the recording
  };

  const handleViewTranscript = (call: Call) => {
    toast.info(`Viewing transcript for call ${call.id}`);
    // Implementation for viewing the transcript
  };

  return (
    <div className="flex h-screen">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="flex-1 overflow-auto">
        <div className="py-4 px-6 bg-card border-b">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-semibold">Real-time QA</h1>
            <div className="flex gap-2 items-center">
              <ThemeToggle />
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowExport(true)}
                className="transition-all hover:shadow-sm"
              >
                <Download className="mr-1 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
          
          {/* Enhanced filter section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by phone, campaign or agent..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Select onValueChange={(value) => setStatusFilter(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Missed">Missed</SelectItem>
                <SelectItem value="Voicemail">Voicemail</SelectItem>
              </SelectContent>
            </Select>
            
            <DateRangePicker
              from={dateRange.from}
              to={dateRange.to}
              onFromChange={(date) => setDateRange(prev => ({ ...prev, from: date }))}
              onToChange={(date) => setDateRange(prev => ({ ...prev, to: date }))}
            />
          </div>
        </div>
        
        <div className="p-6">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : calls.length === 0 ? (
            <div className="text-center p-8">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4">
                <Phone className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold">No calls found</h3>
              <p className="text-muted-foreground">No calls match your filters or there are no calls in the system yet.</p>
            </div>
          ) : (
            <div className="bg-card border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <div className="flex items-center">
                        <ChevronDown className="mr-1 h-4 w-4" />
                        ID
                      </div>
                    </TableHead>
                    <TableHead>Caller</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Campaign</TableHead>
                    <TableHead>
                      <div className="flex items-center">
                        <Calendar className="mr-1 h-4 w-4" />
                        Date/Time
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center">
                        <Clock className="mr-1 h-4 w-4" />
                        Duration
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center">
                        <Star className="mr-1 h-4 w-4" />
                        QA Score
                      </div>
                    </TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {calls.slice((currentPage - 1) * 10, currentPage * 10).map((call) => (
                    <TableRow 
                      key={call.id} 
                      className="hover:bg-muted/50 cursor-pointer"
                      onClick={() => setSelectedCall(call)}
                    >
                      <TableCell className="font-medium">{call.id}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span>{call.callerId}</span>
                          <span className="text-xs text-muted-foreground">{call.customer}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          className={getStatusColor(call.status)}
                          variant={call.status === 'Completed' ? 'success' : 
                                   call.status === 'Missed' ? 'destructive' : 
                                   call.status === 'In Progress' ? 'default' : 'outline'}
                        >
                          {call.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{call.campaignName}</TableCell>
                      <TableCell>{formatDate(call.callDate)}</TableCell>
                      <TableCell>{formatDuration(call.duration)}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                            <div 
                              className={`h-2.5 rounded-full ${
                                call.qaScore >= 80 ? 'bg-green-500' : 
                                call.qaScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                              }`} 
                              style={{ width: `${call.qaScore}%` }}
                            ></div>
                          </div>
                          <span>{call.qaScore}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" onClick={(e) => {
                            e.stopPropagation();
                            handlePlayRecording(call);
                          }}>
                            <Play className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={(e) => {
                            e.stopPropagation();
                            handleViewTranscript(call);
                          }}>
                            <FileText className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {/* Pagination */}
              <div className="border-t px-4 py-2 flex items-center justify-end">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                    <PaginationItem>
                      Page {currentPage} of {Math.ceil(calls.length / 10)}
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => setCurrentPage(p => Math.min(Math.ceil(calls.length / 10), p + 1))}
                        className={currentPage === Math.ceil(calls.length / 10) ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RealTimeQA; 