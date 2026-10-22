import { TableRowActions } from "@/components/table/TableRowActions";
import { useDrawerContext } from "@/context/useDrawerContext";
import { useEntityDomainContext } from "@/context/useEntityDomainContext";
import { useModalContext } from "@/context/useModalContext";
import type { CustomerResponse } from "@/features/customer/types";
import type { RowAction } from "@/types/Types";
import { Edit, Trash } from "lucide-react";
import { lazy, type FC } from "react";

const LazyUpdateCustomerForm = lazy(() =>
  import("@/features/customer/components/UpdateCustomerForm").then((mod) => ({
    default: mod.UpdateCustomerForm,
  })),
);

const LazyDeleteCustomerDialog = lazy(() =>
  import("@/features/customer/components/DeleteCustomerDialog").then((mod) => ({
    default: mod.DeleteCustomerDialog,
  })),
);

export const CustomerTableControls: FC<{ row: CustomerResponse }> = ({
  row,
}) => {
  const { entity } = useEntityDomainContext();
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
        openDrawer({
          title: "Edit customer",
          description: `Editing ${r.customerName} customer info.`,
          data: r,
          render: (customer) => (
            <LazyUpdateCustomerForm customerId={customer.id} />
          ),
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
        openModal({
          title: "Remove Customer",
          size: "sm",
          description: "The customer will lose access and interaction for Customer's based operations in the App.",
          data: r,
          render: (customer) => (
            <LazyDeleteCustomerDialog
              customerId={customer.id}
              customerName={customer.customerName}
            />
          ),
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
