import type { Identifiable } from "@/types/Types";
import { createContext } from "react";

export type SelectionContextType = {
  currentSelection: Identifiable | null;
  setCurrentSelection: (row: Identifiable | null) => void;
  clearSelection: () => void;
};

export const SelectionContext = createContext<SelectionContextType | null>(
  null,
);
