import React, { createContext, useContext, useEffect, useState } from 'react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { UserProfile, UserRole } from '../types';

interface AuthContextType {
  user: SupabaseUser | null;
  profile: UserProfile | null;
  loading: boolean;
  signIn: () => Promise<void>;
  logout: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          fetchProfile(session.user.id);
        } else {
          setProfile(null);
          setLoading(false);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        console.error("Error fetching profile:", error);
      }
      
      if (data) {
        setProfile(data as UserProfile);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async () => {
    if (import.meta.env.VITE_SUPABASE_URL === undefined || import.meta.env.VITE_SUPABASE_URL.includes('xxxx')) {
      alert("⚠️ Supabase n'est pas encore configuré. Ajoutez VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY dans les variables d'environnement.");
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/dashboard'
        }
      });
      if (error) {
        console.error("Sign in error:", error);
        alert("Erreur de connexion. Veuillez vérifier la configuration de votre base de données Supabase.");
      }
    } catch (err: any) {
      console.error("Auth error catch:", err);
      if (err.message?.includes('URL') || err.message?.includes('key')) {
        alert("Les clés Supabase ne sont pas configurées. Veuillez les rajouter via le menu Settings > Environment Variables.");
      } else {
        alert("Impossible de se connecter: " + err.message);
      }
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  const isAdmin = profile?.role === 'institution' || profile?.role === 'gestionnaire';

  return (
    <AuthContext.Provider value={{ user, profile, loading, signIn, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
