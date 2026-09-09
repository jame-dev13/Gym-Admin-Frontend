import { EmailInput, PasswordInput } from "@/components/input/Input";

export const getLoginFormConfig = () => loginFormConfig;

const loginFormConfig = [
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
    autoComplete: "current-password",
    required: true,
    Field: PasswordInput,
  },
];
