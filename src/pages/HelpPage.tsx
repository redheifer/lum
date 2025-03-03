import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const HelpPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearching(true);
      // Simulate search delay
      setTimeout(() => {
        setIsSearching(false);
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="w-16 h-16 flex items-center justify-center bg-gradient-to-br from-amber-400 to-amber-600 text-white rounded-full shadow-lg mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
              <path d="M9 18h6" />
              <path d="M10 22h4" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Lum Help Center</h1>
          <p className="text-xl text-gray-600">Find answers to your questions and learn how to get the most out of Lum</p>
        </div>

        <div className="mb-12">
          <form onSubmit={handleSearch} className="relative">
            <div className="flex">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  type="text"
                  placeholder="Search for help articles..."
                  className="pl-10 py-6 text-lg rounded-l-lg w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button 
                type="submit" 
                className="bg-amber-500 hover:bg-amber-600 text-white py-6 px-8 text-lg rounded-r-lg"
                disabled={isSearching}
              >
                {isSearching ? 'Searching...' : 'Search'}
              </Button>
            </div>
          </form>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Card>
            <CardHeader>
              <CardTitle>Getting Started</CardTitle>
              <CardDescription>Learn the basics of using Lum</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="text-blue-600 hover:underline cursor-pointer">Setting up your first campaign</li>
                <li className="text-blue-600 hover:underline cursor-pointer">Understanding QA scores</li>
                <li className="text-blue-600 hover:underline cursor-pointer">Navigating the dashboard</li>
                <li className="text-blue-600 hover:underline cursor-pointer">Inviting team members</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Advanced Features</CardTitle>
              <CardDescription>Take your experience to the next level</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="text-blue-600 hover:underline cursor-pointer">Custom QA criteria</li>
                <li className="text-blue-600 hover:underline cursor-pointer">API integration</li>
                <li className="text-blue-600 hover:underline cursor-pointer">Advanced reporting</li>
                <li className="text-blue-600 hover:underline cursor-pointer">Webhook configuration</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-amber-800 mb-2">Need more help?</h2>
          <p className="text-amber-700 mb-4">Our support team is available Monday through Friday, 9am-5pm EST.</p>
          <Button className="bg-amber-500 hover:bg-amber-600">Contact Support</Button>
        </div>
      </div>
    </div>
  );
};

export default HelpPage; 