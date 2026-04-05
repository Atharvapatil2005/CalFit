import React, { useCallback } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, Button, TextInput } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '../../src/constants/theme';
import { useOnboarding } from '../../src/context/OnboardingContext';

export default function MeasurementsScreen() {
  const { state, updateState } = useOnboarding();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const isValid = Boolean(state.height.trim() && state.weight.trim() && state.age.trim());

  const handleNext = useCallback(() => {
    if (!isValid) {
      return;
    }

    updateState({
      height: state.height.trim(),
      weight: state.weight.trim(),
      age: state.age.trim(),
    });
    router.push('/(auth)/nutrition');
  }, [isValid, router, state.age, state.height, state.weight, updateState]);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.container}
          contentContainerStyle={[
            styles.content,
            { paddingBottom: 24 + insets.bottom },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
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
                  value={state.height}
                  onChangeText={(value) => updateState({ height: value })}
                  keyboardType="numeric"
                  right={<TextInput.Affix text="cm" />}
                  style={styles.input}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text variant="titleMedium" style={styles.label}>Weight</Text>
                <TextInput
                  mode="outlined"
                  value={state.weight}
                  onChangeText={(value) => updateState({ weight: value })}
                  keyboardType="numeric"
                  right={<TextInput.Affix text="kg" />}
                  style={styles.input}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text variant="titleMedium" style={styles.label}>Age</Text>
                <TextInput
                  mode="outlined"
                  value={state.age}
                  onChangeText={(value) => updateState({ age: value })}
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
      </KeyboardAvoidingView>
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
