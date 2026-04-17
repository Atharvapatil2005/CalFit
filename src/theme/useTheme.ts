import { useColorScheme } from "react-native";
import { lightTheme, darkTheme } from "./colors";

export const useTheme = () => {
  const scheme = useColorScheme();
  return scheme === "dark" ? darkTheme : lightTheme;
};
