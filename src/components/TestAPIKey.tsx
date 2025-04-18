import React from 'react';
import { View, Text } from 'react-native';
import { OPENAI_API_KEY } from '@env';

export default function TestAPIKey() {
  return (
    <View style={{ padding: 20 }}>
      <Text>API Key Status: {OPENAI_API_KEY ? 'Present' : 'Missing'}</Text>
      <Text>API Key Length: {OPENAI_API_KEY?.length || 0}</Text>
      <Text>API Key Prefix: {OPENAI_API_KEY?.substring(0, 7) || 'None'}</Text>
    </View>
  );
} 