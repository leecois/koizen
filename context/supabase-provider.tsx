import { Session, User } from '@supabase/supabase-js';
import { useRouter, useSegments, SplashScreen } from 'expo-router';
import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';

import { supabase } from '@/config/supabase';

SplashScreen.preventAutoHideAsync();

type RefreshCallback = () => void;

type SupabaseContextProps = {
  user: User | null;
  session: Session | null;
  initialized?: boolean;
  isRefreshing: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signInWithPassword: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refresh: () => Promise<void>;
  addRefreshListener: (callback: RefreshCallback) => () => void;
};

type SupabaseProviderProps = {
  children: React.ReactNode;
};

export const SupabaseContext = createContext<SupabaseContextProps>({
  user: null,
  session: null,
  initialized: false,
  isRefreshing: false,
  signUp: async () => {},
  signInWithPassword: async () => {},
  signOut: async () => {},
  refresh: async () => {},
  addRefreshListener: () => () => {},
});

export const useSupabase = () => useContext(SupabaseContext);

export const SupabaseProvider = ({ children }: SupabaseProviderProps) => {
  const router = useRouter();
  const segments = useSegments();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [initialized, setInitialized] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const refreshListeners = useRef<Set<RefreshCallback>>(new Set());

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) {
      throw error;
    }
  };

  const signInWithPassword = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      throw error;
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }
  };

  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      // Refresh your Supabase data here
      // For example:
      // await Promise.all([
      //   supabase.from('table1').select().range(0, 9),
      //   supabase.from('table2').select().range(0, 9),
      // ]);

      // Notify all listeners
      refreshListeners.current.forEach(callback => callback());
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  const addRefreshListener = useCallback((callback: RefreshCallback) => {
    refreshListeners.current.add(callback);
    return () => {
      refreshListeners.current.delete(callback);
    };
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session ? session.user : null);
      setInitialized(true);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session ? session.user : null);
    });
  }, []);

  useEffect(() => {
    if (!initialized) return;

    const inProtectedGroup = segments[0] === '(protected)';

    if (session && !inProtectedGroup) {
      router.replace('/(protected)/');
    } else if (!session) {
      router.replace('/welcome');
    }

    setTimeout(() => {
      SplashScreen.hideAsync();
    }, 500);
  }, [initialized, session]);

  return (
    <SupabaseContext.Provider
      value={{
        user,
        session,
        initialized,
        isRefreshing,
        signUp,
        signInWithPassword,
        signOut,
        refresh,
        addRefreshListener,
      }}>
      {children}
    </SupabaseContext.Provider>
  );
};
