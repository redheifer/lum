import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '@/components/ui/button';
import { LightbulbIcon } from 'lucide-react';
import { useOnboarding } from '@/contexts/OnboardingContext';

const PortalOnboardingButton = () => {
  const { resetAndShowOnboarding } = useOnboarding();
  const [container, setContainer] = useState<HTMLElement | null>(null);
  
  useEffect(() => {
    // Find the container element with the text we want to replace
    const targetElement = Array.from(document.querySelectorAll('*'))
      .find(el => el.textContent?.includes('ADD A BUTTON HERE TO REOPEN ONBOARDING'));
      
    if (targetElement) {
      setContainer(targetElement as HTMLElement);
      // Clear the text content
      targetElement.textContent = '';
    }
  }, []);
  
  if (!container) return null;
  
  return createPortal(
    <Button 
      onClick={resetAndShowOnboarding}
      className="bg-amber-500 hover:bg-amber-600 text-white"
    >
      <LightbulbIcon className="w-4 h-4 mr-2" />
      Setup Wizard
    </Button>,
    container
  );
};

export default PortalOnboardingButton; 