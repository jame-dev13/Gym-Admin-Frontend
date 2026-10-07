import type { ChangeEvent, ReactNode, Ref, InputHTMLAttributes } from "react";
import { type LucideIcon } from "lucide-react";
import type { ChartDatum, ChartLegendItem, ChartSeries, ChartTooltipVariant, Column, DrawerPosition, DrawerSize, DropdownOption, Identifiable, NavbarLink, NavbarPosition, RowAction, SelectOption, SidebarSection, SortDirection, SortOption, TableAction, AvatarMenuItem, AvatarSize, AvatarStatus, AvatarUser } from "@/types/Types";
import type React from "react";

type AvailableIcon = LucideIcon;

type InputHTMLProps = InputHTMLAttributes<HTMLInputElement>;

export interface InputBaseProps {
  labelText?: string;
  Icon?: AvailableIcon;
  error?: string;
}

export type InputProps = InputBaseProps & InputHTMLProps;

export type TextInputProps = InputBaseProps &
  Pick<
    InputHTMLProps,
    | "aria-label"
    | "autoComplete"
    | "disabled"
    | "name"
    | "pattern"
    | "required"
    | "value"
    | "defaultValue"
  >;

export type EmailInputProps = InputBaseProps &
  Pick<
    InputHTMLProps,
    | "aria-label"
    | "autoComplete"
    | "disabled"
    | "name"
    | "pattern"
    | "readOnly"
    | "required"
    | "value"
    | "defaultValue"
  >;

export interface OtpInputProps {
  length?: number;
  name?: string;
  autoComplete?: string;
  required?: boolean;
  disabled?: boolean;
  "aria-label"?: string;
  value?: string;
  onChange?: (value: string) => void;
  onComplete?: (value: string) => void;
}

export type DateInputProps = InputBaseProps &
  Pick<
    InputHTMLProps,
    | "aria-label"
    | "disabled"
    | "min"
    | "max"
    | "name"
    | "value"
    | "defaultValue"
  >;

export type PhoneInputProps = InputBaseProps &
  Pick<
    InputHTMLProps,
    | "aria-label"
    | "autoComplete"
    | "defaultValue"
    | "disabled"
    | "maxLength"
    | "name"
    | "onChange"
    | "pattern"
    | "required"
  > & {
    separator?: string;
  };

export type NumberInputProps = InputBaseProps &
  Pick<
    InputHTMLProps,
    | "id"
    | "name"
    | "value"
    | "defaultValue"
    | "min"
    | "max"
    | "step"
    | "required"
    | "disabled"
    | "readOnly"
    | "className"
    | "aria-label"
    | "aria-describedby"
    | "autoComplete"
    | "title"
    | "onChange"
  >;

export type SearchInputProps = InputBaseProps &
  Pick<
    InputHTMLProps,
    | "id"
    | "name"
    | "placeholder"
    | "autoComplete"
    | "disabled"
    | "required"
    | "readOnly"
    | "value"
    | "defaultValue"
    | "className"
    | "aria-label"
    | "aria-describedby"
    | "onChange"
    | "onKeyDown"
    | "onFocus"
    | "onBlur"
  > & {
    onSearch?: (value: string) => void;
    onClear?: () => void;
    searchLabel?: string;
  };

export type CheckboxInputProps = Pick<
  InputHTMLProps,
  | "id"
  | "name"
  | "checked"
  | "defaultChecked"
  | "disabled"
  | "required"
  | "value"
  | "className"
  | "aria-label"
  | "aria-describedby"
  | "onChange"
  | "onFocus"
  | "onBlur"
> & {
  label: string;
  description?: string;
  error?: string;
  indeterminate?: boolean;
};

export interface LinkToBaseProps {
  to: string;
  Icon?: AvailableIcon;
  className?: string;
  label?: string;
}

export type LinkToProps = Partial<LinkToBaseProps> & {
  "aria-label"?: string;
};

export interface NavLinkProps {
  section?: string;
  className?: string;
}

export type NavLinkToProps = Partial<LinkToBaseProps>;

export interface ButtonBaseProps {
  Icon?: AvailableIcon;
  onClick?: () => void;
  "aria-label"?: string;
  children: ReactNode;
  disabled?: boolean;
  className?: string;
}

export type SubmitBtnProps = Omit<ButtonBaseProps, "type"> & {
  type?: "submit";
};

export type CommandBtnProps = ButtonBaseProps & {
  type?: "button" | "reset";
};

export interface SocialAuthButtonsProps {
  label?: string;
}

export interface AuthCardProps {
  animationClassName?: string;
  "aria-labelledby"?: string;
  children?: ReactNode;
}

export interface AuthHeaderProps {
  title: string;
  subtitle?: string;
  aside?: ReactNode;
}

export type PillBtnProps = ButtonBaseProps & {
  type?: "button" | "reset";
};

export interface SwitchBtnProps {
  checked: boolean;
  onCheckedChange?: (next: boolean) => void;
  onClick?: () => void;
  OnIcon?: AvailableIcon;
  OffIcon?: AvailableIcon;
  label?: string;
  disabled?: boolean;
  size?: "sm" | "md";
  className?: string;
  "aria-label"?: string;
}

export interface RefreshBtnProps {
  onClick?: () => void;
  Icon?: AvailableIcon;
  cooldownMs?: number;
  showCountdown?: boolean;
  label?: string;
  children?: ReactNode;
  disabled?: boolean;
  className?: string;
  "aria-label"?: string;
}

export interface BurgerBtnProps {
  open: boolean;
  controlsId: string;
  onToggle: () => void;
  buttonRef: Ref<HTMLButtonElement>;
}

export interface ThemeBtnProps {
  className?: string;
}

export interface PaginationProps {
  totalElements: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
  "aria-label"?: string;
  className?: string;
}

export type PropsWithChildren = { children?: ReactNode };

export interface AppFormProps {
  onSubmit: (e: React.SubmitEvent<HTMLFormElement>) => void;
  onChange?: (e: React.FormEvent<HTMLFormElement>) => void;
  children: ReactNode;
  id?: string;
  className?: string;
}

export interface FieldsetProps
  extends React.FieldsetHTMLAttributes<HTMLFieldSetElement> {
  legend?: string;
  children: ReactNode;
}

export type ModalSize = "sm" | "md" | "lg";

export interface ModalProps {
  title: string;
  children: ReactNode;
  size?: ModalSize;
}

export interface ToastProviderProps {
  children: ReactNode;
}

export interface ThemeProviderProps {
  children: ReactNode;
}

export type TableSize = "sm" | "md";

export type TableResponsive = "cards" | "scroll";

export type TableProps<T extends Identifiable> = {
  data: T[];
  columns: Column<T>[];
  caption?: string;
  "aria-label"?: string;
  emptyMessage?: string;
  getRowKey?: (row: T) => string | number;
  stickyHeader?: boolean;
  striped?: boolean;
  size?: TableSize;
  responsive?: TableResponsive;
  cardTitleKey?: keyof T;
  className?: string;
};

export interface TableRowActionsProps<T> {
  row: T;
  actions: RowAction<T>[];
  "aria-label"?: string;
}

export type TableLayoutProps<T extends Identifiable> = {
  title: string;
  description?: string;
  data: T[];
  columns: Column<T>[];
  caption?: string;
  "aria-label"?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  onSearchSubmit?: (value: string) => void;
  searchPlaceholder?: string;
  isSearchable?: boolean;
  sortOptions?: ReadonlyArray<SortOption<string>>;
  sortBy?: string;
  sortDirection?: SortDirection;
  onSortByChange?: (value: string) => void;
  onSortDirectionChange?: (direction: SortDirection) => void;
  sortLabel?: string;
  controls?: ReactNode;
  actions?: TableAction[];
  actionsLabel?: string;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  emptyMessage?: string;
  isLoading?: boolean;
  loadingMessage?: string;
  errorMessage?: string | null;
  striped?: boolean;
  size?: TableSize;
  responsive?: TableResponsive;
  cardTitleKey?: keyof T;
  stickyHeader?: boolean;
  getRowKey?: (row: T) => string | number;
  disabled?: boolean;
  className?: string;
};

export type DropdownSize = "sm" | "md";

export type DropdownPlacement = "bottom-start" | "bottom-end";

export type AvatarMenuPlacement = DropdownPlacement | "auto";

export interface DropdownProps {
  options: DropdownOption[];
  value?: string;
  defaultValue?: string;
  onSelect?: (value: string) => void;
  label?: string;
  Icon?: AvailableIcon;
  trigger?: ReactNode;
  placeholder?: string;
  disabled?: boolean;
  size?: DropdownSize;
  placement?: DropdownPlacement;
  "aria-label"?: string;
  className?: string;
}

export interface SelectProps {
  options: SelectOption[];
  label: string;
  name?: string;
  id?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (event: ChangeEvent<HTMLSelectElement>) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  description?: string;
  error?: string;
  className?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
}

export interface SortDropdownProps<T extends string = string> {
  options: ReadonlyArray<SortOption<T>>;
  value?: T;
  defaultValue?: T;
  onChange?: (value: T) => void;
  label?: string;
  Icon?: AvailableIcon;
  placeholder?: string;
  disabled?: boolean;
  size?: DropdownSize;
  placement?: DropdownPlacement;
  "aria-label"?: string;
  className?: string;
}

export interface SortDirectionToggleProps {
  direction: SortDirection;
  onToggle?: () => void;
  onChange?: (next: SortDirection) => void;
  disabled?: boolean;
  size?: DropdownSize;
  "aria-label"?: string;
  className?: string;
}

export interface SortControlsProps extends PropsWithChildren {
  label?: string;
  "aria-label"?: string;
  className?: string;
}

export interface NavbarProps {
  links: NavbarLink[];
  brand?: ReactNode;
  actions?: ReactNode;
  position?: NavbarPosition;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  "aria-label"?: string;
  className?: string;
}

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  position?: DrawerPosition;
  size?: DrawerSize;
  description?: string;
  headerActions?: ReactNode;
  footer?: ReactNode;
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  "aria-label"?: string;
  className?: string;
}

export interface SidebarProps {
  sections: SidebarSection[];
  brand: ReactNode;
  collapsedBrand?: ReactNode;
  footer?: ReactNode;
  defaultCollapsed?: boolean;
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  "aria-label"?: string;
  className?: string;
}

export type ChartTooltipEntry = {
  name?: string;
  value?: string | number;
  color?: string;
  dataKey?: string | number;
};

export interface ChartTooltipProps {
  variant?: ChartTooltipVariant;
  active?: boolean;
  label?: string | number;
  payload?: ChartTooltipEntry[];
  data?: ChartDatum[];
  xKey?: string;
  locale?: string;
  currency?: string;
}

export interface ChartBaseProps {
  data: ChartDatum[];
  height?: number;
  responsive?: boolean;
  animate?: boolean;
  "aria-label"?: string;
  className?: string;
}

export interface LineChartProps extends ChartBaseProps {
  series: ChartSeries[];
  xKey?: string;
  tooltipVariant?: ChartTooltipVariant;
  locale?: string;
  currency?: string;
}

export interface BarChartProps extends ChartBaseProps {
  series: ChartSeries[];
  xKey?: string;
  tooltipVariant?: ChartTooltipVariant;
  locale?: string;
  currency?: string;
}

export interface PieChartProps extends ChartBaseProps {
  dataKey?: string;
  nameKey?: string;
  tooltipVariant?: Extract<ChartTooltipVariant, "default" | "money">;
  locale?: string;
  currency?: string;
}

export interface ChartLegendProps {
  items: ChartLegendItem[];
}

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
