import {api} from './index.js';

export const emergencyService = {
    // Create new emergency alert
    createEmergency: async (emergencyData) => {
        const response = await api.post('/emergency/create', emergencyData);
        return response.data;
    },

    // Get nearby emergencies
    getNearbyEmergencies: async (coordinates, radius = 2) => {
        const response = await api.get(`/emergency/nearby?coordinates=${coordinates}&radius=${radius}`);
        return response.data;
    },

    // Accept emergency response
    acceptEmergency: async (emergencyId) => {
        const response = await api.post(`/emergency/${emergencyId}/accept`);
        return response.data;
    },

    // Get route to emergency
    getEmergencyRoute: async (emergencyId) => {
        const response = await api.get(`/emergency/${emergencyId}/route`);
        return response.data;
    },

    // Get user's emergency history
    getUserEmergencies: async () => {
        const response = await api.get('/emergency/my-emergencies');
        return response.data;
    },

    // Update emergency status
    updateEmergencyStatus: async (emergencyId, status) => {
        const response = await api.put(`/emergency/${emergencyId}/status`, { status });
        return response.data;
    }
};
