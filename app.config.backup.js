export default {
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
  assetBundlePatterns: [
    "**/*"
  ],
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.calfit.app',
    config: {
      usesNonExemptEncryption: false
    }
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#ffffff'
    },
    package: 'com.calfit.app',
    intentFilters: [
      {
        action: "VIEW",
        autoVerify: true,
        data: [
          {
            scheme: "calfit"
          }
        ],
        category: [
          "BROWSABLE",
          "DEFAULT"
        ]
      }
    ]
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
      projectId: 'f736648b-47fb-41da-9f2c-3edc92a54e79'
    }
  },
  owner: 'atharvapatil',
  runtimeVersion: {
    policy: 'appVersion'
  },
  updates: {
    url: 'https://u.expo.dev/f736648b-47fb-41da-9f2c-3edc92a54e79'
  }
}; 