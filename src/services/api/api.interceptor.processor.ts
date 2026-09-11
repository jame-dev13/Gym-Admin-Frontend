import type { ApiErrorResponse } from "@/types/Types";
import axios from "axios";

type FailedQueue = {
  resolve: () => void;
  reject: (err: unknown) => void;
};

let failedQueue: FailedQueue[] = [];

export const processQueue = (err: unknown | null = null) => {
  const SERVER_ERR =
    err && axios.isAxiosError(err)
      ? ((err.response?.data as ApiErrorResponse) ?? err)
      : null;
  failedQueue.forEach(({ resolve, reject }) => {
    if (SERVER_ERR) reject(SERVER_ERR);
    else resolve();
  });

  failedQueue = [];
};

export const enqueueRequest = (req: () => Promise<unknown>) => {
  return new Promise((resolve, reject) => {
    failedQueue.push({
      resolve: () => resolve(req),
      reject: (err) => reject(err),
    });
  });
};
