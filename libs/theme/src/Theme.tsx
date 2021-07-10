import { FunctionComponent } from "react";
import { useEffect, useState } from "react";
import { objectToCss } from "./objectToCss";
import { useThemeService } from "./ThemeService";

export interface ThemeProps {
  prefix?: string;
  theme?: Record<string, unknown>;
}

export const Themed: FunctionComponent<ThemeProps> = ({ prefix, theme, children }) => {
  const [currentTheme, setCurrentTheme] = useState<Record<string, unknown> | undefined>(theme);
  const themeService = useThemeService();


  useEffect(() => {
    if (!theme) {
      // If we don't have a theme then we can the theme from the theme service, which will
      // have current theme, and will broadcast changes
      const subscription = themeService.currentTheme.subscribe(setCurrentTheme);
      return () => subscription.unsubscribe();
    }
  }, [theme, setCurrentTheme, themeService]);

  useEffect(() => {
    const body = document.body || document.documentElement;
    if (currentTheme) {
      // Apply the theme to the body
      body.style.cssText = objectToCss(currentTheme, prefix || '--theme');
    } else {
      body.style.cssText = '';
    }
  }, [currentTheme, prefix]);

  return (
    <>
        {children}
    </>
  );
}