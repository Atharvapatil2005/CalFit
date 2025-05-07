export default {
  expo: {
    name: 'CalFit',
    slug: 'CalFit',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff'
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.atharvapatil.calfit'
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#ffffff'
      },
      package: 'com.atharvapatil.calfit'
    },
    web: {
      favicon: './assets/favicon.png'
    },
    extra: {
      openRouterApiKey: process.env.EXPO_PUBLIC_OPENROUTER_API_KEY,
      httpReferer: process.env.EXPO_PUBLIC_HTTP_REFERER,
      eas: {
        projectId: process.env.EAS_PROJECT_ID
      }
    },
    plugins: ['expo-router'],
    scheme: 'calfit'
  }
}; 