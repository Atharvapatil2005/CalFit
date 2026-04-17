import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button, TextInput, useTheme } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../src/context/AuthContext';
import { useTheme as useAppTheme } from '../../src/theme/useTheme';

export default function LoginScreen() {
  const router = useRouter();
  const { signIn } = useAuth();
  const paperTheme = useTheme();
  const theme = useAppTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError('');
      
      await signIn(email, password);
      router.replace('/(tabs)/dashboard');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.content}>
          <Text variant="headlineMedium" style={[styles.title, { color: theme.text }]}>Welcome to CalFit</Text>
          <Text variant="bodyLarge" style={[styles.subtitle, { color: theme.subtext }]}>Log in to track your meals and progress</Text>

          {error ? <Text style={[styles.error, { color: paperTheme.colors.error }]}>{error}</Text> : null}

          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            style={[styles.input, { backgroundColor: theme.card }]}
            keyboardType="email-address"
            autoCapitalize="none"
            disabled={loading}
            textColor={theme.text}
          />

          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            style={[styles.input, { backgroundColor: theme.card }]}
            secureTextEntry
            disabled={loading}
            textColor={theme.text}
          />

          <Button
            mode="contained"
            onPress={handleLogin}
            style={styles.button}
            loading={loading}
            disabled={loading || !email || !password}
          >
            Log In
          </Button>

          <Button
            mode="text"
            onPress={() => router.push('/(auth)/onboarding')}
            style={styles.button}
            disabled={loading}
          >
            New here? Start onboarding
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  content: {
    width: '100%',
    maxWidth: 520,
    alignSelf: 'center',
  },
  title: {
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    marginBottom: 32,
    textAlign: 'center',
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
  },
  error: {
    marginBottom: 16,
    textAlign: 'center',
  },
});
