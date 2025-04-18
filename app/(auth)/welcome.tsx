import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { router } from 'expo-router';
import { theme } from '../../src/constants/theme';

export default function WelcomeScreen() {
  const handleNext = () => {
    router.push('/(tabs)');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Text variant="labelLarge" style={styles.createdBy}>
            Created by expert nutritionists
          </Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text variant="displaySmall" style={styles.title}>
          Supporting you at every stage
        </Text>

        <View style={styles.card}>
          <Text variant="titleMedium" style={styles.cardTitle}>
            Daily intake
          </Text>
          <View style={styles.macros}>
            <View style={styles.macroItem}>
              <View style={[styles.macroBar, { width: '80%', backgroundColor: theme.colors.primary }]} />
              <Text style={styles.macroLabel}>Carbs</Text>
            </View>
            <View style={styles.macroItem}>
              <View style={[styles.macroBar, { width: '60%', backgroundColor: theme.colors.secondary }]} />
              <Text style={styles.macroLabel}>Fat</Text>
            </View>
            <View style={styles.macroItem}>
              <View style={[styles.macroBar, { width: '40%', backgroundColor: theme.colors.tertiary }]} />
              <Text style={styles.macroLabel}>Protein</Text>
            </View>
          </View>
        </View>

        <View style={styles.imagePlaceholder} />

        <Text variant="headlineMedium" style={styles.subtitle}>
          Personalized nutrition program
        </Text>
        <Text variant="bodyLarge" style={styles.description}>
          Take control of your health with a science-backed plan designed just for you. Transform your relationship with food, guilt-free. Your path to a healthier you begins here.
        </Text>
      </View>

      <View style={styles.footer}>
        <Button
          mode="contained"
          onPress={handleNext}
          style={styles.button}
          contentStyle={styles.buttonContent}
        >
          NEXT
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
  header: {
    padding: 24,
    paddingTop: 48,
  },
  logoContainer: {
    alignItems: 'center',
  },
  createdBy: {
    color: theme.colors.onBackground,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  title: {
    color: theme.colors.onBackground,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  card: {
    backgroundColor: theme.colors.surfaceVariant,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  cardTitle: {
    color: theme.colors.onSurfaceVariant,
    marginBottom: 16,
  },
  macros: {
    gap: 12,
  },
  macroItem: {
    gap: 4,
  },
  macroBar: {
    height: 8,
    borderRadius: 4,
  },
  macroLabel: {
    color: theme.colors.onSurfaceVariant,
    fontSize: 12,
  },
  imagePlaceholder: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    marginBottom: 24,
    backgroundColor: theme.colors.surfaceVariant,
  },
  subtitle: {
    color: theme.colors.onBackground,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    color: theme.colors.onSurfaceVariant,
    lineHeight: 24,
  },
  footer: {
    padding: 24,
  },
  button: {
    borderRadius: 8,
  },
  buttonContent: {
    height: 56,
  },
}); 