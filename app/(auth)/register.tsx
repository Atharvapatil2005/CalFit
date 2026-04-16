import React, { useEffect, useMemo, useState } from 'react';
import { Alert, View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Button, HelperText, Text, TextInput } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../src/context/AuthContext';
import { useOnboarding } from '../../src/context/OnboardingContext';
import { theme } from '../../src/constants/theme';
import { calculateCalories } from '../../src/lib/calorieCalculator';
import { upsertProfile } from '../../src/services/supabase';

export default function RegisterScreen() {
  const { signUp } = useAuth();
  const { state, resetState } = useOnboarding();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
  } as const;

  const hasGoal = Boolean(state.primaryGoal);
  const hasGender = Boolean(state.gender);
  const hasMeasurements = Boolean(state.height.trim() && state.weight.trim() && state.age.trim());
  const hasRequiredOnboardingData = hasGoal && hasGender && hasMeasurements;

  const isFormValid = useMemo(() => {
    return (
      email.trim().length > 0 &&
      password.trim().length >= 8 &&
      confirmPassword.trim().length >= 8 &&
      password === confirmPassword
    );
  }, [confirmPassword, email, password]);

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!hasGoal) {
      router.replace('/(auth)/onboarding');
      return;
    }

    if (!hasGender) {
      router.replace('/(auth)/gender');
      return;
    }

    if (!hasMeasurements) {
      router.replace('/(auth)/measurements');
    }
  }, [hasGender, hasGoal, hasMeasurements, loading, router]);

  const handleRegister = async () => {
    if (!hasRequiredOnboardingData) {
      setError('Complete onboarding before creating your account.');
      return;
    }

    const submissionValues = {
      age: Number(state.age.trim()),
      height: Number(state.height.trim()),
      weight: Number(state.weight.trim()),
      gender: state.gender,
      goal: state.primaryGoal,
      activityLevel: state.activityLevel,
    };

    console.log('[register] calorie calculation inputs', {
      submissionValues,
      onboardingContextSnapshot: {
        age: state.age,
        height: state.height,
        weight: state.weight,
        gender: state.gender,
        goal: state.primaryGoal,
        activityLevel: state.activityLevel,
      },
    });

    const { age, height, weight, gender, goal, activityLevel } = submissionValues;

    if (
      !gender ||
      !goal ||
      !Number.isFinite(age) ||
      !Number.isFinite(height) ||
      !Number.isFinite(weight) ||
      age <= 0 ||
      height <= 0 ||
      weight <= 0
    ) {
      setError('Enter valid age, height, and weight before creating your account.');
      return;
    }

    const targetCalories = calculateCalories({
      age,
      height,
      weight,
      gender,
      activityMultiplier: activityMultipliers[activityLevel],
      goal,
    });

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

      if (!session) {
        throw new Error(
          'Your account was created, but Supabase did not return an active session. Disable email confirmation for immediate signup, or ask the user to confirm their email and then sign in before profile setup.'
        );
      }

      const profile = await upsertProfile(
        {
          id: user.id,
          email: user.email ?? email.trim(),
          gender,
          age,
          height,
          weight,
          health_goal: goal,
          additional_goals: state.additionalGoals,
          dietary_preference: state.preference,
          dietary_restrictions: state.restrictions,
          target_calories: targetCalories,
        },
        session
      );

      const savedTargetCalories = profile?.target_calories ?? targetCalories;

      setInfo(`Your daily calorie target is ${savedTargetCalories} kcal`);
      Alert.alert('Profile saved', `Your daily calorie target is ${savedTargetCalories} kcal`);
      resetState();
      router.replace('/(tabs)/dashboard');
    } catch (signupError) {
      setError(signupError instanceof Error ? signupError.message : 'Unable to create your account.');
      setInfo('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: 24 + insets.bottom },
          ]}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        >
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
              disabled={!isFormValid || loading || !hasRequiredOnboardingData}
              loading={loading}
              style={styles.button}
              contentStyle={styles.buttonContent}
            >
              Create account
            </Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
