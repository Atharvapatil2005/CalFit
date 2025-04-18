import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button, Chip } from 'react-native-paper';
import { router } from 'expo-router';
import { theme } from '../../src/constants/theme';

type DietaryPreference = 'none' | 'vegetarian' | 'vegan' | 'pescatarian';
type DietaryRestriction = 'gluten' | 'dairy' | 'nuts' | 'eggs' | 'soy';

export default function NutritionScreen() {
  const [preference, setPreference] = useState<DietaryPreference>('none');
  const [restrictions, setRestrictions] = useState<DietaryRestriction[]>([]);

  const handleNext = () => {
    // Here we would typically save all the onboarding data to the user's profile
    router.replace('/(tabs)/dashboard');
  };

  const toggleRestriction = (restriction: DietaryRestriction) => {
    setRestrictions(prev => 
      prev.includes(restriction)
        ? prev.filter(r => r !== restriction)
        : [...prev, restriction]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
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
            selected={preference === 'none'}
            onPress={() => setPreference('none')}
            style={styles.chip}
          >
            No specific diet
          </Chip>
          <Chip
            selected={preference === 'vegetarian'}
            onPress={() => setPreference('vegetarian')}
            style={styles.chip}
          >
            Vegetarian
          </Chip>
          <Chip
            selected={preference === 'vegan'}
            onPress={() => setPreference('vegan')}
            style={styles.chip}
          >
            Vegan
          </Chip>
          <Chip
            selected={preference === 'pescatarian'}
            onPress={() => setPreference('pescatarian')}
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
            selected={restrictions.includes('gluten')}
            onPress={() => toggleRestriction('gluten')}
            style={styles.chip}
          >
            Gluten-free
          </Chip>
          <Chip
            selected={restrictions.includes('dairy')}
            onPress={() => toggleRestriction('dairy')}
            style={styles.chip}
          >
            Dairy-free
          </Chip>
          <Chip
            selected={restrictions.includes('nuts')}
            onPress={() => toggleRestriction('nuts')}
            style={styles.chip}
          >
            Nut-free
          </Chip>
          <Chip
            selected={restrictions.includes('eggs')}
            onPress={() => toggleRestriction('eggs')}
            style={styles.chip}
          >
            Egg-free
          </Chip>
          <Chip
            selected={restrictions.includes('soy')}
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: 24,
    flexGrow: 1,
  },
  header: {
    marginTop: 40,
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