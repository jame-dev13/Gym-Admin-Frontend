import { FormSkeleton } from "@/components/skeleton";
import { useSelectionContext } from "@/context/useSelectionContext";
import { CustomerForm } from "@/features/customer/components/CustomerForm";
import { useGetCustomer } from "@/features/customer/hooks/api/useFetchCustomer";
import { useUpdateCustomerHandler } from "@/features/customer/hooks/handlers/useUpdateCustomerHandler";
import { requireId } from "@/utils/utils";

export const UpdateCustomerForm = () => {
  const { currentSelection: id } = useSelectionContext();

  void requireId(id);

  const { data, isLoading, error: fetchError } = useGetCustomer(id!);

  const customer = data?.data;

  const { submit, isPending } = useUpdateCustomerHandler();

  if (isLoading) {
    return <FormSkeleton showLegend fields={3} />;
  }

  if (fetchError || !customer) {
    return (
      <p role="alert" className="text-sm text-danger" aria-live="polite">
        {fetchError?.message ?? "User could not be loaded"}
      </p>
    );
  }
  return (
    <CustomerForm
      mode="update"
      isPending={isPending}
      onSubmit={submit}
      data={customer}
    />
  );
};
