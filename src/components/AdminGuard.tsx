import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const AdminGuard: React.FC = () => {
  const { user, isLoading: authLoading } = useAuth();
  const location = useLocation();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [debugInfo, setDebugInfo] = useState('');

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) return;

      try {
        console.log(`Checking admin status for user: ${user.id}`);
        
        // Check if user is in admin_users table
        const { data: adminData, error: adminError } = await supabase
          .from('admin_users')
          .select('id')
          .eq('id', user.id)
          .single();
          
        if (adminData) {
          console.log('User is admin:', adminData);
          setIsAdmin(true);
        } else {
          console.log('User is not admin, error:', adminError?.message);
          setIsAdmin(false);
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      checkAdminStatus();
    }
  }, [user, authLoading]);

  if (authLoading || loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  if (!user) {
    toast.error('You must be logged in to access this page');
    return <Navigate to="/login" />;
  }

  if (!isAdmin) {
    console.log('User does not have admin privileges, redirecting to dashboard');
    toast.error('You do not have admin privileges');
    return <Navigate to="/dashboard" />;
  }

  return <Outlet />;
};

export default AdminGuard; 