import { EmailInput } from "@/components/input/Input";
import { MembershipSelect } from "@/features/subscription/components/MembershipSelect";
import type { SubscriptionAdminRequest } from "@/features/subscription/types";

type SubscriptionFormFieldConfig = {
  key: string;
  label: string;
  name: keyof SubscriptionAdminRequest;
  Field: typeof EmailInput | typeof MembershipSelect;
  ariaLabel: string;
  required: boolean;
};

const subscriptionFormConfig: readonly SubscriptionFormFieldConfig[] = [
  {
    key: "customer-email-field",
    label: "Customer Email",
    name: "customerEmail",
    Field: EmailInput,
    ariaLabel: "Customer email input field.",
    required: true,
  },
  {
    key: "membership-field",
    label: "Membership",
    name: "membership",
    Field: MembershipSelect,
    ariaLabel: "Membership selector.",
    required: true,
  },
];

export const getSubscriptionFormConfig = () => subscriptionFormConfig;
