import { EmailInput, PasswordInput, TextInput } from "@/components/input/Input";
import { RoleSelect } from "@/features/user/components/UserSelects";
import type { UserRequest, UserUpdateRequest } from "@/features/user/types";

type UserFormFieldConfig = {
  key: string;
  label: string;
  name: keyof UserRequest;
  Field:
    | typeof TextInput
    | typeof EmailInput
    | typeof PasswordInput
    | typeof RoleSelect;
  updatable: boolean;
  ariaLabel: string;
};

const userFormConfig: readonly UserFormFieldConfig[] = [
  {
    key: "name-field",
    label: "Name",
    name: "name",
    Field: TextInput,
    updatable: true,
    ariaLabel: "Name input field.",
  },
  {
    key: "email-field",
    label: "Email",
    name: "email",
    Field: EmailInput,
    updatable: true,
    ariaLabel: "Email input field.",
  },
  {
    key: "password-field",
    label: "Password",
    name: "password",
    Field: PasswordInput,
    updatable: false,
    ariaLabel: "Password input field.",
  },
  {
    key: "roles-field",
    label: "Roles",
    name: "roles",
    Field: RoleSelect,
    updatable: true,
    ariaLabel: "Role selector.",
  },
];

export const getUserFormConfig = () => ({
  create: Object.freeze(
    userFormConfig.map((conf) => ({
      ...conf,
      name: conf.name as keyof UserRequest,
    })),
  ),
  update: Object.freeze(
    userFormConfig
      .filter((conf) => conf.updatable)
      .map((conf) => ({
        ...conf,
        name: conf.name as keyof UserUpdateRequest,
      })),
  ),
});
