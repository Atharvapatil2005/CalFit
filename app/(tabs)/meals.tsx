import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Text, Button, Portal, Modal, TextInput, List, useTheme, IconButton, Surface } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { addMeal, getTodayMeals, deleteMeal, Meal } from '../../src/services/supabase';
import { searchFood, FoodItem } from '../../src/services/nutritionService';
import { useAuth } from '../../src/context/AuthContext';
import { useTheme as useAppTheme } from '../../src/theme/useTheme';

const safe = (v: any): number => {
  const num = Number(v);
  return isNaN(num) ? 0 : num;
};

export default function MealsScreen() {
  const paperTheme = useTheme();
  const theme = useAppTheme();
  const { user } = useAuth();
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<FoodItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('breakfast');
  const [manualFoodName, setManualFoodName] = useState('');
  const [manualCalories, setManualCalories] = useState('');
  const [manualProtein, setManualProtein] = useState('');
  const [manualCarbs, setManualCarbs] = useState('');
  const [manualFats, setManualFats] = useState('');
  const activeSearchTokenRef = useRef(0);

  useEffect(() => {
    let isMounted = true;

    if (user) {
      loadTodayMeals(isMounted);
    }
    return () => {
      isMounted = false;
    };
  }, [user]);

  const loadTodayMeals = async (isMounted = true) => {
    try {
      setLoading(true);
      setError('');
      const todayMeals = await getTodayMeals(user?.id ?? null);
      if (isMounted) {
        setMeals(todayMeals);
      }
    } catch (_error) {
      if (isMounted) {
        setError('Unable to load meals right now.');
      }
    } finally {
      if (isMounted) {
        setLoading(false);
      }
    }
  };

  const handleDeleteMeal = async (mealId: string) => {
    try {
      await deleteMeal(mealId);
      await loadTodayMeals();
    } catch (_error) {
      setError('Unable to delete that meal right now.');
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim() || isSearching) return;

    const searchToken = Date.now();
    activeSearchTokenRef.current = searchToken;

    setSearchResults([]);
    setError('');

    try {
      setIsSearching(true);
      const results = await searchFood(searchQuery);
      if (activeSearchTokenRef.current === searchToken) {
        if (results.length === 0) {
          setError('No foods found. Try a different search.');
        }
        setSearchResults(results);
      }
    } catch (error) {
      if (activeSearchTokenRef.current === searchToken) {
        setError(error instanceof Error ? error.message : 'Food search is unavailable right now.');
      }
    } finally {
      if (activeSearchTokenRef.current === searchToken) {
        setIsSearching(false);
      }
    }
  };

  const handleAddMeal = async (food: FoodItem) => {
    try {
      if (!user) throw new Error('No user found');
      const newMeal = {
        user_id: user.id,
        meal_type: selectedMealType,
        food_name: food.food_name,
        calories: food.calories,
        protein: food.protein,
        carbs: food.carbs,
        fats: food.fats,
        timestamp: new Date().toISOString(),
      };
      await addMeal(newMeal);
      await loadTodayMeals();
      resetMealModal();
    } catch (_error) {
      setError('Unable to save that meal right now.');
    }
  };

  const handleManualAddMeal = async () => {
    if (!user || !manualFoodName.trim()) {
      return;
    }

    try {
      setError('');
      await addMeal({
        user_id: user.id,
        meal_type: selectedMealType,
        food_name: manualFoodName.trim(),
        calories: Number(manualCalories) || 0,
        protein: Number(manualProtein) || 0,
        carbs: Number(manualCarbs) || 0,
        fats: Number(manualFats) || 0,
        timestamp: new Date().toISOString(),
      });
      await loadTodayMeals();
      resetMealModal();
    } catch (_error) {
      setError('Unable to save that meal right now.');
    }
  };

  const resetMealModal = () => {
    setIsModalVisible(false);
    setSearchQuery('');
    setSearchResults([]);
    setManualFoodName('');
    setManualCalories('');
    setManualProtein('');
    setManualCarbs('');
    setManualFats('');
  };

  const renderMealTypeButton = (
    type: 'breakfast' | 'lunch' | 'dinner' | 'snack',
    icon: keyof typeof MaterialCommunityIcons.glyphMap
  ) => (
    <Button
      mode={selectedMealType === type ? 'contained' : 'outlined'}
      onPress={() => setSelectedMealType(type)}
      style={styles.mealTypeButton}
      icon={({ size, color }) => (
        <MaterialCommunityIcons name={icon} size={size} color={color} />
      )}
    >
      {type.charAt(0).toUpperCase() + type.slice(1)}
    </Button>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={{ color: theme.text }}>Today's Meals</Text>
        <Button
          mode="contained"
          onPress={() => setIsModalVisible(true)}
          icon="plus"
        >
          Add Meal
        </Button>
      </View>

      {error ? <Text style={[styles.error, { color: paperTheme.colors.error }]}>{error}</Text> : null}

      {loading ? (
        <ActivityIndicator style={styles.loader} color={paperTheme.colors.primary} />
      ) : (
        <ScrollView style={styles.mealsList}>
          {meals.length === 0 ? (
            <View style={styles.emptyState}>
              <Text variant="titleMedium" style={{ color: theme.text }}>No meals logged yet</Text>
              <Text variant="bodyMedium" style={{ color: theme.subtext }}>Add your first meal to start tracking today's intake.</Text>
            </View>
          ) : null}
          {meals.map((meal) => (
            <Surface key={meal.id} style={[styles.mealItem, { backgroundColor: theme.card }]}>
              <View style={styles.mealContent}>
                <MaterialCommunityIcons
                  name={
                    meal.meal_type === 'breakfast' ? 'food-croissant' :
                    meal.meal_type === 'lunch' ? 'food' :
                    meal.meal_type === 'dinner' ? 'food-steak' :
                    'food-apple'
                  }
                  size={24}
                  color={paperTheme.colors.primary}
                />
                <View style={styles.mealTextContainer}>
                  <Text variant="bodyLarge" style={{ color: theme.text }}>{meal.food_name}</Text>
                  <Text variant="bodySmall" style={{ color: theme.subtext }}>
                    {safe(meal.calories)} kcal | P: {safe(meal.protein)}g | C: {safe(meal.carbs)}g | F: {safe(meal.fats)}g
                  </Text>
                </View>
                <IconButton
                  icon="delete"
                  iconColor={paperTheme.colors.error}
                  onPress={() => handleDeleteMeal(meal.id)}
                />
              </View>
            </Surface>
          ))}
        </ScrollView>
      )}

      <Portal>
        <Modal
          visible={isModalVisible}
          onDismiss={() => setIsModalVisible(false)}
          contentContainerStyle={[styles.modalContent, { backgroundColor: theme.card }]}
        >
          <Text variant="headlineSmall" style={[styles.modalTitle, { color: theme.text }]}>Add Meal</Text>
          <View style={styles.mealTypeContainer}>
            {renderMealTypeButton('breakfast', 'food-croissant')}
            {renderMealTypeButton('lunch', 'food')}
            {renderMealTypeButton('dinner', 'food-steak')}
            {renderMealTypeButton('snack', 'food-apple')}
          </View>
          <TextInput
            label="Search for food"
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={[styles.searchInput, { backgroundColor: theme.background }]}
            right={
              <TextInput.Icon
                icon="magnify"
                onPress={handleSearch}
              />
            }
          />
          {isSearching ? (
            <ActivityIndicator style={styles.loader} />
          ) : (
            <ScrollView style={styles.searchResults}>
              {searchResults.length === 0 && !error ? (
                <Text variant="bodyMedium" style={{ color: theme.subtext, textAlign: 'center', padding: 16 }}>
                  Search for foods above
                </Text>
              ) : null}
              {searchResults.map((food, index) => {
                console.log('[UI] RENDER FOOD ITEM:', food.food_name, 'cal:', food.calories);
                return (
                  <Surface key={`${food.food_name}-${index}`} style={[styles.searchResultItem, { backgroundColor: theme.background, borderColor: theme.border }]}>
                    <Text variant="bodyLarge" style={{ color: theme.text }} onPress={() => handleAddMeal(food)}>{food.food_name}</Text>
                    <Text variant="bodySmall" style={{ color: theme.subtext }}>
                      {safe(food.calories)} kcal | P: {safe(food.protein)}g | C: {safe(food.carbs)}g | F: {safe(food.fats)}g
                    </Text>
                  </Surface>
                );
              })}
            </ScrollView>
          )}
          <Text variant="titleMedium" style={[styles.manualSectionTitle, { color: theme.text }]}>Quick add manually</Text>
          <TextInput
            label="Food name"
            value={manualFoodName}
            onChangeText={setManualFoodName}
            style={[styles.searchInput, { backgroundColor: theme.background }]}
          />
          <View style={styles.macroRow}>
            <TextInput
              label="Calories"
              value={manualCalories}
              onChangeText={setManualCalories}
              keyboardType="numeric"
              style={[styles.macroInput, { backgroundColor: theme.background }]}
            />
            <TextInput
              label="Protein"
              value={manualProtein}
              onChangeText={setManualProtein}
              keyboardType="numeric"
              style={[styles.macroInput, { backgroundColor: theme.background }]}
            />
          </View>
          <View style={styles.macroRow}>
            <TextInput
              label="Carbs"
              value={manualCarbs}
              onChangeText={setManualCarbs}
              keyboardType="numeric"
              style={[styles.macroInput, { backgroundColor: theme.background }]}
            />
            <TextInput
              label="Fats"
              value={manualFats}
              onChangeText={setManualFats}
              keyboardType="numeric"
              style={[styles.macroInput, { backgroundColor: theme.background }]}
            />
          </View>
          <Button
            mode="contained"
            onPress={handleManualAddMeal}
            disabled={!manualFoodName.trim()}
          >
            Save Meal
          </Button>
        </Modal>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  mealsList: {
    flex: 1,
  },
  error: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  emptyState: {
    padding: 16,
    gap: 8,
  },
  loader: {
    marginTop: 32,
  },
  mealItem: {
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 8,
    padding: 8,
  },
  mealContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mealTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  modalContent: {
    padding: 20,
    margin: 20,
    borderRadius: 8,
    maxHeight: '80%',
  },
  modalTitle: {
    marginBottom: 16,
  },
  mealTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  mealTypeButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  searchInput: {
    marginBottom: 16,
  },
  searchResults: {
    maxHeight: 300,
  },
  searchResultItem: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 8,
  },
  manualSectionTitle: {
    marginTop: 16,
    marginBottom: 12,
  },
  macroRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  macroInput: {
    flex: 1,
  },
});
