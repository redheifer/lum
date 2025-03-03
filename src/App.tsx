import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/hooks/use-theme";
import { AuthProvider } from "@/hooks/useAuth";
import AuthGuard from "@/components/AuthGuard";
import AdminGuard from "@/components/AdminGuard";
import HomePage from "./pages/HomePage";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import PricingPage from "./pages/PricingPage";
import DemoPage from "./pages/DemoPage";
import ProductPage from "./pages/ProductPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import AuthRedirect from "./pages/AuthRedirect";
import HelpPage from "./pages/HelpPage";

// Import admin components from the correct path
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UsersManagement from "./pages/admin/UsersManagement";
import CampaignsManagement from "./pages/admin/CampaignsManagement";
import AnalyticsDashboard from "./pages/admin/AnalyticsDashboard";
import AdminSettings from "./pages/admin/AdminSettings";
import WorkspacesManagement from "./pages/admin/WorkspacesManagement";
import WorkspaceDetail from "./pages/admin/WorkspaceDetail";
import WebhookTesting from "./pages/admin/WebhooksTesting";

import React, { ErrorInfo, Component, useEffect } from 'react';
import OnboardingWizard from "./components/OnboardingWizard";
import OnboardingWrapper from "./components/OnboardingWrapper";
import { OnboardingProvider } from '@/contexts/OnboardingContext';
import PortalOnboardingButton from './components/PortalOnboardingButton';
import Calls from "./pages/Calls";
import RealTimeQA from "./pages/RealTimeQA";

// Import settings pages
import ProfileSettings from "./pages/settings/ProfileSettings";
import NotificationSettings from "./pages/settings/NotificationSettings";
import SecuritySettings from "./pages/settings/SecuritySettings";

// Import the WebhookInstructions page
import WebhookInstructions from './pages/WebhookInstructions';

const queryClient = new QueryClient();

class ErrorBoundary extends Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
            <p className="text-gray-600 mb-6">
              We're sorry, but there was an error loading this page. Please try refreshing or contact support if the problem persists.
            </p>
            <div className="flex justify-between">
              <button
                onClick={() => window.location.href = '/'}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                Go Home
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Refresh Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const App = () => {
  console.log('App component loaded', new Date().toISOString());

  // Move event listeners to useEffect to prevent multiple registrations
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error('Global error caught:', event.error);
    };

    const handleRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason);
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleRejection);

    // Add environment check
    import('./utils/checkEnvironment').then(module => {
      module.checkEnvironment();
    });

    // Clean up event listeners when component unmounts
    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleRejection);
    };
  }, []);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="light">
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <AuthProvider>
                <OnboardingProvider>
                  <Routes>
                    {/* Public routes */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/pricing" element={<PricingPage />} />
                    <Route path="/demo" element={<DemoPage />} />
                    <Route path="/product" element={<ProductPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                    <Route path="/verify-email" element={<VerifyEmailPage />} />
                    <Route path="/auth/callback" element={<AuthRedirect />} />
                    <Route path="/help" element={<HelpPage />} />
                    
                    {/* Protected routes */}
                    <Route element={<AuthGuard />}>
                      <Route path="/dashboard" element={<Index />} />
                      <Route path="/calls" element={<Calls />} />
                      <Route path="/realtime-qa" element={<RealTimeQA />} />
                      <Route path="/webhook-instructions" element={<WebhookInstructions />} />
                      <Route path="/" element={<Navigate to="/dashboard" />} />
                      <Route path="/campaigns" element={<Navigate to="/dashboard" />} />
                      <Route path="/reports" element={<Navigate to="/dashboard" />} />
                      
                      {/* Settings routes */}
                      <Route path="/settings" element={<Navigate to="/settings/profile" />} />
                      <Route path="/settings/profile" element={<ProfileSettings />} />
                      <Route path="/settings/notifications" element={<NotificationSettings />} />
                      <Route path="/settings/security" element={<SecuritySettings />} />
                      
                      <Route path="/profile" element={<AdminDashboard />} />
                      <Route 
                        path="/onboarding/:workspaceId" 
                        element={<OnboardingWrapper />} 
                      />
                    </Route>
                    
                    {/* Admin routes */}
                    <Route element={<AdminGuard />}>
                      <Route path="/admin" element={<AdminLayout />}>
                        <Route index element={<AdminDashboard />} />
                        <Route path="users" element={<UsersManagement />} />
                        <Route path="campaigns" element={<CampaignsManagement />} />
                        <Route path="workspaces" element={<WorkspacesManagement />} />
                        <Route path="analytics" element={<AnalyticsDashboard />} />
                        <Route path="settings" element={<AdminSettings />} />
                        <Route path="workspaces/:id" element={<WorkspaceDetail />} />
                        <Route path="webhooks" element={<WebhookTesting />} />
                      </Route>
                    </Route>
                    
                    {/* Catch-all route */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                  <PortalOnboardingButton />
                </OnboardingProvider>
              </AuthProvider>
            </BrowserRouter>
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
