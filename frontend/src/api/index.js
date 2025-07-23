import axios from "axios";

const BASE_URL =
  import.meta.env.VITE_BASE_URL ||
  (window.location.hostname === "localhost"
    ? "http://localhost:8000/api/v1"
    : `http://${window.location.hostname}:8000/api/v1`);

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export * from "./auth";

// src/api/index.js  (or wherever your api instance is)
api.interceptors.response.use(
  res => res,
  async error => {
    const original = error.config;

    // 1. if the request itself asked to skip refresh logic → just reject
    if (original?.skipAuthRefresh) {
      return Promise.reject(error);
    }

    // 2. do NOT refresh / redirect on public endpoints
    const publicEndpoints = [
      '/user/login',
      '/user/register',
      '/user/forgot-password',
      '/user/change-password'
    ];
    if (publicEndpoints.some(p => original.url?.includes(p))) {
      return Promise.reject(error);          // let calling code handle it
    }

    /* ---------- normal refresh flow for protected APIs ---------- */
    if (
      error.response?.status === 401 &&
      !original._retry &&
      !original.url?.includes('/user/update-access-token')
    ) {
      original._retry = true;
      try {
        await api.post('/user/update-access-token');
        return api(original);                // ← retry the failed call
      } catch (refreshErr) {
        // refresh failed → log user out
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error);
  }
);
