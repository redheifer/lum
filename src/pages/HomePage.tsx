
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import NavBar from "@/components/NavBar";
import { 
  CheckCircle2, 
  BarChart2, 
  Headphones, 
  Bot, 
  User, 
  TrendingUp, 
  Clock, 
  DollarSign, 
  ArrowRight, 
  Star,
  ChevronRight,
  ChevronLeft 
} from "lucide-react";

const HomePage = () => {
  const [formStep, setFormStep] = useState(0);
  const [formData, setFormData] = useState({
    agentCount: "",
    avgSalary: "",
    reviewRate: "",
  });
  
  const [calculationResults, setCalculationResults] = useState<null | {
    humanCost: number;
    aiCost: number;
    savings: number;
    savingsPercentage: number;
  }>(null);

  const agentCountOptions = [
    { value: 5, label: "Small Team (5 agents)" },
    { value: 10, label: "Growing Team (10 agents)" },
    { value: 25, label: "Medium Team (25 agents)" },
    { value: 50, label: "Large Team (50 agents)" },
    { value: 100, label: "Enterprise (100+ agents)" },
  ];

  const salaryOptions = [
    { value: 40000, label: "$40,000 - Entry Level" },
    { value: 50000, label: "$50,000 - Mid Level" },
    { value: 60000, label: "$60,000 - Senior Level" },
    { value: 75000, label: "$75,000 - Management" },
  ];

  const reviewRateOptions = [
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

  const features = [
    {
      icon: <CheckCircle2 className="h-10 w-10 text-primary" />,
      title: "100% Call Coverage",
      description: "Review every customer interaction instead of random sampling"
    },
    {
      icon: <BarChart2 className="h-10 w-10 text-primary" />,
      title: "Real-time Analytics",
      description: "Get insights and trends as they happen, not weeks later"
    },
    {
      icon: <Headphones className="h-10 w-10 text-primary" />,
      title: "Agent Coaching",
      description: "Provide targeted training based on actual performance data"
    }
  ];

  const comparisonPoints = [
    {
      title: "Review Capacity",
      ai: "Unlimited calls",
      human: "40-50 calls per day",
      icon: <Clock />
    },
    {
      title: "Consistency",
      ai: "100% objective scoring",
      human: "Varies between reviewers",
      icon: <CheckCircle2 />
    },
    {
      title: "Cost",
      ai: "$0.50 per call",
      human: "$30-40 per hour",
      icon: <DollarSign />
    },
    {
      title: "Speed",
      ai: "Instant results",
      human: "Days to weeks for feedback",
      icon: <TrendingUp />
    }
  ];

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
    <div className="flex flex-col min-h-screen">
      {/* Navigation Bar */}
      <NavBar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 py-20 pt-28">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 text-white mb-10 lg:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                AI-Powered Call Quality Assurance
              </h1>
              <p className="text-lg md:text-xl mb-8">
                Review 100% of your customer interactions with AI precision.
                Increase quality, reduce costs, and scale your QA program effortlessly.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="font-medium">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button size="lg" variant="outline" className="bg-white/10 text-white border-white/20">
                  Schedule Demo
                </Button>
              </div>
            </div>
            <div className="lg:w-1/2 lg:pl-10">
              <div className="bg-white rounded-xl shadow-2xl p-6 animate-fade-in">
                <img
                  src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d"
                  alt="AI Call Analysis"
                  className="rounded-lg w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Key Features</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our AI-powered platform transforms how you monitor, analyze, and improve customer interactions
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* AI vs Human Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">AI vs Human QA</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              See how AI-powered call review stacks up against traditional human review methods
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-blue-50 rounded-xl p-6">
              <div className="flex items-center mb-6">
                <Bot className="h-8 w-8 text-primary mr-3" />
                <h3 className="text-2xl font-bold">AI Review</h3>
              </div>
              <ul className="space-y-4">
                <li className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                  <span>Reviews 100% of calls</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                  <span>Consistent scoring methodology</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                  <span>Real-time feedback</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                  <span>Scales with your business</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                  <span>Fixed, predictable pricing</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center mb-6">
                <User className="h-8 w-8 text-gray-700 mr-3" />
                <h3 className="text-2xl font-bold">Human Review</h3>
              </div>
              <ul className="space-y-4">
                <li className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-amber-500 mr-2" />
                  <span>Reviews 1-2% of calls</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-amber-500 mr-2" />
                  <span>Subjective scoring varies</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-amber-500 mr-2" />
                  <span>Delayed feedback cycle</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-amber-500 mr-2" />
                  <span>Hiring bottlenecks</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-amber-500 mr-2" />
                  <span>Increasing labor costs</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {comparisonPoints.map((point, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md p-6">
                <div className="bg-primary/10 p-3 rounded-full w-fit mb-4">
                  {point.icon}
                </div>
                <h4 className="text-lg font-semibold mb-3">{point.title}</h4>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <Bot className="h-4 w-4 text-primary mt-1 mr-2" />
                    <p className="text-sm">{point.ai}</p>
                  </div>
                  <div className="flex items-start">
                    <User className="h-4 w-4 text-gray-600 mt-1 mr-2" />
                    <p className="text-sm text-gray-600">{point.human}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* ROI Calculator Section */}
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
      
      {/* Testimonials Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">What Our Clients Say</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Hear from organizations that have transformed their QA process with our platform
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "We've increased our call review coverage from 2% to 100% while cutting costs by 70%.",
                author: "Sarah Johnson",
                company: "Global Support Services",
                stars: 5
              },
              {
                quote: "The insights we're getting have helped us improve agent performance across the board.",
                author: "Michael Chen",
                company: "TechCare Solutions",
                stars: 5
              },
              {
                quote: "Implementation was seamless and we saw ROI within the first month.",
                author: "Jessica Rodriguez",
                company: "Premier Financial",
                stars: 4
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md p-8 relative">
                <div className="flex mb-4">
                  {Array(testimonial.stars).fill(0).map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">"{testimonial.quote}"</p>
                <div>
                  <p className="font-semibold">{testimonial.author}</p>
                  <p className="text-sm text-gray-500">{testimonial.company}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="bg-primary py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Transform Your Call Quality Assurance?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
            Join the hundreds of companies using our platform to improve customer experience while reducing costs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/dashboard">
              <Button
                size="lg"
                variant="secondary"
                className="font-medium"
              >
                Get Started
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button 
                size="lg" 
                variant="outline" 
                className="text-white border-white/20 bg-white/10"
              >
                View Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
