import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri } from 'expo-auth-session';
import * as SecureStore from 'expo-secure-store';

// Initialize Supabase client
const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl;
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase configuration. Please check your app.config.ts and environment variables.');
}

// SecureStore adapter for Supabase auth
const secureStorageAdapter = {
  getItem: (key: string) => {
    return SecureStore.getItemAsync(key);
  },
  setItem: (key: string, value: string) => {
    return SecureStore.setItemAsync(key, value);
  },
  removeItem: (key: string) => {
    return SecureStore.deleteItemAsync(key);
  },
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: secureStorageAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false
  },
});

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

// Meal operations
export const addMeal = async (meal: Omit<Meal, 'id' | 'created_at' | 'user_id'>) => {
  const { data, error } = await supabase
    .from('meals')
    .insert([meal])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getTodayMeals = async (userId: string | null) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let query = supabase
    .from('meals')
    .select('*')
    .gte('timestamp', today.toISOString())
    .order('timestamp', { ascending: true });

  if (userId) {
    query = query.or(`user_id.eq.${userId},user_id.is.null`);
  } else {
    query = query.is('user_id', null);
  }

  const { data, error } = await query;
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
      path: '/auth/callback',
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
    console.error('Error signing in with Google:', error);
    throw error;
  }
};

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) {
      // If it's an auth session missing error, return null instead of throwing
      if (error.message.includes('Auth session missing')) {
        return null;
      }
      throw error;
    }
    return user;
  } catch (error) {
    console.error('Error getting current user:', error);
    // For other errors, return null to indicate no authenticated user
    return null;
  }
}; 