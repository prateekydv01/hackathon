// src/hooks/useEmergency.js
import { useState } from 'react';
import { emergencyService } from '../api/emergency.js';
import { toast } from 'react-toastify';

export const useEmergency = () => {
  const [loading, setLoading] = useState(false);
  const [emergencies, setEmergencies] = useState([]);

  const createEmergency = async (emergencyData) => {
    try {
      setLoading(true);
      const response = await emergencyService.createEmergency(emergencyData);
      toast.success(`Emergency alert sent to ${response.data.notifications.notifiedUsersCount} nearby users!`);
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create emergency alert');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const acceptEmergency = async (emergencyId) => {
    try {
      setLoading(true);
      const response = await emergencyService.acceptEmergency(emergencyId);
      toast.success('Emergency response accepted!');
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to accept emergency');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getNearbyEmergencies = async (coordinates) => {
    try {
      setLoading(true);
      const response = await emergencyService.getNearbyEmergencies(coordinates.join(','));
      setEmergencies(response.data);
      return response.data;
    } catch (error) {
      toast.error('Failed to fetch nearby emergencies');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    emergencies,
    createEmergency,
    acceptEmergency,
    getNearbyEmergencies
  };
};
