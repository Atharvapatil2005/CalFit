import React from 'react';
import { View, StyleSheet, ScrollView, useColorScheme } from 'react-native';
import { Text, useTheme, Searchbar } from 'react-native-paper';
import { Stack, useLocalSearchParams } from 'expo-router';

export default function AddMealScreen() {
  const theme = useTheme();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = {
    background: isDark ? '#121212' : '#ffffff',
    text: isDark ? '#ffffff' : '#000000',
    inputBg: isDark ? '#1e1e1e' : '#f5f5f5',
    border: isDark ? '#333333' : '#dddddd',
    placeholder: isDark ? '#888888' : '#999999',
  };
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
          headerTintColor: colors.text,
        }}
      />
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.searchContainer, { backgroundColor: colors.inputBg, borderBottomColor: colors.border }]}>
          <Searchbar
            placeholder="Search for food"
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={[styles.searchBar, { backgroundColor: colors.inputBg, borderColor: colors.border }]}
            iconColor={theme.colors.primary}
            inputStyle={[styles.searchInput, { color: colors.text }]}
            placeholderTextColor={colors.placeholder}
          />
        </View>
        <ScrollView style={styles.content}>
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent</Text>
            {/* Add recent meals list here */}
          </View>
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Common Foods</Text>
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
  },
  searchContainer: {
    padding: 16,
    borderBottomWidth: 1,
  },
  searchBar: {
    elevation: 0,
    borderWidth: 1,
  },
  searchInput: {
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
}); 
