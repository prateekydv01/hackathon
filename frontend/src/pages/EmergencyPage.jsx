import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { createEmergencyAsync, acceptEmergencyAsync } from '../store/emergencySlice';
import EmergencyForm from '../components/EmergencyForm';
import EmergencyDetails from '../components/EmergencyDetails';

const EmergencyPage = () => {
  const { emergencyId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [emergency, setEmergency] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (emergencyId && emergencyId !== 'create') {
      fetchEmergencyDetails();
    }
  }, [emergencyId]);

  const fetchEmergencyDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/emergency/${emergencyId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setEmergency(data.data);
      }
    } catch (error) {
      console.error('Error fetching emergency:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEmergencyCreate = async (emergencyData) => {
    try {
      await dispatch(createEmergencyAsync(emergencyData)).unwrap();
      navigate('/emergency');
    } catch (error) {
      console.error('Create emergency error:', error);
    }
  };

  const handleAcceptEmergency = async () => {
    try {
      const result = await dispatch(acceptEmergencyAsync(emergencyId)).unwrap();
      if (result) {
        navigate(`/emergency/navigate/${emergencyId}`);
      }
    } catch (error) {
      console.error('Accept emergency error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // Create new emergency
  if (!emergencyId || emergencyId === 'create') {
    return (
      <div className="min-h-screen">
        <EmergencyForm />
      </div>
    );
  }

  // View emergency details
  return (
    <div className="min-h-screen">
      {emergency && (
        <EmergencyDetails 
          emergency={emergency}
          onAccept={handleAcceptEmergency}
          onBack={() => navigate('/emergency')}
        />
      )}
    </div>
  );
};

export default EmergencyPage;
