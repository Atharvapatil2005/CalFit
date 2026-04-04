import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button, TextInput } from 'react-native-paper';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../../src/constants/theme';

export default function MeasurementsScreen() {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [age, setAge] = useState('');

  const handleNext = () => {
    router.replace('/(auth)/nutrition');
  };

  const isValid = Boolean(height.trim() && weight.trim() && age.trim());

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.inner}>
          <View style={styles.header}>
            <Text variant="headlineMedium" style={styles.title}>
              Let's get to know you better
            </Text>
            <Text variant="titleLarge" style={styles.subtitle}>
              We'll use this to calculate your daily needs
            </Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text variant="titleMedium" style={styles.label}>Height</Text>
              <TextInput
                mode="outlined"
                value={height}
                onChangeText={setHeight}
                keyboardType="numeric"
                right={<TextInput.Affix text="cm" />}
                style={styles.input}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text variant="titleMedium" style={styles.label}>Weight</Text>
              <TextInput
                mode="outlined"
                value={weight}
                onChangeText={setWeight}
                keyboardType="numeric"
                right={<TextInput.Affix text="kg" />}
                style={styles.input}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text variant="titleMedium" style={styles.label}>Age</Text>
              <TextInput
                mode="outlined"
                value={age}
                onChangeText={setAge}
                keyboardType="numeric"
                right={<TextInput.Affix text="years" />}
                style={styles.input}
              />
            </View>
          </View>

          <View style={styles.footer}>
            <Button
              mode="text"
              onPress={() => {}}
              style={styles.infoButton}
            >
              Why do we need this information?
            </Button>
            <Button
              mode="contained"
              onPress={handleNext}
              disabled={!isValid}
              style={styles.button}
              contentStyle={styles.buttonContent}
            >
              NEXT
            </Button>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
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
  inner: {
    width: '100%',
    maxWidth: 680,
    alignSelf: 'center',
    flexGrow: 1,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    color: theme.colors.onBackground,
    marginBottom: 8,
  },
  subtitle: {
    color: theme.colors.onBackground,
    fontWeight: '600',
  },
  form: {
    gap: 24,
  },
  inputContainer: {
    gap: 8,
  },
  label: {
    color: theme.colors.onBackground,
  },
  input: {
    backgroundColor: theme.colors.background,
  },
  footer: {
    marginTop: 'auto',
    gap: 16,
    paddingTop: 32,
  },
  infoButton: {
    alignSelf: 'center',
  },
  button: {
    borderRadius: 8,
  },
  buttonContent: {
    height: 56,
  },
}); 
