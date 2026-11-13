import { Badge } from "@/components/badge/Badge";
import { CommandBtn } from "@/components/buttons/Buttons";
import { SectionCard } from "@/features/current/components/SectionCard";
import type { SectionCardField } from "@/features/current/components/SectionCardTypes";
import { useFetchCurrentUserInfo } from "@/features/current/hooks/useFetchCurrent";
import type { CurrentUserResponse } from "@/features/current/types";
import { Pencil, UserRound } from "lucide-react";
import { useMemo } from "react";

export type CurrentUserSectionCardProps = Readonly<{
  onEdit?: (user: CurrentUserResponse) => void;
  className?: string;
}>;

export const CurrentUserSectionCard = ({
  onEdit,
  className,
}: CurrentUserSectionCardProps) => {
  const { data, error, isLoading } = useFetchCurrentUserInfo(true);
  const user = data?.data;

  const fields = useMemo<ReadonlyArray<SectionCardField>>(() => {
    if (!user) return [];

    const roles =
      user.roles.length > 0 ? (
        <span className="flex flex-wrap gap-1.5">
          {user.roles.map((role) => (
            <Badge key={role} variant="indigo" leading="dot">
              {role}
            </Badge>
          ))}
        </span>
      ) : undefined;

    return [
      {
        key: "name",
        label: "Name",
        value: user.name,
        emptyValue: "Not available",
      },
      {
        key: "email",
        label: "Email",
        value: user.email,
        emptyValue: "Not available",
      },
      {
        key: "roles",
        label: "Roles",
        value: roles,
        emptyValue: "No roles assigned",
      },
    ];
  }, [user]);

  return (
    <SectionCard
      title="Personal information"
      description="Your profile details and the roles granted to this account."
      Icon={UserRound}
      fields={fields}
      isLoading={isLoading}
      errorMessage={!user && error ? error.message : null}
      emptyMessage="No personal information available."
      className={className}
      actions={
        user && onEdit ? (
          <CommandBtn
            Icon={Pencil}
            title="Edit current user information"
            aria-label="Edit current user information"
            onClick={() => onEdit(user)}
          >
            Edit
          </CommandBtn>
        ) : undefined
      }
    />
  );
};

export default CurrentUserSectionCard;
