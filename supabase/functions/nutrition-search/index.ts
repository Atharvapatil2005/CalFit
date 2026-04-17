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

const getFallbackFoods = (query: string) => {
  const q = query.toLowerCase().trim();
  
  const commonFoods: Record<string, any> = {
    chicken: { food_name: 'Chicken Breast', calories: 165, protein: 31, carbs: 0, fats: 4 },
    rice: { food_name: 'White Rice', calories: 130, protein: 3, carbs: 28, fats: 0 },
    egg: { food_name: 'Egg', calories: 78, protein: 6, carbs: 1, fats: 5 },
    milk: { food_name: 'Milk', calories: 42, protein: 3, carbs: 5, fats: 1 },
    bread: { food_name: 'Bread', calories: 265, protein: 9, carbs: 49, fats: 3 },
    apple: { food_name: 'Apple', calories: 52, protein: 0, carbs: 14, fats: 0 },
    banana: { food_name: 'Banana', calories: 89, protein: 1, carbs: 23, fats: 0 },
    potato: { food_name: 'Potato', calories: 77, protein: 2, carbs: 17, fats: 0 },
    pasta: { food_name: 'Pasta', calories: 131, protein: 5, carbs: 25, fats: 1 },
    salmon: { food_name: 'Salmon', calories: 208, protein: 20, carbs: 0, fats: 13 },
    beef: { food_name: 'Beef', calories: 250, protein: 26, carbs: 0, fats: 15 },
    tofu: { food_name: 'Tofu', calories: 76, protein: 8, carbs: 2, fats: 4 },
    broccoli: { food_name: 'Broccoli', calories: 34, protein: 3, carbs: 7, fats: 0 },
    oatmeal: { food_name: 'Oatmeal', calories: 68, protein: 2, carbs: 12, fats: 1 },
    yogurt: { food_name: 'Yogurt', calories: 59, protein: 10, carbs: 3, fats: 0 },
  };

  for (const [key, food] of Object.entries(commonFoods)) {
    if (q.includes(key)) {
      return [{
        ...food,
        serving_qty: 100,
        serving_unit: 'g',
      }];
    }
  }

  return [{
    food_name: query.trim(),
    serving_qty: 100,
    serving_unit: 'g',
    calories: 100,
    protein: 5,
    carbs: 15,
    fats: 3,
  }];
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
    searchUrl.searchParams.set('search_terms', query.trim());
    searchUrl.searchParams.set('search_simple', '1');
    searchUrl.searchParams.set('action', 'process');
    searchUrl.searchParams.set('json', '1');
    searchUrl.searchParams.set('page_size', '20');
    searchUrl.searchParams.set('fields', 'product_name,nutriments,serving_size');

    console.log('[EDGE] Fetching:', searchUrl.toString());

    const response = await fetch(searchUrl.toString(), {
      headers: {
        'User-Agent': 'CalFit/1.0 (React Native App)',
        'Accept': 'application/json',
      },
    });

    const rawText = await response.text();
    console.log('[EDGE] Raw response length:', rawText.length);
    console.log('[EDGE] Response starts with:', rawText.substring(0, 50));

    if (rawText.trim().startsWith('<')) {
      console.error('[EDGE] API returned HTML instead of JSON - likely rate limited or blocked');
      console.log('[EDGE] Returning fallback foods');
      const fallbackFoods = getFallbackFoods(query);
      return new Response(JSON.stringify({ foods: fallbackFoods }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    let data;
    try {
      data = JSON.parse(rawText);
    } catch (e) {
      console.error('[EDGE] JSON parse failed:', e);
      console.log('[EDGE] Returning fallback foods due to parse error');
      const fallbackFoods = getFallbackFoods(query);
      return new Response(JSON.stringify({ foods: fallbackFoods }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const rawProductCount = data?.products?.length ?? 0;
    console.log('[EDGE] Raw products count:', rawProductCount);

    if (!data?.products || !Array.isArray(data.products) || rawProductCount === 0) {
      console.log('[EDGE] No products from API, returning fallback');
      const fallbackFoods = getFallbackFoods(query);
      return new Response(JSON.stringify({ foods: fallbackFoods }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const foods = data.products.slice(0, 20).map((item: any) => {
      const nutriments = item?.nutriments || {};

      return {
        food_name: item.product_name || 'Unknown food',
        serving_qty: 100,
        serving_unit: 'g',
        calories: Math.round(safeNumber(getCalories(nutriments))),
        protein: Math.round(safeNumber(nutriments['proteins_100g'])),
        carbs: Math.round(safeNumber(nutriments['carbohydrates_100g'])),
        fats: Math.round(safeNumber(nutriments['fat_100g'])),
      };
    });

    const cleanFoods = foods.filter(f => 
      f.food_name && 
      f.food_name !== 'Unknown food'
    );

    console.log('[EDGE] Returning', cleanFoods.length, 'foods');

    if (cleanFoods.length === 0) {
      console.log('[EDGE] No valid foods, returning fallback');
      const fallbackFoods = getFallbackFoods(query);
      return new Response(JSON.stringify({ foods: fallbackFoods }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ foods: cleanFoods }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('[EDGE] Unexpected error:', error);
    const fallbackFoods = getFallbackFoods('food');
    return new Response(JSON.stringify({ foods: fallbackFoods }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
