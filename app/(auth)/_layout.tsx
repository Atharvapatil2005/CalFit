import React from 'react';
import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'fade',
        contentStyle: { backgroundColor: '#fff' }
      }}
    >
      <Stack.Screen name="login" />
      <Stack.Screen name="profile" />
      <Stack.Screen name="welcome" />
    </Stack>
  );
} 