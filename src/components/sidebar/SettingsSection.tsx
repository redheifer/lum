
import React, { useState } from 'react';
import { Settings, ChevronDown, ChevronUp, Mail, UserPlus, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const SettingsSection: React.FC = () => {
  const [isSettingsExpanded, setIsSettingsExpanded] = useState(false);
  const [userEmail, setUserEmail] = useState("user@example.com");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteMessage, setInviteMessage] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const toggleSettingsSection = () => {
    setIsSettingsExpanded(!isSettingsExpanded);
  };

  const handleSaveEmail = () => {
    console.log("Email updated to:", userEmail);
    toast({
      title: "Email updated",
      description: "Your email has been updated successfully.",
    });
    // Here you would typically update the email in your auth system
  };

  const handleInviteUser = () => {
    console.log("Inviting user:", inviteEmail);
    console.log("Message:", inviteMessage);
    toast({
      title: "Invitation sent",
      description: `Invitation sent to ${inviteEmail}`,
    });
    setInviteEmail("");
    setInviteMessage("");
    // Here you would typically send the invitation
  };

  const handleLogout = () => {
    console.log("Logging out...");
    // Clear any auth state/tokens from localStorage
    localStorage.removeItem("auth_token"); // Add any other auth-related items to remove
    
    // Show toast notification
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
    
    // Redirect to login page
    navigate("/");
  };

  return (
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
  );
};

export default SettingsSection;
