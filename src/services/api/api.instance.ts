import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE;

const clientConfig = {
  baseURL: BASE_URL,
  timeout: 30_000,
  withCredentials: true,
  timeoutErrorMessage: "Request reached timeout limit.",
};

export const api = axios.create(clientConfig);

/**
 * Client used by the auth lifecycle (silent refresh and logout). It shares the
 * API base URL and credentials with `api` but has no response interceptor, so
 * a failed refresh can never trigger another refresh attempt.
 */
export const authClient = axios.create(clientConfig);
