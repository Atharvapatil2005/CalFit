import Constants from 'expo-constants';
import { AI_CONFIG } from '../config/ai';

type Message = {
  role: 'user' | 'assistant' | 'system';
  content: string;
};

const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl;
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey;
const aiModel = Constants.expoConfig?.extra?.aiModel || AI_CONFIG.model;

export const sendMessage = async (messages: Message[]) => {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('AI assistant is unavailable because the backend is not configured.');
  }

  const response = await fetch(`${supabaseUrl}/functions/v1/ai-chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${supabaseAnonKey}`,
    },
    body: JSON.stringify({
      model: aiModel,
      messages: [
        { role: 'system', content: AI_CONFIG.systemPrompt },
        ...messages,
      ],
      temperature: AI_CONFIG.temperature,
      max_tokens: AI_CONFIG.maxTokens,
    }),
  });

  if (!response.ok) {
    throw new Error('AI assistant is temporarily unavailable. Deploy the `ai-chat` Edge Function to enable chat.');
  }

  const data = await response.json();

  if (!data.choices?.[0]?.message?.content) {
    throw new Error('Invalid AI response format');
  }

  return data.choices[0].message.content;
};
