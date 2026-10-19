import { usePopoverContext } from "@/context/usePopoverContext";
import { Popover } from "./Popover";

export const PopoverHost = () => {
  const { activePopover, closePopover } = usePopoverContext();

  if (!activePopover) {
    return null;
  }

  return (
    <Popover
      anchor={activePopover.anchor}
      label={activePopover.label}
      onClose={closePopover}
    >
      {activePopover.content()}
    </Popover>
  );
};
