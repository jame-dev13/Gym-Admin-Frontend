import { EmailInput } from "@/components/input/Input";
import { OtpInput } from "@/components/input/OtpInput";

export const getVerificationFormConfig = () => verificationFormConfig;

const verificationFormConfig = [
  {
    key: "email-input-key",
    name: "email",
    autoComplete: "email",
    required: true,
    Field: EmailInput,
  },
  {
    key: "token-input-key",
    name: "token",
    autoComplete: "one-time-code",
    required: true,
    Field: OtpInput,
  },
];