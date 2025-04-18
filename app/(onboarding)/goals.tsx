import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { useRouter } from 'expo-router';

export default function GoalsScreen() {
  const router = useRouter();

  const handleNext = () => {
    router.push('/(onboarding)/nutrition');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.subtitle}>Created by expert nutritionists</Text>
      
      <Text style={styles.title}>Supporting you at{'\n'}every stage</Text>
      
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Daily intake</Text>
        <View style={styles.progressContainer}>
          <Text style={styles.macroLabel}>Carbs</Text>
          <View style={[styles.progressBar, { width: '100%', backgroundColor: '#4CAF50' }]} />
        </View>
        <View style={styles.progressContainer}>
          <Text style={styles.macroLabel}>Fat</Text>
          <View style={[styles.progressBar, { width: '80%', backgroundColor: '#4CAF50' }]} />
        </View>
        <View style={styles.progressContainer}>
          <Text style={styles.macroLabel}>Protein</Text>
          <View style={[styles.progressBar, { width: '60%', backgroundColor: '#8D6E63' }]} />
        </View>
      </View>

      <View style={[styles.card, { height: 200 }]} />

      <Text style={styles.programTitle}>Personalized nutrition{'\n'}program</Text>

      <Text style={styles.description}>
        Transform your relationship with food, guilt-free
      </Text>

      <Button
        mode="contained"
        style={styles.button}
        contentStyle={styles.buttonContent}
        onPress={handleNext}
      >
        NEXT
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 24,
    paddingTop: 60,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 32,
    lineHeight: 40,
  },
  card: {
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  cardTitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 16,
  },
  progressContainer: {
    marginBottom: 16,
  },
  macroLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  programTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 16,
    lineHeight: 40,
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
  },
  button: {
    borderRadius: 8,
  },
  buttonContent: {
    height: 56,
  },
}); 