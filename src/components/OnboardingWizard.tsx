
import React, { useState } from 'react';
import { updateOnboardingState, createCampaign } from '@/lib/supabase';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface OnboardingWizardProps {
  onComplete: () => void;
}

const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    companyName: '',
    industry: '',
    platform: '',
    goals: '',
    campaignName: '',
    publisher: '',
    target: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };
  
  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };
  
  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };
  
  const handleComplete = async () => {
    try {
      setIsSubmitting(true);
      // Save onboarding state
      await updateOnboardingState({ isComplete: true, currentStep: 3 });
      
      // Create initial campaign if all data is filled
      if (formData.campaignName && formData.publisher && formData.target && formData.platform) {
        const campaignData = {
          name: formData.campaignName,
          publisher: formData.publisher,
          target: formData.target,
          platform: formData.platform || 'Retreaver',
          status: 'active' as const
        };
        
        const newCampaign = await createCampaign(campaignData);
        
        if (!newCampaign) {
          throw new Error('Failed to create campaign');
        }
        
        toast.success('Campaign created successfully!');
      } else {
        toast.warning('Please fill all required fields to create a campaign');
      }
      
      onComplete();
    } catch (error) {
      toast.error('Error completing onboarding');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Welcome to Call Campaign Manager</CardTitle>
          <CardDescription>
            Let's set up your account in a few simple steps
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Step 1: About Your Business</h3>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input 
                    id="companyName" 
                    value={formData.companyName}
                    onChange={(e) => handleChange('companyName', e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="industry">Industry</Label>
                  <Select 
                    value={formData.industry} 
                    onValueChange={(value) => handleChange('industry', value)}
                  >
                    <SelectTrigger id="industry">
                      <SelectValue placeholder="Select your industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="insurance">Insurance</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="retail">Retail</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
          
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Step 2: Call Tracking Platform</h3>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="platform">Preferred Call Tracking Platform</Label>
                  <Select 
                    value={formData.platform} 
                    onValueChange={(value) => handleChange('platform', value)}
                  >
                    <SelectTrigger id="platform">
                      <SelectValue placeholder="Select a platform" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Retreaver">Retreaver</SelectItem>
                      <SelectItem value="Invoca">Invoca</SelectItem>
                      <SelectItem value="CallRail">CallRail</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="goals">Goals & Objectives</Label>
                  <Textarea 
                    id="goals" 
                    placeholder="What are you hoping to achieve with call campaigns?"
                    value={formData.goals}
                    onChange={(e) => handleChange('goals', e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}
          
          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Step 3: Create Your First Campaign</h3>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="campaignName">Campaign Name</Label>
                  <Input 
                    id="campaignName" 
                    placeholder="e.g., Spring Auto Insurance Leads"
                    value={formData.campaignName}
                    onChange={(e) => handleChange('campaignName', e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="publisher">Publisher</Label>
                  <Input 
                    id="publisher" 
                    placeholder="e.g., SHL Agency"
                    value={formData.publisher}
                    onChange={(e) => handleChange('publisher', e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="target">Target</Label>
                  <Input 
                    id="target" 
                    placeholder="e.g., Auto Insurance Leads"
                    value={formData.target}
                    onChange={(e) => handleChange('target', e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={handleBack}
            disabled={step === 1}
          >
            Back
          </Button>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">
              Step {step} of 3
            </span>
            <Button onClick={handleNext} disabled={isSubmitting}>
              {step === 3 ? (isSubmitting ? 'Completing...' : 'Complete') : 'Next'}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default OnboardingWizard;
