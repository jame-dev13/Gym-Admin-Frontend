import { TableRowActions } from "@/components/table/TableRowActions";
import { useActionContext } from "@/context/useActionContext";
import { useDrawerContext } from "@/context/useDrawerContext";
import { useEntityDomainContext } from "@/context/useEntityDomainContext";
import { useModalContext } from "@/context/useModalContext";
import { useSelectionContext } from "@/context/useSelectionContext";
import type { CustomerResponse } from "@/features/customer/types";
import type { RowAction } from "@/types/Types";
import { Edit, Trash } from "lucide-react";
import { type FC } from "react";

export const CustomerTableControls: FC<{ row: CustomerResponse }> = ({
  row,
}) => {
  const { setCurrentSelection: setId } = useSelectionContext();
  const { entity } = useEntityDomainContext();
  const { setAction } = useActionContext();
  const { openDrawer, isOpen: isDrawerOpen } = useDrawerContext();
  const { openModal, isOpen: isModalOpen } = useModalContext();

  if (entity !== "customer")
    throw new Error(
      `Wrong value context detected: ${entity} required: 'customer'`,
    );

  const actions: RowAction<CustomerResponse>[] = [
    {
      id: "update-customer",
      Icon: Edit,
      label: "Edit",
      disabled: isDrawerOpen,
      onSelect: (r) => {
        setId(r);
        setAction("edit");
        openDrawer({
          title: "Edit customer",
          description: `Editing ${r.customerName} customer info.`,
        });
      },
    },
    {
      id: "remove-customer",
      Icon: Trash,
      label: "Remove",
      destructive: true,
      disabled: isModalOpen,
      onSelect: (r) => {
        setId({ id: r.id });
        setAction("delete");
        openModal({
          title: "Remove Customer",
          size: "sm",
          description: `Removing ${r.customerName} data from application.`,
        });
      },
    },
  ];
  return (
    <>
      <TableRowActions actions={actions} row={row} />
    </>
  );
};
