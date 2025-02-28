
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogIn, UserPlus } from "lucide-react";

const NavBar: React.FC = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-sm z-50 border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <span className="font-bold text-xl">Call Evolution Hub</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link to="/dashboard">
              <Button variant="ghost" className="flex items-center gap-2">
                <LogIn className="h-4 w-4" />
                Login
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button className="flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
