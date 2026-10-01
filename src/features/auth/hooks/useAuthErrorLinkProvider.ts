import type { ApiErrorResponse } from "@/types/Types";
import type { AuthErrorLinkConfig } from "@/features/auth/types";
import { HttpStatusCode } from "axios";

type AuthErrorMatch = Readonly<{
  code: string;
  status: number;
  link: AuthErrorLinkConfig;
}>;

const AUTH_ERROR_LINKS: ReadonlyArray<AuthErrorMatch> = [
  {
    code: "NO_ACCESS",
    status: HttpStatusCode.Unauthorized,
    link: {
      to: "/auth/password-reset",
      label: "Forgot your password?",
      ariaLabel: "Link to password reset page.",
    },
  },
  {
    code: "VALIDATION_OPERATION",
    status: HttpStatusCode.Conflict,
    link: {
      to: "/auth/activation",
      label: "Activate account here!",
      ariaLabel: "Link to activation page.",
    },
  },
  {
    code: "VERIFICATION_OPERATION",
    status: HttpStatusCode.Forbidden,
    link: {
      to: "/auth/verification",
      label: "Verify account.",
      ariaLabel: "Link to verification page.",
    },
  },
  {
    code: "NOT_FOUND_OPERATION",
    status: HttpStatusCode.NotFound,
    link: {
      to: "/auth/verification",
      label: "Verify account.",
      ariaLabel: "Link to verification page.",
    },
  },
];

const useAuthErrorLinkProvider = (
  err?: ApiErrorResponse | null,
): AuthErrorLinkConfig | null => {
  if (!err) {
    return null;
  }
  return (
    AUTH_ERROR_LINKS.find(
      (entry) => entry.code === err.code && entry.status === err.status,
    )?.link ?? null
  );
};

export { useAuthErrorLinkProvider };
