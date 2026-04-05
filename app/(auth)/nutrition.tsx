import React, { useCallback } from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '../../src/constants/theme';
import {
  DietaryPreference,
  DietaryRestriction,
  useOnboarding,
} from '../../src/context/OnboardingContext';

type ChoiceChipProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
};

function ChoiceChip({ label, selected, onPress }: ChoiceChipProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        selected && styles.selectedChip,
        pressed && styles.pressedChip,
      ]}
    >
      <Text
        style={[
          styles.chipText,
          selected && styles.selectedChipText,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

export default function NutritionScreen() {
  const { state, updateState } = useOnboarding();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleNext = useCallback(() => {
    router.push('/(auth)/register');
  }, [router]);

  const toggleRestriction = useCallback((restriction: DietaryRestriction) => {
    const nextRestrictions = state.restrictions.includes(restriction)
      ? state.restrictions.filter((item) => item !== restriction)
      : [...state.restrictions, restriction];

    updateState({ restrictions: nextRestrictions });
  }, [state.restrictions, updateState]);

  const setPreference = useCallback((preference: DietaryPreference) => {
    updateState({ preference });
  }, [updateState]);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: 24 + insets.bottom },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
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
              <ChoiceChip
                label="No specific diet"
                selected={state.preference === 'none'}
                onPress={() => setPreference('none')}
              />
              <ChoiceChip
                label="Vegetarian"
                selected={state.preference === 'vegetarian'}
                onPress={() => setPreference('vegetarian')}
              />
              <ChoiceChip
                label="Vegan"
                selected={state.preference === 'vegan'}
                onPress={() => setPreference('vegan')}
              />
              <ChoiceChip
                label="Pescatarian"
                selected={state.preference === 'pescatarian'}
                onPress={() => setPreference('pescatarian')}
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Any food allergies or restrictions?
            </Text>
            <View style={styles.chipGroup}>
              <ChoiceChip
                label="Gluten-free"
                selected={state.restrictions.includes('gluten')}
                onPress={() => toggleRestriction('gluten')}
              />
              <ChoiceChip
                label="Dairy-free"
                selected={state.restrictions.includes('dairy')}
                onPress={() => toggleRestriction('dairy')}
              />
              <ChoiceChip
                label="Nut-free"
                selected={state.restrictions.includes('nuts')}
                onPress={() => toggleRestriction('nuts')}
              />
              <ChoiceChip
                label="Egg-free"
                selected={state.restrictions.includes('eggs')}
                onPress={() => toggleRestriction('eggs')}
              />
              <ChoiceChip
                label="Soy-free"
                selected={state.restrictions.includes('soy')}
                onPress={() => toggleRestriction('soy')}
              />
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
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: theme.colors.surfaceVariant,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  selectedChip: {
    backgroundColor: theme.colors.primary,
  },
  pressedChip: {
    opacity: 0.8,
  },
  chipText: {
    color: theme.colors.onSurfaceVariant,
    fontWeight: '500',
  },
  selectedChipText: {
    color: theme.colors.onPrimary,
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
