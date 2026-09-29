type LoginRequest = Readonly<{
  email: string;
  password: string;
}>;

type LoginResponse = Readonly<{
  isUser: boolean;
  email: string;
}>;

export type { LoginRequest, LoginResponse };
