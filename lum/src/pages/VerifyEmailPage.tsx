
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Mail, CheckCircle } from "lucide-react";
import NavBar from "@/components/NavBar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const VerifyEmailPage: React.FC = () => {
  const location = useLocation();
  const email = location.state?.email || "your email";

  const handleResendEmail = async () => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
      });

      if (error) {
        throw error;
      }

      toast.success("Verification email resent successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to resend verification email");
      console.error("Resend verification error:", error);
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
                <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5 mr-2" />
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
            >
              Resend verification email
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
