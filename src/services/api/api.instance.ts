import axios, { type InternalAxiosRequestConfig } from "axios";

const BASE_URL = import.meta.env.VITE_BASE;

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30_000,
  withCredentials: true,
  timeoutErrorMessage: "Request reached timeout limit.",
});

export const ALLOWED_URLS_PATTERN = `${BASE_URL}/auth/*`;

export type RequestType = InternalAxiosRequestConfig & { _retry: boolean };
