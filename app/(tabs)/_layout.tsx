import React from 'react';
import { Tabs } from 'expo-router';
import { useTheme } from 'react-native-paper';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';

type TabIconProps = {
  color: string;
  size: number;
  focused: boolean;
};

export default function TabsLayout() {
  const theme = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.outline,
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }: TabIconProps) => (
            <Icon name="view-dashboard" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="meals"
        options={{
          title: 'Meals',
          tabBarIcon: ({ color, size }: TabIconProps) => (
            <Icon name="food" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Chat',
          tabBarIcon: ({ color, size }: TabIconProps) => (
            <Icon name="chat" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }: TabIconProps) => (
            <Icon name="account" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
} 
