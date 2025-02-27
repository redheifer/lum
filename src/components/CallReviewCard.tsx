
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

const StatusIcon = ({ status }: { status: Call['status'] }) => {
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

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-amber-600';
    return 'text-red-600';
  };

  const getScoreBadgeVariant = (score: number): "success" | "warning" | "destructive" => {
    if (score >= 90) return 'success';
    if (score >= 75) return 'warning';
    return 'destructive';
  };

  return (
    <>
      <div className="flex items-center p-3 border-b hover:bg-slate-50 transition-colors">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <StatusIcon status={call.status} />
            <span className="font-medium text-sm truncate">{call.customer}</span>
          </div>
          <div className="text-xs text-slate-500 truncate">Agent: {call.agent}</div>
        </div>

        <div className="flex-1 hidden md:block">
          <div className="flex gap-1 flex-wrap">
            {call.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {call.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{call.tags.length - 3}
              </Badge>
            )}
          </div>
        </div>

        <div className="flex-1 hidden md:block">
          <div className="text-xs text-slate-500">{call.date}</div>
          <div className="text-xs text-slate-500">{call.duration}</div>
        </div>

        <div className="flex items-center gap-2 ml-2">
          <Badge variant={getScoreBadgeVariant(call.qaScore)} className="text-xs">
            {call.qaScore}%
          </Badge>
          
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ExternalLink className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[80vh]">
              <DialogHeader>
                <DialogTitle>Call Review: {call.customer}</DialogTitle>
                <DialogDescription>
                  Agent: {call.agent} | {call.date} | {call.duration}
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
                    <h4 className="text-sm font-medium mb-2">AI Analysis</h4>
                    <div className="text-sm bg-slate-50 p-3 rounded-md">
                      {call.aiAnalysis || "Analysis not available"}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant={getScoreBadgeVariant(call.qaScore)}>
                      QA Score: {call.qaScore}%
                    </Badge>
                    <Badge variant="outline">{call.status}</Badge>
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
