import { OtpInput } from "@/components/input/OtpInput";

export const getVerificationFormConfig = () => verificationFormConfig;

const verificationFormConfig = [
  {
    key: "token-input-key",
    name: "token",
    autoComplete: "one-time-code",
    required: true,
    Field: OtpInput,
  },
];