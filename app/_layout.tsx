import React, { useEffect, useState } from 'react';
import { Slot, useRouter, useSegments } from 'expo-router';
import { PaperProvider } from 'react-native-paper';
import { getCurrentUser } from '../src/services/supabase';
import { AuthState } from '../src/types/auth';

export default function RootLayout() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
  });
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    checkUser();
  }, []);

  useEffect(() => {
    const inAuthGroup = segments[0] === '(auth)';
    
    if (!authState.loading && !authState.user && !inAuthGroup) {
      router.replace('/login');
    } else if (!authState.loading && authState.user && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [authState.user, authState.loading, segments]);

  const checkUser = async () => {
    try {
      const user = await getCurrentUser();
      setAuthState({
        user,
        session: null,
        loading: false,
      });
    } catch (error) {
      setAuthState({
        user: null,
        session: null,
        loading: false,
      });
    }
  };

  return (
    <PaperProvider>
      <Slot />
    </PaperProvider>
  );
} 