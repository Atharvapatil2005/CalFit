import React from 'react';
import { View, Text } from 'react-native';

export default function TestAPIKey() {
  return (
    <View style={{ padding: 20 }}>
      <Text>Provider keys are no longer available in client builds.</Text>
      <Text>Deploy backend proxies or Supabase Edge Functions to enable protected integrations.</Text>
    </View>
  );
}
