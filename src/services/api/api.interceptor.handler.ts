import { authClient } from "@/services/api/api.instance";

const REFRESH_PATH = import.meta.env.VITE_AUTH_REFRESH as string;
const LOGOUT_PATH = import.meta.env.VITE_AUTH_LOGOUT as string;

const handleInternalRefresh = async () => {
  await authClient.post(REFRESH_PATH);
};

const handleLogout = async () => {
  try {
    await authClient.post(LOGOUT_PATH);
  } catch {
    // Local logout must still happen when the server cannot end the session.
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
