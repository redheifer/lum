import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import NavBar from "@/components/NavBar";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Info } from "lucide-react";

const DemoPage = () => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    teamSize: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, we would send the form data to a server
    console.log("Form submitted:", formData);
    setFormSubmitted(true);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      
      <main className="flex-1 pt-24">
        {formSubmitted ? (
          <Alert variant="default" className="max-w-2xl mx-auto mb-8">
            <Info className="h-4 w-4" />
            <AlertTitle>Thanks for requesting a demo!</AlertTitle>
            <AlertDescription>
              Our team will be in touch with you shortly to schedule your personalized demonstration.
            </AlertDescription>
          </Alert>
        ) : null}
        
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold mb-4">See Our Platform in Action</h1>
              <p className="text-xl text-gray-600">
                Watch our demo video to see how our AI-powered call review system works, 
                or schedule a personalized demonstration with one of our product specialists.
              </p>
            </div>
            
            <div className="mb-16">
              <div className="rounded-xl overflow-hidden shadow-lg">
                <AspectRatio ratio={16 / 9}>
                  <img 
                    src="https://images.unsplash.com/photo-1551434678-e076c223a692" 
                    alt="Demo video placeholder" 
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Button 
                      size="lg" 
                      className="rounded-full w-16 h-16 flex items-center justify-center"
                    >
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 24 24" 
                        fill="currentColor" 
                        className="w-8 h-8 ml-1"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </Button>
                  </div>
                </AspectRatio>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-6 text-center">Schedule a Personalized Demo</h2>
              {/* Google Calendar Appointment Scheduling begin */}
              <div className="w-full">
                <iframe 
                  src="https://calendar.google.com/calendar/appointments/schedules/AcZssZ1Fa1-2fAfb8bERkt4ag72-XhVSCulhO4-DlBqD5LVpOs_dNBTtQ7ll0MFpPHD84vw6yWq7jnR2?gv=true" 
                  style={{ border: 0 }} 
                  width="100%" 
                  height="600" 
                  frameBorder="0"
                  title="Schedule a demo"
                  className="w-full"
                ></iframe>
              </div>
              {/* end Google Calendar Appointment Scheduling */}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DemoPage;
