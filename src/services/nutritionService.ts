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

export const searchFood = async (query: string): Promise<FoodItem[]> => {
  const { supabaseUrl, supabaseAnonKey } = assertBackendConfig();

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

  if (!response.ok) {
    const message =
      (json?.error as string | undefined) ||
      text ||
      'Food search is temporarily unavailable.';

    throw new HttpError(message, response.status, text);
  }

  if (!json) {
    throw new Error('Food search returned a non-JSON response');
  }

  if (!json.foods || !Array.isArray(json.foods)) {
    throw new Error('Invalid response format from food search backend');
  }

  return json.foods.map((food: any) => ({
    food_name: food.food_name,
    serving_qty: food.serving_qty,
    serving_unit: food.serving_unit,
    serving_weight_grams: food.serving_weight_grams,
    calories: Math.round(food.nf_calories),
    protein: Math.round(food.nf_protein),
    carbs: Math.round(food.nf_total_carbohydrate),
    fats: Math.round(food.nf_total_fat),
  }));
};
