import React, { useState } from 'react';
import { View, StyleSheet, Pressable, ScrollView } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { router } from 'expo-router';
import { theme } from '../../src/constants/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

type Gender = 'male' | 'female';

export default function GenderScreen() {
  const [selectedGender, setSelectedGender] = useState<Gender | null>(null);

  const handleNext = () => {
    router.push('/(auth)/measurements');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.inner}>
          <View style={styles.header}>
            <Text variant="headlineMedium" style={styles.title}>
              We're excited to help you!
            </Text>
            <Text variant="titleLarge" style={styles.question}>
              What sex should we use to calculate your recommendations?
            </Text>
          </View>

          <View style={styles.genderContainer}>
            {[
              { value: 'female', label: 'Female', icon: 'human-female' },
              { value: 'male', label: 'Male', icon: 'human-male' },
            ].map((gender) => (
              <Pressable
                key={gender.value}
                style={[
                  styles.genderButton,
                  selectedGender === gender.value && styles.selectedGender,
                ]}
                onPress={() => setSelectedGender(gender.value as Gender)}
              >
                <MaterialCommunityIcons
                  name={gender.icon as any}
                  size={32}
                  color={selectedGender === gender.value ? theme.colors.onPrimary : theme.colors.onSurfaceVariant}
                />
                <Text
                  style={[
                    styles.genderText,
                    selectedGender === gender.value && styles.selectedGenderText,
                  ]}
                >
                  {gender.label}
                </Text>
              </Pressable>
            ))}
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
              disabled={!selectedGender}
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
  question: {
    color: theme.colors.onBackground,
    fontWeight: '600',
  },
  genderContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginTop: 8,
  },
  genderButton: {
    minWidth: 140,
    flexGrow: 1,
    flexBasis: 160,
    backgroundColor: theme.colors.surfaceVariant,
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    gap: 12,
  },
  selectedGender: {
    backgroundColor: theme.colors.primary,
  },
  genderText: {
    fontSize: 16,
    color: theme.colors.onSurfaceVariant,
  },
  selectedGenderText: {
    color: theme.colors.onPrimary,
    fontWeight: 'bold',
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
