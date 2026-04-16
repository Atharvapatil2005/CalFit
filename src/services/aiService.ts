import { AI_CONFIG } from '../config/ai';
import { fetchWithTimeout, HttpError, NetworkError, readResponsePayload } from '../lib/http';
import { assertBackendConfig, runtimeConfig } from '../lib/runtimeConfig';

type Message = {
  role: 'user' | 'assistant' | 'system';
  content: string;
};

const aiModel = runtimeConfig.aiModel || AI_CONFIG.model;

export const sendMessage = async (messages: Message[]) => {
  const { supabaseUrl, supabaseAnonKey } = assertBackendConfig();

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

  if (!response.ok) {
    const message =
      (json?.error as string | undefined) ||
      text ||
      'AI assistant is temporarily unavailable.';

    if (response.status === 404) {
      throw new HttpError(
        'AI assistant is temporarily unavailable because the ai-chat backend route was not found.',
        response.status,
        text
      );
    }

    throw new HttpError(message, response.status, text);
  }

  const choices = Array.isArray((json as { choices?: unknown[] }).choices)
    ? ((json as { choices: Array<{ message?: { content?: string } }> }).choices)
    : [];

  if (!choices[0]?.message?.content) {
    throw new Error('Invalid AI response format');
  }

  return String(choices[0].message.content);
};
