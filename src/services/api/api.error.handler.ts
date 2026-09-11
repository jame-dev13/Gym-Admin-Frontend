import type { RequestType } from "@/services/api/api.request";
import type { ApiErrorResponse } from "@/types/Types";
import { HttpStatusCode, type AxiosError } from "axios";

const ERROR_CODES = {
  access: "ACCESS_OPERATION",
  noAccess: "NO_ACCESS",
};

export const triggeringStatus: Readonly<
  Record<string, Readonly<HttpStatusCode>>
> = {
  unauthorized: HttpStatusCode.Unauthorized,
  forbidden: HttpStatusCode.Forbidden,
  tooManyRequest: HttpStatusCode.TooManyRequests,
  locked: HttpStatusCode.Locked,
};

export const extractApiError = (error: AxiosError): ApiErrorResponse => {
  if (error && error.response?.data) {
    return error.response.data as ApiErrorResponse;
  }
  return error as ApiErrorResponse;
};

export const shouldReject = ({ response }: AxiosError) => {
  const status = response?.status;
  const data = response?.data as ApiErrorResponse | undefined;
  const code = data?.code ?? "";
  const notAllowed = Object.values(triggeringStatus).some(
    (statusCode) => statusCode === status,
  );
  return notAllowed && Object.values(ERROR_CODES).includes(code);
};

export const isLocked = ({ response }: AxiosError) =>
  response?.status === triggeringStatus.locked;

export const isTooManyRequest = ({ response }: AxiosError) =>
  response?.status === triggeringStatus.tooManyRequest;

export const shouldSkip = (req: RequestType) => req.url?.includes("auth");
