import type { AvatarSize, AvatarStatus, AvatarUser, AvatarMenuItem } from "@/types/SharedTypes";
import type { AvatarMenuPlacement } from "@/components/dropdown/DropdownTypes";

export interface AvatarProps {
  name?: string;
  src?: string;
  size?: AvatarSize;
  status?: AvatarStatus;
  className?: string;
}

export interface AvatarMenuProps {
  user: AvatarUser;
  items?: AvatarMenuItem[];
  onAction?: (value: string) => void;
  size?: AvatarSize;
  placement?: AvatarMenuPlacement;
  disabled?: boolean;
  "aria-label"?: string;
  className?: string;
}