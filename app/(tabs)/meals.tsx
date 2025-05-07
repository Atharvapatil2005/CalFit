import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Text, Button, Portal, Modal, TextInput, List, Divider, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { addMeal, getTodayMeals, Meal } from '../../src/services/supabase';
import { searchFood, FoodItem } from '../../src/services/nutritionService';
import { useAuth } from '../../src/context/AuthContext';

export default function MealsScreen() {
  const theme = useTheme();
  const { user } = useAuth();
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<FoodItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('breakfast');

  useEffect(() => {
    if (user) {
    loadTodayMeals();
    }
  }, [user]);

  const loadTodayMeals = async () => {
    try {
      setLoading(true);
      if (!user) throw new Error('No user found');
      
      const todayMeals = await getTodayMeals(user.id);
      setMeals(todayMeals);
    } catch (error) {
      console.error('Error loading meals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    try {
      setIsSearching(true);
      const results = await searchFood(searchQuery);
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching food:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddMeal = async (food: FoodItem) => {
    try {
      if (!user) throw new Error('No user found');

      const newMeal = {
        meal_type: selectedMealType,
        food_name: food.food_name,
        calories: food.calories,
        protein: food.protein,
        carbs: food.carbs,
        fats: food.fats,
        timestamp: new Date().toISOString(),
      };

      console.log('Logging meal (no user_id):', newMeal);
      await addMeal(newMeal);
      await loadTodayMeals();
      setIsModalVisible(false);
      setSearchQuery('');
      setSearchResults([]);
    } catch (error) {
      console.error('Error adding meal:', error);
    }
  };

  const renderMealTypeButton = (type: 'breakfast' | 'lunch' | 'dinner' | 'snack', icon: string) => (
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
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineMedium">Today's Meals</Text>
        <Button
          mode="contained"
          onPress={() => setIsModalVisible(true)}
          icon="plus"
        >
          Add Meal
        </Button>
      </View>

      {loading ? (
        <ActivityIndicator style={styles.loader} />
      ) : (
        <ScrollView style={styles.mealsList}>
          {meals.map((meal) => (
            <List.Item
              key={meal.id}
              title={meal.food_name}
              description={`${meal.calories} kcal | P: ${meal.protein}g | C: ${meal.carbs}g | F: ${meal.fats}g`}
              left={props => (
                <MaterialCommunityIcons
                  {...props}
                  name={
                    meal.meal_type === 'breakfast' ? 'food-croissant' :
                    meal.meal_type === 'lunch' ? 'food' :
                    meal.meal_type === 'dinner' ? 'food-steak' :
                    'food-apple'
                  }
                  size={24}
                  color={theme.colors.primary}
                />
              )}
            />
          ))}
        </ScrollView>
      )}

      <Portal>
        <Modal
          visible={isModalVisible}
          onDismiss={() => setIsModalVisible(false)}
          contentContainerStyle={styles.modalContent}
        >
          <Text variant="headlineSmall" style={styles.modalTitle}>Add Meal</Text>
          
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
            style={styles.searchInput}
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
              {searchResults.map((food) => (
                  <List.Item
                  key={food.food_name}
                    title={food.food_name}
                    description={`${food.calories} kcal | P: ${food.protein}g | C: ${food.carbs}g | F: ${food.fats}g`}
                    onPress={() => handleAddMeal(food)}
                  />
              ))}
            </ScrollView>
          )}
        </Modal>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
  loader: {
    marginTop: 32,
  },
  modalContent: {
    backgroundColor: 'white',
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
}); 