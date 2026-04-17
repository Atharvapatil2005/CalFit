import { corsHeaders } from '../_shared/cors.ts';

const safeNumber = (value: any): number => {
  const num = Number(value);
  return isNaN(num) ? 0 : num;
};

const getCalories = (nutriments: any): number => {
  if (nutriments['energy-kcal_100g'] !== undefined) {
    return nutriments['energy-kcal_100g'];
  }
  if (nutriments['energy_100g'] !== undefined) {
    return nutriments['energy_100g'] / 4.184;
  }
  return 0;
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { query } = await req.json();

    console.log('[EDGE] Query received:', query);

    if (!query || typeof query !== 'string') {
      console.log('[EDGE] Invalid query');
      return new Response(JSON.stringify({ foods: [] }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const searchUrl = new URL('https://world.openfoodfacts.org/cgi/search.pl');
    searchUrl.searchParams.set('search_terms', query);
    searchUrl.searchParams.set('search_simple', '1');
    searchUrl.searchParams.set('action', 'process');
    searchUrl.searchParams.set('json', '1');
    searchUrl.searchParams.set('page_size', '20');
    searchUrl.searchParams.set('fields', 'product_name,nutriments,serving_size');

    console.log('[EDGE] Fetching:', searchUrl.toString());

    const response = await fetch(searchUrl.toString(), {
      headers: {
        'User-Agent': 'CalFit/1.0 (React Native App)',
      },
    });

    const rawText = await response.text();
    console.log('[EDGE] Raw response length:', rawText.length);

    let data;
    try {
      data = JSON.parse(rawText);
    } catch (e) {
      console.error('[EDGE] JSON parse failed:', e);
      console.error('[EDGE] Raw text preview:', rawText.substring(0, 500));
      return new Response(JSON.stringify({ foods: [] }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('[EDGE] Products count:', data?.products?.length ?? 0);
    
    if (data?.products?.length > 0) {
      console.log('[EDGE] RAW PRODUCTS sample:', JSON.stringify(data.products.slice(0, 2)));
    }

    if (!data?.products || !Array.isArray(data.products)) {
      console.log('[EDGE] No products found');
      return new Response(JSON.stringify({ foods: [] }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const foods = data.products.slice(0, 15).map((item: any) => {
      const nutriments = item?.nutriments || {};

      const food = {
        food_name: item.product_name || 'Unknown food',
        serving_qty: 100,
        serving_unit: 'g',
        calories: Math.round(safeNumber(getCalories(nutriments))),
        protein: Math.round(safeNumber(nutriments['proteins_100g'])),
        carbs: Math.round(safeNumber(nutriments['carbohydrates_100g'])),
        fats: Math.round(safeNumber(nutriments['fat_100g'])),
      };

      console.log('[EDGE] Mapped:', food.food_name, '| cal:', food.calories, '| p:', food.protein, '| c:', food.carbs, '| f:', food.fats);
      return food;
    });

    console.log('[EDGE] NORMALIZED FOODS sample:', JSON.stringify(foods.slice(0, 2)));

    const cleanFoods = foods.filter(f => 
      f.food_name && 
      f.food_name !== 'Unknown food' &&
      typeof f.calories === 'number' &&
      f.calories > 0
    );

    console.log('[EDGE] Returning', cleanFoods.length, 'foods');

    return new Response(JSON.stringify({ foods: cleanFoods }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[EDGE] Unexpected error:', error);
    return new Response(JSON.stringify({ foods: [] }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
