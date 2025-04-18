import { User as SupabaseUser } from '@supabase/supabase-js';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  date_of_birth?: string;
  height?: number;
  weight?: number;
  activity_level?: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active';
  health_goal?: 'lose_weight' | 'maintain_weight' | 'gain_muscle';
  preferred_units?: 'metric' | 'imperial';
  created_at: string;
  updated_at: string;
}

export type User = SupabaseUser;

export interface AuthState {
  user: User | null;
  session: any | null;
  loading: boolean;
} 