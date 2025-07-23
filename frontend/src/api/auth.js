import {api} from "./index.js"

// Updated registerUser to handle FormData
export const registerUser = (formData) => {
  return api.post('/user/register', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const loginUser = (data) => api.post('/user/login', data);
export const getCurrentUser = () => api.get('/user/current-user');
export const changePassword = (data) => api.post('/user/change-password', data);
export const getNearbyUsers = (profession = 'all') => api.get(`/user/nearby-user?profession=${profession}`);
export const logoutUser = () => api.post('/user/logout');
export const getAllUsers = () => api.get('/user/getAllUsersf');

// ✅ Fixed: Changed to PUT method and proper FormData handling
export const updateUserProfile = (formData) => 
  api.put('/user/update-profile', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

// ✅ Added: Get user profile by ID
export const getUserProfile = (userId) => api.get(`/user/profile/${userId}`);
