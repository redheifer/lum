
import React, { useState } from 'react';
import { Call } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle, AlertCircle, Clock } from "lucide-react";

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

  return (
    <Card className="w-full transition-all duration-200 hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-medium">Call with {call.customer}</CardTitle>
            <CardDescription>Agent: {call.agent}</CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <StatusIcon status={call.status} />
            <span className={`font-semibold ${getScoreColor(call.qaScore)}`}>{call.qaScore}%</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-slate-500">
            <span>{call.date}</span>
            <span>{call.duration}</span>
          </div>
          <div className="flex flex-wrap gap-1 mt-2">
            {call.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full">View Details</Button>
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
                  <Badge variant={call.qaScore >= 90 ? "success" : call.qaScore >= 75 ? "warning" : "destructive"}>
                    QA Score: {call.qaScore}%
                  </Badge>
                  <Badge variant="outline">{call.status}</Badge>
                </div>
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
};

export default CallReviewCard;
