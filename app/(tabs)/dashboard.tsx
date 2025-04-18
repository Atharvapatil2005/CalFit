import React from 'react';
import { View, ScrollView, StyleSheet, Pressable } from 'react-native';
import { Text, useTheme, IconButton } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

type MealType = {
  name: string;
  calories: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
};

export default function DashboardScreen() {
  const theme = useTheme();
  const router = useRouter();

  // Mock data - replace with real data later
  const dailyData = {
    calories: {
      total: 2086,
      eaten: 0,
      burned: 0,
    },
    macros: {
      carbs: { current: 0, target: 261 },
      protein: { current: 0, target: 104 },
      fat: { current: 0, target: 70 },
    },
    meals: {
      breakfast: { name: 'Breakfast', calories: '521-730', icon: 'coffee' as const },
      lunch: { name: 'Lunch', calories: '626-834', icon: 'silverware-fork-knife' as const },
      dinner: { name: 'Dinner', calories: '813-1064', icon: 'food-variant' as const },
      snack: { name: 'Snack', calories: '125', icon: 'food-apple' as const },
    },
    water: {
      current: 0,
      target: 8,
    },
    exercise: {
      goal: '30 min',
    },
  };

  const handleMealPress = (mealType: string) => {
    router.push(`/meals/add?type=${mealType}`);
  };

  const handleExercisePress = () => {
    router.push('/exercise');
  };

  const handleFastingPress = () => {
    router.push('/fasting');
  };

  return (
    <ScrollView style={styles.container} bounces={false}>
      <LinearGradient
        colors={['#4CAF50', '#8BC34A']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={styles.logo}>CalFit</Text>
          <View style={styles.headerIcons}>
            <IconButton icon="account" iconColor="white" onPress={() => router.push('/profile')} />
            <IconButton icon="bell" iconColor="white" onPress={() => {}} />
          </View>
        </View>

        <View style={styles.calorieCircle}>
          <Text style={styles.calorieNumber}>{dailyData.calories.total}</Text>
          <Text style={styles.calorieLabel}>KCAL LEFT</Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>{dailyData.calories.eaten}</Text>
            <Text style={styles.statLabel}>EATEN</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>{dailyData.calories.burned}</Text>
            <Text style={styles.statLabel}>BURNED</Text>
          </View>
        </View>

        <Pressable style={styles.seeStats}>
          <Text style={styles.seeStatsText}>SEE STATS</Text>
          <MaterialCommunityIcons name="chevron-down" size={24} color="white" />
        </Pressable>
      </LinearGradient>

      <View style={styles.macrosCard}>
        <View style={styles.macroItem}>
          <Text style={styles.macroTitle}>Carbs</Text>
          <Text style={styles.macroValue}>
            {dailyData.macros.carbs.current}/{dailyData.macros.carbs.target}g
          </Text>
        </View>
        <View style={styles.macroItem}>
          <Text style={styles.macroTitle}>Protein</Text>
          <Text style={styles.macroValue}>
            {dailyData.macros.protein.current}/{dailyData.macros.protein.target}g
          </Text>
        </View>
        <View style={styles.macroItem}>
          <Text style={styles.macroTitle}>Fat</Text>
          <Text style={styles.macroValue}>
            {dailyData.macros.fat.current}/{dailyData.macros.fat.target}g
          </Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.dateSelector}>
          <IconButton icon="chevron-left" />
          <Text style={styles.dateText}>TODAY, 16 APR</Text>
          <IconButton icon="chevron-right" />
        </View>

        {Object.entries(dailyData.meals).map(([key, meal]) => (
          <Pressable key={key} style={styles.mealCard} onPress={() => handleMealPress(key)}>
            <View style={styles.mealInfo}>
              <MaterialCommunityIcons
                name={meal.icon}
                size={24}
                color={theme.colors.primary}
              />
              <View style={styles.mealTexts}>
                <Text style={styles.mealTitle}>{meal.name}</Text>
                <Text style={styles.mealCalories}>Recommended: {meal.calories} kcal</Text>
              </View>
            </View>
            <IconButton icon="plus" size={24} onPress={() => handleMealPress(key)} />
          </Pressable>
        ))}

        <View style={styles.waterCard}>
          <View style={styles.waterHeader}>
            <Text style={styles.waterTitle}>Water ({dailyData.water.current} L)</Text>
            <IconButton icon="dots-horizontal" size={20} onPress={() => {}} />
          </View>
          <View style={styles.waterGlasses}>
            {Array(dailyData.water.target).fill(0).map((_, i) => (
              <Pressable key={i} style={styles.waterGlass}>
                <MaterialCommunityIcons
                  name="plus"
                  size={20}
                  color={theme.colors.primary}
                />
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.fastingCard}>
          <View style={styles.fastingIcon}>
            <MaterialCommunityIcons name="clock-outline" size={40} color={theme.colors.primary} />
          </View>
          <Text style={styles.fastingTitle}>Want to start{'\n'}Intermittent Fasting?</Text>
          <Text style={styles.fastingDescription}>
            Choose a fasting interval that fits your lifestyle to manage your weight,
            feel more energized, and even put an end to late-night snacking.
          </Text>
          <Pressable 
            style={[styles.exploreButton, { backgroundColor: theme.colors.primary }]} 
            onPress={handleFastingPress}
          >
            <Text style={styles.exploreButtonText}>EXPLORE NOW</Text>
          </Pressable>
        </View>

        <View style={styles.exerciseCard}>
          <View style={styles.exerciseInfo}>
            <MaterialCommunityIcons name="run" size={24} color={theme.colors.primary} />
            <View style={styles.exerciseTexts}>
              <Text style={styles.exerciseTitle}>Exercise</Text>
              <Text style={styles.exerciseGoal}>Daily Goal: {dailyData.exercise.goal}</Text>
            </View>
          </View>
          <IconButton icon="plus" size={24} onPress={handleExercisePress} />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    padding: 16,
    paddingTop: 48,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  logo: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerIcons: {
    flexDirection: 'row',
  },
  calorieCircle: {
    alignItems: 'center',
    marginBottom: 24,
  },
  calorieNumber: {
    color: 'white',
    fontSize: 48,
    fontWeight: 'bold',
  },
  calorieLabel: {
    color: 'white',
    fontSize: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  stat: {
    alignItems: 'center',
  },
  statNumber: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    color: 'white',
    fontSize: 14,
  },
  seeStats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  seeStatsText: {
    color: 'white',
    marginRight: 8,
  },
  macrosCard: {
    backgroundColor: '#1E1E1E',
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    marginTop: -20,
    marginHorizontal: 16,
    borderRadius: 12,
  },
  macroItem: {
    alignItems: 'center',
  },
  macroTitle: {
    color: 'white',
    marginBottom: 4,
  },
  macroValue: {
    color: '#757575',
  },
  content: {
    padding: 16,
  },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  dateText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  mealCard: {
    backgroundColor: '#1E1E1E',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  mealInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mealTexts: {
    marginLeft: 16,
  },
  mealTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  mealCalories: {
    color: '#757575',
    fontSize: 14,
  },
  waterCard: {
    backgroundColor: '#1E1E1E',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  waterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  waterTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  waterGlasses: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  waterGlass: {
    width: 40,
    height: 40,
    backgroundColor: '#2C2C2C',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fastingCard: {
    backgroundColor: '#1E1E1E',
    padding: 24,
    borderRadius: 12,
    marginBottom: 12,
  },
  fastingIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  fastingTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  fastingDescription: {
    color: '#757575',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  exploreButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    alignItems: 'center',
  },
  exploreButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  exerciseCard: {
    backgroundColor: '#1E1E1E',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  exerciseInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  exerciseTexts: {
    marginLeft: 16,
  },
  exerciseTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  exerciseGoal: {
    color: '#757575',
    fontSize: 14,
  },
}); 