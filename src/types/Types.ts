type ApiError = Partial<{
  timestamp?: string;
  status?: number;
  error?: string;
  message?: string;
  path?: string;
  code?: string;
}>;

export type ApiErrorResponse = Readonly<ApiError>;

export type FetchResponse<T> = {
  data: T;
  status: number;
};

export type MutationResponse<T> = {
  payload?: T;
  status: number;
};

export type Page<T> = Readonly<{
  content: T[],
  page: PageProperty
}>;

type PageProperty = Readonly<{
  size: number;
  number: number;
  totalElements: number;
  totalPages: number;
}>;
