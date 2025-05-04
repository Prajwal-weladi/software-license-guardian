import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { handleEmailConfirmation } from '../lib/auth';

type UserRole = 'employer' | 'admin';

interface User {
  id: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  signup: (email: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  updateUserRole: (newRole: UserRole) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (session?.user) {
        // Get user role from user_roles table
        const { data: roleData, error: roleError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id)
          .single();

        if (roleError) {
          console.error('Error fetching user role:', roleError);
          return;
        }

        setUser({
          id: session.user.id,
          email: session.user.email!,
          role: roleData?.role || 'employer'
        });
        setIsAuthenticated(true);
      }
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const { data: roleData, error: roleError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id)
          .single();

        if (!roleError && roleData) {
          setUser({
            id: session.user.id,
            email: session.user.email!,
            role: roleData.role
          });
          setIsAuthenticated(true);
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string, role: UserRole) => {
    try {
      // First, check if we already have a session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (session?.user) {
        // If we have a session, verify the role
        const { data: roleData, error: roleError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id)
          .single();

        if (roleError) throw roleError;

        if (roleData.role === role) {
          setUser({
            id: session.user.id,
            email: session.user.email!,
            role: roleData.role
          });
          setIsAuthenticated(true);
          return;
        }
      }

      // If no valid session, proceed with login
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        // Get user role in a single query
        const { data: roleData, error: roleError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', data.user.id)
          .single();

        if (roleError) throw roleError;

        if (roleData.role !== role) {
          throw new Error('Invalid role for this account');
        }

        setUser({
          id: data.user.id,
          email: data.user.email!,
          role: roleData.role
        });
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const signup = async (email: string, password: string, role: UserRole) => {
    try {
      // Sign up the user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        // Store the user role
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert([{ user_id: data.user.id, role }]);

        if (roleError) throw roleError;

        return true;
      }

      return false;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const updateUserRole = async (newRole: UserRole) => {
    if (!user) throw new Error('No user logged in');

    try {
      const { error } = await supabase
        .from('user_roles')
        .update({ role: newRole })
        .eq('user_id', user.id);

      if (error) throw error;

      setUser({ ...user, role: newRole });
    } catch (error) {
      console.error('Role update error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        isAuthenticated,
        updateUserRole,
      }}
    >
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