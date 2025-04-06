import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, Card, Button, FAB, Portal, Modal, TextInput } from 'react-native-paper';
import { useTheme } from 'react-native-paper';

type Meal = {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  time: string;
};

export default function MealsScreen() {
  const theme = useTheme();
  const [visible, setVisible] = useState(false);
  const [meals, setMeals] = useState<Meal[]>([
    {
      id: '1',
      name: 'Breakfast',
      calories: 450,
      protein: 25,
      carbs: 45,
      fats: 15,
      time: '08:00',
    },
    {
      id: '2',
      name: 'Lunch',
      calories: 650,
      protein: 35,
      carbs: 65,
      fats: 25,
      time: '12:30',
    },
  ]);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  return (
    <View style={styles.container}>
      <ScrollView>
        {meals.map((meal) => (
          <Card key={meal.id} style={styles.card}>
            <Card.Content>
              <View style={styles.mealHeader}>
                <Text variant="titleMedium">{meal.name}</Text>
                <Text variant="bodyMedium">{meal.time}</Text>
              </View>
              <View style={styles.macros}>
                <Text variant="bodyMedium">Calories: {meal.calories} kcal</Text>
                <Text variant="bodyMedium">Protein: {meal.protein}g</Text>
                <Text variant="bodyMedium">Carbs: {meal.carbs}g</Text>
                <Text variant="bodyMedium">Fats: {meal.fats}g</Text>
              </View>
            </Card.Content>
          </Card>
        ))}
      </ScrollView>

      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={styles.modal}
        >
          <Text variant="titleLarge" style={styles.modalTitle}>Add Meal</Text>
          <TextInput
            label="Meal Name"
            mode="outlined"
            style={styles.input}
          />
          <TextInput
            label="Calories"
            mode="outlined"
            keyboardType="numeric"
            style={styles.input}
          />
          <TextInput
            label="Protein (g)"
            mode="outlined"
            keyboardType="numeric"
            style={styles.input}
          />
          <TextInput
            label="Carbs (g)"
            mode="outlined"
            keyboardType="numeric"
            style={styles.input}
          />
          <TextInput
            label="Fats (g)"
            mode="outlined"
            keyboardType="numeric"
            style={styles.input}
          />
          <Button mode="contained" onPress={hideModal} style={styles.button}>
            Add Meal
          </Button>
        </Modal>
      </Portal>

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={showModal}
      />
    </View>
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
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  macros: {
    gap: 4,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  modal: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  modalTitle: {
    marginBottom: 16,
  },
  input: {
    marginBottom: 12,
  },
  button: {
    marginTop: 8,
  },
}); 