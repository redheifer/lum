import React from 'react';
import { Button } from '@/components/ui/button';
import { LightbulbIcon } from 'lucide-react';
import { useOnboarding } from '@/contexts/OnboardingContext';

const OnboardingButton = () => {
  const { resetAndShowOnboarding } = useOnboarding();
  
  return (
    <Button 
      onClick={resetAndShowOnboarding}
      className="bg-amber-500 hover:bg-amber-600 text-white"
    >
      <LightbulbIcon className="w-4 h-4 mr-2" />
      Setup Wizard
    </Button>
  );
};

export default OnboardingButton; 