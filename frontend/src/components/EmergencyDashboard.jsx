// components/EmergencyDashboard.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  fetchNearbyEmergencies, 
  selectNearbyEmergencies, 
  selectMyEmergencies,
  selectActiveAlert,
  selectEmergencyLoading,
  clearActiveAlert
} from '../store/emergencySlice';
import EmergencyAlert from './EmergencyAlert';
import { Plus, AlertTriangle, Clock, CheckCircle, XCircle, MapPin, Phone } from 'lucide-react';

const EmergencyDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const nearbyEmergencies = useSelector(selectNearbyEmergencies);
  const myEmergencies = useSelector(selectMyEmergencies);
  const activeAlert = useSelector(selectActiveAlert);
  const loading = useSelector(selectEmergencyLoading);

  useEffect(() => {
    dispatch(fetchNearbyEmergencies());
    const interval = setInterval(() => {
      dispatch(fetchNearbyEmergencies());
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [dispatch]);

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
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
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

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center">
              <AlertTriangle className="w-8 h-8 mr-3 text-red-600" />
              Emergency Dashboard
            </h1>
            <p className="text-gray-600 mt-1">Help others in your community during emergencies</p>
          </div>
          <button
            onClick={() => navigate('/emergency/create')}
            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 flex items-center shadow-lg transform hover:scale-105 transition-all"
          >
            <Plus className="w-5 h-5 mr-2" />
            Report Emergency
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Nearby Emergencies</h3>
            <p className="text-3xl font-bold text-red-600">{nearbyEmergencies.length}</p>
            <p className="text-xs text-gray-500 mt-1">Within 2km radius</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
            <h3 className="text-sm font-medium text-gray-600 mb-2">My Emergencies</h3>
            <p className="text-3xl font-bold text-blue-600">{myEmergencies.length}</p>
            <p className="text-xs text-gray-500 mt-1">Total reported</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Helped Others</h3>
            <p className="text-3xl font-bold text-green-600">
              {myEmergencies.filter(e => e.acceptedBy && e.status === 'resolved').length}
            </p>
            <p className="text-xs text-gray-500 mt-1">Successfully resolved</p>
          </div>
        </div>

        {/* Nearby Emergencies */}
        <div className="bg-white rounded-lg shadow-md mb-8">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">Nearby Emergencies</h2>
              <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                Live Updates
              </span>
            </div>
          </div>
          <div className="p-6">
            {loading && nearbyEmergencies.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-500">Loading nearby emergencies...</p>
              </div>
            ) : nearbyEmergencies.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No nearby emergencies</p>
                <p className="text-gray-400 text-sm">Your area is safe right now</p>
              </div>
            ) : (
              <div className="space-y-4">
                {nearbyEmergencies.map((emergency) => (
                  <div key={emergency._id} className="border-2 border-gray-200 rounded-lg p-4 hover:border-red-300 transition-colors">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <span className="text-2xl">{getEmergencyIcon(emergency.emergencyType)}</span>
                          <div>
                            <h3 className="font-bold text-lg capitalize text-gray-800">
                              {emergency.emergencyType === 'other' ? emergency.customIssue : emergency.emergencyType}
                            </h3>
                            <div className="flex items-center space-x-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(emergency.status)}`}>
                                {getStatusIcon(emergency.status)}
                                <span className="ml-1">{emergency.status}</span>
                              </span>
                              <span className="text-xs text-gray-500">
                                {new Date(emergency.createdAt).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <p className="text-gray-700 mb-3 bg-gray-50 p-3 rounded-lg">{emergency.description}</p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center text-sm text-gray-600">
                              <img 
                                src={emergency.sender.avatar} 
                                alt={emergency.sender.fullName}
                                className="w-6 h-6 rounded-full mr-2"
                              />
                              <span>{emergency.sender.fullName}</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-500">
                              <MapPin className="w-4 h-4 mr-1" />
                              <span> 2km away</span>
                            </div>
                          </div>
                          
                          {emergency.status === 'pending' && (
                            <button
                              onClick={() => dispatch({ type: 'emergency/setActiveAlert', payload: emergency })}
                              className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors flex items-center"
                            >
                              <Phone className="w-4 h-4 mr-1" />
                              Help Now
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* My Emergencies */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">My Emergencies</h2>
          </div>
          <div className="p-6">
            {myEmergencies.length === 0 ? (
              <div className="text-center py-8">
                <AlertTriangle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No emergencies reported</p>
                <p className="text-gray-400 text-sm">Hope you never need to use this feature</p>
              </div>
            ) : (
              <div className="space-y-4">
                {myEmergencies.map((emergency) => (
                  <div key={emergency._id} className="border-2 border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="text-2xl">{getEmergencyIcon(emergency.emergencyType)}</span>
                          <div>
                            <h3 className="font-bold text-lg capitalize">
                              {emergency.emergencyType === 'other' ? emergency.customIssue : emergency.emergencyType}
                            </h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(emergency.status)}`}>
                              {getStatusIcon(emergency.status)}
                              <span className="ml-1">{emergency.status}</span>
                            </span>
                          </div>
                        </div>
                        <p className="text-gray-600 mb-2">{emergency.description}</p>
                        <div className="flex items-center text-xs text-gray-500 space-x-4">
                          <span>{new Date(emergency.createdAt).toLocaleString()}</span>
                          {emergency.acceptedBy && (
                            <span className="text-green-600">
                              ✅ Helped by: {emergency.acceptedBy.fullName}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Emergency Alert Modal */}
      {activeAlert && <EmergencyAlert emergency={activeAlert} />}
    </div>
  );
};

export default EmergencyDashboard;
