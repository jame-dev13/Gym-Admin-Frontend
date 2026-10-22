import { CalendarPlus } from "lucide-react";
import { lazy } from "react";
import { CommandBtn } from "@/components/buttons/Buttons";
import { useDrawerContext } from "@/context/useDrawerContext";
import { useEntityDomainContext } from "@/context/useEntityDomainContext";
import type { TableAction } from "@/types/SharedTypes";

const LazyCreateSubscriptionForm = lazy(() =>
  import("@/features/subscription/components/CreateSubscriptionForm").then(
    (mod) => ({
      default: mod.CreateSubscriptionForm,
    }),
  ),
);

export const SubscriptionTableActions = () => {
  const { entity } = useEntityDomainContext();
  const { isOpen: isDrawerOpen, openDrawer } = useDrawerContext();

  if (entity !== "subscription") {
    throw new Error(
      "SubscriptionTableActions can only be used in subscription entity context",
    );
  }

  const handleAdd = () => {
    openDrawer({
      title: "Add Subscription",
      description: "Create a new customer subscription.",
      data: null,
      render: () => <LazyCreateSubscriptionForm />,
    });
  };

  const actions: TableAction[] = [
    {
      id: "add",
      label: "Add subscription",
      Icon: CalendarPlus,
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
          title={action.label}
          iconOnly
          disabled={action.disabled}
        >
          {action.label}
        </CommandBtn>
      ))}
    </div>
  );
};
