import React from 'react';

const WelcomeStep = () => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center bg-gradient-to-br from-amber-400 to-amber-600 text-white rounded-full shadow-amber-lg">
          <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
            <path d="M9 18h6" />
            <path d="M10 22h4" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold mb-2">Welcome to Lum</h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
          Let's get you set up with AI-powered call analysis in just a few minutes.
        </p>
      </div>
      
      <div className="space-y-4 max-w-lg mx-auto">
        <h3 className="text-xl font-semibold">What we'll do:</h3>
        <ul className="space-y-3">
          <li className="flex items-start">
            <div className="bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-full p-1 mr-3 mt-0.5">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 6L9 17l-5-5"/>
              </svg>
            </div>
            <p className="text-gray-700 dark:text-gray-300">Create a webhook to receive your call recordings</p>
          </li>
          <li className="flex items-start">
            <div className="bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-full p-1 mr-3 mt-0.5">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 6L9 17l-5-5"/>
              </svg>
            </div>
            <p className="text-gray-700 dark:text-gray-300">Configure which data you want to send along with your recordings</p>
          </li>
          <li className="flex items-start">
            <div className="bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-full p-1 mr-3 mt-0.5">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 6L9 17l-5-5"/>
              </svg>
            </div>
            <p className="text-gray-700 dark:text-gray-300">Set up your integration with your existing phone system</p>
          </li>
          <li className="flex items-start">
            <div className="bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-full p-1 mr-3 mt-0.5">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 6L9 17l-5-5"/>
              </svg>
            </div>
            <p className="text-gray-700 dark:text-gray-300">Start analyzing calls with Lum's AI-powered insights</p>
          </li>
        </ul>
      </div>
      
      <div className="bg-amber-50 dark:bg-amber-900/10 p-4 rounded-lg border border-amber-100 dark:border-amber-900/30 text-center mt-8">
        <p className="text-amber-800 dark:text-amber-400 font-medium">
          Ready to start illuminating your call data?
        </p>
      </div>
    </div>
  );
};

export default WelcomeStep; 