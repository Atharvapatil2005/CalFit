import { fetchWithTimeout, HttpError, readResponsePayload } from '../lib/http';
import { assertBackendConfig } from '../lib/runtimeConfig';

export type FoodItem = {
  food_name: string;
  serving_qty: number;
  serving_unit: string;
  serving_weight_grams: number;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
};

const safeNumber = (value: any): number => {
  const num = Number(value);
  return isNaN(num) ? 0 : num;
};

export const searchFood = async (query: string): Promise<FoodItem[]> => {
  const { supabaseUrl, supabaseAnonKey } = assertBackendConfig();

  console.log('[SERVICE] Searching for:', query);

  const response = await fetchWithTimeout(
    `${supabaseUrl}/functions/v1/nutrition-search`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${supabaseAnonKey}`,
      },
      body: JSON.stringify({ query }),
    },
    15000
  );

  const { json, text } = await readResponsePayload(response);

  console.log('[SERVICE] Response status:', response.status);
  console.log('[SERVICE] Raw response:', JSON.stringify(json));

  if (!response.ok) {
    const message =
      (json?.error as string | undefined) ||
      text ||
      'Food search is temporarily unavailable.';

    console.error('[SERVICE] HTTP Error:', message);
    throw new HttpError(message, response.status, text);
  }

  if (!json) {
    console.error('[SERVICE] Non-JSON response');
    throw new Error('Food search returned a non-JSON response');
  }

  if (!json.foods || !Array.isArray(json.foods)) {
    console.log('[SERVICE] No foods array in response');
    return [];
  }

  console.log('[SERVICE] Foods received:', json.foods.length);

  const mappedFoods = json.foods.map((food: any) => {
    const mapped = {
      food_name: food.food_name || 'Unknown',
      serving_qty: safeNumber(food.serving_qty),
      serving_unit: food.serving_unit || 'serving',
      serving_weight_grams: safeNumber(food.serving_weight_grams) || 100,
      calories: safeNumber(food.calories),
      protein: safeNumber(food.protein),
      carbs: safeNumber(food.carbs),
      fats: safeNumber(food.fats),
    };

    console.log('[SERVICE] Mapped food:', mapped.food_name, '| cal:', mapped.calories);
    return mapped;
  });

  console.log('[SERVICE] FRONTEND RECEIVED:', JSON.stringify(mappedFoods.slice(0, 2)));

  return mappedFoods;
};
