import Constants from 'expo-constants';

type RuntimeConfig = {
  supabaseUrl: string;
  supabaseAnonKey: string;
  aiModel: string;
};

const extra =
  Constants.expoConfig?.extra ??
  (Constants as typeof Constants & {
    manifest2?: { extra?: Record<string, string> };
  }).manifest2?.extra ??
  {};

export const runtimeConfig: RuntimeConfig = {
  supabaseUrl: typeof extra.supabaseUrl === 'string' ? extra.supabaseUrl : '',
  supabaseAnonKey: typeof extra.supabaseAnonKey === 'string' ? extra.supabaseAnonKey : '',
  aiModel:
    typeof extra.aiModel === 'string' && extra.aiModel.trim().length > 0
      ? extra.aiModel
      : '',
};

export const assertBackendConfig = () => {
  if (!runtimeConfig.supabaseUrl || !runtimeConfig.supabaseAnonKey) {
    throw new Error(
      'Missing backend configuration. Set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY.'
    );
  }

  return runtimeConfig;
};
