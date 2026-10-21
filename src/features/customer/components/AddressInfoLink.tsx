import { PopoverLink } from "@/components/popover";
import type { CustomerResponse } from "@/features/customer/types";
import { CircleQuestionMark } from "lucide-react";
import { type FC } from "react";

const ADDRESS_INFO_FALLBACK = {
  city: "UNSET",
  colony: "UNSET",
  locality: "UNSET",
  street: "UNSET",
  homeNumber: "#",
  cp: "NO-CP",
} satisfies CustomerResponse["addressInfo"];

export const AddressInfoLink: FC<{ customer: CustomerResponse }> = ({
  customer,
}) => {
  if (!customer)
    return (
      <CircleQuestionMark className="bg-amber-400 p-2 rounded-full text-amber-700" />
    );
  return (
    <PopoverLink
      label="Customer's address details"
      data={customer.addressInfo ?? ADDRESS_INFO_FALLBACK}
      render={(data) => (
        <ul
          className="flex flex-col list-none rounded-2xl bg-surface-secondary"
          key={customer.id}
        >
          {Object.entries(data).map(([key, value]) => (
            <li className="inline-flex items-center-safe gap-2 p-2 italic">
              <span className="capitalize">
                {key}
                {": "}
              </span>
              <strong className="capitalize">{value ?? "UNSET"}</strong>
            </li>
          ))}
        </ul>
      )}
    >
      <p>See Address Details</p>
    </PopoverLink>
  );
};
