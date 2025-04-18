import { MD3LightTheme, configureFonts } from 'react-native-paper';

export const COLORS = {
  primary: '#4CAF50', // Green color similar to Lifesum
  secondary: '#2E7D32',
  background: '#FFFFFF',
  surface: '#F5F5F5',
  text: '#1A1A1A',
  textSecondary: '#757575',
  border: '#E0E0E0',
  error: '#B00020',
  success: '#4CAF50',
};

const baseFontConfig = {
  fontFamily: 'System',
  letterSpacing: 0,
  fontWeight: '400' as const,
  lineHeight: 20,
  fontSize: 14,
};

const fontConfig = {
  web: baseFontConfig,
  ios: baseFontConfig,
  android: baseFontConfig,
};

export const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: COLORS.primary,
    background: COLORS.background,
    surface: COLORS.surface,
    error: COLORS.error,
    onPrimary: '#FFFFFF',
    onSurface: COLORS.text,
    outline: COLORS.border,
  },
  fonts: configureFonts({ config: fontConfig }),
};