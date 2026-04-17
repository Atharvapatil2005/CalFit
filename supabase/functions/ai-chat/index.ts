import { corsHeaders } from '../_shared/cors.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const openRouterApiKey = Deno.env.get('OPENROUTER_API_KEY');

  if (!openRouterApiKey) {
    console.error('[AI-CHAT] Missing OPENROUTER_API_KEY');
    return new Response(JSON.stringify({ error: 'AI service not configured' }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const payload = await req.json();

    console.log('[AI-CHAT] Received request with', payload.messages?.length ?? 0, 'messages');

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${openRouterApiKey}`,
      },
      body: JSON.stringify(payload),
    });

    const rawText = await response.text();
    console.log('[AI-CHAT] OpenRouter response length:', rawText.length);

    let data;
    try {
      data = JSON.parse(rawText);
    } catch (e) {
      console.error('[AI-CHAT] JSON parse failed:', e);
      return new Response(JSON.stringify({ error: 'AI response was invalid' }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check for OpenRouter errors
    if (data?.error) {
      const errorMessage = typeof data.error === 'string' 
        ? data.error 
        : data.error?.message || 'AI request failed';
      console.error('[AI-CHAT] OpenRouter error:', errorMessage);
      return new Response(JSON.stringify({ error: errorMessage }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Extract response content
    const choices = data?.choices;
    if (!Array.isArray(choices) || choices.length === 0) {
      console.error('[AI-CHAT] No choices in response:', JSON.stringify(data).substring(0, 200));
      return new Response(JSON.stringify({ error: 'No response from AI' }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const firstChoice = choices[0];
    
    // Handle different message formats
    let reply = '';
    
    if (firstChoice?.message?.content) {
      // Standard OpenAI/OpenRouter format
      reply = firstChoice.message.content;
    } else if (firstChoice?.delta?.content) {
      // Streaming format (not supported yet)
      console.error('[AI-CHAT] Received streaming response, expected regular');
      return new Response(JSON.stringify({ error: 'Streaming not supported' }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } else {
      console.error('[AI-CHAT] No content in choice:', JSON.stringify(firstChoice).substring(0, 200));
      return new Response(JSON.stringify({ error: 'AI response was empty' }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('[AI-CHAT] Returning reply length:', reply.length);

    return new Response(JSON.stringify({ reply }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('[AI-CHAT] Unexpected error:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'AI service failed' 
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
