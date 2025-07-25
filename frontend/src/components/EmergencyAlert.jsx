// components/EmergencyAlert.jsx
import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { acceptEmergencyAsync } from '../store/emergencySlice';
import { clearActiveAlert } from '../store/emergencySlice';
import { MapPin, Clock, User, Phone, Navigation, X, AlertTriangle } from 'lucide-react';

const EmergencyAlert = ({ emergency }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleAccept = async () => {
    try {
      const result = await dispatch(acceptEmergencyAsync(emergency._id)).unwrap();
      dispatch(clearActiveAlert());
      
      // Open Google Maps for navigation
      const route = result.route;
      if (route) {
        const [fromLng, fromLat] = route.from;
        const [toLng, toLat] = route.to;
        window.open(
          `https://www.google.com/maps/dir/${fromLat},${fromLng}/${toLat},${toLng}`,
          '_blank'
        );
      }
    } catch (error) {
      console.error('Accept emergency error:', error);
    }
  };

  const handleIgnore = () => {
    dispatch(clearActiveAlert());
  };

  const getEmergencyIcon = (type) => {
    switch(type) {
      case 'accident': return '🚗';
      case 'health': return '🏥';
      case 'fire': return '🔥';
      case 'theft': return '🚨';
      default: return '⚠️';
    }
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'bg-green-100 text-green-800 border-green-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      high: 'bg-orange-100 text-orange-800 border-orange-200',
      critical: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[priority] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto animate-pulse-ring">
        {/* Header */}
        <div className="bg-red-600 text-white p-4 rounded-t-lg relative">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold flex items-center">
              <span className="text-2xl mr-2 animate-bounce">🚨</span>
              Emergency Alert
            </h2>
            <button 
              onClick={handleIgnore}
              className="text-white hover:text-gray-200 p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="absolute top-0 right-0 w-full h-full bg-red-700 opacity-50 animate-pulse rounded-t-lg"></div>
        </div>

        <div className="p-6 space-y-4">
          {/* Emergency Type & Priority */}
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-2xl">{getEmergencyIcon(emergency.emergencyType)}</span>
                <h3 className="text-xl font-bold text-gray-800 capitalize">
                  {emergency.emergencyType === 'other' ? emergency.customIssue : emergency.emergencyType}
                </h3>
              </div>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${getPriorityColor(emergency.priority)}`}>
                {emergency.priority.toUpperCase()} PRIORITY
              </span>
            </div>
            <div className="text-right">
              <div className="flex items-center text-gray-500 text-sm">
                <Clock className="w-4 h-4 mr-1" />
                {new Date(emergency.createdAt).toLocaleTimeString()}
              </div>
            </div>
          </div>

          {/* Sender Info */}
          <div className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <img
                  src={emergency.sender.avatar}
                  alt={emergency.sender.fullName}
                  className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md"
                />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-ping"></div>
              </div>
              <div>
                <h4 className="font-bold text-gray-800">{emergency.sender.fullName}</h4>
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="w-3 h-3 mr-1" />
                  <a href={`tel:${emergency.sender.contactNumber}`} className="text-blue-600 hover:underline">
                    {emergency.sender.contactNumber}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="font-bold text-gray-800 mb-2">Description:</h4>
            <p className="text-gray-700 bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
              {emergency.description}
            </p>
          </div>

          {/* Location */}
          <div>
            <h4 className="font-bold text-gray-800 mb-2 flex items-center">
              <MapPin className="w-4 h-4 mr-1 text-red-500" />
              Location:
            </h4>
            <p className="text-gray-700 bg-blue-50 border border-blue-200 p-3 rounded-lg text-sm">
              {emergency.address}
            </p>
          </div>

          {/* Distance Info */}
          <div className="bg-green-50 border border-green-200 p-3 rounded-lg">
            <p className="text-green-700 text-sm font-medium">
              📍 This emergency is within 2km of your location
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              onClick={handleIgnore}
              className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Ignore
            </button>
            <button
              onClick={handleAccept}
              className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center animate-pulse"
            >
              <Navigation className="w-4 h-4 mr-2" />
              Accept & Help
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyAlert;
