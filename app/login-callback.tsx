import { useEffect } from 'react';
import { Text, View, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../src/lib/supabase';

export default function LoginCallback() {
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;

    const getSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (!isMounted) {
          return;
        }

        if (!error && data?.session) {
          router.replace('/(tabs)/dashboard');
          return;
        }
      } catch {
        try {
          await supabase.auth.signOut({ scope: 'local' });
        } catch {
          // Ignore local cleanup failures on callback recovery.
        }
      }

      if (isMounted) {
        router.replace('/(auth)/login');
      }
    };

    getSession();

    return () => {
      isMounted = false;
    };
  }, [router]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" />
      <Text>Redirecting...</Text>
    </View>
  );
}
