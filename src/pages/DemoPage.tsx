
import React, { useState, useEffect, useRef } from "react";
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

  const calendarButtonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load the Google Calendar scheduling button script
    const linkElement = document.createElement('link');
    linkElement.href = 'https://calendar.google.com/calendar/scheduling-button-script.css';
    linkElement.rel = 'stylesheet';
    document.head.appendChild(linkElement);

    const scriptElement = document.createElement('script');
    scriptElement.src = 'https://calendar.google.com/calendar/scheduling-button-script.js';
    scriptElement.async = true;
    document.head.appendChild(scriptElement);

    // Initialize the calendar button after scripts have loaded
    scriptElement.onload = () => {
      if (calendarButtonRef.current && window.calendar && window.calendar.schedulingButton) {
        window.calendar.schedulingButton.load({
          url: 'https://calendar.google.com/calendar/appointments/AcZssZ3e3g22em-l_tIchPRce__GtqeLDy7FL_k-Cdc=?gv=true',
          color: '#C0CA33',
          label: "Book a Demo with Lum",
          target: calendarButtonRef.current,
        });
      }
    };

    // Cleanup function
    return () => {
      document.head.removeChild(linkElement);
      if (scriptElement.parentNode) {
        document.head.removeChild(scriptElement);
      }
    };
  }, []);

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
              <h2 className="text-2xl font-bold mb-6 text-center">Book a Demo with Lum</h2>
              <div className="w-full flex justify-center" ref={calendarButtonRef}>
                {/* Google Calendar Scheduling Button will be injected here */}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// Add TypeScript interface for the global window object
declare global {
  interface Window {
    calendar?: {
      schedulingButton: {
        load: (options: {
          url: string;
          color: string;
          label: string;
          target: HTMLElement;
        }) => void;
      };
    };
  }
}

export default DemoPage;
