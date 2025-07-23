// src/pages/NearbyEmergencies.jsx
import React, { useState, useEffect } from 'react';
import { MapPin, RefreshCw, AlertTriangle, Filter, Search } from 'lucide-react';
import EmergencyCard from '../components/Emergency/EmergencyCard';
import { useGeolocation } from '../hooks/geoLocation';
import { useEmergency } from '../hooks/useEmergency';

const NearbyEmergencies = () => {
  const [emergencies, setEmergencies] = useState([]);
  const [filteredEmergencies, setFilteredEmergencies] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [radiusFilter, setRadiusFilter] = useState(2);
  
  const { location, loading: locationLoading, getCurrentLocation } = useGeolocation();
  const { acceptEmergency, getNearbyEmergencies, loading } = useEmergency();

  const emergencyTypes = [
    { value: 'all', label: 'All Emergencies', icon: '🆘' },
    { value: 'health', label: 'Health', icon: '🏥' },
    { value: 'accident', label: 'Accident', icon: '🚗' },
    { value: 'fire', label: 'Fire', icon: '🔥' },
    { value: 'security', label: 'Security', icon: '🚨' },
    { value: 'natural_disaster', label: 'Natural Disaster', icon: '🌪️' },
    { value: 'other', label: 'Other', icon: '❓' }
  ];

  useEffect(() => {
    if (location) {
      loadNearbyEmergencies();
    }
  }, [location, radiusFilter]);

  useEffect(() => {
    filterEmergencies();
  }, [emergencies, selectedFilter, searchTerm]);

  const loadNearbyEmergencies = async () => {
    if (!location) return;
    
    try {
      const data = await getNearbyEmergencies(location.coordinates, radiusFilter);
      setEmergencies(data);
    } catch (error) {
      console.error('Failed to load emergencies:', error);
    }
  };

  const filterEmergencies = () => {
    let filtered = [...emergencies];

    // Filter by type
    if (selectedFilter !== 'all') {
      filtered = filtered.filter(emergency => emergency.emergencyType === selectedFilter);
    }

    // Filter by search term
    if (searchTerm.trim()) {
      filtered = filtered.filter(emergency => 
        emergency.userId.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emergency.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emergency.customDescription?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredEmergencies(filtered);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadNearbyEmergencies();
    setRefreshing(false);
  };

  const handleAcceptEmergency = async (emergencyId) => {
    try {
      await acceptEmergency(emergencyId);
      await loadNearbyEmergencies();
    } catch (error) {
      console.error('Failed to accept emergency:', error);
    }
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

  if (locationLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Getting your location...</p>
        </div>
      </div>
    );
  }

  if (!location) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <AlertTriangle size={64} className="mx-auto text-red-500 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Location Access Required
          </h3>
          <p className="text-gray-600 mb-6">
            We need access to your location to show nearby emergencies and calculate distances accurately.
          </p>
          <button
            onClick={getCurrentLocation}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium"
          >
            Enable Location Access
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                Nearby Emergencies
              </h1>
              <p className="text-sm text-gray-600">
                Emergencies within {radiusFilter}km of your location
              </p>
            </div>
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
                className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50"
              >
                <RefreshCw size={16} className={`mr-1 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Search */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                />
              </div>
              
              {/* Radius Filter */}
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">Radius:</label>
                <select
                  value={radiusFilter}
                  onChange={(e) => setRadiusFilter(Number(e.target.value))}
                  className="border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={1}>1 km</option>
                  <option value={2}>2 km</option>
                  <option value={5}>5 km</option>
                  <option value={10}>10 km</option>
                </select>
              </div>
            </div>

            {/* Emergency Type Filters */}
            <div className="flex items-center space-x-2 overflow-x-auto">
              {emergencyTypes.map((type) => (
                <button
                  key={type.value}
                  onClick={() => setSelectedFilter(type.value)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    selectedFilter === type.value
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span>{type.icon}</span>
                  <span>{type.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-red-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Total Active</p>
                <p className="text-lg font-semibold text-gray-900">
                  {filteredEmergencies.filter(e => e.status === 'active').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center">
              <MapPin className="h-8 w-8 text-blue-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Within Range</p>
                <p className="text-lg font-semibold text-gray-900">
                  {filteredEmergencies.length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center">
              <Filter className="h-8 w-8 text-green-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Filtered Results</p>
                <p className="text-lg font-semibold text-gray-900">
                  {filteredEmergencies.length} / {emergencies.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Emergency List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Loading emergencies...</p>
            </div>
          ) : filteredEmergencies.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <AlertTriangle size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {emergencies.length === 0 ? 'No Active Emergencies' : 'No Results Found'}
              </h3>
              <p className="text-gray-600">
                {emergencies.length === 0 
                  ? `There are no active emergencies within ${radiusFilter}km of your location.`
                  : 'Try adjusting your filters or search terms.'
                }
              </p>
              {searchTerm || selectedFilter !== 'all' ? (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedFilter('all');
                  }}
                  className="mt-4 text-blue-600 hover:underline"
                >
                  Clear all filters
                </button>
              ) : null}
            </div>
          ) : (
            <>
              {/* Sort by distance */}
              {filteredEmergencies
                .sort((a, b) => {
                  const distanceA = calculateDistance(
                    location.latitude, location.longitude,
                    a.location.coordinates[1], a.location.coordinates[0]
                  );
                  const distanceB = calculateDistance(
                    location.latitude, location.longitude,
                    b.location.coordinates[1], b.location.coordinates[0]
                  );
                  return parseFloat(distanceA) - parseFloat(distanceB);
                })
                .map((emergency) => (
                  <EmergencyCard
                    key={emergency._id}
                    emergency={emergency}
                    onAccept={handleAcceptEmergency}
                    currentUserLocation={location}
                  />
                ))
              }
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default NearbyEmergencies;
