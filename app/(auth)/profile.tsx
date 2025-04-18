import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button, TextInput } from 'react-native-paper';
import { router } from 'expo-router';
import { theme } from '../../src/constants/theme';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function ProfileScreen() {
  const [dob, setDob] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');

  const handleNext = () => {
    router.push('/welcome');
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
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
            onPress={() => setShowDatePicker(true)}
            style={styles.dateButton}
          >
            {dob.toLocaleDateString()}
          </Button>
          {showDatePicker && (
            <DateTimePicker
              value={dob}
              mode="date"
              display="default"
              onChange={handleDateChange}
              maximumDate={new Date()}
            />
          )}
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