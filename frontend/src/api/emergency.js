// api/emergency.js
import { api } from "./index.js";

export const createEmergency = (data) => api.post('/emergency/create', data);
export const acceptEmergency = (emergencyId) => api.post(`/emergency/accept/${emergencyId}`);
export const getNearbyEmergencies = (maxDistance = 2000) => api.get(`/emergency/nearby?maxDistance=${maxDistance}`);
export const updateEmergencyStatus = (emergencyId, status) => api.patch(`/emergency/update-status/${emergencyId}`, { status });
