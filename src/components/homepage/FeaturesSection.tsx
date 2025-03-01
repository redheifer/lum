
import React from "react";
import { CheckCircle2, BarChart2, Headphones } from "lucide-react";

interface Feature {
  icon: JSX.Element;
  title: string;
  description: string;
}

const FeaturesSection: React.FC = () => {
  const features: Feature[] = [
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

  return (
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
  );
};

export default FeaturesSection;
