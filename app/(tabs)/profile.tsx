import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, Card, List, Switch, Button } from 'react-native-paper';
import { useTheme } from 'react-native-paper';
import { signOut } from '../../src/services/supabase';
import { router } from 'expo-router';

export default function ProfileScreen() {
  const theme = useTheme();
  const [darkMode, setDarkMode] = React.useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge">John Doe</Text>
          <Text variant="bodyMedium">john.doe@example.com</Text>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <List.Section>
            <List.Subheader>Settings</List.Subheader>
            <List.Item
              title="Dark Mode"
              right={() => (
                <Switch
                  value={darkMode}
                  onValueChange={setDarkMode}
                />
              )}
            />
            <List.Item
              title="Units"
              description="Metric (kg, cm)"
              onPress={() => {}}
            />
            <List.Item
              title="Activity Level"
              description="Moderately Active"
              onPress={() => {}}
            />
            <List.Item
              title="Health Goals"
              description="Lose Weight"
              onPress={() => {}}
            />
          </List.Section>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <List.Section>
            <List.Subheader>App Info</List.Subheader>
            <List.Item
              title="Version"
              description="1.0.0"
            />
            <List.Item
              title="Terms of Service"
              onPress={() => {}}
            />
            <List.Item
              title="Privacy Policy"
              onPress={() => {}}
            />
          </List.Section>
        </Card.Content>
      </Card>

      <Button
        mode="outlined"
        onPress={handleSignOut}
        style={styles.signOutButton}
      >
        Sign Out
      </Button>
    </ScrollView>
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
  signOutButton: {
    marginTop: 8,
    marginBottom: 32,
  },
}); 