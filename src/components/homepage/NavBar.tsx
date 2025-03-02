import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  LogIn, 
  UserPlus, 
  PresentationIcon, 
  InfoIcon, 
  DollarSign, 
  Menu, 
  X,
  Lightbulb
} from "lucide-react";

const NavBar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handlePricingClick = (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-sm z-50 border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Lightbulb className="h-5 w-5 text-primary rotate-12" strokeWidth={2.5} />
              <span className="font-bold text-xl">Lum</span>
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
            <Button variant="ghost" className="flex items-center gap-2" onClick={handlePricingClick}>
              <DollarSign className="h-4 w-4" />
              Pricing
            </Button>
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
            <Link to="/login">
              <Button variant="ghost" className="flex items-center gap-2">
                <LogIn className="h-4 w-4" />
                Login
              </Button>
            </Link>
            <Link to="/signup">
              <Button className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white">
                <UserPlus className="h-4 w-4" />
                Create Free Account
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b shadow-lg">
          <div className="flex flex-col p-4 space-y-3">
            <Button variant="ghost" className="w-full justify-start" onClick={(e) => {
              handlePricingClick(e);
              toggleMenu();
            }}>
              <DollarSign className="h-4 w-4 mr-2" />
              Pricing
            </Button>
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
            <Link to="/login" onClick={toggleMenu}>
              <Button variant="ghost" className="w-full justify-start">
                <LogIn className="h-4 w-4 mr-2" />
                Login
              </Button>
            </Link>
            <Link to="/signup" onClick={toggleMenu}>
              <Button className="w-full justify-start bg-green-600 hover:bg-green-700 text-white">
                <UserPlus className="h-4 w-4 mr-2" />
                Create Free Account
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
