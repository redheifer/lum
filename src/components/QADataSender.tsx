import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { sendQAData } from '@/lib/supabase';

const QADataSender = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    inboundCallId: `call-${Math.floor(Math.random() * 10000)}`,
    campaignId: '',
    campaignName: '',
    platform: 'Web',
    callDate: new Date().toISOString(),
    callerId: '',
    endCallSource: 'Customer',
    publisher: '',
    target: '',
    duration: '180',
    revenue: 0,
    payout: 0,
    status: 'Completed',
    qaScore: 85
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Convert numeric fields
      const qaData = {
        ...formData,
        revenue: Number(formData.revenue),
        payout: Number(formData.payout),
        qaScore: Number(formData.qaScore)
      };

      const result = await sendQAData(qaData);
      
      if (result) {
        toast.success('QA data sent successfully!');
        // Reset form with a new random call ID
        setFormData(prev => ({
          ...prev,
          inboundCallId: `call-${Math.floor(Math.random() * 10000)}`
        }));
      } else {
        toast.error('Failed to send QA data');
      }
    } catch (error) {
      console.error('Error sending QA data:', error);
      toast.error('An error occurred while sending QA data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Send QA Data</CardTitle>
        <CardDescription>
          Use this form to send test QA data to Supabase
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="callerId">Caller ID</Label>
              <Input
                id="callerId"
                name="callerId"
                placeholder="e.g. +1234567890"
                value={formData.callerId}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="campaignName">Campaign Name</Label>
              <Input
                id="campaignName"
                name="campaignName"
                placeholder="e.g. Summer Promo"
                value={formData.campaignName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="publisher">Publisher</Label>
              <Input
                id="publisher"
                name="publisher"
                placeholder="e.g. Facebook"
                value={formData.publisher}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="target">Agent</Label>
              <Input
                id="target"
                name="target"
                placeholder="e.g. John Smith"
                value={formData.target}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (seconds)</Label>
              <Input
                id="duration"
                name="duration"
                type="number"
                min="0"
                value={formData.duration}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="qaScore">QA Score (%)</Label>
              <Input
                id="qaScore"
                name="qaScore"
                type="number"
                min="0"
                max="100"
                value={formData.qaScore}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select 
              value={formData.status} 
              onValueChange={(value) => handleSelectChange('status', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Missed">Missed</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Voicemail">Voicemail</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'Sending...' : 'Send QA Data'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default QADataSender; 