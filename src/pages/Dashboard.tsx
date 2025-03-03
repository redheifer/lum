import React from 'react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import OnboardingWizard from '@/components/OnboardingWizard';
import DashboardContent from '@/components/DashboardContent';

const Dashboard: React.FC = () => {
  const { 
    showOnboarding, 
    completeOnboarding, 
    skipTutorial,
    onboardingState 
  } = useOnboarding();

  return (
    <div>
      {showOnboarding ? (
        <OnboardingWizard 
          workspaceId="dashboard"
          onComplete={completeOnboarding}
          onSkip={skipTutorial}
          initialState={onboardingState}
        />
      ) : (
        <DashboardContent />
      )}
    </div>
  );
};

export default Dashboard; 