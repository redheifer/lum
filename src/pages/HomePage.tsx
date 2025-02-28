
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Star 
} from "lucide-react";

const HomePage = () => {
  const [formData, setFormData] = useState({
    agentCount: 10,
    avgSalary: 50000,
    reviewRate: 20,
  });
  
  const [calculationResults, setCalculationResults] = useState<null | {
    humanCost: number;
    aiCost: number;
    savings: number;
    savingsPercentage: number;
  }>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: parseInt(value) || 0,
    });
  };

  const calculateROI = () => {
    const { agentCount, avgSalary, reviewRate } = formData;
    
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

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 py-20">
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
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-6">Your Organization</h3>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="agentCount">Number of Agents</Label>
                    <Input 
                      id="agentCount" 
                      name="agentCount" 
                      type="number" 
                      value={formData.agentCount}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="avgSalary">Average QA Analyst Salary ($)</Label>
                    <Input 
                      id="avgSalary" 
                      name="avgSalary" 
                      type="number" 
                      value={formData.avgSalary}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="reviewRate">
                      Percentage of Calls to Review (%)
                    </Label>
                    <Input 
                      id="reviewRate" 
                      name="reviewRate" 
                      type="number" 
                      value={formData.reviewRate}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <Button 
                    onClick={calculateROI} 
                    className="w-full mt-4"
                  >
                    Calculate Savings
                  </Button>
                </div>
              </div>
              
              <div className="bg-slate-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-6">Your Potential Savings</h3>
                
                {calculationResults ? (
                  <div className="space-y-6">
                    <div>
                      <p className="text-sm text-gray-500">Traditional QA Cost</p>
                      <p className="text-2xl font-bold">${calculationResults.humanCost.toLocaleString()}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">AI QA Cost</p>
                      <p className="text-2xl font-bold">${calculationResults.aiCost.toLocaleString()}</p>
                    </div>
                    
                    <div className="pt-4 border-t border-gray-200">
                      <p className="text-sm text-gray-500">Annual Savings</p>
                      <p className="text-3xl font-bold text-green-600">
                        ${calculationResults.savings.toLocaleString()}
                      </p>
                      <p className="text-lg font-medium text-green-600">
                        ({calculationResults.savingsPercentage.toFixed(1)}% reduction)
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                    <BarChart2 className="h-12 w-12 mb-3 opacity-50" />
                    <p>Enter your information and calculate to see potential savings</p>
                  </div>
                )}
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
            <Button
              size="lg"
              variant="secondary"
              className="font-medium"
            >
              Get Started
            </Button>
            <Link to="/">
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
