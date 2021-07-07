export { Themed } from "./src/Theme";
import { defaultTheme } from "./themes/default";
export type Theme = typeof defaultTheme;

export { defaultTheme as DefaultTheme };
export { useThemeService, ThemeService } from './src/ThemeService';