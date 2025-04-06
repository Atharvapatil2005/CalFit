import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, Card, ProgressBar, useTheme } from 'react-native-paper';
import { useRouter } from 'expo-router';

export default function DashboardScreen() {
  const theme = useTheme();
  const router = useRouter();

  // Mock data - replace with real data from Supabase
  const dailyProgress = {
    calories: {
      consumed: 1200,
      target: 2000,
    },
    protein: {
      consumed: 60,
      target: 150,
    },
    carbs: {
      consumed: 150,
      target: 250,
    },
    fats: {
      consumed: 40,
      target: 65,
    },
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge">Daily Progress</Text>
          <View style={styles.progressContainer}>
            <Text variant="bodyMedium">Calories</Text>
            <ProgressBar
              progress={dailyProgress.calories.consumed / dailyProgress.calories.target}
              color={theme.colors.primary}
              style={styles.progressBar}
            />
            <Text variant="bodySmall">
              {dailyProgress.calories.consumed} / {dailyProgress.calories.target} kcal
            </Text>
          </View>

          <View style={styles.progressContainer}>
            <Text variant="bodyMedium">Protein</Text>
            <ProgressBar
              progress={dailyProgress.protein.consumed / dailyProgress.protein.target}
              color={theme.colors.secondary}
              style={styles.progressBar}
            />
            <Text variant="bodySmall">
              {dailyProgress.protein.consumed}g / {dailyProgress.protein.target}g
            </Text>
          </View>

          <View style={styles.progressContainer}>
            <Text variant="bodyMedium">Carbs</Text>
            <ProgressBar
              progress={dailyProgress.carbs.consumed / dailyProgress.carbs.target}
              color={theme.colors.tertiary}
              style={styles.progressBar}
            />
            <Text variant="bodySmall">
              {dailyProgress.carbs.consumed}g / {dailyProgress.carbs.target}g
            </Text>
          </View>

          <View style={styles.progressContainer}>
            <Text variant="bodyMedium">Fats</Text>
            <ProgressBar
              progress={dailyProgress.fats.consumed / dailyProgress.fats.target}
              color={theme.colors.error}
              style={styles.progressBar}
            />
            <Text variant="bodySmall">
              {dailyProgress.fats.consumed}g / {dailyProgress.fats.target}g
            </Text>
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  progressContainer: {
    marginTop: 16,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginVertical: 8,
  },
}); 