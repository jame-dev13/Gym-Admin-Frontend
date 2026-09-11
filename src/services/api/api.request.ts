import type { InternalAxiosRequestConfig } from "axios";

export type RequestType = InternalAxiosRequestConfig & { _retry: boolean };

let refreshing = false;

export const isRefreshing = () => refreshing;
export const setIsRefreshing = (refreshValue: boolean) =>
  (refreshing = refreshValue);
