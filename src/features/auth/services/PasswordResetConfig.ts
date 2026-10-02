import { EmailInput, PasswordInput } from "@/components/input/Input";

export const getEmailConfirmationConfig = () => emailConfirmationConfig;
export const getSetPasswordConfig = () => setPasswordConfig;

const emailConfirmationConfig = [
  {
    key: "email-input-key",
    name: "email",
    autoComplete: "email",
    required: true,
    Field: EmailInput,
  },
];

const setPasswordConfig = [
  {
    key: "set-password-email-input-key",
    name: "email",
    labelText: "Email",
    autoComplete: "email",
    required: true,
    Field: EmailInput,
  },
  {
    key: "password-input-key",
    name: "password",
    labelText: "Password",
    autoComplete: "new-password",
    required: true,
    Field: PasswordInput,
  },
  {
    key: "confirm-password-input-key",
    name: "confirmPassword",
    labelText: "Confirm Password",
    autoComplete: "new-password",
    required: true,
    Field: PasswordInput,
  },
];