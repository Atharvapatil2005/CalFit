import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button, Chip } from 'react-native-paper';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../../src/constants/theme';
import {
  DietaryPreference,
  DietaryRestriction,
  useOnboarding,
} from '../../src/context/OnboardingContext';

export default function NutritionScreen() {
  const { state, updateState } = useOnboarding();

  const handleNext = () => {
    router.replace('/(auth)/register');
  };

  const toggleRestriction = (restriction: DietaryRestriction) => {
    const nextRestrictions = state.restrictions.includes(restriction)
      ? state.restrictions.filter((item) => item !== restriction)
      : [...state.restrictions, restriction];

    updateState({ restrictions: nextRestrictions });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.inner}>
          <View style={styles.header}>
            <Text variant="headlineMedium" style={styles.title}>
              Dietary preferences
            </Text>
            <Text variant="titleLarge" style={styles.subtitle}>
              Help us personalize your meal plans
            </Text>
          </View>

          <View style={styles.section}>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Do you follow any specific diet?
            </Text>
            <View style={styles.chipGroup}>
              <Chip
                selected={state.preference === 'none'}
                onPress={() => updateState({ preference: 'none' })}
                style={styles.chip}
              >
                No specific diet
              </Chip>
              <Chip
                selected={state.preference === 'vegetarian'}
                onPress={() => updateState({ preference: 'vegetarian' })}
                style={styles.chip}
              >
                Vegetarian
              </Chip>
              <Chip
                selected={state.preference === 'vegan'}
                onPress={() => updateState({ preference: 'vegan' })}
                style={styles.chip}
              >
                Vegan
              </Chip>
              <Chip
                selected={state.preference === 'pescatarian'}
                onPress={() => updateState({ preference: 'pescatarian' })}
                style={styles.chip}
              >
                Pescatarian
              </Chip>
            </View>
          </View>

          <View style={styles.section}>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Any food allergies or restrictions?
            </Text>
            <View style={styles.chipGroup}>
              <Chip
                selected={state.restrictions.includes('gluten')}
                onPress={() => toggleRestriction('gluten')}
                style={styles.chip}
              >
                Gluten-free
              </Chip>
              <Chip
                selected={state.restrictions.includes('dairy')}
                onPress={() => toggleRestriction('dairy')}
                style={styles.chip}
              >
                Dairy-free
              </Chip>
              <Chip
                selected={state.restrictions.includes('nuts')}
                onPress={() => toggleRestriction('nuts')}
                style={styles.chip}
              >
                Nut-free
              </Chip>
              <Chip
                selected={state.restrictions.includes('eggs')}
                onPress={() => toggleRestriction('eggs')}
                style={styles.chip}
              >
                Egg-free
              </Chip>
              <Chip
                selected={state.restrictions.includes('soy')}
                onPress={() => toggleRestriction('soy')}
                style={styles.chip}
              >
                Soy-free
              </Chip>
            </View>
          </View>

          <View style={styles.footer}>
            <Button
              mode="text"
              onPress={() => {}}
              style={styles.infoButton}
            >
              I'll set this up later
            </Button>
            <Button
              mode="contained"
              onPress={handleNext}
              style={styles.button}
              contentStyle={styles.buttonContent}
            >
              GET STARTED
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
  content: {
    flexGrow: 1,
    padding: 24,
  },
  inner: {
    width: '100%',
    maxWidth: 680,
    alignSelf: 'center',
    flexGrow: 1,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    color: theme.colors.onBackground,
    marginBottom: 8,
  },
  subtitle: {
    color: theme.colors.onBackground,
    fontWeight: '600',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    color: theme.colors.onBackground,
    marginBottom: 16,
  },
  chipGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    marginBottom: 8,
  },
  footer: {
    marginTop: 'auto',
    gap: 16,
    paddingTop: 24,
  },
  infoButton: {
    alignSelf: 'center',
  },
  button: {
    borderRadius: 8,
  },
  buttonContent: {
    height: 56,
  },
}); 
