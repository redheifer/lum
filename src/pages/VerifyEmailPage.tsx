import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';
import NavBar from '@/components/NavBar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const VerifyEmailPage: React.FC = () => {
  const [isResending, setIsResending] = useState(false);
  const email = new URLSearchParams(window.location.search).get('email') || '';

  const handleResendEmail = async () => {
    if (!email) {
      toast.error('No email address found');
      return;
    }

    try {
      setIsResending(true);
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
      });

      if (error) {
        throw error;
      }

      toast.success('Verification email resent successfully');
    } catch (error) {
      console.error('Error resending verification email:', error);
      toast.error('Failed to resend verification email');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 bg-green-100 p-3 rounded-full w-16 h-16 flex items-center justify-center">
              <Mail className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold">Verify your email</CardTitle>
            <CardDescription>
              We've sent a verification link to <span className="font-medium">{email}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-start">
                <svg
                  className="h-5 w-5 text-blue-500 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z"
                    clipRule="evenodd"
                  />
                </svg>
                <div>
                  <p className="text-sm text-blue-800">
                    Please check your email inbox and click the verification link to activate your account.
                  </p>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              If you don't see the email, check your spam folder. Still missing? Click below to resend.
            </p>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button 
              onClick={handleResendEmail} 
              variant="outline" 
              className="w-full"
              disabled={isResending}
            >
              {isResending ? 'Sending...' : 'Resend verification email'}
            </Button>
            <div className="text-center text-sm">
              <span className="text-gray-600">Back to </span>
              <Link to="/login" className="text-green-600 hover:text-green-500 font-medium">
                Sign in
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
