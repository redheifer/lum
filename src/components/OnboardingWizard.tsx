import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowRight, Check, Copy, ExternalLink } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useOnboarding } from '@/contexts/OnboardingContext';

interface OnboardingWizardProps {
  onComplete: () => void;
  initialState?: any;
}

interface WebhookField {
  id: string;
  name: string;
  description: string;
  required: boolean;
  selected: boolean;
}

const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ onComplete, initialState }) => {
  const { user } = useAuth();
  const { updateOnboardingState } = useOnboarding();
  
  const [currentStep, setCurrentStep] = useState(initialState?.lastViewedStep || 'welcome');
  const [completedSteps, setCompletedSteps] = useState(initialState?.completedSteps || []);
  
  useEffect(() => {
    if (initialState) {
      setCurrentStep(initialState.lastViewedStep || 'welcome');
      setCompletedSteps(initialState.completedSteps || []);
    }
  }, [initialState]);

  const [workspaceName, setWorkspaceName] = useState(initialState?.workspaceName || '');
  const [loading, setLoading] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState('');
  
  // Webhook configuration
  const [webhookFields, setWebhookFields] = useState<WebhookField[]>([
    { id: 'campaign_name', name: 'Campaign Name', description: 'Name of the call campaign', required: true, selected: true },
    { id: 'campaign_id', name: 'Campaign ID', description: 'Unique identifier for the campaign', required: true, selected: true },
    { id: 'recording_url', name: 'Recording URL', description: 'URL to the call recording file', required: true, selected: true },
    { id: 'caller_id', name: 'Caller ID', description: 'Phone number of the caller', required: false, selected: false },
    { id: 'agent_id', name: 'Agent ID', description: 'ID of the agent handling the call', required: false, selected: false },
    { id: 'duration', name: 'Call Duration', description: 'Length of the call in seconds', required: false, selected: false },
    { id: 'call_timestamp', name: 'Call Timestamp', description: 'When the call occurred', required: false, selected: false },
    { id: 'call_direction', name: 'Call Direction', description: 'Inbound or outbound call', required: false, selected: false },
    { id: 'call_outcome', name: 'Call Outcome', description: 'Result of the call (e.g., converted, rejected)', required: false, selected: false },
  ]);

  const generateWebhookUrl = async () => {
    setLoading(true);
    try {
      // In a real implementation, this would make an API call to generate the webhook
      // For now, we'll simulate with a timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate a unique ID (would normally come from backend)
      const uniqueId = Math.random().toString(36).substring(2, 15);
      
      // Set the branded webhook URL
      setWebhookUrl(`https://api.lumai.com/webhook/${uniqueId}`);
      
      // Move to next step
      setCurrentStep(currentStep === 'welcome' ? 'required_fields' : currentStep === 'required_fields' ? 'optional_fields' : 'generate_webhook');
    } catch (error) {
      toast({
        title: "Error generating webhook",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleField = (fieldId: string) => {
    setWebhookFields(fields => 
      fields.map(field => 
        field.id === fieldId && !field.required 
          ? { ...field, selected: !field.selected }
          : field
      )
    );
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "Webhook URL copied to clipboard",
    });
  };

  const goToNextStep = (nextStep: string) => {
    const updatedCompletedSteps = [...completedSteps];
    if (!updatedCompletedSteps.includes(currentStep)) {
      updatedCompletedSteps.push(currentStep);
    }
    
    setCompletedSteps(updatedCompletedSteps);
    setCurrentStep(nextStep);
    
    if (user) {
      updateOnboardingState({
        lastViewedStep: nextStep,
        completedSteps: updatedCompletedSteps,
        workspaceName: workspaceName
      });
    }
  };

  const handleBack = () => {
    if (currentStep > 'welcome') {
      goToNextStep(currentStep === 'welcome' ? 'welcome' : (currentStep as string).slice(0, -1));
    }
  };

  const getWebhookPayloadExample = () => {
    const selectedFields = webhookFields.filter(field => field.required || field.selected);
    let examplePayload: Record<string, any> = {};
    
    selectedFields.forEach(field => {
      switch (field.id) {
        case 'campaign_name':
          examplePayload[field.id] = "Q4 Sales Outreach";
          break;
        case 'campaign_id':
          examplePayload[field.id] = "camp_12345";
          break;
        case 'recording_url':
          examplePayload[field.id] = "https://storage.example.com/recordings/call-abc123.mp3";
          break;
        case 'caller_id':
          examplePayload[field.id] = "+15551234567";
          break;
        case 'agent_id':
          examplePayload[field.id] = "agent_89012";
          break;
        case 'duration':
          examplePayload[field.id] = 245;
          break;
        case 'call_timestamp':
          examplePayload[field.id] = "2023-11-15T14:30:00Z";
          break;
        case 'call_direction':
          examplePayload[field.id] = "outbound";
          break;
        case 'call_outcome':
          examplePayload[field.id] = "qualified_lead";
          break;
      }
    });
    
    return JSON.stringify(examplePayload, null, 2);
  };

  const handleSkip = () => {
    if (user) {
      updateOnboardingState({
        skippedTutorial: true,
        workspaceName: workspaceName
      });
    }
    onComplete();
  };

  return (
    <div className="container max-w-3xl mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span role="img" aria-label="Lum logo">🪔</span> 
            Welcome to Lum Call Analysis
          </CardTitle>
          <CardDescription>
            Step {currentStep.charAt(0).toUpperCase() + currentStep.slice(1)} of 6: {
              currentStep === 'welcome' ? "Welcome" :
              currentStep === 'required_fields' ? "Required Webhook Fields" :
              currentStep === 'optional_fields' ? "Optional Fields" :
              currentStep === 'generate_webhook' ? "Generate Webhook" :
              currentStep === 'integration_guide' ? "Integration Guide" :
              "Completion"
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {currentStep === 'welcome' && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Welcome to Lum!</h2>
              <p>Lum is an AI-powered call analysis platform that helps you review 100% of your customer interactions with AI precision.</p>
              
              <div className="bg-indigo-50 dark:bg-indigo-950 p-4 rounded-lg my-4 space-y-2">
                <h3 className="font-medium">With Lum, you can:</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Analyze all your call recordings automatically</li>
                  <li>Identify customer sentiment and key topics</li>
                  <li>Track compliance with scripts and regulations</li>
                  <li>Improve agent performance with actionable insights</li>
                </ul>
              </div>
              
              <p>Let's get started by setting up a webhook to send your call recordings to Lum for analysis.</p>
              
              <div className="mt-4">
                <Label htmlFor="workspace-name">Workspace Name</Label>
                <Input 
                  id="workspace-name" 
                  value={workspaceName} 
                  onChange={(e) => setWorkspaceName(e.target.value)} 
                  placeholder="My Call Center"
                  className="mt-1"
                />
                <p className="text-sm text-muted-foreground mt-1">This name will be displayed in your dashboard and reports.</p>
              </div>
            </div>
          )}
          
          {currentStep === 'required_fields' && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Required Webhook Fields</h2>
              <p>The following fields are required for Lum to analyze your calls:</p>
              
              <div className="space-y-4 mt-4">
                {webhookFields.filter(field => field.required).map(field => (
                  <div key={field.id} className="flex items-start space-x-3 p-3 border rounded-md bg-muted/20">
                    <div className="mt-1">
                      <Check className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">{field.name}</h3>
                      <p className="text-sm text-muted-foreground">{field.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <Alert className="mt-4">
                <AlertDescription>
                  These fields are mandatory for Lum to process your calls. Make sure your system can provide these data points.
                </AlertDescription>
              </Alert>
            </div>
          )}
          
          {currentStep === 'optional_fields' && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Optional Fields</h2>
              <p>Select additional fields to enhance your call analysis:</p>
              
              <div className="space-y-3 mt-4">
                {webhookFields.filter(field => !field.required).map(field => (
                  <div key={field.id} className="flex items-start space-x-3 p-3 border rounded-md">
                    <Checkbox 
                      id={field.id}
                      checked={field.selected}
                      onCheckedChange={() => handleToggleField(field.id)}
                      className="mt-1"
                    />
                    <div>
                      <Label 
                        htmlFor={field.id} 
                        className="font-medium cursor-pointer"
                      >
                        {field.name}
                      </Label>
                      <p className="text-sm text-muted-foreground">{field.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <p className="text-sm text-muted-foreground mt-2">
                Including more fields will provide richer analytics and insights.
              </p>
            </div>
          )}
          
          {currentStep === 'generate_webhook' && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Your Webhook URL</h2>
              <p>Use this unique webhook URL to send your call data to Lum:</p>
              
              <div className="flex items-center mt-4">
                <div className="flex-1 p-3 bg-muted rounded-l-md font-mono text-sm overflow-x-auto">
                  {webhookUrl}
                </div>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="rounded-l-none"
                  onClick={() => copyToClipboard(webhookUrl)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="mt-6 space-y-2">
                <h3 className="font-medium">Expected Payload Format:</h3>
                <pre className="p-3 bg-muted rounded-md text-xs overflow-x-auto">
                  {getWebhookPayloadExample()}
                </pre>
              </div>
              
              <p className="text-sm mt-4">
                This webhook is unique to your workspace. Don't share it publicly.
              </p>
            </div>
          )}
          
          {currentStep === 'integration_guide' && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Integration Guide</h2>
              <p>Follow these steps to integrate Lum with your existing system:</p>
              
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <h3 className="font-medium">1. Configure your call recording system</h3>
                  <p className="text-sm">Set up your existing system to send a POST request to the webhook URL after each call.</p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium">2. Format the payload</h3>
                  <p className="text-sm">Ensure the data matches the JSON format shown in the previous step.</p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium">3. Test the integration</h3>
                  <p className="text-sm">Send a test call to verify the data is being received correctly.</p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium">4. Monitor the dashboard</h3>
                  <p className="text-sm">Once calls are processed, you'll see analytics in your Lum dashboard.</p>
                </div>
              </div>
              
              <div className="mt-4 flex space-x-2">
                <Button variant="outline" size="sm" onClick={() => window.open('https://docs.lumai.com/integration', '_blank')}>
                  View detailed documentation
                  <ExternalLink className="h-4 w-4 ml-2" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => window.open('https://support.lumai.com', '_blank')}>
                  Contact support
                  <ExternalLink className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          )}
          
          {currentStep === 'completion' && (
            <div className="space-y-4 text-center">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Check className="h-6 w-6 text-primary" />
              </div>
              
              <h2 className="text-xl font-semibold">You're all set!</h2>
              <p>Your webhook integration for {workspaceName || 'your workspace'} is now configured.</p>
              
              <div className="bg-muted p-4 rounded-lg mt-4 text-left">
                <p className="font-medium">Next steps:</p>
                <ul className="list-disc pl-5 space-y-1 mt-2 text-sm">
                  <li>Test your webhook with a sample call</li>
                  <li>Set up user access for your team members</li>
                  <li>Customize your analytics dashboard</li>
                  <li>Schedule a walkthrough with our customer success team</li>
                </ul>
              </div>
              
              <p className="text-sm text-muted-foreground mt-4">
                Need help? Reach out to our support team at support@lumai.com
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter className={`flex ${currentStep === 'completion' ? 'justify-center' : 'justify-between'}`}>
          {currentStep !== 'completion' ? (
            <>
              <div>
                <Button 
                  variant="outline" 
                  onClick={handleBack}
                  disabled={currentStep === 'welcome'}
                >
                  Back
                </Button>
                
                {currentStep === 'welcome' && onComplete && (
                  <Button 
                    variant="link" 
                    onClick={handleSkip}
                    className="ml-2"
                  >
                    Skip Tutorial
                  </Button>
                )}
              </div>
              
              <Button 
                onClick={() => goToNextStep(currentStep === 'welcome' ? 'required_fields' : currentStep === 'required_fields' ? 'optional_fields' : currentStep === 'optional_fields' ? 'generate_webhook' : currentStep === 'generate_webhook' ? 'integration_guide' : 'completion')}
                disabled={loading}
              >
                {loading ? 'Processing...' : currentStep === 'integration_guide' ? 'Complete' : 'Next'}
                {!loading && currentStep !== 'integration_guide' && <ArrowRight className="ml-2 h-4 w-4" />}
              </Button>
            </>
          ) : (
            <Button onClick={onComplete}>
              Go to Dashboard
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default OnboardingWizard;
