import 'dotenv/config';

export default {
  expo: {
    name: "CalFit",
    slug: "calfit",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./my-app/images/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./my-app/images/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.calfit.app",
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false
      }
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./my-app/images/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      package: "com.calfit.app"
    },
    web: {
      favicon: "./my-app/images/favicon.png"
    },
    plugins: ["expo-router"],
    scheme: "calfit",
    extra: {
      supabaseUrl: "https://dnpizhnpcioigfgwgllh.supabase.co",
      supabaseAnonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRucGl6aG5wY2lvaWdmZ3dnbGxoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3ODAzNDQsImV4cCI6MjA1OTM1NjM0NH0.MOjyaYUYmLd0W1bAe_7vDkyCt3ca8W1t_kXLzG9IlOc",
      router: {
        origin: false
      },
      eas: {
        projectId: "f736648b-47fb-41da-9f2c-3edc92a54e79"
      }
    },
    owner: "atharvapatil",
    runtimeVersion: {
      policy: "appVersion"
    },
    updates: {
      url: "https://u.expo.dev/f736648b-47fb-41da-9f2c-3edc92a54e79"
    }
  }
};