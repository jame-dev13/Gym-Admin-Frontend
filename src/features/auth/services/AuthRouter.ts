import { lazy } from "react";

export const getAuthRouter = () => AuthRouter;

const AuthRouter = {
  AuthLayout: lazy(() => import("@/features/auth/layouts/AuthLayout")),
  Register: lazy(() => import("@/features/auth/components/register/RegisterForm")),
  Login: lazy(() => import("@/features/auth/components/login/LoginForm")),
  Verification: lazy(
    () => import("@/features/auth/components/verification/VerificationForm"),
  ),
  PasswordReset: lazy(
    () => import("@/features/auth/components/password-reset/PasswordResetForm"),
  ),
  SetPassword: lazy(
    () => import("@/features/auth/components/password-reset/SetPasswordForm"),
  ),
  Recovery: lazy(
    () => import("@/features/auth/components/recovery/RecoveryForm"),
  ),
};
