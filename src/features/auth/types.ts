type LoginRequest = Readonly<{
  email: string;
  password: string;
}>;

type LoginResponse = Readonly<{
  isUser: boolean;
  email: string;
}>;

type RegisterRequest = Readonly<{
  name: string;
  email: string;
  password: string;
}>;

type VerificationRequest = Readonly<{
  email: string;
  token: string;
}>;

type PasswordResetRequest = Readonly<{
  email: string;
}>;

type ResetPasswordRequest = Readonly<{
  email: string;
  newPassword: string;
}>;

type AuthErrorLinkConfig = Readonly<{
  to: string;
  label: string;
  ariaLabel: string;
}>;

export type {
  AuthErrorLinkConfig,
  LoginRequest,
  LoginResponse,
  PasswordResetRequest,
  RegisterRequest,
  ResetPasswordRequest,
  VerificationRequest,
};
