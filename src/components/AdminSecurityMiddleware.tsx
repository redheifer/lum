import React, { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

// This component adds additional security measures for the admin dashboard
const AdminSecurityMiddleware: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Add noindex meta tag to prevent search engines from indexing admin pages
    const metaRobots = document.createElement('meta');
    metaRobots.name = 'robots';
    metaRobots.content = 'noindex, nofollow';
    document.head.appendChild(metaRobots);

    // Log admin access attempts for security auditing
    const logAdminAccess = async () => {
      if (user) {
        try {
          await supabase.from('admin_access_logs').insert({
            user_id: user.id,
            ip_address: 'client-side', // For privacy, we'll log this server-side
            user_agent: navigator.userAgent,
            path: window.location.pathname
          });
        } catch (error) {
          console.error('Failed to log admin access:', error);
        }
      }
    };

    logAdminAccess();

    // Set up inactivity timeout for admin pages (auto logout after 30 minutes of inactivity)
    let inactivityTimer: number;
    
    const resetInactivityTimer = () => {
      window.clearTimeout(inactivityTimer);
      inactivityTimer = window.setTimeout(() => {
        // Log out the user after inactivity
        supabase.auth.signOut().then(() => {
          navigate('/login');
          alert('You have been logged out due to inactivity.');
        });
      }, 30 * 60 * 1000); // 30 minutes
    };

    // Reset the timer on user activity
    const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    activityEvents.forEach(event => {
      document.addEventListener(event, resetInactivityTimer);
    });

    resetInactivityTimer();

    // Clean up
    return () => {
      document.head.removeChild(metaRobots);
      activityEvents.forEach(event => {
        document.removeEventListener(event, resetInactivityTimer);
      });
      window.clearTimeout(inactivityTimer);
    };
  }, [user, navigate]);

  return <>{children}</>;
};

export default AdminSecurityMiddleware; 