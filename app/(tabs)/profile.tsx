import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Text, Card, List, Switch, Button, useTheme } from 'react-native-paper';
import { router } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';
import { useTheme as useAppTheme } from '../../src/theme/useTheme';

export default function ProfileScreen() {
  const paperTheme = useTheme();
  const theme = useAppTheme();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace('/(auth)/login');
    } catch (_error) {
      // Keep the user on the current screen if sign-out fails.
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <Card style={[styles.card, { backgroundColor: theme.card }]}>
        <Card.Content>
          <Text variant="titleLarge" style={{ color: theme.text }}>{user?.user_metadata?.full_name || 'User'}</Text>
          <Text variant="bodyMedium" style={{ color: theme.subtext }}>{user?.email}</Text>
        </Card.Content>
      </Card>

      <Card style={[styles.card, { backgroundColor: theme.card }]}>
        <Card.Content>
          <List.Section>
            <List.Subheader style={{ color: theme.subtext }}>Settings</List.Subheader>
            <List.Item
              title="Dark Mode"
              titleStyle={{ color: theme.text }}
              description="Toggle system theme"
              descriptionStyle={{ color: theme.subtext }}
              right={() => (
                <Switch
                  value={false}
                  onValueChange={() => {}}
                  color={paperTheme.colors.primary}
                />
              )}
            />
            <List.Item
              title="Units"
              titleStyle={{ color: theme.text }}
              description="Metric (kg, cm)"
              descriptionStyle={{ color: theme.subtext }}
              onPress={() => {}}
            />
            <List.Item
              title="Activity Level"
              titleStyle={{ color: theme.text }}
              description="Moderately Active"
              descriptionStyle={{ color: theme.subtext }}
              onPress={() => {}}
            />
            <List.Item
              title="Health Goals"
              titleStyle={{ color: theme.text }}
              description="Lose Weight"
              descriptionStyle={{ color: theme.subtext }}
              onPress={() => {}}
            />
          </List.Section>
        </Card.Content>
      </Card>

      <Card style={[styles.card, { backgroundColor: theme.card }]}>
        <Card.Content>
          <List.Section>
            <List.Subheader style={{ color: theme.subtext }}>App Info</List.Subheader>
            <List.Item
              title="Version"
              titleStyle={{ color: theme.text }}
              description="1.0.0"
              descriptionStyle={{ color: theme.subtext }}
            />
            <List.Item
              title="Terms of Service"
              titleStyle={{ color: theme.text }}
              onPress={() => {}}
            />
            <List.Item
              title="Privacy Policy"
              titleStyle={{ color: theme.text }}
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
