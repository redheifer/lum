import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const setupAuth = async () => {
      // Try to get the initial session
      const { data: { session: initialSession } } = await supabase.auth.getSession();
      setSession(initialSession);
      setUser(initialSession?.user ?? null);
      setIsLoading(false);

      // Listen for auth changes
      const { data: { subscription } } = await supabase.auth.onAuthStateChange(
        (event, currentSession) => {
          if (event === 'SIGNED_OUT') {
            setSession(null);
            setUser(null);
            navigate('/login');
          } else if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
            setSession(currentSession);
            setUser(currentSession?.user ?? null);
          }
        }
      );

      return () => {
        subscription.unsubscribe();
      };
    };

    setupAuth();
  }, [navigate]);

  const signOut = async () => {
    try {
      // Only clear auth-related items from storage instead of everything
      // Supabase typically stores auth in 'supabase.auth.token' and similar keys
      localStorage.removeItem('supabase.auth.token');
      sessionStorage.removeItem('supabase.auth.token');
      
      // Remove any other app-specific auth data
      localStorage.removeItem('user');
      localStorage.removeItem('session');
      
      // Only clear authentication-related cookies
      // These are typically set by Supabase auth
      const authCookies = ['sb-access-token', 'sb-refresh-token', 'sb-auth-token'];
      authCookies.forEach(cookieName => {
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      });
      
      // Sign out from Supabase
      await supabase.auth.signOut();
      
      // Force redirect to login page
      window.location.href = '/login';
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ session, user, isLoading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
