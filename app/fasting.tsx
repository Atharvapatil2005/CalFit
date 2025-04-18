import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, useTheme, Button } from 'react-native-paper';
import { Stack } from 'expo-router';

export default function FastingScreen() {
  const theme = useTheme();

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Intermittent Fasting',
          headerStyle: {
            backgroundColor: theme.colors.primary,
          },
          headerTintColor: '#fff',
        }}
      />
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          <Text variant="headlineMedium" style={styles.title}>
            Choose Your Fasting Schedule
          </Text>
          <View style={styles.scheduleCard}>
            <Text style={styles.scheduleTitle}>16:8 Protocol</Text>
            <Text style={styles.scheduleDescription}>
              Fast for 16 hours and eat within an 8-hour window
            </Text>
            <Button mode="contained" style={styles.button}>
              Select
            </Button>
          </View>
          <View style={styles.scheduleCard}>
            <Text style={styles.scheduleTitle}>14:10 Protocol</Text>
            <Text style={styles.scheduleDescription}>
              Fast for 14 hours and eat within a 10-hour window
            </Text>
            <Button mode="contained" style={styles.button}>
              Select
            </Button>
          </View>
          <View style={styles.scheduleCard}>
            <Text style={styles.scheduleTitle}>18:6 Protocol</Text>
            <Text style={styles.scheduleDescription}>
              Fast for 18 hours and eat within a 6-hour window
            </Text>
            <Button mode="contained" style={styles.button}>
              Select
            </Button>
          </View>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  content: {
    padding: 16,
  },
  title: {
    color: 'white',
    marginBottom: 24,
  },
  scheduleCard: {
    backgroundColor: '#1E1E1E',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  scheduleTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  scheduleDescription: {
    color: '#757575',
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
  },
}); 