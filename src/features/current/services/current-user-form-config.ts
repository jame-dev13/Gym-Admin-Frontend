import { EmailInput, Input, PasswordInput } from "@/components/input/Input";
import type {
  EmailInputProps,
  InputProps,
} from "@/components/input/InputTypes";
import type { CurrentUserResponse, CurrentUserUpdateRequest } from "@/features/current/types";
import type { ComponentType } from "react";

export const getUpdateCurrentFormConfig = () => UPDATE_CURRENT_FORM_CONFIG;

type UpdateCurrentFormConfigType = {
  key: string;
  label: string;
  required: boolean;
  name: keyof CurrentUserUpdateRequest;
  Field: ComponentType<InputProps | EmailInputProps>;
  getValue?: (user: CurrentUserResponse) => CurrentUserResponse["name"] | CurrentUserResponse["email"]
};

const UPDATE_CURRENT_FORM_CONFIG: ReadonlyArray<UpdateCurrentFormConfigType> = [
  {
    key: "name-input",
    label: "Name",
    required: true,
    name: "name",
    Field: Input,
    getValue: (user) => user.name
  },
  {
    key: "email-input",
    label: "Email",
    required: true,
    name: "email",
    Field: EmailInput,
    getValue: (user) => user.email
  },
  {
    key: "password-input",
    label: "Password",
    required: false,
    name: "password",
    Field: PasswordInput,
  },
];
