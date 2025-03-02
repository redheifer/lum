
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const CTASection: React.FC = () => {
  return (
    <section className="bg-primary py-16">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-white mb-6">
          Ready to Transform Your Call Quality Assurance?
        </h2>
        <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
          Join the hundreds of companies using Lum to improve customer experience while reducing costs.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/signup">
            <Button
              size="lg"
              variant="secondary"
              className="font-medium"
            >
              Get Started
            </Button>
          </Link>
          <Link to="/demo">
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
  );
};

export default CTASection;
