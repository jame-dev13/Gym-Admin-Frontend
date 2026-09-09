import { lazy } from "react";

export const getAuthRouter = () => AuthRouter;

const AuthRouter = {
  AuthLayout: lazy(() => import("@/features/auth/layouts/AuthLayout")),
  Register: lazy(() => import("@/features/auth/components/RegisterForm")),
  Login: lazy(() => import("@/features/auth/components/LoginForm")),
  Verification: lazy(() => import("@/features/auth/components/VerificationForm")),
  PasswordReset: lazy(() => import("@/features/auth/components/PasswordResetForm")),
};
