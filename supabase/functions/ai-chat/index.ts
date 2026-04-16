import { corsHeaders } from '../_shared/cors.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const openRouterApiKey = Deno.env.get('OPENROUTER_API_KEY');

  if (!openRouterApiKey) {
    return new Response(
      JSON.stringify({ error: 'Missing OPENROUTER_API_KEY secret' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }

  try {
    const payload = await req.json();

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${openRouterApiKey}`,
      },
      body: JSON.stringify(payload),
    });

    const rawBody = await response.text();
    const contentType = response.headers.get('content-type') ?? '';
    const isJson = contentType.includes('application/json');

    let body: unknown;
    if (isJson) {
      try {
        body = JSON.parse(rawBody);
      } catch {
        body = null;
      }
    }

    return new Response(JSON.stringify(body ?? { error: rawBody || 'Upstream AI response was not valid JSON.' }), {
      status: response.status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unexpected AI proxy error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
