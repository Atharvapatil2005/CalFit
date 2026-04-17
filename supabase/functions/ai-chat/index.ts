import { corsHeaders } from '../_shared/cors.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const OPENROUTER_API_KEY = Deno.env.get('OPENROUTER_API_KEY');

  if (!OPENROUTER_API_KEY) {
    console.error('[AI-CHAT] Missing OPENROUTER_API_KEY');
    return new Response(
      JSON.stringify({ reply: 'AI service is not configured' }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    const payload = await req.json();
    const userMessage = payload.messages?.find((m: any) => m.role === 'user')?.content || payload.query || 'Hello';

    console.log('[AI-CHAT] Processing message:', userMessage.substring(0, 50));

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'openrouter/elephant-alpha',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful fitness and nutrition assistant named CalFit. Keep responses concise and actionable. Focus on nutrition, calories, macros, and healthy eating.',
          },
          {
            role: 'user',
            content: userMessage,
          },
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const rawText = await response.text();
    console.log('[AI-CHAT] Raw response length:', rawText.length);

    let data;
    try {
      data = JSON.parse(rawText);
    } catch (e) {
      console.error('[AI-CHAT] JSON parse failed:', e);
      return new Response(
        JSON.stringify({ reply: 'AI is temporarily unavailable' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (data?.error) {
      const errorMsg = typeof data.error === 'string' ? data.error : data.error?.message || 'API error';
      console.error('[AI-CHAT] API Error:', errorMsg);
      return new Response(
        JSON.stringify({ reply: 'AI service is temporarily unavailable' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const reply =
      data?.choices?.[0]?.message?.content ||
      data?.choices?.[0]?.text ||
      'Sorry, I couldn\'t generate a response. Please try again.';

    const safeReply = typeof reply === 'string' && reply.trim().length > 0
      ? reply.trim()
      : 'Sorry, I couldn\'t generate a response. Please try again.';

    console.log('[AI-CHAT] Reply length:', safeReply.length);

    return new Response(
      JSON.stringify({ reply: safeReply }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.error('[AI-CHAT] Request timeout');
      return new Response(
        JSON.stringify({ reply: 'AI request timed out. Please try again.' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.error('[AI-CHAT] Unexpected error:', error);
    return new Response(
      JSON.stringify({ reply: 'AI service failed. Please try again.' }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
