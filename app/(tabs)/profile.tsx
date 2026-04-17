import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Text, Card, List, Button, RadioButton, useTheme as usePaperTheme } from 'react-native-paper';
import { router } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';
import { useTheme } from '../../src/theme/useTheme';
import { useThemeMode } from '../../src/theme/ThemeContext';

export default function ProfileScreen() {
  const paperTheme = usePaperTheme();
  const theme = useTheme();
  const { themeMode, setThemeMode } = useThemeMode();
  const { user, signOut } = useAuth();
  const [expanded, setExpanded] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace('/(auth)/login');
    } catch (_error) {
    }
  };

  const getThemeLabel = () => {
    switch (themeMode) {
      case 'light': return 'Light';
      case 'dark': return 'Dark';
      case 'system': return 'System';
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
            <List.Subheader style={{ color: theme.subtext }}>Appearance</List.Subheader>
            <List.Accordion
              title="Theme"
              description={getThemeLabel()}
              expanded={expanded}
              onPress={() => setExpanded(!expanded)}
              titleStyle={{ color: theme.text }}
              descriptionStyle={{ color: theme.subtext }}
              style={{ backgroundColor: theme.card }}
            >
              <View style={[styles.radioGroup, { backgroundColor: theme.background }]}>
                <RadioButton.Group
                  onValueChange={(value) => {
                    setThemeMode(value as 'light' | 'dark' | 'system');
                    setExpanded(false);
                  }}
                  value={themeMode}
                >
                  <RadioButton.Item
                    label="Light"
                    value="light"
                    labelStyle={{ color: theme.text }}
                    uncheckedColor={theme.subtext}
                    style={styles.radioItem}
                  />
                  <RadioButton.Item
                    label="Dark"
                    value="dark"
                    labelStyle={{ color: theme.text }}
                    uncheckedColor={theme.subtext}
                    style={styles.radioItem}
                  />
                  <RadioButton.Item
                    label="System"
                    value="system"
                    labelStyle={{ color: theme.text }}
                    uncheckedColor={theme.subtext}
                    style={styles.radioItem}
                  />
                </RadioButton.Group>
              </View>
            </List.Accordion>
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
  radioGroup: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  radioItem: {
    paddingVertical: 4,
  },
});
