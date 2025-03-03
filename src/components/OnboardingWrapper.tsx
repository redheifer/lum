import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import OnboardingWizard from './OnboardingWizard';

const OnboardingWrapper: React.FC = () => {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const navigate = useNavigate();
  
  const handleComplete = () => {
    // Handle completion logic here
    console.log('Onboarding completed');
    navigate('/dashboard'); // Or wherever you want to redirect after onboarding
  };
  
  // Make sure we have a workspaceId
  if (!workspaceId) {
    return <div>Missing workspace ID</div>;
  }
  
  return (
    <OnboardingWizard 
      workspaceId={workspaceId}
      onComplete={handleComplete}
    />
  );
};

export default OnboardingWrapper; 