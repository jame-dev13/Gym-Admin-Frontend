import {
  extractApiError,
  isLocked,
  isTooManyRequest,
  shouldReject,
  shouldSkip,
} from "@/services/api/api.error.handler";
import { api } from "@/services/api/api.instance";
import { getInterceptorHandler } from "@/services/api/api.interceptor.handler";
import {
  enqueueRequest,
  processQueue,
} from "@/services/api/api.interceptor.processor";
import {
  isRefreshing,
  setIsRefreshing,
  type RequestType,
} from "@/services/api/api.request";
import type { AxiosError } from "axios";

const interceptorHandler = getInterceptorHandler();

api.interceptors.response.use(
  (res) => res,
  async (err: AxiosError) => {
    const originalRequest = err.config as RequestType | undefined;
    const apiError = extractApiError(err);
    
    if (isTooManyRequest(err)) {
      interceptorHandler.tooManyRequest();
      return Promise.reject(apiError);
    }
    
    if (isLocked(err)) {
      interceptorHandler.locked();
      return Promise.reject(apiError);
    }
    
    if (
      !originalRequest ||
      shouldSkip(originalRequest) ||
      !shouldReject(err) ||
      originalRequest._retry
    ) {
      return Promise.reject(apiError);
    }

    originalRequest._retry = true;

    if (isRefreshing()) {
      return enqueueRequest(() => api(originalRequest));
    }

    setIsRefreshing(true);

    try {
      await interceptorHandler.refresh();
    } catch (refreshError) {
      processQueue(refreshError);
      await interceptorHandler.logout();
      return Promise.reject(extractApiError(refreshError as AxiosError));
    } finally {
      setIsRefreshing(false);
    }

    processQueue(null);
    return api(originalRequest);
  },
);

export { api } from "./api/api.instance";
