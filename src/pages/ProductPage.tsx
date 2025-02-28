
import React, { useState } from "react";
import NavBar from "@/components/NavBar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  MicIcon, 
  BarChart2, 
  LineChart, 
  BookOpenCheck, 
  Bot, 
  Brain 
} from "lucide-react";

const ProductPage = () => {
  const [activeTab, setActiveTab] = useState("call-analytics");

  const features = [
    {
      id: "call-analytics",
      title: "Call Analytics",
      description: "Advanced call data insights",
      icon: <BarChart2 className="h-6 w-6" />,
      color: "bg-gradient-to-br from-blue-500 to-indigo-600",
      content: (
        <>
          <h3 className="text-lg font-semibold mb-2">Turn Conversations into Insights</h3>
          <p className="mb-4">
            Our AI-powered call analytics platform automatically transcribes and analyzes every customer conversation, providing insights into customer sentiment, pain points, and sales opportunities.
          </p>
          <ul className="space-y-2 mb-6">
            <li className="flex items-start">
              <div className="mr-2 mt-1 bg-blue-100 p-1 rounded-full">
                <div className="h-2 w-2 rounded-full bg-blue-600"></div>
              </div>
              <span>Real-time transcription with 98% accuracy</span>
            </li>
            <li className="flex items-start">
              <div className="mr-2 mt-1 bg-blue-100 p-1 rounded-full">
                <div className="h-2 w-2 rounded-full bg-blue-600"></div>
              </div>
              <span>Keyword and topic tracking across all conversations</span>
            </li>
            <li className="flex items-start">
              <div className="mr-2 mt-1 bg-blue-100 p-1 rounded-full">
                <div className="h-2 w-2 rounded-full bg-blue-600"></div>
              </div>
              <span>Sentiment analysis to gauge customer satisfaction</span>
            </li>
          </ul>
          <Badge variant="outline" className="mr-2">Speech Recognition</Badge>
          <Badge variant="outline" className="mr-2">NLP</Badge>
          <Badge variant="outline">Data Visualization</Badge>
        </>
      )
    },
    {
      id: "performance-metrics",
      title: "Performance Metrics",
      description: "Track agent effectiveness",
      icon: <LineChart className="h-6 w-6" />,
      color: "bg-gradient-to-br from-green-500 to-emerald-600",
      content: (
        <>
          <h3 className="text-lg font-semibold mb-2">Measure What Matters</h3>
          <p className="mb-4">
            Our performance metrics dashboard gives you a comprehensive view of your team's performance, highlighting areas of strength and opportunities for improvement.
          </p>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Call Duration</p>
              <p className="text-xl font-bold">-15%</p>
              <p className="text-xs text-green-600">Improved efficiency</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Resolution Rate</p>
              <p className="text-xl font-bold">+23%</p>
              <p className="text-xs text-green-600">First-call resolutions</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Customer Score</p>
              <p className="text-xl font-bold">4.8/5</p>
              <p className="text-xs text-green-600">Average satisfaction</p>
            </div>
          </div>
          <Badge variant="outline" className="mr-2">Analytics</Badge>
          <Badge variant="outline" className="mr-2">Dashboards</Badge>
          <Badge variant="outline">KPI Tracking</Badge>
        </>
      )
    },
    {
      id: "ai-coaching",
      title: "AI Coaching",
      description: "Real-time agent guidance",
      icon: <Bot className="h-6 w-6" />,
      color: "bg-gradient-to-br from-purple-500 to-violet-600",
      content: (
        <>
          <h3 className="text-lg font-semibold mb-2">A Virtual Coach for Every Agent</h3>
          <p className="mb-4">
            Our AI coach provides real-time suggestions and guidance to help your agents handle difficult situations, follow scripts, and improve their performance on every call.
          </p>
          <div className="bg-purple-50 p-4 rounded-lg mb-6">
            <p className="italic text-gray-700 border-l-4 border-purple-300 pl-4">
              "The AI coach helps me stay on track during calls and gives me helpful suggestions when I'm stuck. It's like having an experienced mentor by my side at all times."
            </p>
            <p className="text-right text-sm mt-2">- Maria S., Customer Service Agent</p>
          </div>
          <Badge variant="outline" className="mr-2">Real-time Guidance</Badge>
          <Badge variant="outline" className="mr-2">Speech Recognition</Badge>
          <Badge variant="outline">Feedback Loop</Badge>
        </>
      )
    },
    {
      id: "voice-transcription",
      title: "Voice Transcription",
      description: "Convert calls to text",
      icon: <MicIcon className="h-6 w-6" />,
      color: "bg-gradient-to-br from-red-500 to-pink-600",
      content: (
        <>
          <h3 className="text-lg font-semibold mb-2">Every Word, Captured Accurately</h3>
          <p className="mb-4">
            Our voice transcription technology converts spoken conversations into accurate, searchable text in real-time, supporting multiple languages and accents with high precision.
          </p>
          <div className="bg-gray-100 p-4 rounded-lg mb-6 text-sm font-mono">
            <p className="text-gray-500 mb-1">// Sample transcription</p>
            <p><span className="text-blue-600">Agent:</span> "Thank you for calling Call Evolution Hub. How can I help you today?"</p>
            <p><span className="text-green-600">Customer:</span> "I'm having trouble setting up the new dashboard on my account."</p>
            <p><span className="text-blue-600">Agent:</span> "I understand that can be frustrating. Let me walk you through the setup process step by step."</p>
          </div>
          <Badge variant="outline" className="mr-2">Multilingual</Badge>
          <Badge variant="outline" className="mr-2">99.5% Accuracy</Badge>
          <Badge variant="outline">Searchable Archive</Badge>
        </>
      )
    },
    {
      id: "quality-assurance",
      title: "Quality Assurance",
      description: "Ensure call compliance",
      icon: <BookOpenCheck className="h-6 w-6" />,
      color: "bg-gradient-to-br from-amber-500 to-yellow-600",
      content: (
        <>
          <h3 className="text-lg font-semibold mb-2">Automated Quality Assurance</h3>
          <p className="mb-4">
            Our QA system automatically screens calls for compliance issues, script adherence, and best practices, ensuring every customer interaction meets your quality standards.
          </p>
          <div className="border border-amber-200 rounded-lg overflow-hidden mb-6">
            <div className="bg-amber-50 px-4 py-2 border-b border-amber-200">
              <h4 className="font-medium">Compliance Checklist</h4>
            </div>
            <div className="p-4">
              <div className="flex items-center mb-2">
                <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3 w-3 text-green-600">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <span>Proper greeting and identification</span>
              </div>
              <div className="flex items-center mb-2">
                <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3 w-3 text-green-600">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <span>Required disclosures delivered</span>
              </div>
              <div className="flex items-center">
                <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3 w-3 text-green-600">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <span>Sensitive information handling protocol followed</span>
              </div>
            </div>
          </div>
          <Badge variant="outline" className="mr-2">Compliance</Badge>
          <Badge variant="outline" className="mr-2">Automation</Badge>
          <Badge variant="outline">Risk Management</Badge>
        </>
      )
    },
    {
      id: "sentiment-analysis",
      title: "Sentiment Analysis",
      description: "Gauge customer emotions",
      icon: <Brain className="h-6 w-6" />,
      color: "bg-gradient-to-br from-cyan-500 to-blue-600",
      content: (
        <>
          <h3 className="text-lg font-semibold mb-2">Understanding Customer Emotions</h3>
          <p className="mb-4">
            Our sentiment analysis engine detects emotional cues in customer speech, helping agents adapt their approach in real-time and providing valuable insights for improving customer experience.
          </p>
          <div className="bg-white shadow rounded-lg p-4 mb-6">
            <div className="flex items-center mb-3">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-green-600 h-2.5 rounded-full" style={{ width: "65%" }}></div>
              </div>
              <span className="ml-3 text-sm font-medium w-20">Positive</span>
            </div>
            <div className="flex items-center mb-3">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-gray-600 h-2.5 rounded-full" style={{ width: "25%" }}></div>
              </div>
              <span className="ml-3 text-sm font-medium w-20">Neutral</span>
            </div>
            <div className="flex items-center">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-red-600 h-2.5 rounded-full" style={{ width: "10%" }}></div>
              </div>
              <span className="ml-3 text-sm font-medium w-20">Negative</span>
            </div>
          </div>
          <Badge variant="outline" className="mr-2">Emotion Detection</Badge>
          <Badge variant="outline" className="mr-2">NLP</Badge>
          <Badge variant="outline">Customer Experience</Badge>
        </>
      )
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold mb-4">Our Features</h1>
              <p className="text-xl text-gray-600">
                Discover how our AI-powered platform transforms your call center operations
              </p>
            </div>
            
            <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8 bg-transparent h-auto">
                {features.map((feature) => (
                  <TabsTrigger
                    key={feature.id}
                    value={feature.id}
                    className="p-0 data-[state=active]:bg-transparent data-[state=active]:shadow-none h-full"
                  >
                    <Card 
                      className={`w-full h-full transition-all hover:shadow-lg ${
                        activeTab === feature.id 
                          ? "ring-2 ring-primary shadow-md" 
                          : "hover:border-primary/50"
                      }`}
                    >
                      <CardHeader className={`${feature.color} text-white rounded-t-lg`}>
                        <div className="flex justify-between items-center">
                          {feature.icon}
                          {activeTab === feature.id && (
                            <div className="h-2 w-2 rounded-full bg-white"></div>
                          )}
                        </div>
                        <CardTitle className="mt-3">{feature.title}</CardTitle>
                        <CardDescription className="text-white/80">
                          {feature.description}
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  </TabsTrigger>
                ))}
              </TabsList>
              
              <div className="bg-white shadow-lg rounded-xl p-6 mt-4 min-h-[400px] animate-fade-in">
                {features.map((feature) => (
                  <TabsContent key={feature.id} value={feature.id} className="focus:outline-none">
                    <div className="flex flex-col md:flex-row md:items-start gap-6">
                      <div className={`hidden md:flex h-16 w-16 rounded-full ${feature.color} text-white items-center justify-center flex-shrink-0`}>
                        {feature.icon}
                      </div>
                      <div className="flex-grow">
                        <h2 className="text-2xl font-bold mb-4">{feature.title}</h2>
                        {feature.content}
                        <div className="mt-6">
                          <Button className="mr-3">Learn More</Button>
                          <Button variant="outline">See Demo</Button>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                ))}
              </div>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductPage;
