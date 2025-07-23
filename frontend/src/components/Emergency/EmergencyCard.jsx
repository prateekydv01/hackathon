// src/components/Emergency/EmergencyCard.jsx
import React, { useState } from 'react';
import { MapPin, Clock, User, Phone, Navigation } from 'lucide-react';
import RouteModal from './RouteModal';

const EmergencyCard = ({ emergency, onAccept, currentUserLocation }) => {
  const [showRouteModal, setShowRouteModal] = useState(false);
  const [accepting, setAccepting] = useState(false);

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return (R * c).toFixed(1);
  };

  const handleAccept = async () => {
    try {
      setAccepting(true);
      await onAccept(emergency._id);
      setShowRouteModal(true);
    } catch (error) {
      console.error('Failed to accept emergency:', error);
    } finally {
      setAccepting(false);
    }
  };

  const isResponder = emergency.respondersAccepted?.some(
    responder => responder.userId._id === localStorage.getItem('userId')
  );

  const distance = currentUserLocation ? 
    calculateDistance(
      currentUserLocation.latitude,
      currentUserLocation.longitude,
      emergency.location.coordinates[1],
      emergency.location.coordinates[0]
    ) : null;

  const getEmergencyIcon = (type) => {
    const icons = {
      health: '🏥',
      accident: '🚗',
      fire: '🔥',
      security: '🚨',
      natural_disaster: '🌪️',
      other: '❓'
    };
    return icons[type] || '⚠️';
  };

  const getSeverityColor = (severity) => {
    const colors = {
      low: 'bg-green-100 text-green-800 border-green-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      high: 'bg-orange-100 text-orange-800 border-orange-200',
      critical: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[severity] || colors.medium;
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md border-l-4 border-red-500 p-4 mb-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">{getEmergencyIcon(emergency.emergencyType)}</span>
            <div>
              <h3 className="font-semibold text-gray-900 capitalize">
                {emergency.emergencyType.replace('_', ' ')} Emergency
              </h3>
              <div className="flex items-center space-x-2 mt-1">
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(emergency.severity)}`}>
                  {emergency.severity.toUpperCase()}
                </span>
                <span className="text-xs text-gray-500 flex items-center">
                  <Clock size={12} className="mr-1" />
                  {formatTime(emergency.createdAt)}
                </span>
              </div>
            </div>
          </div>
          {distance && (
            <span className="text-sm text-blue-600 font-medium">
              {distance} km away
            </span>
          )}
        </div>

        {emergency.customDescription && (
          <p className="text-gray-700 text-sm mb-3 bg-gray-50 p-2 rounded">
            "{emergency.customDescription}"
          </p>
        )}

        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center">
            <User size={14} className="mr-2" />
            <span>{emergency.userId.fullName}</span>
          </div>
          <div className="flex items-center">
            <Phone size={14} className="mr-2" />
            <span>{emergency.userId.contactNumber}</span>
          </div>
          <div className="flex items-start">
            <MapPin size={14} className="mr-2 mt-0.5" />
            <span className="flex-1">{emergency.address}</span>
          </div>
        </div>

        {emergency.respondersAccepted?.length > 0 && (
          <div className="mt-3 p-2 bg-green-50 rounded border-l-2 border-green-400">
            <p className="text-sm text-green-700">
              {emergency.respondersAccepted.length} responder(s) on the way
            </p>
          </div>
        )}

        <div className="flex space-x-2 mt-4">
          {!isResponder ? (
            <button
              onClick={handleAccept}
              disabled={accepting}
              className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
            >
              {accepting ? 'Accepting...' : 'Accept & Help'}
            </button>
          ) : (
            <button
              onClick={() => setShowRouteModal(true)}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm font-medium flex items-center justify-center"
            >
              <Navigation size={16} className="mr-2" />
              Get Directions
            </button>
          )}
        </div>
      </div>

      {showRouteModal && (
        <RouteModal
          isOpen={showRouteModal}
          onClose={() => setShowRouteModal(false)}
          emergency={emergency}
          currentLocation={currentUserLocation}
        />
      )}
    </>
  );
};

export default EmergencyCard;
