import {api} from "./index.js"

export const registerUser = (data) => api.post('/user/register', data);
export const loginUser = (data) => api.post('/user/login', data);
export const getCurrentUser = () => api.get('/user/current-user');
export const changePassword = (data) => api.post('/user/change-password', data);
export const getNearbyUsers = (profession = 'all') => api.get(`/user/nearby-user?profession=${profession}`);

api.interceptors.response.use(
  res => res,
  async error => {
    const originalRequest = error.config;

    // Check for 401 (unauthorized) and retry only once
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const res = await api.post("/user/update-access-token")
        const newAccessToken = res.data.data.accessToken;
        // Add token to header (if you use Authorization Bearer flow)
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

        return api(originalRequest); // Retry the original request
      } catch (refreshError) {
        // Handle refresh error (e.g., logout user)
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
