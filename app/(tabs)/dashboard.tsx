import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Pressable } from 'react-native';
import { Text, useTheme, IconButton, Card } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { getTodayMeals } from '../../src/services/supabase';
import { useAuth } from '../../src/context/AuthContext';

type MealType = {
  name: string;
  calories: number;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
};

type DailyData = {
  macros: {
    carbs: { current: number; target: number };
    protein: { current: number; target: number };
    fat: { current: number; target: number };
  };
  meals: {
    [key: string]: MealType;
  };
  water: {
    current: number;
    target: number;
  };
  exercise: {
    goal: string;
  };
};

export default function DashboardScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { user } = useAuth();
  const [meals, setMeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dailyData, setDailyData] = useState<DailyData>({
    macros: {
      carbs: { current: 0, target: 250 },
      protein: { current: 0, target: 150 },
      fat: { current: 0, target: 70 }
    },
    meals: {
      breakfast: { name: 'Breakfast', calories: 500, icon: 'food-croissant' },
      lunch: { name: 'Lunch', calories: 700, icon: 'food' },
      dinner: { name: 'Dinner', calories: 600, icon: 'food-steak' },
      snacks: { name: 'Snacks', calories: 200, icon: 'food-apple' }
    },
    water: {
      current: 0,
      target: 8
    },
    exercise: {
      goal: '30 min cardio'
    }
  });

  useEffect(() => {
    if (user) {
    loadTodayMeals();
    }
  }, [user]);

  const loadTodayMeals = async () => {
    try {
      if (!user) return;
      
      const todayMeals = await getTodayMeals(user.id);
      setMeals(todayMeals);
      
      // Update macros based on actual meals
      const macros = todayMeals.reduce((acc: any, meal: any) => ({
        carbs: acc.carbs + (meal.carbs || 0),
        protein: acc.protein + (meal.protein || 0),
        fat: acc.fats + (meal.fats || 0)
      }), { carbs: 0, protein: 0, fat: 0 });

      setDailyData(prev => ({
        ...prev,
        macros: {
          carbs: { ...prev.macros.carbs, current: macros.carbs },
          protein: { ...prev.macros.protein, current: macros.protein },
          fat: { ...prev.macros.fat, current: macros.fat }
        }
      }));
    } catch (error) {
      console.error('Error loading meals:', error);
    } finally {
      setLoading(false);
    }
  };

  const navigateToAddMeal = (mealType: string) => {
    router.push(`/meals/add?type=${mealType}`);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineMedium">Today's Progress</Text>
        </View>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.cardTitle}>Macros</Text>
          <View style={styles.macroContainer}>
            {Object.entries(dailyData.macros).map(([key, value]) => (
              <View key={key} style={styles.macroItem}>
                <Text variant="bodyLarge">{key.charAt(0).toUpperCase() + key.slice(1)}</Text>
                <Text variant="headlineSmall">{value.current}g</Text>
                <Text variant="bodySmall">of {value.target}g</Text>
            </View>
            ))}
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.cardTitle}>Meals</Text>
          <View style={styles.mealsContainer}>
        {Object.entries(dailyData.meals).map(([key, meal]) => (
              <Pressable
                key={key}
                style={styles.mealItem}
                onPress={() => navigateToAddMeal(key)}
              >
              <MaterialCommunityIcons
                name={meal.icon}
                size={24}
                  color={theme.colors.primary}
                />
                <Text variant="bodyMedium">{meal.name}</Text>
                <Text variant="bodySmall">{meal.calories} kcal</Text>
              </Pressable>
            ))}
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.cardTitle}>Water</Text>
          <View style={styles.waterContainer}>
            <Text variant="headlineLarge">{dailyData.water.current}</Text>
            <Text variant="bodyMedium">of {dailyData.water.target} glasses</Text>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.cardTitle}>Exercise</Text>
          <Text variant="bodyLarge">{dailyData.exercise.goal}</Text>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
  },
  card: {
    margin: 16,
    marginTop: 0,
  },
  cardTitle: {
    marginBottom: 16,
  },
  macroContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  macroItem: {
    alignItems: 'center',
  },
  mealsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  mealItem: {
    width: '48%',
    alignItems: 'center',
    padding: 16,
    marginBottom: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  waterContainer: {
    alignItems: 'center',
  },
}); 