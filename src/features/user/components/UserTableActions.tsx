import { UserPlus } from "lucide-react";
import { CommandBtn } from "@/components/buttons/Buttons";
import { useToastContext } from "@/context/useToastContext";
import type { TableAction } from "@/types/SharedTypes";

export const UserTableActions = () => {
  const { show } = useToastContext();

  const actions: TableAction[] = [
    {
      id: "add",
      label: "Add user",
      Icon: UserPlus,
      onSelect: () => show("Add user action triggered", "info"),
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
        >
          {action.label}
        </CommandBtn>
      ))}
    </div>
  );
};