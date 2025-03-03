import React, { useState, useRef } from 'react';
import { HelpCircle, FileText, Lightbulb, MessageSquare } from 'lucide-react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';

const HelpMenu = () => {
  const { setShowOnboarding, resetAndShowOnboarding } = useOnboarding();
  const navigate = useNavigate();
  
  const handleStartWizard = () => {
    resetAndShowOnboarding();
  };
  
  const handleDocumentation = () => {
    window.open('https://docs.lumai.com', '_blank');
  };
  
  const handleContactSupport = () => {
    window.open('mailto:support@lumai.com', '_blank');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 hover:bg-yellow-50 hover:text-amber-600 rounded-md w-full">
          <HelpCircle className="h-5 w-5 mr-2" />
          Help & Resources
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuItem onClick={handleStartWizard}>
          <Lightbulb className="h-4 w-4 mr-2" />
          <span>Setup Wizard</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDocumentation}>
          <FileText className="h-4 w-4 mr-2" />
          <span>Documentation</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleContactSupport}>
          <MessageSquare className="h-4 w-4 mr-2" />
          <span>Contact Support</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default HelpMenu; 