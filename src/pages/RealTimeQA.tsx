import React, { useState, useEffect } from 'react';
import { fetchAllCalls, sendQAData } from '@/lib/supabase';
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
import { Filter, Search, ChevronDown, Phone, Clock, Calendar, Star, Download, Play, FileText, RefreshCw, PlusCircle, Copy, ExternalLink } from "lucide-react";
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
import { supabase } from "@/integrations/supabase/client";
import QADataSender from '@/components/QADataSender';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
  const [newDataReceived, setNewDataReceived] = useState(false);
  const [showDataSender, setShowDataSender] = useState(false);
  const [viewMode, setViewMode] = useState('table');
  const [displayMode, setDisplayMode] = useState('existing'); // 'existing' or 'webhook'
  const [webhookData, setWebhookData] = useState<any[]>([]);
  const webhookUrl = "https://cohen.app.n8n.cloud/webhook/retreaver";

  // Set the active tab on component mount
  useEffect(() => {
    setActiveTab('realtime-qa');
  }, []);
  
  // Function to load data from Supabase
  const loadData = async () => {
    try {
      setLoading(true);
      // Fetch actual data from Supabase
      const callsData = await fetchAllCalls();
      setCalls(callsData);
      setNewDataReceived(false);
    } catch (error) {
      console.error('Error loading calls data:', error);
      toast.error('Failed to load QA data');
    } finally {
      setLoading(false);
    }
  };
  
  // Initial data load
  useEffect(() => {
    loadData();
  }, [dateRange, statusFilter]);
  
  // Set up real-time subscription to Supabase
  useEffect(() => {
    // Subscribe to changes on the QA table
    const subscription = supabase
      .channel('QA-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'QA'
        }, 
        (payload) => {
          console.log('Real-time update received:', payload);
          setNewDataReceived(true);
          toast.info('New QA data received! Click refresh to update.');
        }
      )
      .subscribe();
    
    // Cleanup subscription on component unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
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

  // Function to handle test webhook data
  const handleSendTestWebhookData = () => {
    const testData = {
      inbound_call_id: `test-${Math.floor(Math.random() * 10000)}`,
      call_date: new Date().toISOString(),
      caller_id: `+1${Math.floor(Math.random() * 9000000000) + 1000000000}`,
      end_call_source: Math.random() > 0.5 ? 'Customer' : 'Agent',
      publisher: ['Facebook', 'Google', 'Instagram', 'LinkedIn', 'Twitter'][Math.floor(Math.random() * 5)],
      campaign: ['Summer Sale', 'Back to School', 'Holiday Special', 'Spring Promotion'][Math.floor(Math.random() * 4)],
      target: ['John Smith', 'Jane Doe', 'Alex Johnson', 'Sarah Williams'][Math.floor(Math.random() * 4)],
      duration: Math.floor(Math.random() * 300) + 30, // 30-330 seconds
      revenue: (Math.random() * 100).toFixed(2),
      payout: (Math.random() * 50).toFixed(2),
      recording: 'https://example.com/recordings/sample.mp3'
    };

    // Add to webhook data array
    setWebhookData(prevData => [testData, ...prevData]);
    
    // Also save to Supabase
    const qaData = {
      inboundCallId: testData.inbound_call_id,
      campaignId: '',
      campaignName: testData.campaign,
      platform: 'Web',
      callDate: testData.call_date,
      callerId: testData.caller_id,
      endCallSource: testData.end_call_source,
      publisher: testData.publisher,
      target: testData.target,
      duration: testData.duration.toString(),
      revenue: parseFloat(testData.revenue),
      payout: parseFloat(testData.payout),
      recording: testData.recording,
      status: 'Completed',
      qaScore: Math.floor(Math.random() * 100)
    };

    sendQAData(qaData)
      .then(() => toast.success('Test webhook data sent to Supabase'))
      .catch(error => toast.error('Failed to send test data to Supabase'));
  };

  const copyWebhookUrl = () => {
    navigator.clipboard.writeText(webhookUrl);
    toast.success('Webhook URL copied to clipboard');
  };

  const generateParameterizedUrl = () => {
    const params = new URLSearchParams({
      inbound_call_id: '12345-test',
      call_date: new Date().toISOString(),
      caller_id: '+15551234567',
      end_call_source: 'Customer',
      publisher: 'Facebook',
      campaign: 'Summer Campaign',
      target: 'John Smith',
      duration: '120',
      revenue: '75.00',
      payout: '25.00',
      recording: 'https://example.com/recording.mp3'
    });
    return `${webhookUrl}?${params.toString()}`;
  };

  const copyParameterizedUrl = () => {
    navigator.clipboard.writeText(generateParameterizedUrl());
    toast.success('Example webhook URL with parameters copied to clipboard');
  };

  // Filter calls based on search term and status
  const filteredCalls = calls.filter(call => {
    const matchesSearch = 
      !searchTerm || 
      call.callerId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      call.campaignName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      call.target?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || call.status === statusFilter;
    
    const callDate = new Date(call.callDate);
    const matchesDateRange = 
      callDate >= dateRange.from && 
      callDate <= dateRange.to;
    
    return matchesSearch && matchesStatus && matchesDateRange;
  });

  // Render table data for existing QA data
  const renderExistingDataTable = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      );
    }
    
    if (filteredCalls.length === 0) {
      return (
        <div className="text-center p-8">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4">
            <Phone className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-semibold">No calls found</h3>
          <p className="text-muted-foreground">No calls match your filters or there are no calls in the system yet.</p>
        </div>
      );
    }
    
    return (
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
            {filteredCalls.slice((currentPage - 1) * 10, currentPage * 10).map((call) => (
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
        <div className="border-t px-4 py-2 flex items-center justify-between">
          <div>
            <span className="text-sm text-muted-foreground">
              Showing {Math.min(filteredCalls.length, (currentPage - 1) * 10 + 1)} to {Math.min(filteredCalls.length, currentPage * 10)} of {filteredCalls.length} entries
            </span>
          </div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              <PaginationItem>
                Page {currentPage} of {Math.ceil(filteredCalls.length / 10)}
              </PaginationItem>
              <PaginationItem>
                <PaginationNext 
                  onClick={() => setCurrentPage(p => Math.min(Math.ceil(filteredCalls.length / 10), p + 1))}
                  className={currentPage === Math.ceil(filteredCalls.length / 10) ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    );
  };
  
  // Render cards view for existing QA data
  const renderExistingDataCards = () => {
    if (loading || filteredCalls.length === 0) return null;
    
    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCalls.slice((currentPage - 1) * 12, currentPage * 12).map((call) => (
            <div 
              key={call.id} 
              className="bg-card border rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedCall(call)}
            >
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium">{call.callerId}</h3>
                    <p className="text-sm text-muted-foreground">{call.campaignName}</p>
                  </div>
                  <Badge 
                    className={getStatusColor(call.status)}
                    variant={call.status === 'Completed' ? 'success' : 
                            call.status === 'Missed' ? 'destructive' : 
                            call.status === 'In Progress' ? 'default' : 'outline'}
                  >
                    {call.status}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                  <div>
                    <p className="text-muted-foreground flex items-center">
                      <Calendar className="mr-1 h-3 w-3" />
                      Date
                    </p>
                    <p>{formatDate(call.callDate)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground flex items-center">
                      <Clock className="mr-1 h-3 w-3" />
                      Duration
                    </p>
                    <p>{formatDuration(call.duration)}</p>
                  </div>
                </div>
                
                <div className="mb-3">
                  <p className="text-muted-foreground flex items-center text-sm mb-1">
                    <Star className="mr-1 h-3 w-3" />
                    QA Score
                  </p>
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
                </div>
                
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="w-full" onClick={(e) => {
                    e.stopPropagation();
                    handlePlayRecording(call);
                  }}>
                    <Play className="h-4 w-4 mr-1" />
                    Play
                  </Button>
                  <Button variant="outline" size="sm" className="w-full" onClick={(e) => {
                    e.stopPropagation();
                    handleViewTranscript(call);
                  }}>
                    <FileText className="h-4 w-4 mr-1" />
                    Transcript
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Card View Pagination */}
        <div className="mt-4 flex items-center justify-between">
          <div>
            <span className="text-sm text-muted-foreground">
              Showing {Math.min(filteredCalls.length, (currentPage - 1) * 12 + 1)} to {Math.min(filteredCalls.length, currentPage * 12)} of {filteredCalls.length} entries
            </span>
          </div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              <PaginationItem>
                Page {currentPage} of {Math.ceil(filteredCalls.length / 12)}
              </PaginationItem>
              <PaginationItem>
                <PaginationNext 
                  onClick={() => setCurrentPage(p => Math.min(Math.ceil(filteredCalls.length / 12), p + 1))}
                  className={currentPage === Math.ceil(filteredCalls.length / 12) ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </>
    );
  };
  
  // Render webhook data table
  const renderWebhookDataTable = () => {
    return (
      <div className="bg-card border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Call ID</TableHead>
              <TableHead>Caller</TableHead>
              <TableHead>Campaign</TableHead>
              <TableHead>Agent</TableHead>
              <TableHead>Date/Time</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Revenue</TableHead>
              <TableHead>Payout</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {webhookData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8">
                  <div className="flex flex-col items-center justify-center">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4">
                      <Phone className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-semibold">No webhook data yet</h3>
                    <p className="text-muted-foreground mb-4">Send data to the webhook endpoint to see it appear here</p>
                    <Button onClick={handleSendTestWebhookData}>Generate Test Data</Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              webhookData.map((data, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{data.inbound_call_id}</TableCell>
                  <TableCell>{data.caller_id}</TableCell>
                  <TableCell>{data.campaign}</TableCell>
                  <TableCell>{data.target}</TableCell>
                  <TableCell>{formatDate(data.call_date)}</TableCell>
                  <TableCell>{formatDuration(data.duration)}</TableCell>
                  <TableCell>${parseFloat(data.revenue).toFixed(2)}</TableCell>
                  <TableCell>${parseFloat(data.payout).toFixed(2)}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => {
                        if (data.recording) {
                          window.open(data.recording, '_blank');
                        } else {
                          toast.info('No recording available');
                        }
                      }}>
                        <Play className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    );
  };

  // Render webhook configuration
  const renderWebhookConfig = () => {
    return (
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Webhook Configuration</CardTitle>
          <CardDescription>
            Send data to this endpoint to populate the webhook data table
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col space-y-2">
            <div className="flex justify-between items-center">
              <div className="text-sm font-medium">Webhook URL:</div>
              <Button variant="outline" size="sm" onClick={copyWebhookUrl}>
                <Copy className="h-4 w-4 mr-2" />
                Copy URL
              </Button>
            </div>
            <div className="bg-slate-100 dark:bg-slate-800 rounded-md p-2 text-sm font-mono overflow-x-auto">
              {webhookUrl}
            </div>
          </div>
          
          <div className="flex flex-col space-y-2">
            <div className="flex justify-between items-center">
              <div className="text-sm font-medium">Example with parameters:</div>
              <Button variant="outline" size="sm" onClick={copyParameterizedUrl}>
                <Copy className="h-4 w-4 mr-2" />
                Copy Example
              </Button>
            </div>
            <div className="bg-slate-100 dark:bg-slate-800 rounded-md p-2 text-sm font-mono overflow-x-auto text-xs">
              {webhookUrl}?inbound_call_id=[call_uuid]&call_date=[call_start_time]&caller_id=[caller_id]&end_call_source=[hung_up_by]&publisher=[publisher_company]&campaign=[campaign_name]&target=[buyer_name]&duration=[call_duration]&revenue=[revenue]&payout=[payout]&recording=[call_recording_url]
            </div>
          </div>
          
          <div className="flex justify-between items-center pt-4">
            <div>
              <Button variant="default" onClick={handleSendTestWebhookData}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Generate Test Data
              </Button>
            </div>
            <div>
              <Button variant="outline" onClick={() => window.open(webhookUrl, '_blank')}>
                <ExternalLink className="h-4 w-4 mr-2" />
                Test Endpoint
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
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
              
              {/* Add Test Data Button */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="transition-all hover:shadow-sm"
                  >
                    <PlusCircle className="mr-1 h-4 w-4" />
                    Add Test Data
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add Test QA Data</DialogTitle>
                    <DialogDescription>
                      Fill out the form below to send test QA data to Supabase
                    </DialogDescription>
                  </DialogHeader>
                  <QADataSender />
                </DialogContent>
              </Dialog>
              
              {newDataReceived && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={loadData}
                  className="transition-all hover:shadow-sm animate-pulse"
                >
                  <RefreshCw className="mr-1 h-4 w-4" />
                  Refresh New Data
                </Button>
              )}
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
          
          {/* Main Display Mode Tabs */}
          <Tabs value={displayMode} onValueChange={setDisplayMode} className="mb-4">
            <TabsList className="grid w-[400px] grid-cols-2">
              <TabsTrigger value="existing">Existing QA Data</TabsTrigger>
              <TabsTrigger value="webhook">Webhook Data Table</TabsTrigger>
            </TabsList>
            
            {/* Content for existing data tab */}
            <TabsContent value="existing">
              {/* View Mode Tabs for existing data */}
              <Tabs value={viewMode} onValueChange={setViewMode} className="mb-4">
                <TabsList className="grid w-[200px] grid-cols-2">
                  <TabsTrigger value="table">Table View</TabsTrigger>
                  <TabsTrigger value="cards">Card View</TabsTrigger>
                </TabsList>
                
                {/* Enhanced filter section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 mt-4">
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
                
                {/* Table View Content */}
                <TabsContent value="table" className="mt-0">
                  {renderExistingDataTable()}
                </TabsContent>
                
                {/* Card View Content */}
                <TabsContent value="cards" className="mt-0">
                  {renderExistingDataCards()}
                </TabsContent>
              </Tabs>
            </TabsContent>
            
            {/* Content for webhook data tab */}
            <TabsContent value="webhook">
              {renderWebhookConfig()}
              <div className="p-0">
                {renderWebhookDataTable()}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default RealTimeQA; 