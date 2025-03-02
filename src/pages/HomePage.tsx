
import React from "react";
import NavBar from "@/components/homepage/NavBar";
import HeroSection from "@/components/homepage/HeroSection";
import FeaturesSection from "@/components/homepage/FeaturesSection";
import ComparisonSection from "@/components/homepage/ComparisonSection";
import ROICalculator from "@/components/homepage/ROICalculator";
import PricingSection from "@/components/homepage/PricingSection";
import TestimonialsSection from "@/components/homepage/TestimonialsSection";
import CTASection from "@/components/homepage/CTASection";
import Footer from "@/components/homepage/Footer";

const HomePage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation Bar */}
      <NavBar />
      
      <main>
        {/* Hero Section */}
        <HeroSection />
        
        {/* Key Features Section */}
        <FeaturesSection />
        
        {/* AI vs Human Section */}
        <ComparisonSection />
        
        {/* ROI Calculator Section */}
        <ROICalculator />
        
        {/* Pricing Section */}
        <PricingSection />
        
        {/* Testimonials Section */}
        <TestimonialsSection />
        
        {/* CTA Section */}
        <CTASection />
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;
