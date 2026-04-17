import { useThemeContext } from './ThemeContext';

export const useTheme = () => {
  const { resolvedTheme } = useThemeContext();
  return resolvedTheme;
};
