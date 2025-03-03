
import React, { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

const AuthGuard: React.FC = () => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading && !user) {
      toast.error("Please log in to access this page");
    }
  }, [isLoading, user]);

  // If still loading, show nothing or a loading spinner
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  // If user is not logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If user's email is not confirmed, redirect to verify email page
  if (!user.email_confirmed_at) {
    return <Navigate to="/verify-email" state={{ email: user.email }} replace />;
  }

  // User is logged in and email is confirmed, render the protected route
  return <Outlet />;
};

export default AuthGuard;
