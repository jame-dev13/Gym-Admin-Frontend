import type { PropsWithChildren } from "@/components/form/FormTypes";
import { PopoverContext } from "@/context/PopoverContext";
import type { ActivePopover, OpenPopoverOptions } from "@/context/PopoverContext";
import { useCallback, useMemo, useState } from "react";

/**
 * Binds `data` to its `render` at the call site, so the stored content is
 * self-contained and the non-generic context never needs an assertion.
 */
const toActivePopover = <T,>(options: OpenPopoverOptions<T>): ActivePopover => ({
  anchor: options.anchor,
  label: options.label,
  content: () => options.render(options.data),
});

export const PopoverProvider = ({ children }: PropsWithChildren) => {
  const [activePopover, setActivePopover] = useState<ActivePopover | null>(null);

  const openPopover = useCallback(<T,>(options: OpenPopoverOptions<T>) => {
    setActivePopover(toActivePopover(options));
  }, []);

  const closePopover = useCallback(() => setActivePopover(null), []);

  const togglePopover = useCallback(<T,>(options: OpenPopoverOptions<T>) => {
    setActivePopover((current) =>
      current?.anchor === options.anchor ? null : toActivePopover(options),
    );
  }, []);

  const value = useMemo(
    () => ({
      isOpen: activePopover !== null,
      activePopover,
      openPopover,
      closePopover,
      togglePopover,
    }),
    [activePopover, openPopover, closePopover, togglePopover],
  );

  return (
    <PopoverContext.Provider value={value}>{children}</PopoverContext.Provider>
  );
};
