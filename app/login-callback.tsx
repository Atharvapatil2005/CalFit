import { useEffect } from 'react';
import { Text, View, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../src/lib/supabase';

export default function LoginCallback() {
  const router = useRouter();

  useEffect(() => {
    const getSession = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (data?.session) {
        console.log('✅ Logged in!');
        router.replace('/(tabs)'); // or your home screen
      } else {
        console.log('❌ Session not found', error);
        router.replace('/login'); // fallback to login screen
      }
    };

    getSession();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" />
      <Text>Redirecting...</Text>
    </View>
  );
}