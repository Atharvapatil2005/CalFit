import Constants from 'expo-constants';

const NUTRITIONIX_APP_ID = process.env.EXPO_PUBLIC_NUTRITIONIX_APP_ID;
const NUTRITIONIX_APP_KEY = process.env.EXPO_PUBLIC_NUTRITIONIX_APP_KEY;

if (!NUTRITIONIX_APP_ID || !NUTRITIONIX_APP_KEY) {
  console.error('❌ Nutritionix credentials are missing from Constants');
}

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
  try {
    if (!NUTRITIONIX_APP_ID || !NUTRITIONIX_APP_KEY) {
      throw new Error('Nutritionix credentials are missing');
    }

    const response = await fetch('https://trackapi.nutritionix.com/v2/natural/nutrients', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-app-id': NUTRITIONIX_APP_ID,
        'x-app-key': NUTRITIONIX_APP_KEY,
      },
      body: JSON.stringify({
        query,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Nutritionix API Error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    
    if (!data.foods || !Array.isArray(data.foods)) {
      throw new Error('Invalid response format from Nutritionix API');
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
  } catch (error: any) {
    console.error('❌ Nutrition Service Error:', error.message);
    throw error;
  }
}; 