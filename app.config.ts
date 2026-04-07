import 'dotenv/config';

const requiredEnvVars = [
  'EXPO_PUBLIC_SUPABASE_URL',
  'EXPO_PUBLIC_SUPABASE_ANON_KEY',
  'EAS_PROJECT_ID',
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar] || !process.env[envVar].trim()) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

export default function appConfig() {
  return {
    name: 'CalFit',
    slug: 'calfit',
    version: '1.0.0',
    orientation: 'portrait',
    userInterfaceStyle: 'light',

    // ✅ temporary remote icon
    icon: 'https://via.placeholder.com/1024.png?text=CF',

    assetBundlePatterns: ['**/*'],

    ios: {
      supportsTablet: true,
      icon: 'https://via.placeholder.com/1024.png?text=CF',
      bundleIdentifier: 'com.atharvapatil.calfit',
    },

    android: {
      package: 'com.atharvapatil.calfit',
      adaptiveIcon: {
        foregroundImage: 'https://via.placeholder.com/1024.png?text=CF',
        backgroundColor: '#4CAF50',
      },
    },

    splash: {
      image: 'https://via.placeholder.com/1024.png?text=CF',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },

    web: {
      favicon: 'https://via.placeholder.com/48.png?text=CF',
    },

    plugins: ['expo-router'],
    scheme: 'calfit',
    owner: 'atharvapatil',
    runtimeVersion: '1.0.0',

    // ✅ keep new architecture ON
    newArchEnabled: true,

    extra: {
      eas: {
        projectId: process.env.EAS_PROJECT_ID,
      },
      supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
      supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
      aiModel:
        process.env.EXPO_PUBLIC_AI_MODEL ||
        'microsoft/phi-4-reasoning-plus:free',
    },
  };
}