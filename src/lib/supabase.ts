import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dnpizhnpcioigfgwgllh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRucGl6aG5wY2lvaWdmZ3dnbGxoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3ODAzNDQsImV4cCI6MjA1OTM1NjM0NH0.MOjyaYUYmLd0W1bAe_7vDkyCt3ca8W1t_kXLzG9IlOc';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
}); 