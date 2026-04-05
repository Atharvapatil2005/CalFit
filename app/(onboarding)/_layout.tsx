import { Stack } from 'expo-router';
import { useTheme } from 'react-native-paper';

export default function OnboardingLayout() {
  const theme = useTheme();

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.background,
        },
        headerTintColor: theme.colors.onBackground,
        headerBackTitle: 'Back',
      }}
    >
      <Stack.Screen
        name="goals"
        options={{
          title: 'Your Goals',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="nutrition"
        options={{
          title: 'Nutrition Program',
          headerShown: false,
        }}
      />
    </Stack>
  );
} 
