// src/components/Emergency/EmergencyModal.jsx
import React, { useState, useEffect } from 'react';
import { X, MapPin, AlertCircle } from 'lucide-react';
import { useGeolocation } from '../../hooks/geoLocation';
import { useEmergency } from '../../hooks/useEmergency';

const EMERGENCY_TYPES = [
  { value: 'health', label: 'Health Emergency', icon: '🏥', color: 'bg-red-100 text-red-800' },
  { value: 'accident', label: 'Accident', icon: '🚗', color: 'bg-orange-100 text-orange-800' },
  { value: 'fire', label: 'Fire Emergency', icon: '🔥', color: 'bg-red-100 text-red-800' },
  { value: 'security', label: 'Security Threat', icon: '🚨', color: 'bg-purple-100 text-purple-800' },
  { value: 'natural_disaster', label: 'Natural Disaster', icon: '🌪️', color: 'bg-gray-100 text-gray-800' },
  { value: 'other', label: 'Other', icon: '❓', color: 'bg-blue-100 text-blue-800' }
];

const SEVERITY_LEVELS = [
  { value: 'low', label: 'Low', color: 'bg-green-500' },
  { value: 'medium', label: 'Medium', color: 'bg-yellow-500' },
  { value: 'high', label: 'High', color: 'bg-orange-500' },
  { value: 'critical', label: 'Critical', color: 'bg-red-500' }
];

const EmergencyModal = ({ isOpen, onClose }) => {
  const [selectedType, setSelectedType] = useState('');
  const [customDescription, setCustomDescription] = useState('');
  const [severity, setSeverity] = useState('medium');
  const [address, setAddress] = useState('');
  
  const { location, loading: locationLoading, getCurrentLocation } = useGeolocation();
  const { createEmergency, loading } = useEmergency();

  useEffect(() => {
    if (location && !address) {
      // Reverse geocoding to get address
      reverseGeocode(location.latitude, location.longitude);
    }
  }, [location]);

  const reverseGeocode = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${process.env.REACT_APP_OPENCAGE_API_KEY}`
      );
      const data = await response.json();
      if (data.results && data.results[0]) {
        setAddress(data.results[0].formatted);
      }
    } catch (error) {
      console.error('Reverse geocoding failed:', error);
      setAddress('Unable to fetch address');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedType) {
      alert('Please select an emergency type');
      return;
    }

    if (selectedType === 'other' && !customDescription.trim()) {
      alert('Please provide a description for other emergency type');
      return;
    }

    if (!location) {
      alert('Location is required. Please enable location services.');
      return;
    }

    try {
      await createEmergency({
        emergencyType: selectedType,
        customDescription: selectedType === 'other' ? customDescription : '',
        severity,
        coordinates: location.coordinates,
        address: address || 'Address not available'
      });
      
      onClose();
      // Reset form
      setSelectedType('');
      setCustomDescription('');
      setSeverity('medium');
    } catch (error) {
      console.error('Failed to create emergency:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold text-red-600 flex items-center">
            <AlertCircle className="mr-2" />
            Emergency Alert
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Location Status */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center text-sm">
              <MapPin size={16} className="mr-2 text-blue-500" />
              {locationLoading ? (
                <span>Getting your location...</span>
              ) : location ? (
                <span className="text-green-600">Location detected</span>
              ) : (
                <span className="text-red-600">Location required</span>
              )}
            </div>
            {address && (
              <p className="text-xs text-gray-600 mt-1">{address}</p>
            )}
            {!location && (
              <button
                type="button"
                onClick={getCurrentLocation}
                className="mt-2 text-blue-600 text-sm hover:underline"
              >
                Retry getting location
              </button>
            )}
          </div>

          {/* Emergency Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Emergency Type *
            </label>
            <div className="grid grid-cols-2 gap-2">
              {EMERGENCY_TYPES.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setSelectedType(type.value)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    selectedType === type.value
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex flex-col items-center">
                    <span className="text-2xl mb-1">{type.icon}</span>
                    <span className="text-xs font-medium">{type.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Description */}
          {selectedType === 'other' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Describe the emergency *
              </label>
              <textarea
                value={customDescription}
                onChange={(e) => setCustomDescription(e.target.value)}
                placeholder="Please describe the emergency situation..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                rows="3"
                maxLength="150"
              />
              <p className="text-xs text-gray-500 mt-1">
                {customDescription.length}/150 characters
              </p>
            </div>
          )}

          {/* Severity Level */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Severity Level
            </label>
            <div className="flex space-x-2">
              {SEVERITY_LEVELS.map((level) => (
                <button
                  key={level.value}
                  type="button"
                  onClick={() => setSeverity(level.value)}
                  className={`flex-1 p-2 rounded-lg text-white font-medium ${
                    level.color
                  } ${
                    severity === level.value
                      ? 'ring-2 ring-offset-2 ring-gray-400'
                      : 'opacity-70 hover:opacity-90'
                  }`}
                >
                  {level.label}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !selectedType || !location}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending Alert...' : 'Send Emergency Alert'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmergencyModal;
