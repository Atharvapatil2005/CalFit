import { AI_CONFIG } from '../config/ai';
import { fetchWithTimeout, HttpError, readResponsePayload } from '../lib/http';
import { assertBackendConfig, runtimeConfig } from '../lib/runtimeConfig';

type Message = {
  role: 'user' | 'assistant' | 'system';
  content: string;
};

export type SendMessageResult = {
  reply: string;
};

const aiModel = runtimeConfig.aiModel || AI_CONFIG.model;

export const sendMessage = async (messages: Message[]): Promise<string> => {
  const { supabaseUrl, supabaseAnonKey } = assertBackendConfig();

  console.log('[AI-SERVICE] Sending message, history length:', messages.length);

  const response = await fetchWithTimeout(
    `${supabaseUrl}/functions/v1/ai-chat`,
    {
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
    },
    20000
  );

  const { json, text } = await readResponsePayload(response);

  console.log('[AI-SERVICE] Response status:', response.status);
  console.log('[AI-SERVICE] Response body:', JSON.stringify(json));

  // Check for HTTP-level errors
  if (!response.ok) {
    const errorData = json?.error;
    const message = typeof errorData === 'string' 
      ? errorData 
      : (text || 'AI assistant is temporarily unavailable.');
    console.error('[AI-SERVICE] HTTP Error:', message);
    throw new HttpError(message, response.status, text);
  }

  // Check for application-level errors
  if (json?.error) {
    const errorMessage = typeof json.error === 'string' 
      ? json.error 
      : 'AI request failed';
    console.error('[AI-SERVICE] App Error:', errorMessage);
    throw new Error(errorMessage);
  }

  // Extract reply from new standardized format
  const reply = json?.reply;
  
  if (!reply || typeof reply !== 'string') {
    console.error('[AI-SERVICE] Invalid response format:', JSON.stringify(json));
    throw new Error('Invalid response from AI service');
  }

  console.log('[AI-SERVICE] Reply length:', reply.length);

  return reply;
};
