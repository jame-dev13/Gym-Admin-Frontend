import { Dropdown } from "@/components/dropdown/Dropdown";
import { useDrawerContext } from "@/context/useDrawerContext";
import { Bolt, CreditCardIcon, UserPlus } from "lucide-react";
import { lazy, type ReactNode } from "react";

type QuickCommandProperties = {
  id: string;
  text: string;
  desc: string;
  Element: ReactNode;
};

type QuickCommandType = {
  addMember: QuickCommandProperties;
  addMembershipPlan: QuickCommandProperties;
};

const CreateUserForm = lazy(() =>
  import("@/features/user/components/UserCreateForm").then((mod) => ({
    default: mod.UserCreateForm,
  })),
);

const COMMAND_VALUES: QuickCommandType = {
  addMember: {
    id: "add-member",
    text: "Add member",
    desc: "Add a user member.",
    Element: <CreateUserForm />,
  },
  addMembershipPlan: {
    id: "add-membership-plan",
    text: "Add Membership Plan",
    desc: "Add a new membership",
    Element: <div>Panel in development.....</div>,
  },
};

export const DropdownQuickCommands = () => {
  const { openDrawer, isOpen } = useDrawerContext();

  const handleOnSelect = (value: string | null) => {
    if (!value || !Object.values(COMMAND_VALUES).find((v) => v.id === value))
      return;

    const current =
      value === COMMAND_VALUES.addMember.id
        ? COMMAND_VALUES.addMember
        : COMMAND_VALUES.addMembershipPlan;

    const title = current.text;
    const description = current.desc;

    openDrawer({
      size: "sm",
      position: "left",
      data: undefined,
      title,
      description,
      render: () => <>{current.Element}</>,
    });
  };
  return (
    <Dropdown
      options={[
        {
          value: COMMAND_VALUES.addMember.id,
          label: COMMAND_VALUES.addMember.text,
          description: COMMAND_VALUES.addMember.desc,
          Icon: UserPlus,
        },
        {
          value: COMMAND_VALUES.addMembershipPlan.id,
          label: COMMAND_VALUES.addMembershipPlan.text,
          description: COMMAND_VALUES.addMembershipPlan.desc,
          Icon: CreditCardIcon,
        },
      ]}
      disabled={isOpen}
      onSelect={handleOnSelect}
      label="Quick commands"
      size="sm"
      placement="bottom-start"
      Icon={Bolt}
      aria-label="Dropdown quick commands"
      className="w-fit"
      placeholder="Quick Commands"
    />
  );
};
