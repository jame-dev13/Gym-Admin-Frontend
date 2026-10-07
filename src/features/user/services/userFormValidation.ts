import type { UserUpdateRequest } from "@/features/user/types";
import { AUTH_PROVIDERS } from "@/features/user/services/userFormOptions";

export type UserFormErrors = Partial<
  Record<"name" | "email" | "password" | "authProvider" | "roles", string>
>;

type DraftValues = {
  name?: unknown;
  email?: unknown;
  password?: unknown;
  authProvider?: unknown;
  roles?: unknown;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateUserName = (value: unknown): string | undefined => {
  if (typeof value !== "string" || value.trim().length < 2) {
    return "Name must contain at least 2 characters";
  }
  return undefined;
};

export const validateUserEmail = (value: unknown): string | undefined => {
  if (typeof value !== "string" || !EMAIL_PATTERN.test(value.trim())) {
    return "Enter a valid email address";
  }
  return undefined;
};

export const validateUserPassword = (value: unknown): string | undefined => {
  if (typeof value !== "string" || value.length < 6) {
    return "Password must contain at least 6 characters";
  }
  return undefined;
};

export const validateUserAuthProvider = (value: unknown): string | undefined => {
  if (
    typeof value !== "string" ||
    !(AUTH_PROVIDERS as ReadonlyArray<string>).includes(value)
  ) {
    return "Select an auth provider";
  }
  return undefined;
};

export const validateUserRoles = (value: unknown): string | undefined => {
  if (
    !Array.isArray(value) ||
    value.length === 0 ||
    value.some((role) => typeof role !== "string" || role.trim().length === 0)
  ) {
    return "Select at least one role";
  }
  return undefined;
};

export const validateUserCreate = (values: DraftValues): UserFormErrors => {
  const errors: UserFormErrors = {};
  const name = validateUserName(values.name);
  const email = validateUserEmail(values.email);
  const password = validateUserPassword(values.password);
  const authProvider = validateUserAuthProvider(values.authProvider);
  const roles = validateUserRoles(values.roles);

  if (name) errors.name = name;
  if (email) errors.email = email;
  if (password) errors.password = password;
  if (authProvider) errors.authProvider = authProvider;
  if (roles) errors.roles = roles;
  return errors;
};

export const validateUserUpdate = (
  values: Partial<Pick<UserUpdateRequest, "name" | "email" | "roles">>,
): Pick<UserFormErrors, "name" | "email" | "roles"> => {
  const errors: Pick<UserFormErrors, "name" | "email" | "roles"> = {};
  const name = validateUserName(values.name);
  const email = validateUserEmail(values.email);
  const roles = validateUserRoles(values.roles);

  if (name) errors.name = name;
  if (email) errors.email = email;
  if (roles) errors.roles = roles;
  return errors;
};
