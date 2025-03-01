
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { CheckCircle2 } from "lucide-react";

interface PricingTier {
  name: string;
  pricePerCall: number;
  features: string[];
  buttonText: string;
  highlighted: boolean;
  bgColor: string;
  borderColor: string;
}

const PricingSection: React.FC = () => {
  // State for pricing slider
  const [selectedPricingTier, setSelectedPricingTier] = useState(0);

  const pricingTiers: PricingTier[] = [
    {
      name: "Free",
      pricePerCall: 0,
      features: ["10 calls per day", "Basic analytics", "Email support"],
      buttonText: "Start Free",
      highlighted: false,
      bgColor: "bg-blue-50",
      borderColor: "border-blue-100"
    },
    {
      name: "Tier 1",
      pricePerCall: 0.45,
      features: ["100 calls per day", "Advanced analytics", "Priority email support", "Custom scoring"],
      buttonText: "Get Started",
      highlighted: false,
      bgColor: "bg-indigo-50",
      borderColor: "border-indigo-100"
    },
    {
      name: "Tier 2",
      pricePerCall: 0.30,
      features: ["500 calls per day", "All analytics features", "Phone support", "Custom scoring", "Team management"],
      buttonText: "Popular Choice",
      highlighted: true,
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200"
    },
    {
      name: "Tier 3 - White Label",
      pricePerCall: 0.20,
      features: ["Unlimited calls", "Fully custom solution", "Dedicated account manager", "API access", "White label solution"],
      buttonText: "Contact Sales",
      highlighted: false,
      bgColor: "bg-green-50",
      borderColor: "border-green-100"
    }
  ];

  // Handle slider change
  const handleSliderChange = (value: number[]) => {
    setSelectedPricingTier(value[0]);
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Flexible Pricing Plans</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Choose the perfect plan for your call quality assurance needs
          </p>
        </div>
        
        {/* Pricing Slider - Enhanced styling */}
        <div className="bg-gradient-to-b from-gray-50 to-white rounded-xl shadow-md p-8 max-w-4xl mx-auto mb-12">
          <h3 className="text-xl font-semibold mb-6 text-center">Select Your Plan</h3>
          
          <div className="mb-12">
            <Slider
              defaultValue={[0]}
              max={3}
              step={1}
              value={[selectedPricingTier]}
              onValueChange={handleSliderChange}
              className="mb-8"
            />
            
            {/* Tier labels */}
            <div className="flex justify-between px-2 text-sm text-gray-600">
              <span>Free</span>
              <span>Tier 1</span>
              <span>Tier 2</span>
              <span>Enterprise</span>
            </div>
          </div>
          
          {/* Selected Pricing Tier - Enhanced styling */}
          <div className={`border rounded-xl p-6 transition-all duration-300 shadow-md ${pricingTiers[selectedPricingTier].highlighted ? 
            'border-primary/30 shadow-lg ring-1 ring-primary/20 ' + pricingTiers[selectedPricingTier].bgColor : 
            'border-gray-100 ' + pricingTiers[selectedPricingTier].bgColor}`}>
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
              <div>
                <h4 className="text-2xl font-bold mb-1">{pricingTiers[selectedPricingTier].name}</h4>
                <p className="text-gray-500 text-sm">Perfect for {selectedPricingTier === 0 ? "getting started" : 
                  selectedPricingTier === 1 ? "small teams" : 
                  selectedPricingTier === 2 ? "growing operations" : "enterprise needs"}</p>
              </div>
              <div className="mt-3 md:mt-0 text-right">
                <div className="bg-white/80 px-4 py-2 rounded-lg inline-block shadow-sm">
                  <span className="text-3xl font-bold text-gray-800">
                    ${pricingTiers[selectedPricingTier].pricePerCall.toFixed(2)}
                  </span>
                  <span className="text-gray-500 text-sm"> / call</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-3 mb-6 bg-white/60 p-4 rounded-lg">
              {pricingTiers[selectedPricingTier].features.map((feature, index) => (
                <div key={index} className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
            
            <Button 
              className={`w-full ${pricingTiers[selectedPricingTier].highlighted ? 'bg-primary shadow-md shadow-primary/20' : ''}`}
              variant={pricingTiers[selectedPricingTier].highlighted ? 'default' : 'outline'}
            >
              {pricingTiers[selectedPricingTier].buttonText}
            </Button>
            
            {selectedPricingTier === 3 && (
              <p className="text-center text-sm text-gray-500 mt-4">
                Contact our sales team for custom volume pricing
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
