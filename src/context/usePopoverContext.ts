import { PopoverContext } from "@/context/PopoverContext";
import { useContext } from "react";

export const usePopoverContext = () => {
  const context = useContext(PopoverContext);
  if (!context) {
    throw new Error("usePopoverContext must be used within a PopoverProvider");
  }
  return context;
};
