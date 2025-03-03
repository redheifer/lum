
import React, { useState } from 'react';
import { Call } from '@/lib/types';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle, AlertCircle, Clock, ExternalLink } from "lucide-react";

interface CallReviewCardProps {
  call: Call;
}

// Custom status definition since it's not in our Call type
type CallStatus = 'reviewed' | 'flagged' | 'pending';

const StatusIcon = ({ status }: { status: CallStatus }) => {
  switch (status) {
    case 'reviewed':
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case 'flagged':
      return <AlertCircle className="h-4 w-4 text-amber-500" />;
    case 'pending':
      return <Clock className="h-4 w-4 text-slate-400" />;
    default:
      return null;
  }
};

const CallReviewCard: React.FC<CallReviewCardProps> = ({ call }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Derive a status from call disposition or other properties
  const getCallStatus = (): CallStatus => {
    if (call.disposition?.includes('Technical/Quality Issue')) return 'flagged';
    if (call.rating && call.rating > 3) return 'reviewed';
    return 'pending';
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-amber-600';
    return 'text-red-600';
  };

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 90) return 'default';
    if (score >= 75) return 'secondary';
    return 'destructive';
  };

  // Extract caller name from callerId
  const getCallerName = () => {
    return call.callerId.split('@')[0] || 'Unknown Caller';
  };

  return (
    <>
      <div className="flex items-center p-3 border-b hover:bg-slate-50 transition-colors">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <StatusIcon status={getCallStatus()} />
            <span className="font-medium text-sm truncate">{getCallerName()}</span>
          </div>
          <div className="text-xs text-slate-500 truncate">Campaign: {call.campaignName}</div>
        </div>

        <div className="flex-1 hidden md:block">
          <div className="flex gap-1 flex-wrap">
            {call.disposition && (
              <Badge variant="outline" className="text-xs">
                {call.disposition}
              </Badge>
            )}
          </div>
        </div>

        <div className="flex-1 hidden md:block">
          <div className="text-xs text-slate-500">{new Date(call.callDate).toLocaleString()}</div>
          <div className="text-xs text-slate-500">{call.duration}</div>
        </div>

        <div className="flex items-center gap-2 ml-2">
          {call.rating && (
            <Badge variant={call.rating > 3 ? "default" : "destructive"} className="text-xs">
              {call.rating}/5
            </Badge>
          )}
          
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ExternalLink className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[80vh]">
              <DialogHeader>
                <DialogTitle>Call Review: {getCallerName()}</DialogTitle>
                <DialogDescription>
                  Campaign: {call.campaignName} | {new Date(call.callDate).toLocaleString()} | {call.duration}
                </DialogDescription>
              </DialogHeader>
              <ScrollArea className="mt-4 max-h-[60vh]">
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Transcript</h4>
                    <div className="text-sm whitespace-pre-wrap bg-slate-50 p-3 rounded-md">
                      {call.transcript || "Transcript not available"}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-2">Description</h4>
                    <div className="text-sm bg-slate-50 p-3 rounded-md">
                      {call.description || "Description not available"}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {call.rating && (
                      <Badge variant={call.rating > 3 ? "default" : "destructive"}>
                        Rating: {call.rating}/5
                      </Badge>
                    )}
                    <Badge variant="outline">{getCallStatus()}</Badge>
                  </div>
                </div>
              </ScrollArea>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </>
  );
};

export default CallReviewCard;
