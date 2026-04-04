import React, { useMemo, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Button, HelperText, Text, TextInput } from 'react-native-paper';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../src/context/AuthContext';
import { useOnboarding } from '../../src/context/OnboardingContext';
import { theme } from '../../src/constants/theme';
import { upsertProfile } from '../../src/services/supabase';

export default function RegisterScreen() {
  const { signUp } = useAuth();
  const { state, resetState } = useOnboarding();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  const isFormValid = useMemo(() => {
    return (
      email.trim().length > 0 &&
      password.trim().length >= 8 &&
      confirmPassword.trim().length >= 8 &&
      password === confirmPassword
    );
  }, [confirmPassword, email, password]);

  const handleRegister = async () => {
    try {
      setLoading(true);
      setError('');
      setInfo('');

      const metadata = {
        health_goal: state.primaryGoal,
        gender: state.gender,
      };

      const { user, session } = await signUp(email.trim(), password, metadata);

      if (!user) {
        throw new Error('We could not create your account.');
      }

      if (session) {
        await upsertProfile({
          id: user.id,
          email: user.email ?? email.trim(),
          gender: state.gender,
          age: state.age ? Number(state.age) : null,
          height: state.height ? Number(state.height) : null,
          weight: state.weight ? Number(state.weight) : null,
          health_goal: state.primaryGoal,
          additional_goals: state.additionalGoals,
          dietary_preference: state.preference,
          dietary_restrictions: state.restrictions,
        });

        resetState();
        router.replace('/(tabs)/dashboard');
        return;
      }

      resetState();
      setInfo('Account created. Check your email to confirm your account, then log in.');
      router.replace('/(auth)/login');
    } catch (signupError) {
      setError(signupError instanceof Error ? signupError.message : 'Unable to create your account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.content}>
          <Text variant="headlineMedium" style={styles.title}>Create your account</Text>
          <Text variant="bodyLarge" style={styles.subtitle}>
            Finish signup to save your onboarding details and start using CalFit.
          </Text>

          <View style={styles.summaryCard}>
            <Text variant="titleMedium" style={styles.summaryTitle}>Your setup</Text>
            <Text variant="bodyMedium">Goal: {state.primaryGoal ? state.primaryGoal.replace('_', ' ') : 'Not selected'}</Text>
            <Text variant="bodyMedium">Gender: {state.gender ?? 'Not selected'}</Text>
            <Text variant="bodyMedium">Height: {state.height || '-'} cm</Text>
            <Text variant="bodyMedium">Weight: {state.weight || '-'} kg</Text>
            <Text variant="bodyMedium">Age: {state.age || '-'} years</Text>
          </View>

          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            style={styles.input}
            disabled={loading}
          />

          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
            disabled={loading}
          />

          <TextInput
            label="Confirm password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            style={styles.input}
            disabled={loading}
          />

          {confirmPassword.length > 0 && password !== confirmPassword ? (
            <HelperText type="error" visible>
              Passwords must match.
            </HelperText>
          ) : null}

          {error ? <Text style={styles.error}>{error}</Text> : null}
          {info ? <Text style={styles.info}>{info}</Text> : null}

          <Button
            mode="contained"
            onPress={handleRegister}
            disabled={!isFormValid || loading}
            loading={loading}
            style={styles.button}
            contentStyle={styles.buttonContent}
          >
            Create account
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  content: {
    width: '100%',
    maxWidth: 560,
    alignSelf: 'center',
  },
  title: {
    color: theme.colors.onBackground,
    marginBottom: 8,
  },
  subtitle: {
    color: theme.colors.onSurfaceVariant,
    marginBottom: 24,
  },
  summaryCard: {
    backgroundColor: theme.colors.surfaceVariant,
    padding: 16,
    borderRadius: 16,
    gap: 6,
    marginBottom: 20,
  },
  summaryTitle: {
    marginBottom: 8,
    color: theme.colors.onSurfaceVariant,
  },
  input: {
    marginBottom: 16,
    backgroundColor: theme.colors.background,
  },
  button: {
    marginTop: 8,
    borderRadius: 8,
  },
  buttonContent: {
    height: 56,
  },
  error: {
    color: theme.colors.error,
    marginTop: 4,
  },
  info: {
    color: theme.colors.primary,
    marginTop: 4,
  },
});
