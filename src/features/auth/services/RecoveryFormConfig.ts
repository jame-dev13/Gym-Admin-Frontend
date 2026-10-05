import { OtpInput } from "@/components/input/OtpInput";

export const getRecoveryActivateConfig = () => recoveryActivateConfig;

const recoveryActivateConfig = [
  {
    key: "recovery-token-input-key",
    name: "token",
    autoComplete: "one-time-code",
    required: true,
    "aria-label": "Recovery code",
    Field: OtpInput,
  },
];
