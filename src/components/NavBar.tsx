
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
  CircleUser,
  Headphones,
  Mic,
  BarChart4,
  Zap,
  Laptop,
  Info
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

type AffiliateProduct = {
  name: string;
  description: string;
  icon: any;
  link: string;
};

const NavBar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const affiliateProducts: AffiliateProduct[] = [
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
    <nav className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-sm z-50 border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <span className="font-bold text-xl">Call Evolution Hub</span>
            </Link>
          </div>
          
          {/* Desktop: Just show hamburger button */}
          <div className="flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Open menu">
                  <Menu className="h-6 w-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <Link to="/pricing">
                  <DropdownMenuItem className="cursor-pointer">
                    <DollarSign className="h-4 w-4 mr-2" />
                    Pricing
                  </DropdownMenuItem>
                </Link>
                
                <Link to="/product">
                  <DropdownMenuItem className="cursor-pointer">
                    <InfoIcon className="h-4 w-4 mr-2" />
                    Product
                  </DropdownMenuItem>
                </Link>
                
                <Link to="/demo">
                  <DropdownMenuItem className="cursor-pointer">
                    <PresentationIcon className="h-4 w-4 mr-2" />
                    Request Demo
                  </DropdownMenuItem>
                </Link>
                
                <DropdownMenuSeparator />
                
                <Link to="/login">
                  <DropdownMenuItem className="cursor-pointer">
                    <LogIn className="h-4 w-4 mr-2" />
                    Login
                  </DropdownMenuItem>
                </Link>
                
                <Link to="/dashboard">
                  <DropdownMenuItem className="cursor-pointer text-amber-600">
                    <CircleUser className="h-4 w-4 mr-2" />
                    Developer Login
                  </DropdownMenuItem>
                </Link>
                
                <Link to="/dashboard" className="mt-2 block px-1">
                  <Button className="w-full justify-start bg-green-600 hover:bg-green-700 text-white">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Create Free Account
                  </Button>
                </Link>
                
                <DropdownMenuSeparator className="my-2" />
                
                <div className="px-2 py-1.5">
                  <div className="flex items-center gap-2 mb-2">
                    <Info className="h-4 w-4 text-blue-500" />
                    <span className="font-medium">Recommended Tools</span>
                  </div>
                  
                  <div className="space-y-2 max-h-60 overflow-y-auto py-1">
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
                            <product.icon className="h-3 w-3" />
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
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
