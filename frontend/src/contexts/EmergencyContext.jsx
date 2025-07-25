// contexts/EmergencyContext.jsx
import React, { createContext, useContext, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { io } from 'socket.io-client';
import { toast } from 'react-toastify';
import { addEmergencyAlert, updateEmergencyStatus } from '../store/emergencySlice';

const EmergencyContext = createContext();
export const useEmergency = () => useContext(EmergencyContext);

let socket = null;

export const EmergencyProvider = ({ children }) => {
  const dispatch = useDispatch();
  const authStatus = useSelector((state) => state.auth.status);
  const userData = useSelector((state) => state.auth.userData);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token && authStatus) {
      // Initialize socket connection
      socket = io(import.meta.env.VITE_SERVER_URL || 'http://localhost:3000', {
        auth: { token },
      });

      // Listen for emergency alerts
      socket.on('emergency_alert', ({ emergency, message }) => {
        toast.error(`🚨 ${message}`, {
          position: "top-center",
          autoClose: 10000,
          onClick: () => {
            dispatch(addEmergencyAlert(emergency));
          }
        });
        dispatch(addEmergencyAlert(emergency));
      });

      // Listen for emergency acceptance
      socket.on('emergency_accepted', ({ emergency, acceptor, message }) => {
        toast.success(`✅ ${message}`, {
          position: "top-center",
          autoClose: 5000,
        });
        dispatch(updateEmergencyStatus({ 
          emergencyId: emergency._id, 
          status: 'accepted' 
        }));
      });

      // Listen for status updates
      socket.on('emergency_status_update', ({ emergency, message }) => {
        toast.info(`📱 ${message}`, {
          position: "top-center",
          autoClose: 5000,
        });
        dispatch(updateEmergencyStatus({ 
          emergencyId: emergency._id, 
          status: emergency.status 
        }));
      });

      return () => {
        if (socket) {
          socket.disconnect();
          socket = null;
        }
      };
    }
  }, [token, authStatus, dispatch]);

  const value = {
    socket,
  };

  return (
    <EmergencyContext.Provider value={value}>
      {children}
    </EmergencyContext.Provider>
  );
};
