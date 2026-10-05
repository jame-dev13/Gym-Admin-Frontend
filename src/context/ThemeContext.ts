import { createContext } from "react";
import type { ThemeMode } from "@/types/Types";

export const THEME_STORAGE_KEY = "gym-admin-theme";

export interface ThemeContextValue {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggle: () => void;
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);

export const isThemeMode = (value: unknown): value is ThemeMode => {
  return value === "dark" || value === "light";
};
