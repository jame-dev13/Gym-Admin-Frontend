import { SelectionContext } from "@/context/SelectionContext";
import { useContext } from "react";

export const useSelectionContext = () => {
  const ctx = useContext(SelectionContext);
  if (!ctx) throw new Error("SelectionContext has no provider.");
  return ctx;
};
