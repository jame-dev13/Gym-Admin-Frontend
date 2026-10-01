type LoginRequest = Readonly<{
  email: string;
  password: string;
}>;

type LoginResponse = Readonly<{
  isUser: boolean;
  email: string;
}>;

type AuthErrorLinkConfig = Readonly<{
  to: string;
  label: string;
  ariaLabel: string;
}>;

export type { AuthErrorLinkConfig, LoginRequest, LoginResponse };
