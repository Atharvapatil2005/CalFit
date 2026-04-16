import { corsHeaders } from '../_shared/cors.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const nutritionixAppId = Deno.env.get('NUTRITIONIX_APP_ID');
  const nutritionixAppKey = Deno.env.get('NUTRITIONIX_APP_KEY');

  if (!nutritionixAppId || !nutritionixAppKey) {
    return new Response(
      JSON.stringify({ error: 'Missing Nutritionix secrets' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }

  try {
    const { query } = await req.json();

    const response = await fetch('https://trackapi.nutritionix.com/v2/natural/nutrients', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-app-id': nutritionixAppId,
        'x-app-key': nutritionixAppKey,
      },
      body: JSON.stringify({ query }),
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

    return new Response(JSON.stringify(body ?? { error: rawBody || 'Upstream nutrition response was not valid JSON.' }), {
      status: response.status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unexpected nutrition proxy error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
