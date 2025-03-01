
import React, { useState, useEffect } from 'react';
import { updateOnboardingState, createCampaign } from '@/lib/supabase';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { OnboardingState } from '@/lib/types';

interface OnboardingWizardProps {
  onComplete: () => void;
  initialState?: OnboardingState;
}

const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ onComplete, initialState }) => {
  const [step, setStep] = useState(1);
  const [businessData, setBusinessData] = useState({
    companyName: '',
    industry: '',
    goals: ''
  });
  const [campaignData, setCampaignData] = useState({
    campaignName: '',
    platform: '',
    publisher: '',
    target: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    // Initialize form with existing data if available
    if (initialState?.businessData) {
      setBusinessData(initialState.businessData);
    }
  }, [initialState]);
  
  const handleBusinessDataChange = (field: string, value: string) => {
    setBusinessData({ ...businessData, [field]: value });
  };
  
  const handleCampaignDataChange = (field: string, value: string) => {
    setCampaignData({ ...campaignData, [field]: value });
  };
  
  const handleNext = async () => {
    if (step === 1) {
      // Save business data before proceeding
      const updated = await updateOnboardingState({
        id: initialState?.id,
        isComplete: false,
        currentStep: 2,
        businessData
      });
      
      if (!updated) {
        toast.error('Failed to save business data');
        return;
      }
      
      setStep(2);
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
      await updateOnboardingState({
        id: initialState?.id,
        isComplete: true,
        currentStep: 2,
        businessData
      });
      
      // Create initial campaign if all data is filled
      if (campaignData.campaignName && campaignData.publisher && campaignData.target) {
        const campaignToCreate = {
          name: campaignData.campaignName,
          publisher: campaignData.publisher,
          target: campaignData.target,
          platform: campaignData.platform || 'Retreaver',
          status: 'active' as const
        };
        
        const newCampaign = await createCampaign(campaignToCreate);
        
        if (!newCampaign) {
          throw new Error('Failed to create campaign');
        }
        
        toast.success('Campaign created successfully!');
      } else {
        toast.warning('Please fill all required fields to create a campaign');
        return;
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
      <Card className="border-2 border-primary/20 shadow-lg bg-gradient-to-br from-card to-card/50">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
            Welcome to Call Campaign Manager
          </CardTitle>
          <CardDescription className="text-center text-lg">
            Let's set up your account in a few simple steps
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
              <h3 className="text-xl font-medium">Step 1: About Your Business</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="companyName" className="text-md">Company Name</Label>
                  <Input 
                    id="companyName" 
                    value={businessData.companyName}
                    onChange={(e) => handleBusinessDataChange('companyName', e.target.value)}
                    className="mt-1"
                    placeholder="Enter your company name"
                  />
                </div>
                
                <div>
                  <Label htmlFor="industry" className="text-md">Industry</Label>
                  <Select 
                    value={businessData.industry} 
                    onValueChange={(value) => handleBusinessDataChange('industry', value)}
                  >
                    <SelectTrigger id="industry" className="mt-1">
                      <SelectValue placeholder="Select your industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="insurance">Insurance</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="retail">Retail</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="goals" className="text-md">Business Goals</Label>
                  <Textarea 
                    id="goals" 
                    placeholder="What are you hoping to achieve with call campaigns?"
                    value={businessData.goals}
                    onChange={(e) => handleBusinessDataChange('goals', e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
          )}
          
          {step === 2 && (
            <div className="space-y-6 animate-fade-in">
              <h3 className="text-xl font-medium">Step 2: Create Your First Campaign</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="campaignName" className="text-md">Campaign Name</Label>
                  <Input 
                    id="campaignName" 
                    placeholder="e.g., Spring Auto Insurance Leads"
                    value={campaignData.campaignName}
                    onChange={(e) => handleCampaignDataChange('campaignName', e.target.value)}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="platform" className="text-md">Call Tracking Platform</Label>
                  <Select 
                    value={campaignData.platform} 
                    onValueChange={(value) => handleCampaignDataChange('platform', value)}
                  >
                    <SelectTrigger id="platform" className="mt-1">
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
                  <Label htmlFor="publisher" className="text-md">Publisher</Label>
                  <Input 
                    id="publisher" 
                    placeholder="e.g., SHL Agency"
                    value={campaignData.publisher}
                    onChange={(e) => handleCampaignDataChange('publisher', e.target.value)}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="target" className="text-md">Target</Label>
                  <Input 
                    id="target" 
                    placeholder="e.g., Auto Insurance Leads"
                    value={campaignData.target}
                    onChange={(e) => handleCampaignDataChange('target', e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-between pt-6">
          <Button 
            variant="outline" 
            onClick={handleBack}
            disabled={step === 1}
            className="transition-all hover:shadow-md"
          >
            Back
          </Button>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">
              Step {step} of 2
            </span>
            <Button 
              onClick={handleNext} 
              disabled={isSubmitting || (step === 1 && !businessData.companyName) || (step === 2 && (!campaignData.campaignName || !campaignData.publisher || !campaignData.target))} 
              className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary transition-all hover:shadow-md"
            >
              {step === 2 ? (isSubmitting ? 'Completing...' : 'Complete') : 'Next'}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default OnboardingWizard;
