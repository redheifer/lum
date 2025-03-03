import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

const WebhookAnalytics = ({ workspaceId }) => {
  const [recentCalls, setRecentCalls] = useState([]);
  const [callStats, setCallStats] = useState({
    total: 0,
    completed: 0,
    missed: 0,
    today: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCallData = async () => {
      if (!workspaceId) return;
      
      try {
        setLoading(true);
        
        // Get recent calls
        const { data: calls, error: callsError } = await supabase
          .from('calls')
          .select('*')
          .eq('workspace_id', workspaceId)
          .order('created_at', { ascending: false })
          .limit(10);
          
        if (callsError) {
          console.error('Error fetching calls:', callsError);
          return;
        }
        
        setRecentCalls(calls || []);
        
        // Get call statistics
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const { data: stats, error: statsError } = await supabase
          .from('calls')
          .select('status, count')
          .eq('workspace_id', workspaceId)
          .gt('created_at', today.toISOString())
          .group('status');
          
        if (statsError) {
          console.error('Error fetching call stats:', statsError);
          return;
        }
        
        // Get total calls
        const { count: totalCalls, error: countError } = await supabase
          .from('calls')
          .select('id', { count: 'exact', head: true })
          .eq('workspace_id', workspaceId);
          
        if (countError) {
          console.error('Error fetching call count:', countError);
          return;
        }
        
        // Calculate statistics
        const completed = stats?.find(s => s.status === 'completed')?.count || 0;
        const missed = stats?.find(s => s.status === 'missed')?.count || 0;
        const todayTotal = stats?.reduce((acc, curr) => acc + curr.count, 0) || 0;
        
        setCallStats({
          total: totalCalls,
          completed,
          missed,
          today: todayTotal
        });
        
      } catch (error) {
        console.error('Error fetching call data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCallData();
    
    // Set up a polling interval to refresh data
    const interval = setInterval(fetchCallData, 60000); // Refresh every minute
    
    return () => clearInterval(interval);
  }, [workspaceId]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Calls</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{callStats.total}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completed Calls</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{callStats.completed}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Missed Calls</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{callStats.missed}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Today's Calls</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{callStats.today}</div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Recent Calls</CardTitle>
          <CardDescription>
            The most recent calls received through your webhook
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-4">Loading...</div>
          ) : recentCalls.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              No calls received yet
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date/Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Caller</TableHead>
                  <TableHead>Campaign</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentCalls.map((call) => (
                  <TableRow key={call.id}>
                    <TableCell>
                      {format(new Date(call.created_at), 'MMM d, yyyy h:mm a')}
                    </TableCell>
                    <TableCell>
                      <Badge variant={call.status === 'completed' ? 'success' : 'destructive'}>
                        {call.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {call.duration ? `${Math.floor(call.duration / 60)}:${String(call.duration % 60).padStart(2, '0')}` : 'N/A'}
                    </TableCell>
                    <TableCell>{call.caller_number}</TableCell>
                    <TableCell>{call.utm_campaign || 'Unknown'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WebhookAnalytics; 