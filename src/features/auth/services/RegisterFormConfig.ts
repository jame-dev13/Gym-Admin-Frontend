import {
  EmailInput,
  PasswordInput,
  TextInput,
} from "@/components/input/Input";

export const getRegisterFormConfig = () => registerFormConfig;

const registerFormConfig = [
  {
    key: "name-input-key",
    name: "name",
    autoComplete: "name",
    required: true,
    Field: TextInput,
  },
  {
    key: "email-input-key",
    name: "email",
    autoComplete: "email",
    required: true,
    Field: EmailInput,
  },
  {
    key: "password-input-key",
    name: "password",
    autoComplete: "new-password",
    required: true,
    Field: PasswordInput,
  },
];