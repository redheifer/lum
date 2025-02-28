
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import NavBar from "@/components/NavBar";
import { Calendar, Phone, Mail, Building2, Users, PhoneCall, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const DemoPage: React.FC = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    companyName: "",
    email: "",
    phone: "",
    numAgents: "1-10",
    callsPerDay: "10-50",
    preferredTime: "",
    message: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    toast({
      title: "Demo Request Submitted",
      description: "We'll contact you shortly to schedule your demo.",
      variant: "success"
    });
    // Reset form
    setFormData({
      companyName: "",
      email: "",
      phone: "",
      numAgents: "1-10",
      callsPerDay: "10-50",
      preferredTime: "",
      message: ""
    });
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Experience Call Evolution Hub in Action</h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto">See how our AI-powered solution transforms call quality assurance for businesses like yours</p>
          </div>
        </section>
        
        {/* Video and Form Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-start">
              {/* Video Section */}
              <div className="rounded-lg overflow-hidden shadow-xl bg-white p-3">
                <h2 className="text-2xl font-bold mb-6 text-center">See It in Action</h2>
                <div className="aspect-video bg-gray-200 rounded-lg mb-6 overflow-hidden relative">
                  {/* Replace with actual video or iframe when available */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-gray-600 mb-4">Demo Video</p>
                      <p className="text-sm text-gray-500">Showing happy customer service agents using Call Evolution Hub</p>
                      {/* Placeholder for video - would be replaced with actual video component */}
                      <div className="mt-4 p-4 bg-gray-100 rounded-full inline-flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                          <polygon points="5 3 19 12 5 21 5 3"></polygon>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-6 text-gray-700">
                  <div className="flex items-start">
                    <div className="bg-blue-100 rounded-full p-3 mr-4">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Happy Agents</h3>
                      <p>Our platform makes quality assurance less stressful and more collaborative for your agents.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-green-100 rounded-full p-3 mr-4">
                      <PhoneCall className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Better Call Quality</h3>
                      <p>Identify areas for improvement and celebrate wins with data-driven insights.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-purple-100 rounded-full p-3 mr-4">
                      <Clock className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Save Time & Money</h3>
                      <p>Reduce QA time by 80% while increasing the number of calls you can review.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Request Form */}
              <div className="bg-white rounded-lg shadow-xl p-8">
                <h2 className="text-2xl font-bold mb-6">Request Your Personalized Demo</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name</Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Building2 className="h-5 w-5 text-gray-400" />
                      </div>
                      <Input 
                        type="text" 
                        id="companyName" 
                        name="companyName" 
                        className="pl-10" 
                        placeholder="Your Company Name" 
                        value={formData.companyName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <Input 
                        type="email" 
                        id="email" 
                        name="email" 
                        className="pl-10" 
                        placeholder="you@company.com" 
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-gray-400" />
                      </div>
                      <Input 
                        type="tel" 
                        id="phone" 
                        name="phone" 
                        className="pl-10" 
                        placeholder="(555) 123-4567"
                        value={formData.phone} 
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="numAgents">Number of Agents</Label>
                      <select 
                        id="numAgents" 
                        name="numAgents" 
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        value={formData.numAgents}
                        onChange={handleChange}
                        required
                      >
                        <option value="1-10">1-10 Agents</option>
                        <option value="11-50">11-50 Agents</option>
                        <option value="51-100">51-100 Agents</option>
                        <option value="101-500">101-500 Agents</option>
                        <option value="500+">500+ Agents</option>
                      </select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="callsPerDay">Calls Per Day</Label>
                      <select 
                        id="callsPerDay" 
                        name="callsPerDay" 
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        value={formData.callsPerDay}
                        onChange={handleChange}
                        required
                      >
                        <option value="10-50">10-50 calls/day</option>
                        <option value="51-100">51-100 calls/day</option>
                        <option value="101-500">101-500 calls/day</option>
                        <option value="501-1000">501-1000 calls/day</option>
                        <option value="1000+">1000+ calls/day</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="preferredTime">Preferred Demo Time</Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar className="h-5 w-5 text-gray-400" />
                      </div>
                      <Input 
                        type="text" 
                        id="preferredTime" 
                        name="preferredTime" 
                        className="pl-10" 
                        placeholder="e.g. Weekdays after 2pm EST"
                        value={formData.preferredTime}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="message">Additional Information (Optional)</Label>
                    <Textarea 
                      id="message" 
                      name="message" 
                      placeholder="Tell us more about your needs..."
                      rows={3}
                      value={formData.message}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <Button type="submit" className="w-full">Request Your Demo</Button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default DemoPage;
