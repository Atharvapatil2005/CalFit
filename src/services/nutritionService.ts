import Constants from 'expo-constants';

const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl;
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey;

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
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Food search is unavailable because the backend is not configured.');
  }

  const response = await fetch(`${supabaseUrl}/functions/v1/nutrition-search`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${supabaseAnonKey}`,
    },
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    throw new Error('Food search is temporarily unavailable. Use quick add until the `nutrition-search` Edge Function is deployed.');
  }

  const data = await response.json();

  if (!data.foods || !Array.isArray(data.foods)) {
    throw new Error('Invalid response format from food search backend');
  }

  return data.foods.map((food: any) => ({
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
