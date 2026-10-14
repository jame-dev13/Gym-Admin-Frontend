import { UserPlus } from "lucide-react";
import { CommandBtn } from "@/components/buttons/Buttons";
import { useEntityDomainContext } from "@/context/useEntityDomainContext";
import { useActionContext } from "@/context/useActionContext";
import { useDrawerContext } from "@/context/useDrawerContext";
import { useSelectionContext } from "@/context/useSelectionContext";
import type { TableAction } from "@/types/SharedTypes";

export const UserTableActions = () => {
  const { entity } = useEntityDomainContext();
  const { setAction } = useActionContext();
  const { isOpen: isDrawerOpen, openDrawer } = useDrawerContext();
  const { clearSelection } = useSelectionContext();

  if (entity !== "user") {
    throw new Error("UserTableActions can only be used in user entity context");
  }

  const handleAdd = () => {
    clearSelection();
    setAction("add");
    openDrawer({
      title: "Add User",
      description: "Create a new user",
    });
  };

  const actions: TableAction[] = [
    {
      id: "add",
      label: "Add user",
      Icon: UserPlus,
      disabled: isDrawerOpen,
      onSelect: handleAdd,
    },
  ];

  return (
    <div className="flex gap-2">
      {actions.map((action) => (
        <CommandBtn
          key={action.id}
          Icon={action.Icon}
          onClick={action.onSelect}
          aria-label={action.label}
          disabled={action.disabled}
        >
          {action.label}
        </CommandBtn>
      ))}
    </div>
  );
};