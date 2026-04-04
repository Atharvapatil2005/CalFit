import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Stack, router, useSegments } from 'expo-router';
import { PaperProvider, Text } from 'react-native-paper';
import { theme } from '../src/constants/theme';
import { AuthProvider } from '../src/context/AuthContext';
import { useAuth } from '../src/context/AuthContext';
import { OnboardingProvider } from '../src/context/OnboardingContext';

function RootLayoutNav() {
  const { user, loading } = useAuth();
  const segments = useSegments();

  useEffect(() => {
    if (loading) {
      return;
    }

    const inAuthGroup = segments[0] === '(auth)';
    const inTabsGroup = segments[0] === '(tabs)';
    const isCallbackRoute = segments[0] === 'login-callback';

    if (user && !inTabsGroup) {
      router.replace('/(tabs)/dashboard');
    } else if (!user && !inAuthGroup && !isCallbackRoute) {
      router.replace('/(auth)/login');
    }
  }, [loading, segments, user]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text variant="displayLarge" style={styles.title}>CalFit</Text>
        <Text variant="titleLarge" style={styles.subtitle}>Loading...</Text>
      </View>
    );
  }

  return (
      <Stack>
        <Stack.Screen
          name="(auth)"
          options={{
            headerShown: false,
            animation: 'fade'
          }}
        />
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
            animation: 'fade'
          }}
        />
        <Stack.Screen
          name="login-callback"
          options={{
            headerShown: false,
            animation: 'fade'
          }}
        />
        <Stack.Screen
          name="meals/add"
          options={{
            headerShown: true
          }}
        />
      </Stack>
  );
}

export default function RootLayout() {
  return (
    <PaperProvider theme={theme}>
      <AuthProvider>
        <OnboardingProvider>
          <RootLayoutNav />
        </OnboardingProvider>
      </AuthProvider>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    color: 'white',
    opacity: 0.9,
    textAlign: 'center',
  },
});
