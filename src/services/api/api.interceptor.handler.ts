import axios, { type AxiosRequestConfig } from "axios";

const REFRESH_PATH = import.meta.env.VITE_REFRESH;
const LOGOUT_PATH = import.meta.env.LOGOUT;

const handleInternalRefresh = async () => {
  try {
    await axios.post(REFRESH_PATH);
  } catch {
    throw new Error("Cannot perform internal refresh.");
  }
};

const handleLogout = async () => {
  try {
    await axios.post(LOGOUT_PATH, {}, { _retry: false } as AxiosRequestConfig);
  } finally {
    cleanUp();
    window.location.assign("/");
  }
};

const handleTooManyRequest = () => {
  cleanUp();
  window.location.assign("/warning");
};

const handleLocked = () => {
  cleanUp();
  window.location.assign("/locked");
};

const cleanUp = () => {
  localStorage.clear();
  sessionStorage.clear();
};

export const getInterceptorHandler = () => ({
  refresh: handleInternalRefresh,
  logout: handleLogout,
  tooManyRequest: handleTooManyRequest,
  locked: handleLocked,
});
