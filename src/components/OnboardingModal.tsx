import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, CheckCircle, Lightbulb } from 'lucide-react';
import { generateUniqueId } from '@/lib/utils';

// Import onboarding steps
import WelcomeStep from './onboarding/WelcomeStep';
import RequiredFieldsStep from './onboarding/RequiredFieldsStep';
import OptionalFieldsStep from './onboarding/OptionalFieldsStep';
import WebhookUrlStep from './onboarding/WebhookUrlStep';
import IntegrationStep from './onboarding/IntegrationStep';
import SuccessStep from './onboarding/SuccessStep';

interface OnboardingModalProps {
  open: boolean;
  workspaceId: string;
  onOpenChange: (open: boolean) => void;
  onComplete: () => void;
}

const OnboardingModal: React.FC<OnboardingModalProps> = ({
  open,
  workspaceId,
  onOpenChange,
  onComplete
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [webhookConfig, setWebhookConfig] = useState({
    name: 'Call Analysis Webhook',
    description: 'Webhook to analyze call recordings',
    requiredFields: {
      campaign_name: true,
      campaign_id: true,
      recording_url: true
    },
    optionalFields: {
      caller_id: true,
      call_duration: true,
      agent_id: false,
      call_date: true,
      call_time: false,
      disposition: true
    },
    webhookUrl: `https://api.lumai.com/webhook/${generateUniqueId(8)}`,
    webhookSecret: generateUniqueId(24)
  });

  // Define steps array with all the step components
  const steps = [
    {
      id: 'welcome',
      title: 'Welcome',
      component: <WelcomeStep />
    },
    {
      id: 'required-fields',
      title: 'Required Fields',
      component: <RequiredFieldsStep 
        webhookConfig={webhookConfig} 
        onRequiredFieldChange={(field, value) => {
          setWebhookConfig({
            ...webhookConfig,
            requiredFields: {
              ...webhookConfig.requiredFields,
              [field]: value
            }
          });
        }}
      />
    },
    {
      id: 'optional-fields',
      title: 'Optional Fields',
      component: <OptionalFieldsStep 
        webhookConfig={webhookConfig} 
        onOptionalFieldChange={(field, value) => {
          setWebhookConfig({
            ...webhookConfig,
            optionalFields: {
              ...webhookConfig.optionalFields,
              [field]: value
            }
          });
        }}
      />
    },
    {
      id: 'webhook-url',
      title: 'Webhook URL',
      component: <WebhookUrlStep webhookConfig={webhookConfig} />
    },
    {
      id: 'integration',
      title: 'Integration',
      component: <IntegrationStep webhookConfig={webhookConfig} />
    },
    {
      id: 'success',
      title: 'Complete',
      component: <SuccessStep webhookConfig={webhookConfig} />
    }
  ];

  const handleBack = () => {
    setCurrentStep(Math.max(0, currentStep - 1));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Last step - complete onboarding
      console.log('Completing onboarding with config:', webhookConfig);
      onComplete();
      // Reset step for next time
      setCurrentStep(0);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <div className="flex items-center">
            <div className="h-8 w-8 bg-gradient-to-br from-amber-400 to-amber-600 text-white rounded-full flex items-center justify-center shadow-sm mr-3">
              <Lightbulb className="h-5 w-5" />
            </div>
            <DialogTitle className="text-xl font-semibold">{steps[currentStep].title}</DialogTitle>
          </div>
          
          <div className="mt-4 flex space-x-0">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <div className="flex-1 flex flex-col items-center">
                  <div 
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs ${
                      index < currentStep 
                        ? 'bg-amber-500 text-white' 
                        : index === currentStep 
                          ? 'bg-white dark:bg-gray-800 border-2 border-amber-500 text-amber-500' 
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600'
                    }`}
                  >
                    {index < currentStep ? (
                      <CheckCircle className="h-3 w-3" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  <span className="text-xs mt-1 text-gray-600 dark:text-gray-400">
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className="flex-1 flex items-center justify-center">
                    <div className={`h-px w-full ${
                      index < currentStep ? 'bg-amber-500' : 'bg-gray-200 dark:bg-gray-700'
                    }`} />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </DialogHeader>
        
        <div className="py-4 min-h-[300px] max-h-[60vh] overflow-y-auto">
          {steps[currentStep].component}
        </div>
        
        <div className="flex justify-between pt-4 border-t border-gray-200 dark:border-gray-800">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 0}
            className={currentStep === 0 ? 'opacity-0 pointer-events-none' : ''}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          
          <Button 
            onClick={handleNext}
            className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white"
          >
            {currentStep < steps.length - 1 ? (
              <>
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </>
            ) : (
              <>
                Complete
                <CheckCircle className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OnboardingModal; 