
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const HeroSection: React.FC = () => {
  return (
    <section className="bg-gradient-to-r from-blue-600 to-indigo-700 py-20 pt-28">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 text-white mb-10 lg:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              AI-Powered Call Quality Assurance
            </h1>
            <p className="text-lg md:text-xl mb-8">
              Review 100% of your customer interactions with AI precision.
              Increase quality, reduce costs, and scale your QA program effortlessly with Lum.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/signup">
                <Button size="lg" className="font-medium">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/demo">
                <Button size="lg" variant="outline" className="bg-white/10 text-white border-white/20">
                  Schedule Demo
                </Button>
              </Link>
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
  );
};

export default HeroSection;
