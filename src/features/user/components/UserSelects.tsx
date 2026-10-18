import { Select } from "@/components/input/Select";
import type { FC } from "react";

type UserSelectProps = {
  defaultValue?: string;
  value?: string;
  label?: string;
  ariaLabel?: string;
};

export const RoleSelect: FC<UserSelectProps> = ({
  ariaLabel,
  defaultValue,
  label,
  value,
}) => {
  return (
    <>
      <Select
        name="roles"
        aria-label={ariaLabel}
        defaultValue={defaultValue}
        value={value}
        label={label ?? "Roles"}
        options={[
          { label: "User", value: "USER" },
          { label: "Admin", value: "ADMIN" },
        ]}
        description="Role user's select."
      />
    </>
  );
};
