import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Phone, 
  MessageSquare, 
  BarChart4, 
  ChevronDown, 
  ChevronUp, 
  Headphones, 
  Mic, 
  Laptop,
  Zap,
  Info,
  Settings,
  LogOut,
  Mail,
  UserPlus
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const [isAffiliateExpanded, setIsAffiliateExpanded] = useState(false);
  const [isSettingsExpanded, setIsSettingsExpanded] = useState(false);
  const [userEmail, setUserEmail] = useState("user@example.com");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteMessage, setInviteMessage] = useState("");

  const toggleAffiliateSection = () => {
    setIsAffiliateExpanded(!isAffiliateExpanded);
  };

  const toggleSettingsSection = () => {
    setIsSettingsExpanded(!isSettingsExpanded);
  };

  const handleSaveEmail = () => {
    console.log("Email updated to:", userEmail);
    // Here you would typically update the email in your auth system
  };

  const handleInviteUser = () => {
    console.log("Inviting user:", inviteEmail);
    console.log("Message:", inviteMessage);
    setInviteEmail("");
    setInviteMessage("");
    // Here you would typically send the invitation
  };

  const handleLogout = () => {
    console.log("Logging out...");
    // Here you would typically handle logout
  };

  const affiliateProducts = [
    { 
      name: "Pro Headset XZ500", 
      description: "Premium noise-canceling headset for call centers", 
      icon: Headphones,
      link: "#" 
    },
    { 
      name: "Voice Clarity Mic", 
      description: "Crystal clear audio for professional calls", 
      icon: Mic,
      link: "#" 
    },
    { 
      name: "CallTrack Analytics", 
      description: "Advanced metrics dashboard for call quality", 
      icon: BarChart4,
      link: "#" 
    },
    { 
      name: "TurboScript AI", 
      description: "AI-powered call scripting software", 
      icon: Zap,
      link: "#" 
    },
    { 
      name: "CallStation Pro", 
      description: "All-in-one workstation for call agents", 
      icon: Laptop,
      link: "#" 
    }
  ];

  return (
    <div className="h-full w-full bg-white border-r">
      <div className="flex flex-col h-full">
        <div className="p-4 border-b">
          <h2 className="font-semibold text-lg">Call Evolution Hub</h2>
          <p className="text-sm text-slate-500">AI-powered call quality analysis</p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <div className="p-4 border-b">
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="calls" className="flex items-center gap-1">
                <Phone className="h-4 w-4" />
                <span className="hidden sm:inline">Calls</span>
              </TabsTrigger>
              <TabsTrigger value="prompts" className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4" />
                <span className="hidden sm:inline">Prompts</span>
              </TabsTrigger>
              <TabsTrigger value="training" className="flex items-center gap-1">
                <BarChart4 className="h-4 w-4" />
                <span className="hidden sm:inline">Training</span>
              </TabsTrigger>
            </TabsList>
          </div>
          
          {/* Content will be rendered in the main area, not here */}
        </Tabs>
        
        {/* Settings Section */}
        <div className="mt-auto border-t">
          <button 
            onClick={toggleSettingsSection}
            className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Settings className="h-4 w-4 text-green-600" />
              <span className="font-medium">Settings</span>
            </div>
            {isSettingsExpanded ? 
              <ChevronUp className="h-4 w-4 text-slate-400" /> : 
              <ChevronDown className="h-4 w-4 text-slate-400" />
            }
          </button>
          
          {isSettingsExpanded && (
            <div className="px-4 pb-4">
              <div className="space-y-3">
                {/* Edit Email Setting */}
                <Dialog>
                  <DialogTrigger asChild>
                    <button className="w-full p-2 rounded-md border border-slate-200 hover:border-green-200 hover:bg-green-50 transition-colors flex items-center gap-2">
                      <Mail className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Edit Email</span>
                    </button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Edit your email</DialogTitle>
                      <DialogDescription>
                        Change the email address associated with your account.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                      <Input 
                        type="email"
                        placeholder="you@example.com"
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)}
                        className="mb-2"
                      />
                    </div>
                    <DialogFooter>
                      <Button type="submit" onClick={handleSaveEmail}>Save Changes</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                
                {/* Invite Users Setting */}
                <Dialog>
                  <DialogTrigger asChild>
                    <button className="w-full p-2 rounded-md border border-slate-200 hover:border-green-200 hover:bg-green-50 transition-colors flex items-center gap-2">
                      <UserPlus className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Invite Users</span>
                    </button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Invite team members</DialogTitle>
                      <DialogDescription>
                        Send invitations to your colleagues to join your workspace.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-4">
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium">Email</label>
                        <Input 
                          id="email"
                          type="email"
                          placeholder="colleague@example.com"
                          value={inviteEmail}
                          onChange={(e) => setInviteEmail(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="message" className="text-sm font-medium">Message (optional)</label>
                        <Textarea 
                          id="message"
                          placeholder="Join our workspace to collaborate!"
                          value={inviteMessage}
                          onChange={(e) => setInviteMessage(e.target.value)}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit" onClick={handleInviteUser}>Send Invitation</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                
                {/* Logout Button */}
                <button 
                  onClick={handleLogout}
                  className="w-full p-2 rounded-md border border-slate-200 hover:border-red-200 hover:bg-red-50 transition-colors flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4 text-red-600" />
                  <span className="text-sm">Log Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Affiliate Products Section */}
        <div className="border-t">
          <button 
            onClick={toggleAffiliateSection}
            className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4 text-blue-500" />
              <span className="font-medium">Recommended Tools</span>
            </div>
            {isAffiliateExpanded ? 
              <ChevronUp className="h-4 w-4 text-slate-400" /> : 
              <ChevronDown className="h-4 w-4 text-slate-400" />
            }
          </button>
          
          {isAffiliateExpanded && (
            <ScrollArea className="max-h-60">
              <div className="px-4 pb-4">
                <p className="text-xs text-slate-500 mb-3">
                  Tools we recommend to improve your call center performance
                </p>
                <div className="space-y-3">
                  {affiliateProducts.map((product, index) => (
                    <a 
                      key={index}
                      href={product.link}
                      className="block p-2 rounded-md border border-slate-200 hover:border-blue-200 hover:bg-blue-50 transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <div className="flex items-start">
                        <div className="mt-0.5 mr-2 p-1.5 bg-blue-100 rounded-md text-blue-600">
                          <product.icon className="h-4 w-4" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium">{product.name}</h4>
                          <p className="text-xs text-slate-500">{product.description}</p>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </ScrollArea>
          )}
        </div>
        
        <div className="p-4 border-t">
          <Button variant="outline" className="w-full">Help & Documentation</Button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
