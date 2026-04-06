import 'dotenv/config';
import { ExpoConfig, ConfigContext } from 'expo/config';

const requiredEnvVars = [
  'EXPO_PUBLIC_SUPABASE_URL',
  'EXPO_PUBLIC_SUPABASE_ANON_KEY',
  'EAS_PROJECT_ID',
] as const;

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]?.trim()) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

export default ({ config }: ConfigContext): ExpoConfig => ({
  name: 'CalFit',
  slug: 'calfit',
  version: '1.0.0',
  orientation: 'portrait',
  userInterfaceStyle: 'light',
  icon: './assets/icon.png',
  assetBundlePatterns: [
    '**/*'
  ],
  ios: {
    supportsTablet: true,
    icon: './assets/icon.png',
    bundleIdentifier: 'com.atharvapatil.calfit'
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#4CAF50'
    },
    package: 'com.atharvapatil.calfit'
  },
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff'
  },
  web: {
    favicon: './assets/favicon.png'
  },
  plugins: [
    'expo-router'
  ],
  scheme: 'calfit',
  owner: 'atharvapatil',
  runtimeVersion: {
    policy: 'appVersion'
  },
  newArchEnabled: true,
  extra: {
    eas: {
      projectId: process.env.EAS_PROJECT_ID!
    },
    supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL!,
    supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
    aiModel: process.env.EXPO_PUBLIC_AI_MODEL || 'microsoft/phi-4-reasoning-plus:free'
  }
});
