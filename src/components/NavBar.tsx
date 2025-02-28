
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  LogIn, 
  UserPlus, 
  PresentationIcon, 
  InfoIcon, 
  DollarSign, 
  Menu, 
  X,
  Mail,
  CircleUser
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const NavBar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-sm z-50 border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <span className="font-bold text-xl">Call Evolution Hub</span>
            </Link>
          </div>
          
          {/* Hamburger menu button */}
          <div className="md:hidden">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleMenu}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
          
          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/pricing">
              <Button variant="ghost" className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Pricing
              </Button>
            </Link>
            <Link to="/product">
              <Button variant="ghost" className="flex items-center gap-2">
                <InfoIcon className="h-4 w-4" />
                Product
              </Button>
            </Link>
            <Link to="/demo">
              <Button variant="ghost" className="flex items-center gap-2">
                <PresentationIcon className="h-4 w-4" />
                Request Demo
              </Button>
            </Link>
            <div className="h-6 border-l border-gray-300 mx-1"></div>
            <Link to="/dashboard">
              <Button variant="ghost" className="flex items-center gap-2">
                <LogIn className="h-4 w-4" />
                Login
              </Button>
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="flex items-center gap-2">
                  <UserPlus className="h-4 w-4" />
                  Sign Up
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuItem>
                  <Link to="/dashboard" className="flex items-center gap-2 w-full">
                    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg" className="h-4 w-4" alt="Google" />
                    Sign up with Google
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/dashboard" className="flex items-center gap-2 w-full">
                    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/microsoft/microsoft-original.svg" className="h-4 w-4" alt="Microsoft" />
                    Sign up with Microsoft
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/dashboard" className="flex items-center gap-2 w-full">
                    <Mail className="h-4 w-4" />
                    Sign up with Email
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b shadow-lg">
          <div className="flex flex-col p-4 space-y-3">
            <Link to="/pricing" onClick={toggleMenu}>
              <Button variant="ghost" className="w-full justify-start">
                <DollarSign className="h-4 w-4 mr-2" />
                Pricing
              </Button>
            </Link>
            <Link to="/product" onClick={toggleMenu}>
              <Button variant="ghost" className="w-full justify-start">
                <InfoIcon className="h-4 w-4 mr-2" />
                Product
              </Button>
            </Link>
            <Link to="/demo" onClick={toggleMenu}>
              <Button variant="ghost" className="w-full justify-start">
                <PresentationIcon className="h-4 w-4 mr-2" />
                Request Demo
              </Button>
            </Link>
            <div className="border-t border-gray-200 my-2"></div>
            <Link to="/dashboard" onClick={toggleMenu}>
              <Button variant="ghost" className="w-full justify-start">
                <LogIn className="h-4 w-4 mr-2" />
                Login
              </Button>
            </Link>
            <div className="border-t border-gray-200 my-2"></div>
            <div className="space-y-2">
              <p className="text-sm font-medium px-2">Sign up with:</p>
              <Link to="/dashboard" onClick={toggleMenu}>
                <Button variant="outline" className="w-full justify-start">
                  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg" className="h-4 w-4 mr-2" alt="Google" />
                  Google
                </Button>
              </Link>
              <Link to="/dashboard" onClick={toggleMenu}>
                <Button variant="outline" className="w-full justify-start">
                  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/microsoft/microsoft-original.svg" className="h-4 w-4 mr-2" alt="Microsoft" />
                  Microsoft
                </Button>
              </Link>
              <Link to="/dashboard" onClick={toggleMenu}>
                <Button variant="outline" className="w-full justify-start">
                  <Mail className="h-4 w-4 mr-2" />
                  Email
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
