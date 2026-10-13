import type { PropsWithChildren } from "@/components/form/FormTypes";
import { SelectionContext } from "@/context/SelectionContext";
import type { Identifiable } from "@/types/Types";
import { useCallback, useMemo, useState } from "react";

export const SelectionProvider = ({ children }: PropsWithChildren) => {
  const [selection, setSelection] = useState<Identifiable | null>(null);

  const setCurrentSelection = useCallback((selection: Identifiable | null) => {
    setSelection(selection);
  }, []);

  const clearSelection = useCallback(() => setSelection(null), []);

  const contextValue = useMemo(
    () => ({
      currentSelection: selection,
      setCurrentSelection,
      clearSelection,
    }),
    [selection, setCurrentSelection, clearSelection],
  );

  return (
    <SelectionContext.Provider value={contextValue}>
      {children}
    </SelectionContext.Provider>
  );
};
