import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri } from 'expo-auth-session';
import { Session } from '@supabase/supabase-js';
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

export type UserProfileInsert = {
  id: string;
  email: string;
  full_name?: string | null;
  gender?: 'male' | 'female' | null;
  age?: number | null;
  height?: number | null;
  weight?: number | null;
  health_goal?: 'lose_weight' | 'maintain_weight' | 'gain_weight' | null;
  additional_goals?: string[] | null;
  dietary_preference?: 'none' | 'vegetarian' | 'vegan' | 'pescatarian' | null;
  dietary_restrictions?: string[] | null;
  target_calories?: number | null;
};

const PROFILE_WRITE_SESSION_ERROR =
  'Your account was created, but your authenticated session was not ready to save your profile. Please sign in again to finish setup.';

const buildProfileWriteError = (error: { code?: string; message: string }) => {
  if (error.code === '42501') {
    return new Error(
      'Profile save was blocked by Supabase RLS. Confirm the `profiles` INSERT policy allows `auth.uid() = id`.'
    );
  }

  return new Error(`Unable to save your profile: ${error.message}`);
};

const ensureProfileWriteSession = async (
  expectedUserId: string,
  session?: Session | null
) => {
  if (session?.access_token && session.refresh_token) {
    const { error } = await supabase.auth.setSession({
      access_token: session.access_token,
      refresh_token: session.refresh_token,
    });

    if (error) {
      throw new Error(PROFILE_WRITE_SESSION_ERROR);
    }
  }

  let activeSession: Session | null = null;

  try {
    const {
      data: { session: nextSession },
      error,
    } = await supabase.auth.getSession();

    if (error) {
      throw error;
    }

    activeSession = nextSession;
  } catch {
    throw new Error(PROFILE_WRITE_SESSION_ERROR);
  }

  if (!activeSession || activeSession.user.id !== expectedUserId) {
    throw new Error(PROFILE_WRITE_SESSION_ERROR);
  }

  return activeSession;
};

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

export const upsertProfile = async (
  profile: UserProfileInsert,
  session?: Session | null
) => {
  await ensureProfileWriteSession(profile.id, session);

  const { data, error } = await supabase
    .from('profiles')
    .upsert(profile, { onConflict: 'id' })
    .select()
    .single();

  if (error) throw buildProfileWriteError(error);
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
