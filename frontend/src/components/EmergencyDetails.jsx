// components/EmergencyDetails.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { acceptEmergencyAsync } from '../store/emergencySlice';
import { 
  MapPin, 
  Clock, 
  User, 
  Phone, 
  Navigation, 
  ArrowLeft, 
  AlertTriangle,
  CheckCircle,
  Calendar,
  MessageCircle
} from 'lucide-react';

const EmergencyDetails = ({ emergency, onAccept, onBack }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const handleAccept = async () => {
    setLoading(true);
    try {
      await onAccept();
    } catch (error) {
      console.error('Accept emergency error:', error);
    } finally {
      setLoading(false);
    }
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

  const getStatusColor = (status) => {
    const colors = {
      pending: 'text-yellow-600 bg-yellow-100 border-yellow-200',
      accepted: 'text-blue-600 bg-blue-100 border-blue-200',
      resolved: 'text-green-600 bg-green-100 border-green-200',
      cancelled: 'text-gray-600 bg-gray-100 border-gray-200'
    };
    return colors[status] || 'text-gray-600 bg-gray-100 border-gray-200';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'accepted': return <AlertTriangle className="w-4 h-4" />;
      case 'resolved': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <AlertTriangle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const openLocationInMaps = () => {
    const [lng, lat] = emergency.location.coordinates;
    const url = `https://www.google.com/maps?q=${lat},${lng}`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md mb-4">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center">
              <button
                onClick={onBack}
                className="mr-3 p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div className="flex items-center space-x-3">
                <span className="text-3xl">{getEmergencyIcon(emergency.emergencyType)}</span>
                <div>
                  <h1 className="text-xl font-bold text-gray-800 capitalize">
                    {emergency.emergencyType === 'other' ? emergency.customIssue : emergency.emergencyType}
                  </h1>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(emergency.status)}`}>
                      {getStatusIcon(emergency.status)}
                      <span className="ml-1 capitalize">{emergency.status}</span>
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(emergency.priority)}`}>
                      {emergency.priority.toUpperCase()} PRIORITY
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Details */}
        <div className="bg-white rounded-lg shadow-md mb-4">
          <div className="p-6 space-y-6">
            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <MessageCircle className="w-5 h-5 mr-2 text-blue-500" />
                Description
              </h3>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-gray-700 leading-relaxed">{emergency.description}</p>
              </div>
            </div>

            {/* Sender Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <User className="w-5 h-5 mr-2 text-green-500" />
                Person in Need
              </h3>
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <img
                      src={emergency.sender.avatar}
                      alt={emergency.sender.fullName}
                      className="w-16 h-16 rounded-full object-cover border-3 border-white shadow-lg"
                    />
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-white animate-pulse"></div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-lg text-gray-800">{emergency.sender.fullName}</h4>
                    <div className="flex items-center text-gray-600 mt-1">
                      <Phone className="w-4 h-4 mr-2" />
                      <a 
                        href={`tel:${emergency.sender.contactNumber}`} 
                        className="text-blue-600 hover:underline font-medium"
                      >
                        {emergency.sender.contactNumber}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Location Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-red-500" />
                Location
              </h3>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-gray-700 mb-3">{emergency.address}</p>
                <button
                  onClick={openLocationInMaps}
                  className="inline-flex items-center px-3 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  View on Maps
                </button>
              </div>
            </div>

            {/* Time Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-purple-500" />
                Timeline
              </h3>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="w-4 h-4 mr-2" />
                  <span className="font-medium">Reported:</span>
                  <span className="ml-2">{new Date(emergency.createdAt).toLocaleString()}</span>
                </div>
                
                {emergency.acceptedAt && (
                  <div className="flex items-center text-sm text-blue-600">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    <span className="font-medium">Accepted:</span>
                    <span className="ml-2">{new Date(emergency.acceptedAt).toLocaleString()}</span>
                  </div>
                )}

                {emergency.resolvedAt && (
                  <div className="flex items-center text-sm text-green-600">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    <span className="font-medium">Resolved:</span>
                    <span className="ml-2">{new Date(emergency.resolvedAt).toLocaleString()}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Helper Information (if accepted) */}
            {emergency.acceptedBy && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                  Helper
                </h3>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <img
                      src={emergency.acceptedBy.avatar}
                      alt={emergency.acceptedBy.fullName}
                      className="w-12 h-12 rounded-full object-cover border-2 border-green-300"
                    />
                    <div>
                      <h4 className="font-medium text-gray-800">{emergency.acceptedBy.fullName}</h4>
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="w-3 h-3 mr-1" />
                        <a 
                          href={`tel:${emergency.acceptedBy.contactNumber}`}
                          className="text-blue-600 hover:underline"
                        >
                          {emergency.acceptedBy.contactNumber}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-lg shadow-md p-4">
          {emergency.status === 'pending' && onAccept && (
            <div className="flex space-x-3">
              <button
                onClick={onBack}
                className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Go Back
              </button>
              <button
                onClick={handleAccept}
                disabled={loading}
                className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Navigation className="w-4 h-4 mr-2" />
                    Accept & Help
                  </>
                )}
              </button>
            </div>
          )}

          {emergency.status !== 'pending' && (
            <button
              onClick={onBack}
              className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Back to Dashboard
            </button>
          )}
        </div>

        {/* Emergency Instructions */}
        {emergency.status === 'pending' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-800 mb-2">Important Information</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Contact emergency services (911) if life-threatening</li>
                  <li>• Your location will be shared with the person in need</li>
                  <li>• Stay safe and assess the situation carefully</li>
                  <li>• Call the person directly before heading to location</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmergencyDetails;
