import { Session } from '@supabase/supabase-js';
import { useRouter } from 'expo-router';
import { createContext, useContext, useEffect, useState } from 'react';
import { fetchCommuterDetails } from '../services/authentication';
import { fetchDriverByUserId } from '../services/driver';
import { Commuter, Driver, UserRole } from '../types';
import { supabase } from '../utils/supabase';

type AuthContextType = {
  signInWithPhoneNumber: (
    phone_number: string,
    password: string
  ) => Promise<{ success: boolean; role: UserRole | null }>;
  signOutUser: () => Promise<string | void>;
  session: Session | null;
  /** Commuter profile when role is 'commuter', else null. Existing screens rely on this field. */
  user: Commuter | null;
  /** Driver profile when role is 'driver', else null. */
  driver: Driver | null;
  /** Resolved role from `auth.user.user_metadata.role`. Null until profile load resolves. */
  role: UserRole | null;
  authChecked: boolean;
  isEmailVerified: boolean;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const resolveRole = (session: Session | null): UserRole => {
  const raw = session?.user?.user_metadata?.role;
  if (raw === 'driver' || raw === 'operator' || raw === 'authority') return raw;
  return 'commuter';
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<Commuter | null>(null);
  const [driver, setDriver] = useState<Driver | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);

      const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
        setSession(session);
        if (event === 'PASSWORD_RECOVERY') {
          router.replace('/(authentication)/update-password');
        }
      });

      return () => {
        listener.subscription.unsubscribe();
      };
    };

    init().finally(() => {
      setAuthChecked(true);
    });
  }, []);

  useEffect(() => {
    const loadProfile = async () => {
      if (!session?.user?.id) {
        setUser(null);
        setDriver(null);
        setRole(null);
        return;
      }

      const detectedRole = resolveRole(session);
      setRole(detectedRole);

      if (detectedRole === 'driver') {
        const { data: driverProfile, error } = await fetchDriverByUserId(session.user.id);
        if (error) {
          console.error('Failed to fetch driver:', {
            code: error.code,
            message: error.message,
            details: error.details,
            hint: error.hint,
            userId: session.user.id,
          });
          setDriver(null);
        } else {
          if (!driverProfile) {
            console.warn('No drivers row linked to user_id', session.user.id);
          }
          setDriver(driverProfile);
        }
        setUser(null);
      } else {
        const { data: commuter, error } = await fetchCommuterDetails(session.user.id);
        if (error) {
          console.error('Failed to fetch commuter:', error.message);
          setUser(null);
        } else {
          setUser(commuter);
        }
        setDriver(null);
      }
    };

    loadProfile();
  }, [session]);

  async function signInWithPhoneNumber(phone_number: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      phone: phone_number,
      password: password,
    });

    if (error || !data?.user) {
      return { success: false, role: null };
    }

    const detectedRole = resolveRole(data.session);
    setRole(detectedRole);

    if (detectedRole === 'driver') {
      const { data: driverProfile } = await fetchDriverByUserId(data.user.id);
      setDriver(driverProfile);
      setUser(null);
    } else {
      const { data: commuter } = await fetchCommuterDetails(data.user.id);
      setUser(commuter);
      setDriver(null);
    }

    return { success: true, role: detectedRole };
  }

  async function signOutUser() {
    const { error } = await supabase.auth.signOut();
    if (error) return error.message;
    setSession(null);
    setUser(null);
    setDriver(null);
    setRole(null);
  }

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        driver,
        role,
        signInWithPhoneNumber,
        signOutUser,
        authChecked,
        isEmailVerified: !!session?.user?.email_confirmed_at,
      }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within a AuthProvider');
  }

  return context;
}
