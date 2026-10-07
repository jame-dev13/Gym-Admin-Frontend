import { useCallback, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { DrawerContext } from "./DrawerContext";
import type { OpenDrawerOptions } from "./DrawerContext";
import type { DrawerPosition, DrawerSize } from "@/types/Types";

interface DrawerProviderProps {
  children: ReactNode;
}

interface DrawerConfig {
  title: string;
  description?: string;
  position: DrawerPosition;
  size: DrawerSize;
  showCloseButton: boolean;
  closeOnOverlayClick: boolean;
}

const DEFAULT_CONFIG: DrawerConfig = {
  title: "",
  description: undefined,
  position: "right",
  size: "md",
  showCloseButton: true,
  closeOnOverlayClick: true,
};

export const DrawerProvider = ({ children }: DrawerProviderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState<DrawerConfig>(DEFAULT_CONFIG);

  const openDrawer = useCallback((options: OpenDrawerOptions) => {
    if (!options.title.trim()) {
      throw new Error("Drawer title must not be empty");
    }
    setConfig({
      title: options.title,
      description: options.description,
      position: options.position ?? DEFAULT_CONFIG.position,
      size: options.size ?? DEFAULT_CONFIG.size,
      showCloseButton:
        options.showCloseButton ?? DEFAULT_CONFIG.showCloseButton,
      closeOnOverlayClick:
        options.closeOnOverlayClick ?? DEFAULT_CONFIG.closeOnOverlayClick,
    });
    setIsOpen(true);
  }, []);

  const closeDrawer = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggleDrawer = useCallback(() => {
    setIsOpen((previous) => !previous);
  }, []);

  // Stable callbacks + memoized value: without them every provider render
  // would hand consumers a new context identity and re-render them all.
  const value = useMemo(
    () => ({
      isOpen,
      title: config.title,
      description: config.description,
      position: config.position,
      size: config.size,
      showCloseButton: config.showCloseButton,
      closeOnOverlayClick: config.closeOnOverlayClick,
      openDrawer,
      closeDrawer,
      toggleDrawer,
    }),
    [isOpen, config, openDrawer, closeDrawer, toggleDrawer],
  );

  return (
    <DrawerContext.Provider value={value}>{children}</DrawerContext.Provider>
  );
};
