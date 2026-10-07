import type { SelectOption } from "@/types/Types";
import type { UserRequest } from "@/features/user/types";

export type AuthProvider = UserRequest["authProvider"];

export const AUTH_PROVIDER_OPTIONS: ReadonlyArray<SelectOption> = [
  { value: "LOCAL", label: "Local" },
  { value: "GOOGLE", label: "Google" },
  { value: "FACEBOOK", label: "Facebook" },
];

export const AUTH_PROVIDERS: ReadonlyArray<AuthProvider> = [
  "LOCAL",
  "GOOGLE",
  "FACEBOOK",
];

export const USER_ROLE_OPTIONS: ReadonlyArray<SelectOption> = [
  { value: "ADMIN", label: "Admin" },
  { value: "CUSTOMER", label: "Customer" },
];
