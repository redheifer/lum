
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ChevronLeft } from "lucide-react";

interface AgentOption {
  value: number;
  label: string;
}

interface SalaryOption {
  value: number;
  label: string;
}

interface ReviewRateOption {
  value: number;
  label: string;
}

interface CalculationResults {
  humanCost: number;
  aiCost: number;
  savings: number;
  savingsPercentage: number;
}

const ROICalculator: React.FC = () => {
  const [formStep, setFormStep] = useState(0);
  const [formData, setFormData] = useState({
    agentCount: "",
    avgSalary: "",
    reviewRate: "",
  });
  
  const [calculationResults, setCalculationResults] = useState<null | CalculationResults>(null);

  const agentCountOptions: AgentOption[] = [
    { value: 5, label: "Small Team (5 agents)" },
    { value: 10, label: "Growing Team (10 agents)" },
    { value: 25, label: "Medium Team (25 agents)" },
    { value: 50, label: "Large Team (50 agents)" },
    { value: 100, label: "Enterprise (100+ agents)" },
  ];

  const salaryOptions: SalaryOption[] = [
    { value: 40000, label: "$40,000 - Entry Level" },
    { value: 50000, label: "$50,000 - Mid Level" },
    { value: 60000, label: "$60,000 - Senior Level" },
    { value: 75000, label: "$75,000 - Management" },
  ];

  const reviewRateOptions: ReviewRateOption[] = [
    { value: 10, label: "10% of calls" },
    { value: 20, label: "20% of calls" },
    { value: 50, label: "50% of calls" },
    { value: 100, label: "100% of calls" },
  ];

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Automatically advance to next step when an option is selected
    if (formStep < 2) {
      setFormStep(formStep + 1);
    } else {
      // If we're on the last step, calculate ROI and show results
      calculateROI();
      setFormStep(3);
    }
  };

  const prevStep = () => {
    if (formStep > 0) {
      setFormStep(formStep - 1);
    }
  };

  const calculateROI = () => {
    const agentCount = parseInt(formData.agentCount);
    const avgSalary = parseInt(formData.avgSalary);
    const reviewRate = parseInt(formData.reviewRate);
    
    // Calculate how many calls need review per year
    const totalCalls = agentCount * 50 * 5 * 50; // 50 calls per day, 5 days a week, 50 weeks
    const callsToReview = totalCalls * (reviewRate / 100);
    
    // Human QA cost (assume QA analyst can review 40 calls per day)
    const qaAnalystsNeeded = Math.ceil(callsToReview / (40 * 5 * 50));
    const humanCost = qaAnalystsNeeded * avgSalary;
    
    // AI QA cost (estimate: $0.50 per call review)
    const aiCost = callsToReview * 0.5;
    
    // Calculate savings
    const savings = humanCost - aiCost;
    const savingsPercentage = (savings / humanCost) * 100;
    
    setCalculationResults({
      humanCost,
      aiCost,
      savings,
      savingsPercentage
    });
  };

  const resetCalculator = () => {
    setFormStep(0);
    setFormData({
      agentCount: "",
      avgSalary: "",
      reviewRate: "",
    });
    setCalculationResults(null);
  };

  // Step content for the ROI calculator
  const renderStepContent = () => {
    switch (formStep) {
      case 0:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">How many agents do you have?</h3>
            <div className="grid gap-4">
              {agentCountOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleSelectChange("agentCount", option.value.toString())}
                  className={`flex items-center justify-between p-4 border rounded-lg hover:border-primary transition-all ${
                    formData.agentCount === option.value.toString() ? "border-primary bg-primary/5" : "border-gray-200"
                  }`}
                >
                  <span className="font-medium">{option.label}</span>
                  {formData.agentCount === option.value.toString() && (
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  )}
                </button>
              ))}
            </div>
          </div>
        );
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">What's the average QA analyst salary?</h3>
            <div className="grid gap-4">
              {salaryOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleSelectChange("avgSalary", option.value.toString())}
                  className={`flex items-center justify-between p-4 border rounded-lg hover:border-primary transition-all ${
                    formData.avgSalary === option.value.toString() ? "border-primary bg-primary/5" : "border-gray-200"
                  }`}
                >
                  <span className="font-medium">{option.label}</span>
                  {formData.avgSalary === option.value.toString() && (
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  )}
                </button>
              ))}
            </div>
            <Button 
              variant="outline" 
              onClick={prevStep} 
              className="flex items-center mt-4"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">What percentage of calls do you want to review?</h3>
            <div className="grid gap-4">
              {reviewRateOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleSelectChange("reviewRate", option.value.toString())}
                  className={`flex items-center justify-between p-4 border rounded-lg hover:border-primary transition-all ${
                    formData.reviewRate === option.value.toString() ? "border-primary bg-primary/5" : "border-gray-200"
                  }`}
                >
                  <span className="font-medium">{option.label}</span>
                  {formData.reviewRate === option.value.toString() && (
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  )}
                </button>
              ))}
            </div>
            <Button 
              variant="outline" 
              onClick={prevStep} 
              className="flex items-center mt-4"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-center">Your Potential Savings</h3>
            {calculationResults && (
              <div className="space-y-6">
                <div className="bg-slate-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Traditional QA Cost</p>
                  <p className="text-2xl font-bold">${calculationResults.humanCost.toLocaleString()}</p>
                </div>
                
                <div className="bg-slate-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">AI QA Cost</p>
                  <p className="text-2xl font-bold">${calculationResults.aiCost.toLocaleString()}</p>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                  <p className="text-sm text-gray-500">Annual Savings</p>
                  <p className="text-3xl font-bold text-green-600">
                    ${calculationResults.savings.toLocaleString()}
                  </p>
                  <p className="text-lg font-medium text-green-600">
                    ({calculationResults.savingsPercentage.toFixed(1)}% reduction)
                  </p>
                </div>
                
                <div className="flex flex-col gap-3">
                  <Button onClick={resetCalculator} variant="outline" className="w-full">
                    Calculate Again
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={prevStep} 
                    className="flex items-center justify-center"
                  >
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                </div>
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <section className="py-20 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">ROI Calculator</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            See how much you can save by implementing our AI-powered call review system
          </p>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-4xl mx-auto">
          <div className="relative">
            {/* Progress bar */}
            {formStep < 3 && (
              <div className="mb-8">
                <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-primary h-full transition-all duration-300" 
                    style={{ width: `${(formStep / 2) * 100}%` }}
                  ></div>
                </div>
                <div className="flex justify-between mt-2 text-sm text-gray-500">
                  <span>Team Size</span>
                  <span>QA Salary</span>
                  <span>Coverage</span>
                </div>
              </div>
            )}
            
            {/* Form step content */}
            <div className="min-h-[320px] flex flex-col">
              {renderStepContent()}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ROICalculator;
