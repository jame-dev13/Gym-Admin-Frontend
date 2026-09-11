type ApiError = Partial<{
  timestamp?: string;
  status?: number;
  error?: string;
  message?: string;
  path?: string;
  code?: string;
}>;

export type ApiErrorResponse = Readonly<ApiError>;
