import React, { useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { AdminUser } from '../types';
import { AuthContext } from './authContextDef';

const LOCAL_AUTH_KEY = 'nexus_admin_session';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function initSession() {
      if (isSupabaseConfigured) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            setUser({
              id: session.user.id,
              email: session.user.email || 'admin@nexus.io',
              role: 'admin',
            });
          }
        } catch (err) {
          console.warn('Error reading Supabase session:', err);
        }

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
          if (session?.user) {
            setUser({
              id: session.user.id,
              email: session.user.email || 'admin@nexus.io',
              role: 'admin',
            });
          } else {
            setUser(null);
          }
        });

        setLoading(false);
        return () => subscription.unsubscribe();
      } else {
        // Fallback local session for demo / testing
        const stored = localStorage.getItem(LOCAL_AUTH_KEY);
        if (stored) {
          try {
            setUser(JSON.parse(stored));
          } catch {
            localStorage.removeItem(LOCAL_AUTH_KEY);
          }
        }
        setLoading(false);
      }
    }

    initSession();
  }, []);

  const signIn = async (email: string, password: string): Promise<void> => {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw new Error(error.message);
      if (data.user) {
        setUser({
          id: data.user.id,
          email: data.user.email || email,
          role: 'admin',
        });
      }
      return;
    }

    // Local / Demo Authentication verification
    // Permitted credentials: admin@nexus.io / NexusAdmin2026! or any admin credentials
    if (
      (email.toLowerCase() === 'admin@nexus.io' && password === 'NexusAdmin2026!') ||
      (email.includes('admin') && password.length >= 6)
    ) {
      const adminSession: AdminUser = {
        id: 'admin-local-uuid',
        email,
        role: 'admin',
      };
      localStorage.setItem(LOCAL_AUTH_KEY, JSON.stringify(adminSession));
      setUser(adminSession);
    } else {
      throw new Error('Invalid administrator credentials. For local preview, use admin@nexus.io / NexusAdmin2026!');
    }
  };

  const signOut = async (): Promise<void> => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem(LOCAL_AUTH_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAdmin: Boolean(user),
        signIn,
        signOut,
        isDemoMode: !isSupabaseConfigured,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
