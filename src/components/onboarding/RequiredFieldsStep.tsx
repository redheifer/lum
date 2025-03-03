import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { InfoCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface RequiredFieldsStepProps {
  webhookConfig: any;
  onRequiredFieldChange: (field: string, value: boolean) => void;
}

const RequiredFieldsStep: React.FC<RequiredFieldsStepProps> = ({ 
  webhookConfig, 
  onRequiredFieldChange 
}) => {
  // These fields are always required and cannot be unchecked
  const requiredFields = [
    {
      id: 'campaign_name',
      label: 'Campaign Name',
      description: 'Name of the campaign this call belongs to'
    },
    {
      id: 'campaign_id',
      label: 'Campaign ID',
      description: 'Unique identifier for the campaign'
    },
    {
      id: 'recording_url',
      label: 'Recording URL',
      description: 'Direct URL to the call recording file (MP3, WAV, etc.)'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-xl font-semibold">Required Fields</h3>
        <p className="text-gray-600 dark:text-gray-400">
          These fields are required for Lum to properly analyze your calls.
        </p>
      </div>
      
      <div className="bg-amber-50 dark:bg-amber-900/10 p-4 rounded-lg border border-amber-100 dark:border-amber-900/30 mb-6">
        <p className="text-amber-800 dark:text-amber-400 text-sm">
          These required fields must be included in every webhook request. Without them, Lum won't be able to properly analyze your calls.
        </p>
      </div>
      
      <div className="space-y-4">
        {requiredFields.map((field) => (
          <div 
            key={field.id} 
            className="flex items-start space-x-3 p-3 border border-gray-200 dark:border-gray-800 rounded-md bg-white dark:bg-gray-900"
          >
            <Checkbox 
              id={field.id} 
              checked={true} 
              disabled={true}
              className="data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500 mt-1"
            />
            <div className="space-y-1 flex-1">
              <div className="flex items-center">
                <Label 
                  htmlFor={field.id} 
                  className="font-medium text-gray-900 dark:text-gray-100 cursor-default"
                >
                  {field.label}
                </Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="ml-2 text-gray-400 cursor-help">
                        <InfoCircle size={14} />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p className="max-w-xs">{field.description}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {field.description}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="pt-4">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          On the next screen, you'll be able to select additional optional fields that can provide more context and improve analysis.
        </p>
      </div>
    </div>
  );
};

export default RequiredFieldsStep; 