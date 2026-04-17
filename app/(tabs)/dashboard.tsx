import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Pressable } from 'react-native';
import { Text, useTheme, Card } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { calculateMacroTargets } from '../../src/lib/macroCalculator';
import { getProfile, getTodayMeals, Meal } from '../../src/services/supabase';
import { useAuth } from '../../src/context/AuthContext';
import { useTheme as useAppTheme } from '../../src/theme/useTheme';

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
  const paperTheme = useTheme();
  const theme = useAppTheme();
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<{ target_calories?: number | null } | null>(null);
  const [targetCalories, setTargetCalories] = useState<number | null>(null);
  const [dailyData, setDailyData] = useState<DailyData>({
    macros: {
      carbs: { current: 0, target: 0 },
      protein: { current: 0, target: 0 },
      fat: { current: 0, target: 0 }
    },
    meals: {
      breakfast: { name: 'Breakfast', calories: 0, icon: 'food-croissant' },
      lunch: { name: 'Lunch', calories: 0, icon: 'food' },
      dinner: { name: 'Dinner', calories: 0, icon: 'food-steak' },
      snack: { name: 'Snack', calories: 0, icon: 'food-apple' }
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
    console.log('Profile:', profile);
    console.log('Calories:', profile?.target_calories);

    if (!profile?.target_calories) {
      return;
    }

    const macroTargets = calculateMacroTargets(profile.target_calories);
    console.log('Macro Targets:', macroTargets);

    setDailyData(prev => ({
      ...prev,
      macros: {
        carbs: { ...prev.macros.carbs, target: macroTargets.carbs },
        protein: { ...prev.macros.protein, target: macroTargets.protein },
        fat: { ...prev.macros.fat, target: macroTargets.fat },
      },
    }));
  }, [profile?.target_calories]);

  useEffect(() => {
    let isMounted = true;

    if (user) {
      loadDashboardData(isMounted);
    } else {
      setLoading(false);
    }
    return () => {
      isMounted = false;
    };
  }, [user]);

  const loadDashboardData = async (isMounted = true) => {
    try {
      if (!user) return;

      const [todayMeals, nextProfile] = await Promise.all([
        getTodayMeals(user.id),
        getProfile(user.id),
      ]);

      if (!isMounted) {
        return;
      }

      setProfile(nextProfile);
      setTargetCalories(nextProfile?.target_calories ?? null);

      const mealTotals = todayMeals.reduce<Record<string, number>>((acc, meal: Meal) => {
        acc[meal.meal_type] = (acc[meal.meal_type] ?? 0) + meal.calories;
        return acc;
      }, {});
      
      const macros = todayMeals.reduce((acc, meal: Meal) => ({
        carbs: acc.carbs + (meal.carbs || 0),
        protein: acc.protein + (meal.protein || 0),
        fat: acc.fat + (meal.fats || 0)
      }), { carbs: 0, protein: 0, fat: 0 });

      setDailyData(prev => ({
        ...prev,
        macros: {
          carbs: {
            current: macros.carbs,
            target: prev.macros.carbs.target,
          },
          protein: {
            current: macros.protein,
            target: prev.macros.protein.target,
          },
          fat: {
            current: macros.fat,
            target: prev.macros.fat.target,
          }
        },
        meals: {
          breakfast: { ...prev.meals.breakfast, calories: mealTotals.breakfast ?? 0 },
          lunch: { ...prev.meals.lunch, calories: mealTotals.lunch ?? 0 },
          dinner: { ...prev.meals.dinner, calories: mealTotals.dinner ?? 0 },
          snack: { ...prev.meals.snack, calories: mealTotals.snack ?? 0 }
        }
      }));
    } catch (_error) {
      if (!isMounted) {
        return;
      }

      setDailyData(prev => ({
        ...prev,
        macros: {
          carbs: {
            current: 0,
            target: prev.macros.carbs.target,
          },
          protein: {
            current: 0,
            target: prev.macros.protein.target,
          },
          fat: {
            current: 0,
            target: prev.macros.fat.target,
          }
        }
      }));
    } finally {
      if (isMounted) {
        setLoading(false);
      }
    }
  };

  const navigateToAddMeal = (mealType: string) => {
    router.push(`/meals/add?type=${mealType}`);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={{ color: theme.text }}>Today's Progress</Text>
        {targetCalories ? (
          <Text variant="bodyMedium" style={{ color: theme.subtext }}>Daily calorie target: {targetCalories} kcal</Text>
        ) : null}
        {loading ? <Text variant="bodyMedium" style={{ color: theme.subtext }}>Refreshing...</Text> : null}
      </View>

      <Card style={[styles.card, { backgroundColor: theme.card }]}>
        <Card.Content>
          <Text variant="titleMedium" style={[styles.cardTitle, { color: theme.text }]}>Macros</Text>
          <View style={styles.macroContainer}>
            {Object.entries(dailyData.macros).map(([key, value]) => (
              <View key={key} style={styles.macroItem}>
                <Text variant="bodyLarge" style={{ color: theme.text }}>{key.charAt(0).toUpperCase() + key.slice(1)}</Text>
                <Text variant="headlineSmall" style={{ color: theme.text }}>{value.current}g</Text>
                <Text variant="bodySmall" style={{ color: theme.subtext }}>of {value.target}g</Text>
            </View>
            ))}
          </View>
        </Card.Content>
      </Card>

      <Card style={[styles.card, { backgroundColor: theme.card }]}>
        <Card.Content>
          <Text variant="titleMedium" style={[styles.cardTitle, { color: theme.text }]}>Meals</Text>
          <View style={styles.mealsContainer}>
        {Object.entries(dailyData.meals).map(([key, meal]) => (
              <Pressable
                key={key}
                style={[styles.mealItem, { backgroundColor: theme.background, borderColor: theme.border }]}
                onPress={() => navigateToAddMeal(key)}
              >
                <MaterialCommunityIcons
                  name={meal.icon}
                  size={24}
                  color={paperTheme.colors.primary}
                />
                <Text variant="bodyMedium" style={{ color: theme.text }}>{meal.name}</Text>
                <Text variant="bodySmall" style={{ color: theme.subtext }}>{meal.calories} kcal</Text>
              </Pressable>
            ))}
          </View>
        </Card.Content>
      </Card>

      <Card style={[styles.card, { backgroundColor: theme.card }]}>
        <Card.Content>
          <Text variant="titleMedium" style={[styles.cardTitle, { color: theme.text }]}>Water</Text>
          <View style={styles.waterContainer}>
            <Text variant="headlineLarge" style={{ color: theme.text }}>{dailyData.water.current}</Text>
            <Text variant="bodyMedium" style={{ color: theme.subtext }}>of {dailyData.water.target} glasses</Text>
          </View>
        </Card.Content>
      </Card>

      <Card style={[styles.card, { backgroundColor: theme.card }]}>
        <Card.Content>
          <Text variant="titleMedium" style={[styles.cardTitle, { color: theme.text }]}>Exercise</Text>
          <Text variant="bodyLarge" style={{ color: theme.text }}>{dailyData.exercise.goal}</Text>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    borderRadius: 8,
    borderWidth: 1,
  },
  waterContainer: {
    alignItems: 'center',
  },
}); 
