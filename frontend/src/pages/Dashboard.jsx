// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { MapPin, RefreshCw, AlertTriangle } from 'lucide-react';
import EmergencyButton from '../components/Emergency/EmergencyButton';
import EmergencyCard from '../components/Emergency/EmergencyCard';
import { useGeolocation } from '../hooks/geoLocation';
import { useEmergency } from '../hooks/useEmergency';

const Dashboard = () => {
  const [emergencies, setEmergencies] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  
  const { location, loading: locationLoading, getCurrentLocation } = useGeolocation();
  const { acceptEmergency, getNearbyEmergencies, loading } = useEmergency();

  useEffect(() => {
    if (location) {
      loadNearbyEmergencies();
    }
  }, [location]);

  const loadNearbyEmergencies = async () => {
    if (!location) return;
    
    try {
      const data = await getNearbyEmergencies(location.coordinates);
      setEmergencies(data);
    } catch (error) {
      console.error('Failed to load emergencies:', error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadNearbyEmergencies();
    setRefreshing(false);
  };

  const handleAcceptEmergency = async (emergencyId) => {
    try {
      await acceptEmergency(emergencyId);
      // Refresh the list to update the accepted emergency
      await loadNearbyEmergencies();
    } catch (error) {
      console.error('Failed to accept emergency:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl font-semibold text-gray-900">
              Emergency Dashboard
            </h1>
            <div className="flex items-center space-x-4">
              {location && (
                <div className="flex items-center text-sm text-green-600">
                  <MapPin size={16} className="mr-1" />
                  Location Active
                </div>
              )}
              <button
                onClick={handleRefresh}
                disabled={refreshing || loading}
                className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900"
              >
                <RefreshCw size={16} className={`mr-1 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {locationLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Getting your location...</p>
          </div>
        ) : !location ? (
          <div className="text-center py-12">
            <AlertTriangle size={48} className="mx-auto text-red-500 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Location Access Required
            </h3>
            <p className="text-gray-600 mb-4">
              We need your location to show nearby emergencies and send alerts.
            </p>
            <button
              onClick={getCurrentLocation}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Enable Location
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Active Emergencies
                </h3>
                <p className="text-3xl font-bold text-red-600">
                  {emergencies.filter(e => e.status === 'active').length}
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  In Progress
                </h3>
                <p className="text-3xl font-bold text-orange-600">
                  {emergencies.filter(e => e.status === 'in_progress').length}
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Total Nearby
                </h3>
                <p className="text-3xl font-bold text-blue-600">
                  {emergencies.length}
                </p>
              </div>
            </div>

            {/* Emergency List */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b">
                <h2 className="text-lg font-medium text-gray-900">
                  Nearby Emergencies (2km radius)
                </h2>
              </div>
              <div className="p-6">
                {loading ? (
                  <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <p className="mt-2 text-gray-600">Loading emergencies...</p>
                  </div>
                ) : emergencies.length === 0 ? (
                  <div className="text-center py-8">
                    <AlertTriangle size={48} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No Active Emergencies
                    </h3>
                    <p className="text-gray-600">
                      There are no active emergencies in your area right now.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {emergencies.map((emergency) => (
                      <EmergencyCard
                        key={emergency._id}
                        emergency={emergency}
                        onAccept={handleAcceptEmergency}
                        currentUserLocation={location}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Emergency Button */}
      <EmergencyButton />
    </div>
  );
};

export default Dashboard;
