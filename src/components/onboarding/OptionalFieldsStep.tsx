import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { InfoCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface OptionalFieldsStepProps {
  webhookConfig: any;
  onOptionalFieldChange: (field: string, value: boolean) => void;
}

const OptionalFieldsStep: React.FC<OptionalFieldsStepProps> = ({ 
  webhookConfig, 
  onOptionalFieldChange 
}) => {
  const optionalFields = [
    {
      id: 'caller_id',
      label: 'Caller ID',
      description: 'Phone number of the caller'
    },
    {
      id: 'call_duration',
      label: 'Call Duration',
      description: 'Length of the call in seconds'
    },
    {
      id: 'agent_id',
      label: 'Agent ID',
      description: 'Identifier for the agent who handled the call'
    },
    {
      id: 'call_date',
      label: 'Call Date',
      description: 'Date when the call occurred'
    },
    {
      id: 'call_time',
      label: 'Call Time',
      description: 'Time when the call occurred'
    },
    {
      id: 'disposition',
      label: 'Disposition',
      description: 'Outcome of the call (e.g., sale, follow-up, no answer)'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-xl font-semibold">Optional Fields</h3>
        <p className="text-gray-600 dark:text-gray-400">
          Select additional fields to enhance your call analysis.
        </p>
      </div>
      
      <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-lg border border-blue-100 dark:border-blue-900/30 mb-6">
        <p className="text-blue-800 dark:text-blue-400 text-sm">
          The more context you provide, the more detailed insights Lum can generate. We recommend selecting as many optional fields as you have available.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {optionalFields.map((field) => (
          <div 
            key={field.id} 
            className="flex items-start space-x-3 p-3 border border-gray-200 dark:border-gray-800 rounded-md bg-white dark:bg-gray-900"
          >
            <Checkbox 
              id={field.id} 
              checked={webhookConfig.optionalFields[field.id]}
              onCheckedChange={(checked) => 
                onOptionalFieldChange(field.id, checked as boolean)
              }
              className="data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500 mt-1"
            />
            <div className="space-y-1 flex-1">
              <div className="flex items-center">
                <Label 
                  htmlFor={field.id} 
                  className="font-medium text-gray-900 dark:text-gray-100"
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
          Don't worry, you can always update these settings later in your webhook configuration.
        </p>
      </div>
    </div>
  );
};

export default OptionalFieldsStep; 