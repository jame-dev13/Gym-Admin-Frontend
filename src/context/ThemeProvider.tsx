import { useCallback, useEffect, useMemo, useState } from "react";
import type { ThemeProviderProps } from "@/types/Props";
import type { ThemeMode } from "@/types/Types";
import { isThemeMode, THEME_STORAGE_KEY, ThemeContext } from "./ThemeContext";

const resolveInitialMode = (): ThemeMode => {
  const stored = window.localStorage.getItem(THEME_STORAGE_KEY);

  if (isThemeMode(stored)) {
    return stored;
  }

  if (
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-color-scheme: light)").matches
  ) {
    return "light";
  }

  return "dark";
};

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [mode, setMode] = useState<ThemeMode>(resolveInitialMode);

  const toggle = useCallback(() => {
    setMode((previous) => (previous === "dark" ? "light" : "dark"));
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("light", mode === "light");
    window.localStorage.setItem(THEME_STORAGE_KEY, mode);
  }, [mode]);

  const value = useMemo(
    () => ({
      mode,
      setMode,
      toggle,
    }),
    [mode, toggle],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
