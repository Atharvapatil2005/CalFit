import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri } from 'expo-auth-session';
import { supabase } from '../lib/supabase';

// Types
export type Meal = {
  id: string;
  user_id: string;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  food_name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  timestamp: string;
  created_at: string;
};

export type MealInsert = Omit<Meal, 'id' | 'created_at'>;

// Meal operations
export const addMeal = async (meal: MealInsert) => {
  const { data, error } = await supabase
    .from('meals')
    .insert([meal])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getTodayMeals = async (userId: string | null) => {
  if (!userId) {
    return [];
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const { data, error } = await supabase
    .from('meals')
    .select('*')
    .eq('user_id', userId)
    .gte('timestamp', today.toISOString())
    .order('timestamp', { ascending: true });

  if (error) throw error;
  return data;
};

export const deleteMeal = async (mealId: string) => {
  const { error } = await supabase
    .from('meals')
    .delete()
    .eq('id', mealId);

  if (error) throw error;
};

export const updateMeal = async (mealId: string, updates: Partial<Meal>) => {
  const { data, error } = await supabase
    .from('meals')
    .update(updates)
    .eq('id', mealId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Auth helper functions
export const signInWithGoogle = async () => {
  try {
    const redirectUrl = makeRedirectUri({
      path: 'login-callback',
    });
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
        skipBrowserRedirect: false,
      },
    });

    if (error) throw error;

    if (data?.url) {
      const result = await WebBrowser.openAuthSessionAsync(
        data.url,
        redirectUrl
      );
      
      if (result.type === 'success') {
        const { url } = result;
        if (url) {
          const params = new URL(url).searchParams;
          const access_token = params.get('access_token');
          const refresh_token = params.get('refresh_token');
          
          if (access_token && refresh_token) {
            const { data: { session }, error: sessionError } = await supabase.auth.setSession({
              access_token,
              refresh_token,
            });
            if (sessionError) throw sessionError;
            return { session };
          }
        }
      }
    }
    
    return null;
  } catch (error) {
    throw error;
  }
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) {
      if (error.message.includes('Auth session missing')) {
        return null;
      }
      throw error;
    }
    return user;
  } catch (error) {
    return null;
  }
};
