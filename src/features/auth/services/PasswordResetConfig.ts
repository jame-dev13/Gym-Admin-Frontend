import { EmailInput, PasswordInput } from "@/components/input/Input";

export const getEmailConfirmationConfig = () => emailConfirmationConfig;
export const getNewPasswordConfig = () => newPasswordConfig;

const emailConfirmationConfig = [
  {
    key: "email-input-key",
    name: "email",
    autoComplete: "email",
    required: true,
    Field: EmailInput,
  },
];

const newPasswordConfig = [
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