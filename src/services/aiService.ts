import { AI_CONFIG } from '../config/ai';

type Message = {
  role: 'user' | 'assistant' | 'system';
  content: string;
};

const OPENROUTER_API_KEY = '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';

export const sendMessage = async (messages: Message[]) => {
  try {
    console.log('Sending message to OpenRouter (Mistral)...');
    
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'https://github.com/atharvapatil/CalFit',
        'X-Title': 'CalFit',
      },
      body: JSON.stringify({
        model: 'mistralai/mistral-7b-instruct',
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
      console.error('OpenRouter API Error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData
      });
      throw new Error(`OpenRouter API Error: ${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error: any) {
    console.error('AI Service Error:', error);
    throw new Error(`AI Service Error: ${error.message || 'Unknown error occurred'}`);
  }
};