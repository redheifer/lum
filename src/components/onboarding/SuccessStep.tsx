import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, ExternalLink } from 'lucide-react';

interface SuccessStepProps {
  webhookConfig: any;
}

const SuccessStep: React.FC<SuccessStepProps> = ({ webhookConfig }) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center bg-gradient-to-br from-green-400 to-green-600 text-white rounded-full shadow-lg">
          <CheckCircle size={36} />
        </div>
        <h1 className="text-2xl font-bold mb-2">Setup Complete!</h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
          Your webhook is now configured and ready to receive call data.
        </p>
      </div>
      
      <div className="space-y-4 max-w-lg mx-auto">
        <h3 className="text-xl font-semibold">What's next?</h3>
        <ul className="space-y-3">
          <li className="flex items-start">
            <div className="bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-full p-1 mr-3 mt-0.5">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 6L9 17l-5-5"/>
              </svg>
            </div>
            <p className="text-gray-700 dark:text-gray-300">Send your first test call to the webhook</p>
          </li>
          <li className="flex items-start">
            <div className="bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-full p-1 mr-3 mt-0.5">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 6L9 17l-5-5"/>
              </svg>
            </div>
            <p className="text-gray-700 dark:text-gray-300">Check the dashboard for your first AI analysis</p>
          </li>
          <li className="flex items-start">
            <div className="bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-full p-1 mr-3 mt-0.5">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 6L9 17l-5-5"/>
              </svg>
            </div>
            <p className="text-gray-700 dark:text-gray-300">Invite your team members to collaborate</p>
          </li>
        </ul>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
        <Button 
          className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white"
          onClick={() => window.location.href = '/dashboard'}
        >
          Go to Dashboard
        </Button>
        
        <Button variant="outline" onClick={() => window.location.href = '/documentation'}>
          View Documentation
          <ExternalLink className="ml-2 h-4 w-4" />
        </Button>
      </div>
      
      <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-lg border border-blue-100 dark:border-blue-900/30 text-center mt-6">
        <p className="text-blue-800 dark:text-blue-400">
          Need help? Our support team is here for you. <a href="#" className="underline font-medium">Contact us</a>
        </p>
      </div>
    </div>
  );
};

export default SuccessStep; 