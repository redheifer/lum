
import React, { useState } from 'react';
import { Info, ChevronDown, ChevronUp, Headphones, Mic, BarChart4, Zap, Laptop } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface AffiliateProduct {
  name: string;
  description: string;
  icon: React.ElementType;
  link: string;
}

const AffiliateSection: React.FC = () => {
  const [isAffiliateExpanded, setIsAffiliateExpanded] = useState(false);

  const toggleAffiliateSection = () => {
    setIsAffiliateExpanded(!isAffiliateExpanded);
  };

  const affiliateProducts: AffiliateProduct[] = [
    { 
      name: "Pro Headset XZ500", 
      description: "Premium noise-canceling headset for call centers", 
      icon: Headphones,
      link: "#" 
    },
    { 
      name: "Voice Clarity Mic", 
      description: "Crystal clear audio for professional calls", 
      icon: Mic,
      link: "#" 
    },
    { 
      name: "CallTrack Analytics", 
      description: "Advanced metrics dashboard for call quality", 
      icon: BarChart4,
      link: "#" 
    },
    { 
      name: "TurboScript AI", 
      description: "AI-powered call scripting software", 
      icon: Zap,
      link: "#" 
    },
    { 
      name: "CallStation Pro", 
      description: "All-in-one workstation for call agents", 
      icon: Laptop,
      link: "#" 
    }
  ];

  return (
    <div className="border-t">
      <button 
        onClick={toggleAffiliateSection}
        className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Info className="h-4 w-4 text-blue-500" />
          <span className="font-medium">Recommended Tools</span>
        </div>
        {isAffiliateExpanded ? 
          <ChevronUp className="h-4 w-4 text-slate-400" /> : 
          <ChevronDown className="h-4 w-4 text-slate-400" />
        }
      </button>
      
      {isAffiliateExpanded && (
        <ScrollArea className="max-h-60">
          <div className="px-4 pb-4">
            <p className="text-xs text-slate-500 mb-3">
              Tools we recommend to improve your call center performance
            </p>
            <div className="space-y-3">
              {affiliateProducts.map((product, index) => {
                const Icon = product.icon;
                return (
                  <a 
                    key={index}
                    href={product.link}
                    className="block p-2 rounded-md border border-slate-200 hover:border-blue-200 hover:bg-blue-50 transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className="flex items-start">
                      <div className="mt-0.5 mr-2 p-1.5 bg-blue-100 rounded-md text-blue-600">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium">{product.name}</h4>
                        <p className="text-xs text-slate-500">{product.description}</p>
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        </ScrollArea>
      )}
    </div>
  );
};

export default AffiliateSection;
