
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  type: 'customer' | 'merchant';
  shopId?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  session: Session | null;
  isLoading: boolean;
  login: (email: string, password: string, type?: 'customer' | 'merchant') => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string, name: string, type: 'customer' | 'merchant') => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isMerchant: boolean;
  isCustomer: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth event:', event, session);
        setSession(session);
        
        if (session?.user) {
          // Fetch user profile from our profiles table
          setTimeout(async () => {
            try {
              const { data: profile, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();
              
              if (error) {
                console.error('Error fetching profile:', error);
                setUser(null);
              } else if (profile) {
                setUser({
                  id: profile.id,
                  email: profile.email,
                  name: profile.name,
                  type: profile.type as 'customer' | 'merchant',
                  shopId: profile.shop_id || undefined,
                });
              }
            } catch (error) {
              console.error('Profile fetch error:', error);
              setUser(null);
            }
          }, 0);
        } else {
          setUser(null);
        }
        
        setIsLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setSession(session);
      } else {
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signup = async (
    email: string, 
    password: string, 
    name: string, 
    type: 'customer' | 'merchant'
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            name,
            type,
          }
        }
      });

      if (error) {
        setIsLoading(false);
        return { success: false, error: error.message };
      }

      if (data.user) {
        setIsLoading(false);
        return { success: true };
      }

      setIsLoading(false);
      return { success: false, error: 'Registration failed' };
    } catch (error) {
      setIsLoading(false);
      return { success: false, error: 'An unexpected error occurred' };
    }
  };

  const login = async (
    email: string, 
    password: string, 
    type?: 'customer' | 'merchant'
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setIsLoading(false);
        return { success: false, error: error.message };
      }

      if (data.user) {
        // If type is specified, verify user type matches
        if (type) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('type')
            .eq('id', data.user.id)
            .single();
          
          if (profile && profile.type !== type) {
            await supabase.auth.signOut();
            setIsLoading(false);
            return { 
              success: false, 
              error: `Questo account non è registrato come ${type === 'merchant' ? 'merchant' : 'cliente'}` 
            };
          }
        }

        setIsLoading(false);
        return { success: true };
      }

      setIsLoading(false);
      return { success: false, error: 'Login failed' };
    } catch (error) {
      setIsLoading(false);
      return { success: false, error: 'An unexpected error occurred' };
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const isAuthenticated = !!user && !!session;
  const isMerchant = user?.type === 'merchant';
  const isCustomer = user?.type === 'customer';

  const value: AuthContextType = {
    user,
    session,
    isLoading,
    login,
    signup,
    logout,
    isAuthenticated,
    isMerchant,
    isCustomer,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
