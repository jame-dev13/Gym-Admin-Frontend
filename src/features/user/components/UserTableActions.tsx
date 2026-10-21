import { UserPlus } from "lucide-react";
import { lazy } from "react";
import { CommandBtn } from "@/components/buttons/Buttons";
import { useEntityDomainContext } from "@/context/useEntityDomainContext";
import { useDrawerContext } from "@/context/useDrawerContext";
import type { TableAction } from "@/types/SharedTypes";

const LazyUserCreateForm = lazy(() =>
  import("@/features/user/components/UserCreateForm").then((mod) => ({
    default: mod.UserCreateForm,
  })),
);

export const UserTableActions = () => {
  const { entity } = useEntityDomainContext();
  const { isOpen: isDrawerOpen, openDrawer } = useDrawerContext();

  if (entity !== "user") {
    throw new Error("UserTableActions can only be used in user entity context");
  }

  const handleAdd = () => {
    openDrawer({
      title: "Add User",
      description: "Create a new user",
      data: null,
      render: () => <LazyUserCreateForm />,
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
