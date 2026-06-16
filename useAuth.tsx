import { useState, useEffect, createContext, useContext, type ReactNode } from 'react';
import type { Profile, UserType } from '../types';

interface DemoUser extends Profile {
  wallet_balance: number;
  trust_score: number;
  completed_tasks: number;
}

interface AuthContextType {
  user: DemoUser | null;
  loading: boolean;
  isDemoMode: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, fullName: string, userType: UserType) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  updateUserWallet: (amount: number) => void;
  updateUserTrust: (score: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo user for hackathon mode
const DEMO_USER: DemoUser = {
  id: 'demo-user-ekta',
  email: 'ekta@neurolance.ai',
  full_name: 'Ekta',
  user_type: 'business',
  avatar_url: null,
  created_at: new Date().toISOString(),
  wallet_balance: 245,
  trust_score: 4.8,
  completed_tasks: 12,
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<DemoUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(true);

  useEffect(() => {
    // Auto-login demo user immediately (no API calls)
    const timer = setTimeout(() => {
      setUser(DEMO_USER);
      setLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  async function refreshProfile() {
    // In demo mode, just refresh with current demo user data
    if (user) {
      setUser({ ...user });
    }
  }

  async function signIn(_email: string, _password: string) {
    // In demo mode, sign in as demo user
    setUser(DEMO_USER);
    return { error: null };
  }

  async function signUp(_email: string, _password: string, _fullName: string, _userType: UserType) {
    // In demo mode, sign up as demo user
    setUser(DEMO_USER);
    return { error: null };
  }

  async function signOut() {
    // In demo mode, stay logged in as demo user
    setUser(DEMO_USER);
  }

  function updateUserWallet(amount: number) {
    if (user) {
      setUser({ ...user, wallet_balance: user.wallet_balance + amount });
    }
  }

  function updateUserTrust(score: number) {
    if (user) {
      setUser({ ...user, trust_score: score });
    }
  }

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      isDemoMode,
      signIn,
      signUp,
      signOut,
      refreshProfile,
      updateUserWallet,
      updateUserTrust,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
