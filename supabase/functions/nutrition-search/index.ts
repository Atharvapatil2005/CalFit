import { corsHeaders } from '../_shared/cors.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { query } = await req.json();

    console.log('[NUTRITION SEARCH] Query:', query);

    if (!query || typeof query !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Query is required', foods: [] }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const searchUrl = new URL('https://world.openfoodfacts.org/cgi/search.pl');
    searchUrl.searchParams.set('search_terms', query);
    searchUrl.searchParams.set('search_simple', '1');
    searchUrl.searchParams.set('action', 'process');
    searchUrl.searchParams.set('json', '1');
    searchUrl.searchParams.set('page_size', '20');
    searchUrl.searchParams.set('fields', 'product_name,nutriments,serving_size');

    const response = await fetch(searchUrl.toString(), {
      headers: {
        'User-Agent': 'CalFit/1.0 (React Native App)',
      },
    });

    if (!response.ok) {
      console.error('[NUTRITION SEARCH] Open Food Facts API error:', response.status);
      return new Response(
        JSON.stringify({ error: 'Food search service unavailable', foods: [] }),
        {
          status: 502,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const data = await response.json();

    console.log('[NUTRITION SEARCH] Results count:', data.products?.length ?? 0);

    const foods = (data.products || [])
      .filter((product: any) => product.product_name)
      .slice(0, 15)
      .map((product: any) => {
        const nutriments = product.nutriments || {};
        
        return {
          food_name: product.product_name,
          serving_qty: 1,
          serving_unit: product.serving_size || 'serving',
          serving_weight_grams: 100,
          calories: Math.round(nutriments['energy-kcal_100g'] || nutriments['energy-kcal'] || 0),
          protein: Math.round(nutriments.proteins_100g || nutriments.proteins || 0),
          carbs: Math.round(nutriments.carbohydrates_100g || nutriments.carbohydrates || 0),
          fats: Math.round(nutriments.fat_100g || nutriments.fat || 0),
        };
      });

    return new Response(
      JSON.stringify({ foods }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('[NUTRITION SEARCH] Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Food search failed', foods: [] }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
