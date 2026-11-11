import React, { createContext, useContext, useState, useEffect } from 'react';
import { Profile } from '../types';
import { supabaseApi, isSupabaseConfigured } from '../lib/supabase';
import { DEMO_PROFILES } from '../lib/seedData';

interface AuthContextType {
  user: { id: string; email?: string } | null;
  profile: Profile | null;
  isLoading: boolean;
  isModerator: boolean;
  isBackendConnected: boolean;
  signIn: (params: { email: string; password: string }) => Promise<void>;
  signUp: (params: { email: string; password: string; nickname: string; avatar: string }) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (params: { nickname: string; avatar: string }) => Promise<void>;
  requestDeletion: (reason?: string) => Promise<void>;
  loginAsDemoUser: (nickname: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const isBackendConnected = isSupabaseConfigured();

  useEffect(() => {
    // Check existing session
    const session = supabaseApi.getCurrentSession();
    if (session) {
      setUser(session.user);
      setProfile(session.profile);
    } else {
      setUser(null);
      setProfile(null);
    }
    setIsLoading(false);
  }, []);

  const signIn = async (params: { email: string; password: string }) => {
    setIsLoading(true);
    try {
      const res = await supabaseApi.signIn(params);
      setUser(res.user);
      setProfile(res.profile);
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (params: { email: string; password: string; nickname: string; avatar: string }) => {
    setIsLoading(true);
    try {
      const res = await supabaseApi.signUp(params);
      setUser(res.user);
      setProfile(res.profile);
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      await supabaseApi.signOut();
      setUser(null);
      setProfile(null);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (params: { nickname: string; avatar: string }) => {
    if (!user) throw new Error('Not authenticated');
    const updated = await supabaseApi.updateProfile(user.id, params);
    setProfile(updated);
  };

  const requestDeletion = async (reason?: string) => {
    if (!user) throw new Error('Not authenticated');
    await supabaseApi.requestAccountDeletion(user.id, reason);
  };

  const loginAsDemoUser = (nickname: string) => {
    const found = DEMO_PROFILES.find(p => p.nickname === nickname) || DEMO_PROFILES[0];
    const demoUser = { id: found.id, email: `${found.nickname}@domain.org` };
    setUser(demoUser);
    setProfile(found);
    localStorage.setItem('tor_auth_session', JSON.stringify({ user: demoUser, profile: found }));
  };

  const isModerator = Boolean(profile?.is_moderator);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isLoading,
        isModerator,
        isBackendConnected,
        signIn,
        signUp,
        signOut,
        updateProfile,
        requestDeletion,
        loginAsDemoUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

