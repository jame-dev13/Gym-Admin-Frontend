import { Dropdown } from "@/components/dropdown/Dropdown";
import type { DropdownOption } from "@/types/SharedTypes";
import { CreditCardCheck, Link2, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

const OPTIONS: DropdownOption[] = [
  {
    label: "Manage Members",
    value: "/administration/services/users",
    description: "Navigate to /services/users to manage them",
    Icon: Users,
  },
  {
    label: "Manage Subscriptions",
    value: "/administration/services/subscriptions",
    description: "Navigate to /services/subscriptions to manage them.",
    Icon: CreditCardCheck,
  },
];

export const DropdownQuickLinks = () => {
  const navigate = useNavigate();

  const handleSelect = (value: string) => navigate(value);

  return (
    <>
      <Dropdown
        options={OPTIONS}
        Icon={Link2}
        onSelect={handleSelect}
        className="w-fit"
        size="sm"
        label="Quick Links"
        placeholder="Quick Links"
        placement="bottom-end"
        aria-label="Dropdown quick links"
      />
    </>
  );
};
