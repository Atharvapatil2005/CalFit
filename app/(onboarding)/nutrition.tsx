import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { useRouter } from 'expo-router';

export default function NutritionScreen() {
  const router = useRouter();

  const handleNext = () => {
    router.push('/(auth)/onboarding');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Let's personalize{'\n'}your nutrition plan</Text>
      
      <View style={styles.card}>
        <Text style={styles.cardTitle}>What we'll cover:</Text>
        <View style={styles.bulletPoint}>
          <View style={styles.bullet} />
          <Text style={styles.bulletText}>Daily calorie and macro targets</Text>
        </View>
        <View style={styles.bulletPoint}>
          <View style={styles.bullet} />
          <Text style={styles.bulletText}>Meal timing and portion control</Text>
        </View>
        <View style={styles.bulletPoint}>
          <View style={styles.bullet} />
          <Text style={styles.bulletText}>Food recommendations based on your goals</Text>
        </View>
        <View style={styles.bulletPoint}>
          <View style={styles.bullet} />
          <Text style={styles.bulletText}>Progress tracking and adjustments</Text>
        </View>
      </View>

      <Text style={styles.description}>
        We'll create a personalized plan that fits your lifestyle and helps you reach your goals sustainably.
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
    marginBottom: 32,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  bulletPoint: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  bullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
    marginRight: 12,
  },
  bulletText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
    lineHeight: 24,
  },
  button: {
    borderRadius: 8,
  },
  buttonContent: {
    height: 56,
  },
}); 
