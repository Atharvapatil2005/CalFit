import React from 'react';
import { View, StyleSheet, ImageBackground } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { router } from 'expo-router';
import { theme } from '../../src/constants/theme';

export default function LoginScreen() {
  const handleNavigation = (isNewUser = false) => {
    if (isNewUser) {
      router.push('/(auth)/onboarding');
    } else {
      router.replace('/(tabs)/dashboard');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text variant="displayLarge" style={styles.title}>
          CalFit
        </Text>
        <Text variant="headlineMedium" style={styles.subtitle}>
          Your AI-powered calorie tracker
        </Text>
      </View>

      <View style={styles.footer}>
        <Button
          mode="contained"
          onPress={() => handleNavigation(true)}
          style={styles.button}
          contentStyle={styles.buttonContent}
        >
          GET STARTED
        </Button>
        <Button
          mode="text"
          onPress={() => handleNavigation(false)}
          labelStyle={styles.linkText}
        >
          Already have an account?
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  title: {
    color: theme.colors.primary,
    marginBottom: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  subtitle: {
    color: theme.colors.onBackground,
    textAlign: 'center',
    marginBottom: 32,
    fontSize: 24,
    lineHeight: 32,
  },
  footer: {
    padding: 24,
    paddingBottom: 48,
  },
  button: {
    marginBottom: 16,
    borderRadius: 8,
  },
  buttonContent: {
    height: 56,
  },
  linkText: {
    fontSize: 16,
    color: theme.colors.primary,
  },
});

