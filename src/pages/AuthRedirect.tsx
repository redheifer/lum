import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const AuthRedirect = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    const handleRedirect = async () => {
      try {
        // Get the hash parameters from the URL
        const hashParams = new URLSearchParams(location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        const type = hashParams.get('type');
        
        if (accessToken) {
          // Set the session in Supabase
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken || '',
          });
          
          if (error) {
            throw error;
          }
          
          if (type === 'signup' || type === 'recovery') {
            toast.success(type === 'signup' ? 'Email verified successfully!' : 'Password reset successful!');
          }
          
          // Get user data to check if email is confirmed
          const { data: { user } } = await supabase.auth.getUser();
          
          if (user && user.email_confirmed_at) {
            navigate('/dashboard');
          } else {
            navigate('/login');
          }
        } else {
          navigate('/login');
        }
      } catch (error) {
        console.error('Auth redirect error:', error);
        toast.error('Authentication failed. Please try again.');
        navigate('/login');
      }
    };
    
    handleRedirect();
  }, [location, navigate]);
  
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Verifying your account...</h2>
        <p>Please wait while we complete the verification process.</p>
        <div className="mt-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto"></div>
        </div>
      </div>
    </div>
  );
};

export default AuthRedirect; 