import Constants from 'expo-constants';
import { AI_CONFIG } from '../config/ai';

type Message = {
  role: 'user' | 'assistant' | 'system';
  content: string;
};

const OPENROUTER_API_KEY = process.env.EXPO_PUBLIC_OPENROUTER_API_KEY;
const REFERER = process.env.EXPO_PUBLIC_HTTP_REFERER;
const MODEL = process.env.EXPO_PUBLIC_AI_MODEL;

if (!OPENROUTER_API_KEY) {
  console.error('❌ OpenRouter API Key is missing from Constants');
}
if (!REFERER) {
  console.error('❌ HTTP Referer is missing from Constants');
}

export const sendMessage = async (messages: Message[]) => {
  try {
    if (!OPENROUTER_API_KEY) {
      throw new Error('OpenRouter API Key is missing at runtime');
    }

    console.log('🔁 Sending message to OpenRouter...');
    console.log('📤 Request Headers:', {
      'Authorization': `Bearer ${OPENROUTER_API_KEY.substring(0, 10)}...`,
      'Content-Type': 'application/json',
      'HTTP-Referer': REFERER,
      'X-Title': 'CalFit',
    });

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': REFERER || '',
        'X-Title': 'CalFit',
        'OpenAI-Organization': 'atharvapatil-calfit',
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: 'system', content: AI_CONFIG.systemPrompt },
          ...messages,
        ],
        temperature: AI_CONFIG.temperature,
        max_tokens: AI_CONFIG.maxTokens,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ OpenRouter API Error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
      });
      throw new Error(`OpenRouter API Error: ${response.status} - ${errorText}`);
    }

    const responseData = await response.json();
    console.log('📥 Response Data:', JSON.stringify(responseData, null, 2));

    // Check if the response has the expected structure
    if (!responseData?.choices?.[0]?.message?.content) {
      console.error('❌ Invalid response format:', responseData);
      throw new Error('Invalid response format from OpenRouter API');
    }

    // Return just the message content
    return responseData.choices[0].message.content;
  } catch (error: any) {
    console.error('❌ AI Service Error:', error.message);
    throw error;
  }
};