import { Select } from "@/components/input/Select";
import type { Membership } from "@/features/subscription/types";
import type { FC } from "react";

const MEMBERSHIP_OPTIONS = [
  { label: "Biweekly", value: "BIWEEKLY" },
  { label: "Monthly", value: "MONTHLY" },
  { label: "Quarterly", value: "QUARTERLY" },
  { label: "Annual", value: "ANNUAL" },
] satisfies { label: string; value: Membership }[];

export type MembershipSelectProps = {
  labelText?: string;
  name?: string;
  defaultValue?: string;
  value?: string;
  required?: boolean;
  disabled?: boolean;
  "aria-label"?: string;
};

export const MembershipSelect: FC<MembershipSelectProps> = ({
  labelText = "Membership",
  ...props
}) => {
  return (
    <Select
      options={MEMBERSHIP_OPTIONS}
      label={labelText}
      description="Membership plan selection."
      {...props}
    />
  );
};
