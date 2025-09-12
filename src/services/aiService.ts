import Constants from 'expo-constants';
import { AI_CONFIG } from '../config/ai';
import { EXPO_PUBLIC_OPENROUTER_API_KEY, EXPO_PUBLIC_HTTP_REFERER, EXPO_PUBLIC_AI_MODEL } from '@env';

type Message = {
  role: 'user' | 'assistant' | 'system';
  content: string;
};

export const sendMessage = async (messages: Message[]) => {
  try {
    if (!EXPO_PUBLIC_OPENROUTER_API_KEY) {
      console.error('OpenRouter API key is missing');
      throw new Error('API key missing');
    }

    console.log('Sending message to OpenRouter...');
    console.log('📤 Request Headers:', {
      Authorization: `Bearer ${EXPO_PUBLIC_OPENROUTER_API_KEY.substring(0, 10)}...`,
      'Content-Type': 'application/json',
      'HTTP-Referer': EXPO_PUBLIC_HTTP_REFERER,
      'X-Title': 'CalFit'
    });

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${EXPO_PUBLIC_OPENROUTER_API_KEY}`,
        'HTTP-Referer': EXPO_PUBLIC_HTTP_REFERER,
        'X-Title': 'CalFit',
      },
      body: JSON.stringify({
        model: EXPO_PUBLIC_AI_MODEL || AI_CONFIG.model,
        messages: [
          { role: 'system', content: AI_CONFIG.systemPrompt },
          ...messages,
        ],
        temperature: AI_CONFIG.temperature,
        max_tokens: AI_CONFIG.maxTokens,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ OpenRouter API Error:', errorData);
      throw new Error(`OpenRouter API Error: ${response.status} - ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();

    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Invalid AI response format');
    }

    return data.choices[0].message.content;
  } catch (error: any) {
    console.error('❌ AI Service Error:', error.message);
    throw error;
  }
};