import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { PaperProvider, Text } from 'react-native-paper';
import { theme } from '../src/constants/theme';
import { AuthProvider } from '../src/context/AuthContext';
import { useAuth } from '../src/context/AuthContext';
import { router } from 'expo-router';

// Debug logging
console.log('App starting...');

function RootLayoutNav() {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.replace('/(tabs)/dashboard');
      } else {
        router.replace('/(auth)/login');
      }
    }
  }, [user, loading]);

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
    </Stack>
  );
}

export default function RootLayout() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    setAppIsReady(true);
  }, []);

  if (!appIsReady) {
    return (
      <View style={styles.container}>
        <Text variant="displayLarge" style={styles.title}>CalFit</Text>
        <Text variant="titleLarge" style={styles.subtitle}>Loading...</Text>
      </View>
    );
  }

  return (
    <PaperProvider theme={theme}>
      <AuthProvider>
        <RootLayoutNav />
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