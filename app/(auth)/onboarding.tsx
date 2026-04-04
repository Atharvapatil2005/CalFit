import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../../src/constants/theme';
import { Goal, AdditionalGoal, useOnboarding } from '../../src/context/OnboardingContext';

export default function OnboardingScreen() {
  const { state, updateState } = useOnboarding();

  const goals: { value: Goal; label: string }[] = [
    { value: 'lose_weight', label: 'Lose weight' },
    { value: 'maintain_weight', label: 'Maintain weight' },
    { value: 'gain_weight', label: 'Gain weight' },
  ];

  const additionalGoalOptions: { value: AdditionalGoal; label: string }[] = [
    { value: 'living_longer', label: 'Living longer' },
    { value: 'feeling_energized', label: 'Feeling energized' },
    { value: 'athletic_performance', label: 'Optimize athletic performance' },
    { value: 'healthier_habits', label: 'Build healthier habits' },
    { value: 'mindset', label: 'Eliminate All-or-Nothing mindset' },
    { value: 'prevent_diseases', label: 'Prevent lifestyle diseases' },
  ];

  const toggleAdditionalGoal = (goal: AdditionalGoal) => {
    const nextGoals = state.additionalGoals.includes(goal)
      ? state.additionalGoals.filter((item) => item !== goal)
      : [...state.additionalGoals, goal];

    updateState({ additionalGoals: nextGoals });
  };

  const handleNext = () => {
    if (!state.primaryGoal) return;
    router.replace('/(auth)/gender');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Text variant="headlineMedium" style={styles.title}>
              Let's get to know you better!
            </Text>
          </View>

          <View style={styles.section}>
            <Text variant="titleLarge" style={styles.sectionTitle}>
              What goal do you have in mind?
            </Text>
            <View style={styles.goalsContainer}>
              {goals.map((goal) => (
                <Pressable
                key={goal.value}
                style={[
                  styles.goalButton,
                  state.primaryGoal === goal.value && styles.selectedGoal,
                ]}
                onPress={() => updateState({ primaryGoal: goal.value })}
              >
                  <Text
                    style={[
                      styles.goalText,
                      state.primaryGoal === goal.value && styles.selectedGoalText,
                    ]}
                  >
                    {goal.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text variant="titleLarge" style={styles.sectionTitle}>
              What additional goals do you have?
            </Text>
            <View style={styles.goalsContainer}>
              {additionalGoalOptions.map((goal) => (
                <Pressable
                key={goal.value}
                style={[
                  styles.goalButton,
                  state.additionalGoals.includes(goal.value) && styles.selectedGoal,
                ]}
                onPress={() => toggleAdditionalGoal(goal.value)}
              >
                  <Text
                    style={[
                      styles.goalText,
                      state.additionalGoals.includes(goal.value) && styles.selectedGoalText,
                    ]}
                  >
                    {goal.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View style={styles.footer}>
            <Text variant="bodyMedium" style={styles.footerText}>
              We use this information to calculate and provide you with daily personalized recommendations.
            </Text>
            <Button
              mode="contained"
              onPress={handleNext}
              disabled={!state.primaryGoal}
              style={styles.button}
              contentStyle={styles.buttonContent}
            >
              NEXT
            </Button>
          </View>
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
    paddingBottom: 16,
  },
  content: {
    width: '100%',
    maxWidth: 680,
    alignSelf: 'center',
  },
  header: {
    padding: 24,
    paddingTop: 24,
  },
  title: {
    fontWeight: 'bold',
    color: theme.colors.onBackground,
    marginBottom: 8,
  },
  section: {
    padding: 24,
    paddingTop: 0,
  },
  sectionTitle: {
    marginBottom: 16,
    color: theme.colors.onBackground,
  },
  goalsContainer: {
    gap: 12,
  },
  goalButton: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: theme.colors.surfaceVariant,
  },
  selectedGoal: {
    backgroundColor: theme.colors.primary,
  },
  goalText: {
    fontSize: 16,
    color: theme.colors.onSurfaceVariant,
  },
  selectedGoalText: {
    color: theme.colors.onPrimary,
    fontWeight: 'bold',
  },
  footer: {
    padding: 24,
    paddingTop: 8,
  },
  footerText: {
    textAlign: 'center',
    marginBottom: 24,
    color: theme.colors.onSurfaceVariant,
  },
  button: {
    borderRadius: 8,
  },
  buttonContent: {
    height: 56,
  },
}); 
