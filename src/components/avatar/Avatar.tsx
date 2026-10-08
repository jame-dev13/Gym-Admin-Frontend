import { User } from "lucide-react";
import { getInitials } from "./getInitials";
import type { AvatarProps } from "./AvatarTypes";
import type { AvatarSize } from "@/types/SharedTypes";

const sizeClasses: Record<AvatarSize, string> = {
  sm: "size-8 text-xs",
  md: "size-10 text-sm",
  lg: "size-12 text-base",
};

const iconSizes: Record<AvatarSize, number> = {
  sm: 16,
  md: 18,
  lg: 22,
};

const statusClasses: Record<Exclude<AvatarProps["status"], undefined>, string> = {
  online: "bg-success",
  busy: "bg-warning",
  offline: "bg-text-tertiary",
  none: "hidden",
};

export const Avatar = ({
  name = "",
  src,
  size = "md",
  status = "none",
  className = "",
}: AvatarProps) => {
  const initials = getInitials(name);

  return (
    <span
      aria-hidden="true"
      className={`relative inline-flex shrink-0 items-center justify-center overflow-visible rounded-full border border-border bg-surface-over font-semibold text-text-primary ${sizeClasses[size]} ${className}`}
    >
      {src ? (
        <img
          src={src}
          alt=""
          className="size-full rounded-full object-cover"
          loading="lazy"
          draggable={false}
        />
      ) : initials ? (
        <span aria-hidden="true" className="select-none tracking-wide">
          {initials}
        </span>
      ) : (
        <User size={iconSizes[size]} aria-hidden="true" className="text-text-secondary" />
      )}
      <span
        aria-hidden="true"
        className={`absolute -right-0.5 -bottom-0.5 size-2.5 rounded-full ring-2 ring-surface ${statusClasses[status]}`}
      />
    </span>
  );
};
