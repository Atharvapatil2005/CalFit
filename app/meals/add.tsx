import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, useTheme, Searchbar } from 'react-native-paper';
import { Stack, useLocalSearchParams } from 'expo-router';

export default function AddMealScreen() {
  const theme = useTheme();
  const { type } = useLocalSearchParams();
  const [searchQuery, setSearchQuery] = React.useState('');

  const getMealTitle = (mealType: string) => {
    switch (mealType) {
      case 'breakfast':
        return 'Add Breakfast';
      case 'lunch':
        return 'Add Lunch';
      case 'dinner':
        return 'Add Dinner';
      case 'snack':
        return 'Add Snack';
      default:
        return 'Add Meal';
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: getMealTitle(type as string),
          headerStyle: {
            backgroundColor: theme.colors.primary,
          },
          headerTintColor: '#fff',
        }}
      />
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <Searchbar
            placeholder="Search for food"
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={styles.searchBar}
            iconColor={theme.colors.primary}
            inputStyle={styles.searchInput}
            placeholderTextColor="#757575"
          />
        </View>
        <ScrollView style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent</Text>
            {/* Add recent meals list here */}
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Common Foods</Text>
            {/* Add common foods list here */}
          </View>
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  searchContainer: {
    padding: 16,
    backgroundColor: '#1E1E1E',
  },
  searchBar: {
    backgroundColor: '#2C2C2C',
    elevation: 0,
  },
  searchInput: {
    color: 'white',
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
}); 