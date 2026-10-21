import { CustomerForm } from '@/features/customer/components/CustomerForm';
import { useCreateCurrentCustomerHandler } from '@/features/customer/hooks/handlers/useCreateCustomerHandler';

export const CreateCurrentCustomerForm = () => {
  const { isPending, submit } = useCreateCurrentCustomerHandler();
  return (
    <CustomerForm mode="create" side="current" isPending={isPending} onSubmit={submit} />
  )
}
