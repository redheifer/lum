import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import WelcomeStep from './onboarding/WelcomeStep';
// Add other step imports one by one to identify the problematic component

interface ProgressiveModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: () => void;
}

const ProgressiveModal: React.FC<ProgressiveModalProps> = ({
  open,
  onOpenChange,
  onComplete
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  
  // Start with just the first step
  const steps = [
    {
      id: 'welcome',
      title: 'Welcome',
      component: <WelcomeStep />
    }
    // Add other steps one by one
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{steps[currentStep].title}</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          {steps[currentStep].component}
        </div>
        
        <DialogFooter>
          <Button onClick={onComplete}>
            Complete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProgressiveModal; 