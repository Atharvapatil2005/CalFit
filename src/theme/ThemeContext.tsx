import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useColorScheme, Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightTheme, darkTheme } from './colors';

type ThemeMode = 'system' | 'light' | 'dark';

interface ThemeContextType {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => Promise<void>;
  resolvedTheme: typeof lightTheme;
}

const STORAGE_KEY = 'theme_preference';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadPreference = async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved && ['system', 'light', 'dark'].includes(saved)) {
          setThemeModeState(saved as ThemeMode);
        }
      } catch {
        // Use default on error
      } finally {
        setIsLoaded(true);
      }
    };
    loadPreference();
  }, []);

  const setThemeMode = useCallback(async (mode: ThemeMode) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, mode);
      setThemeModeState(mode);
    } catch {
      // Keep previous state on error
    }
  }, []);

  const resolvedTheme = useMemo(() => {
    if (themeMode === 'system') {
      return systemColorScheme === 'dark' ? darkTheme : lightTheme;
    }
    return themeMode === 'dark' ? darkTheme : lightTheme;
  }, [themeMode, systemColorScheme]);

  const value = useMemo(() => ({
    themeMode,
    setThemeMode,
    resolvedTheme,
  }), [themeMode, setThemeMode, resolvedTheme]);

  if (!isLoaded) {
    return null;
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeContext() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
}

export function useThemeMode() {
  const { themeMode, setThemeMode } = useThemeContext();
  return { themeMode, setThemeMode };
}
