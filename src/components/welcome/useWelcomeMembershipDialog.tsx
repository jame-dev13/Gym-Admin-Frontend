import { useCallback } from "react";
import { useModalContext } from "@/context/useModalContext";
import { CreateCurrentCustomerDialog } from "@/features/customer/components/CreateCurrentCustomerDialog";

const WELCOME_MEMBERSHIP_MODAL = {
  title: "Customer profile registration",
  description: "Create your customer profile to activate your membership.",
  size: "sm",
} as const;

export const useWelcomeMembershipDialog = () => {
  const { openModal } = useModalContext();

  return useCallback(() => {
    openModal({
      ...WELCOME_MEMBERSHIP_MODAL,
      data: undefined,
      render: () => <CreateCurrentCustomerDialog />,
    });
  }, [openModal]);
};
