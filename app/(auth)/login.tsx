import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { signInWithGoogle } from '../../src/services/supabase';
import { router } from 'expo-router';

export default function LoginScreen() {
  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Text variant="displayMedium" style={styles.title}>
          CalFit
        </Text>
        <Text variant="titleMedium" style={styles.subtitle}>
          Your AI-powered calorie tracker
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={handleGoogleSignIn}
          style={styles.button}
          icon="google"
        >
          Sign in with Google
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#007AFF',
  },
  subtitle: {
    textAlign: 'center',
    opacity: 0.7,
  },
  buttonContainer: {
    marginBottom: 40,
  },
  button: {
    width: '100%',
    paddingVertical: 8,
  },
}); 