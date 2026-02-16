
import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import { authService } from '../services/supabaseService';

interface User {
  email: string;
  name: string;
  role: 'student' | 'company';
  isProfileComplete: boolean;
  details?: any;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, role: 'student' | 'company', initialDetails?: any) => Promise<void>;
  completeProfile: (details: any) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  refreshUser: () => Promise<void>;
}

const STORAGE_KEY = 'smrh_user';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // Hydratation: vérifier la session Supabase au lieu de se fier uniquement au localStorage
  useEffect(() => {
    const initAuth = async () => {
      // 1. Hydratation rapide depuis le localStorage pour éviter le flicker
      const savedUser = localStorage.getItem(STORAGE_KEY);
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch {
          localStorage.removeItem(STORAGE_KEY);
        }
      }

      // 2. Vérification asynchrone de la session Supabase (source de vérité)
      try {
        authService.onAuthStateChange((event, session) => {
          if (event === 'SIGNED_OUT' || !session) {
            setUser(null);
            localStorage.removeItem(STORAGE_KEY);
          }
        });
      } catch {
        // Supabase non configuré — on garde le fallback localStorage
      }
    };

    initAuth();
  }, []);

  const persistUser = (userData: User) => {
    // Ne stocker que le minimum nécessaire (pas les données sensibles)
    const safeData = {
      email: userData.email,
      name: userData.name,
      role: userData.role,
      isProfileComplete: userData.isProfileComplete,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(safeData));
  };

  const refreshUser = async () => {
    if (!user) return;
    try {
      const dbProfile = await apiService.getCandidateProfile();
      if (dbProfile && Object.keys(dbProfile).length > 0) {
        const updatedUser = { ...user, details: dbProfile, isProfileComplete: true };
        setUser(updatedUser);
        persistUser(updatedUser);
      }
    } catch (e) {
      console.warn("Sync failed, fallback to local state");
    }
  };

  const login = async (email: string, role: 'student' | 'company', initialDetails?: any) => {
    const name = initialDetails
      ? (initialDetails.firstName || email.split('@')[0])
      : email.split('@')[0];

    const userData: User = {
      email,
      name,
      role,
      isProfileComplete: !!initialDetails,
      details: initialDetails || {}
    };

    setUser(userData);
    persistUser(userData);

    if (initialDetails) {
      try {
        await apiService.saveProfileSync(initialDetails);
      } catch (e) {
        console.error("Critical: Database sync failed during login", e);
      }
    }
  };

  const completeProfile = async (details: any) => {
    if (user) {
      const updatedUser = { ...user, isProfileComplete: true, details: { ...user.details, ...details } };
      setUser(updatedUser);
      persistUser(updatedUser);
      await apiService.saveProfileSync(details);
    }
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
    try {
      await authService.signOut();
    } catch {
      // Supabase non configuré — on nettoie quand même le state local
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, completeProfile, logout, isAuthenticated: !!user, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
