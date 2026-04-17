import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Stack, router, useSegments } from 'expo-router';
import { PaperProvider, Text } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { theme } from '../src/constants/theme';
import { AuthProvider } from '../src/context/AuthContext';
import { useAuth } from '../src/context/AuthContext';
import { OnboardingProvider } from '../src/context/OnboardingContext';
import { ThemeProvider } from '../src/theme/ThemeContext';
import { useTheme } from '../src/theme/useTheme';

function AppNavigator() {
  const { session, loading } = useAuth();
  const segments = useSegments();
  const theme = useTheme();

  useEffect(() => {
    if (loading) {
      return;
    }

    const inAuthGroup = segments[0] === '(auth)';
    const inTabsGroup = segments[0] === '(tabs)';
    const isCallbackRoute = segments[0] === 'login-callback';
    const currentLeafSegment = segments[segments.length - 1];
    const inRegisterRoute = inAuthGroup && currentLeafSegment === 'register';

    const hasActiveSession = Boolean(session?.access_token);

    if (hasActiveSession && !inTabsGroup && !isCallbackRoute && !inRegisterRoute) {
      router.replace('/(tabs)/dashboard');
    } else if (!hasActiveSession && !inAuthGroup && !isCallbackRoute) {
      router.replace('/(auth)/login');
    }
  }, [loading, segments, session]);

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
        <Text variant="displayLarge" style={[styles.title, { color: theme.text }]}>CalFit</Text>
        <Text variant="titleLarge" style={[styles.subtitle, { color: theme.subtext }]}>Loading...</Text>
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

function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <GestureHandlerRootView style={styles.appRoot}>
      <SafeAreaProvider>
        <ThemeProvider>
          <AuthProvider>
            <OnboardingProvider>
              <PaperProvider theme={theme}>
                {children}
              </PaperProvider>
            </OnboardingProvider>
          </AuthProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default function RootLayout() {
  return (
    <AppProviders>
      <AppNavigator />
    </AppProviders>
  );
}

const styles = StyleSheet.create({
  appRoot: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    opacity: 0.9,
    textAlign: 'center',
  },
});
