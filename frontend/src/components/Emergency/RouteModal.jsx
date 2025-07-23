// src/components/Emergency/RouteModal.jsx
import React, { useState, useEffect } from 'react';
import { X, Navigation, Phone, User, MapPin } from 'lucide-react';
import { emergencyService } from '../../api/emergency';

const RouteModal = ({ isOpen, onClose, emergency, currentLocation }) => {
  const [routeData, setRouteData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && emergency) {
      fetchRouteData();
    }
  }, [isOpen, emergency]);

  const fetchRouteData = async () => {
    try {
      setLoading(true);
      const response = await emergencyService.getEmergencyRoute(emergency._id);
      setRouteData(response.data);
    } catch (error) {
      console.error('Failed to fetch route data:', error);
    } finally {
      setLoading(false);
    }
  };

  const openInGoogleMaps = () => {
    if (!routeData || !currentLocation) return;
    
    const { coordinates } = routeData.destination;
    const destination = `${coordinates[1]},${coordinates[0]}`;
    const origin = `${currentLocation.latitude},${currentLocation.longitude}`;
    
    const url = `https://www.google.com/maps/dir/${origin}/${destination}`;
    window.open(url, '_blank');
  };

  const callEmergencyContact = () => {
    if (routeData?.contactInfo?.phone) {
      window.open(`tel:${routeData.contactInfo.phone}`, '_self');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold text-blue-600 flex items-center">
            <Navigation className="mr-2" />
            Emergency Route
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <div className="p-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Loading route information...</p>
            </div>
          ) : routeData ? (
            <div className="space-y-4">
              {/* Emergency Details */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <h3 className="font-semibold text-red-800 mb-2">
                  {routeData.emergencyDetails.type.replace('_', ' ').toUpperCase()} EMERGENCY
                </h3>
                {routeData.emergencyDetails.description && (
                  <p className="text-red-700 text-sm">
                    {routeData.emergencyDetails.description}
                  </p>
                )}
                <p className="text-red-600 text-xs mt-1">
                  Reported: {new Date(routeData.emergencyDetails.createdAt).toLocaleString()}
                </p>
              </div>

              {/* Contact Information */}
              <div className="bg-gray-50 rounded-lg p-3">
                <h4 className="font-medium text-gray-800 mb-2 flex items-center">
                  <User size={16} className="mr-2" />
                  Emergency Contact
                </h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <p className="flex items-center">
                    <span className="font-medium mr-2">Name:</span>
                    {routeData.contactInfo.name}
                  </p>
                  <p className="flex items-center">
                    <Phone size={14} className="mr-2" />
                    {routeData.contactInfo.phone}
                  </p>
                </div>
              </div>

              {/* Destination */}
              <div className="bg-blue-50 rounded-lg p-3">
                <h4 className="font-medium text-blue-800 mb-2 flex items-center">
                  <MapPin size={16} className="mr-2" />
                  Destination
                </h4>
                <p className="text-blue-700 text-sm">
                  {routeData.destination.address}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <button
                  onClick={openInGoogleMaps}
                  className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 font-medium flex items-center justify-center"
                >
                  <Navigation size={20} className="mr-2" />
                  Open in Google Maps
                </button>
                
                <button
                  onClick={callEmergencyContact}
                  className="w-full bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 font-medium flex items-center justify-center"
                >
                  <Phone size={20} className="mr-2" />
                  Call Emergency Contact
                </button>
              </div>

              {/* Safety Note */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-yellow-800 text-sm">
                  <strong>Safety First:</strong> If this is a life-threatening emergency, 
                  call local emergency services (911) immediately before proceeding.
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-red-600">Failed to load route information</p>
              <button
                onClick={fetchRouteData}
                className="mt-2 text-blue-600 hover:underline"
              >
                Try again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RouteModal;
