import React, { useState } from 'react';
import { HelpCircle, X, Lightbulb } from 'lucide-react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

const FloatingHelpButton = () => {
  const { setShowOnboarding, resetAndShowOnboarding } = useOnboarding();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  
  const handleStartWizard = () => {
    setOpen(false);
    resetAndShowOnboarding();
  };
  
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button className="h-12 w-12 rounded-full shadow-lg bg-amber-500 hover:bg-amber-600">
            <HelpCircle className="h-6 w-6 text-white" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-56" side="top" align="end">
          <div className="space-y-2">
            <h3 className="font-medium">Need Help?</h3>
            <Button 
              variant="ghost" 
              className="w-full justify-start" 
              onClick={handleStartWizard}
            >
              <Lightbulb className="h-4 w-4 mr-2" />
              Run Setup Wizard
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default FloatingHelpButton; 