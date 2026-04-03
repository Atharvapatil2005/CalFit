import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Platform } from 'react-native';
import { Text, Button, TextInput } from 'react-native-paper';
import { router } from 'expo-router';
import { theme } from '../../src/constants/theme';

export default function ProfileScreen() {
  const [dob, setDob] = useState(new Date());
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');

  const handleNext = () => {
    router.push('/(auth)/welcome');
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (selectedDate) {
      setDob(selectedDate);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.title}>
          Let's personalize your experience
        </Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text variant="titleMedium" style={styles.label}>
            Date of Birth
          </Text>
          <Button
            mode="outlined"
            onPress={() => {
              if (Platform.OS === 'ios') {
                // For iOS, we'll use a modal with a simple date picker
                // You can implement a custom modal here if needed
              } else {
                // For Android, we'll use the native date picker
                const currentDate = new Date();
                const date = new Date(currentDate.getFullYear() - 18, currentDate.getMonth(), currentDate.getDate());
                handleDateChange(null, date);
              }
            }}
            style={styles.dateButton}
          >
            {dob.toLocaleDateString()}
          </Button>
        </View>

        <View style={styles.inputGroup}>
          <Text variant="titleMedium" style={styles.label}>
            Height (cm)
          </Text>
          <TextInput
            mode="outlined"
            value={height}
            onChangeText={setHeight}
            keyboardType="numeric"
            style={styles.input}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text variant="titleMedium" style={styles.label}>
            Weight (kg)
          </Text>
          <TextInput
            mode="outlined"
            value={weight}
            onChangeText={setWeight}
            keyboardType="numeric"
            style={styles.input}
          />
        </View>
      </View>

      <View style={styles.footer}>
        <Text variant="bodyMedium" style={styles.footerText}>
          We use this information to calculate and provide you with daily personalized recommendations.
        </Text>
        <Button
          mode="contained"
          onPress={handleNext}
          disabled={!height || !weight}
          style={styles.button}
          contentStyle={styles.buttonContent}
        >
          NEXT
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flexGrow: 1,
    padding: 24,
  },
  header: {
    marginTop: 40,
    marginBottom: 32,
  },
  title: {
    color: theme.colors.onBackground,
    marginBottom: 8,
  },
  form: {
    gap: 24,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    color: theme.colors.onBackground,
  },
  input: {
    backgroundColor: theme.colors.background,
  },
  dateButton: {
    borderColor: theme.colors.outline,
  },
  footer: {
    marginTop: 'auto',
    gap: 24,
    paddingTop: 24,
  },
  footerText: {
    textAlign: 'center',
    color: theme.colors.onSurfaceVariant,
  },
  button: {
    borderRadius: 8,
  },
  buttonContent: {
    height: 56,
  },
}); 
