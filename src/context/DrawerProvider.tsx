import type { ReactNode } from "react";
import { useCallback, useMemo, useState } from "react";
import { DrawerContext } from "./DrawerContext";
import type { ActiveDrawer, OpenDrawerOptions } from "./DrawerContext";
import type { DrawerPosition, DrawerSize } from "@/types/Types";

interface DrawerProviderProps {
  children: ReactNode;
}

const DEFAULT_POSITION: DrawerPosition = "right";
const DEFAULT_SIZE: DrawerSize = "md";

/**
 * Binds `data` to its `render` at the call site, so the stored content is
 * self-contained and the non-generic context never needs an assertion.
 */
const toActiveDrawer = <T,>(options: OpenDrawerOptions<T>): ActiveDrawer => ({
  title: options.title,
  description: options.description,
  position: options.position ?? DEFAULT_POSITION,
  size: options.size ?? DEFAULT_SIZE,
  showCloseButton: options.showCloseButton ?? true,
  closeOnOverlayClick: options.closeOnOverlayClick ?? true,
  content: () => options.render(options.data),
});

export const DrawerProvider = ({ children }: DrawerProviderProps) => {
  const [activeDrawer, setActiveDrawer] = useState<ActiveDrawer | null>(null);

  const openDrawer = useCallback(<T,>(options: OpenDrawerOptions<T>) => {
    if (!options.title.trim()) {
      throw new Error("Drawer title must not be empty");
    }
    setActiveDrawer(toActiveDrawer(options));
  }, []);

  const closeDrawer = useCallback(() => setActiveDrawer(null), []);

  const value = useMemo(
    () => ({
      isOpen: activeDrawer !== null,
      activeDrawer,
      openDrawer,
      closeDrawer,
    }),
    [activeDrawer, openDrawer, closeDrawer],
  );

  return (
    <DrawerContext.Provider value={value}>{children}</DrawerContext.Provider>
  );
};
