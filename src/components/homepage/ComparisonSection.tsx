
import React from "react";
import { 
  Bot, 
  User, 
  TrendingUp, 
  Clock, 
  DollarSign, 
  CheckCircle2 
} from "lucide-react";

interface ComparisonPoint {
  title: string;
  ai: string;
  human: string;
  icon: JSX.Element;
}

const ComparisonSection: React.FC = () => {
  const comparisonPoints: ComparisonPoint[] = [
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
  );
};

export default ComparisonSection;
