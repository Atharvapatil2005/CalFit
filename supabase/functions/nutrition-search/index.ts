import { corsHeaders } from '../_shared/cors.ts';

const safeNumber = (value: any): number => {
  const num = Number(value);
  return isNaN(num) ? 0 : num;
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { query } = await req.json();

    console.log('[NUTRITION SEARCH] Query received:', query);

    if (!query || typeof query !== 'string') {
      console.log('[NUTRITION SEARCH] Invalid query');
      return new Response(
        JSON.stringify({ foods: [] }),
        {
          status: 200,
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

    console.log('[NUTRITION SEARCH] Fetching:', searchUrl.toString());

    const response = await fetch(searchUrl.toString(), {
      headers: {
        'User-Agent': 'CalFit/1.0 (React Native App)',
      },
    });

    const rawText = await response.text();
    console.log('[NUTRITION SEARCH] Raw response length:', rawText.length);

    let data;
    try {
      data = JSON.parse(rawText);
    } catch (e) {
      console.error('[NUTRITION SEARCH] JSON parse failed:', e);
      console.error('[NUTRITION SEARCH] Raw text preview:', rawText.substring(0, 500));
      return new Response(
        JSON.stringify({ foods: [] }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    console.log('[NUTRITION SEARCH] Parsed data type:', typeof data);
    console.log('[NUTRITION SEARCH] Products count:', data?.products?.length ?? 0);

    if (!data?.products || !Array.isArray(data.products)) {
      console.log('[NUTRITION SEARCH] No products found in response');
      return new Response(
        JSON.stringify({ foods: [] }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const foods = data.products.slice(0, 15).map((item: any) => {
      const nutriments = item?.nutriments || {};
      
      const food = {
        food_name: item.product_name || 'Unknown food',
        serving_qty: 100,
        serving_unit: 'g',
        calories: Math.round(safeNumber(nutriments['energy-kcal_100g'])),
        protein: Math.round(safeNumber(nutriments['proteins_100g'])),
        carbs: Math.round(safeNumber(nutriments['carbohydrates_100g'])),
        fats: Math.round(safeNumber(nutriments['fat_100g'])),
      };

      console.log('[NUTRITION SEARCH] Mapped food:', food.food_name, 'cal:', food.calories);
      return food;
    });

    const cleanFoods = foods.filter(f => 
      f.food_name !== 'Unknown food' &&
      f.calories > 0
    );

    console.log('[NUTRITION SEARCH] Returning', cleanFoods.length, 'foods');

    return new Response(
      JSON.stringify({ foods: cleanFoods }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('[NUTRITION SEARCH] Unexpected error:', error);
    return new Response(
      JSON.stringify({ foods: [] }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
