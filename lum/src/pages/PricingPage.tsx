
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import NavBar from "@/components/NavBar";

const PricingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Simple, Transparent Pricing</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose the perfect plan for your call quality assurance needs
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Basic Tier */}
          <Card className="border-2 hover:shadow-lg transition-all duration-200">
            <CardHeader className="text-center">
              <CardTitle className="text-xl">Starter</CardTitle>
              <div className="mt-4">
                <span className="text-4xl font-bold">$199</span>
                <span className="text-muted-foreground ml-1">/month</span>
              </div>
              <CardDescription className="mt-2">Perfect for small teams</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {[
                  "Up to 5 agents",
                  "100 calls analyzed per month",
                  "Basic metrics and insights",
                  "Email support",
                  "7-day data retention",
                ].map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Get Started</Button>
            </CardFooter>
          </Card>
          
          {/* Pro Tier */}
          <Card className="border-2 border-primary relative shadow-md hover:shadow-xl transition-all duration-200">
            <div className="absolute -top-4 left-0 right-0 flex justify-center">
              <div className="bg-primary text-white text-sm font-medium py-1 px-3 rounded-full">
                Most Popular
              </div>
            </div>
            <CardHeader className="text-center">
              <CardTitle className="text-xl">Professional</CardTitle>
              <div className="mt-4">
                <span className="text-4xl font-bold">$499</span>
                <span className="text-muted-foreground ml-1">/month</span>
              </div>
              <CardDescription className="mt-2">Ideal for growing businesses</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {[
                  "Up to 25 agents",
                  "500 calls analyzed per month",
                  "Advanced metrics and insights",
                  "Priority email support",
                  "30-day data retention",
                  "Custom scoring templates",
                  "Weekly performance reports",
                ].map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Get Started</Button>
            </CardFooter>
          </Card>
          
          {/* Enterprise Tier */}
          <Card className="border-2 hover:shadow-lg transition-all duration-200">
            <CardHeader className="text-center">
              <CardTitle className="text-xl">Enterprise</CardTitle>
              <div className="mt-4">
                <span className="text-4xl font-bold">$999</span>
                <span className="text-muted-foreground ml-1">/month</span>
              </div>
              <CardDescription className="mt-2">For large organizations</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {[
                  "Unlimited agents",
                  "Unlimited calls analyzed",
                  "Enterprise-grade security",
                  "Dedicated account manager",
                  "90-day data retention",
                  "Custom AI model training",
                  "API access",
                  "SSO integration",
                  "Custom reporting",
                ].map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Contact Sales</Button>
            </CardFooter>
          </Card>
        </div>
        
        <div className="text-center mt-16">
          <p className="text-muted-foreground mb-6">
            Need a custom plan? Contact our sales team for a tailored solution.
          </p>
          <Button variant="outline" size="lg">
            Contact Sales
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
