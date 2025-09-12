import 'dotenv/config';
import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  name: 'CalFit',
  slug: 'calfit',
  version: '1.0.0',
  orientation: 'portrait',
  userInterfaceStyle: 'light',
  assetBundlePatterns: [
    '**/*'
  ],
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.atharvapatil.calfit'
  },
  android: {
    package: 'com.atharvapatil.calfit'
  },
  web: {
    favicon: './assets/favicon.png'
  },
  plugins: [
    'expo-router'
  ],
  scheme: 'calfit',
  extra: {
    eas: {
      projectId: process.env.EAS_PROJECT_ID
    },
    supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
    supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
    openRouterApiKey: process.env.EXPO_PUBLIC_OPENROUTER_API_KEY,
    httpReferer: process.env.EXPO_PUBLIC_HTTP_REFERER,
    aiModel: process.env.EXPO_PUBLIC_AI_MODEL || 'microsoft/phi-4-reasoning-plus:free'
  }
});