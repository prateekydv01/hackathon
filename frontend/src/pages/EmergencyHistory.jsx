// src/pages/EmergencyHistory.jsx
import React, { useState, useEffect } from 'react';
import { Clock, MapPin, User, Phone, AlertTriangle, CheckCircle, XCircle, Loader } from 'lucide-react';
import { emergencyService } from '../api/emergency'
import { toast } from 'react-toastify';

const EmergencyHistory = () => {
  const [emergencies, setEmergencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(null);

  useEffect(() => {
    loadUserEmergencies();
  }, []);

  const loadUserEmergencies = async () => {
    try {
      setLoading(true);
      const response = await emergencyService.getUserEmergencies();
      setEmergencies(response.data);
    } catch (error) {
      console.error('Failed to load emergency history:', error);
      toast.error('Failed to load emergency history');
    } finally {
      setLoading(false);
    }
  };

  const updateEmergencyStatus = async (emergencyId, newStatus) => {
    try {
      setUpdatingStatus(emergencyId);
      await emergencyService.updateEmergencyStatus(emergencyId, newStatus);
      
      // Update local state
      setEmergencies(prev => 
        prev.map(emergency => 
          emergency._id === emergencyId 
            ? { ...emergency, status: newStatus }
            : emergency
        )
      );
      
      toast.success(`Emergency status updated to ${newStatus}`);
    } catch (error) {
      console.error('Failed to update emergency status:', error);
      toast.error('Failed to update emergency status');
    } finally {
      setUpdatingStatus(null);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-red-100 text-red-800 border-red-200',
      in_progress: 'bg-orange-100 text-orange-800 border-orange-200',
      resolved: 'bg-green-100 text-green-800 border-green-200',
      cancelled: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[status] || colors.active;
  };

  const getStatusIcon = (status) => {
    const icons = {
      active: <AlertTriangle size={16} className="text-red-600" />,
      in_progress: <Loader size={16} className="text-orange-600" />,
      resolved: <CheckCircle size={16} className="text-green-600" />,
      cancelled: <XCircle size={16} className="text-gray-600" />
    };
    return icons[status] || icons.active;
  };

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

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeSince = (timestamp) => {
    const now = new Date();
    const emergencyTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - emergencyTime) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)} hours ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)} days ago`;
    }
  };

  const canUpdateStatus = (status) => {
    return status === 'active' || status === 'in_progress';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                Emergency History
              </h1>
              <p className="text-sm text-gray-600">
                View and manage your emergency alerts
              </p>
            </div>
            <button
              onClick={loadUserEmergencies}
              disabled={loading}
              className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50"
            >
              <Clock size={16} className={`mr-1 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-red-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Active</p>
                <p className="text-lg font-semibold text-gray-900">
                  {emergencies.filter(e => e.status === 'active').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center">
              <Loader className="h-8 w-8 text-orange-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">In Progress</p>
                <p className="text-lg font-semibold text-gray-900">
                  {emergencies.filter(e => e.status === 'in_progress').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Resolved</p>
                <p className="text-lg font-semibold text-gray-900">
                  {emergencies.filter(e => e.status === 'resolved').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-blue-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Total</p>
                <p className="text-lg font-semibold text-gray-900">
                  {emergencies.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Emergency List */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-medium text-gray-900">
              Your Emergency Alerts
            </h2>
          </div>
          
          <div className="p-6">
            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-2 text-gray-600">Loading your emergency history...</p>
              </div>
            ) : emergencies.length === 0 ? (
              <div className="text-center py-8">
                <AlertTriangle size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No Emergency History
                </h3>
                <p className="text-gray-600">
                  You haven't created any emergency alerts yet.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {emergencies.map((emergency) => (
                  <div key={emergency._id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start space-x-3">
                        <span className="text-2xl">{getEmergencyIcon(emergency.emergencyType)}</span>
                        <div>
                          <h3 className="font-semibold text-gray-900 capitalize flex items-center">
                            {emergency.emergencyType.replace('_', ' ')} Emergency
                            <span className="ml-2">{getStatusIcon(emergency.status)}</span>
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">
                            {formatDate(emergency.createdAt)} • {getTimeSince(emergency.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(emergency.status)}`}>
                          {emergency.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                    </div>

                    {emergency.customDescription && (
                      <div className="mb-3">
                        <p className="text-gray-700 text-sm bg-gray-50 p-3 rounded border-l-4 border-blue-200">
                          <span className="font-medium">Description: </span>
                          "{emergency.customDescription}"
                        </p>
                      </div>
                    )}

                    <div className="space-y-2 text-sm text-gray-600 mb-3">
                      <div className="flex items-center">
                        <MapPin size={14} className="mr-2 text-blue-500" />
                        <span>{emergency.address}</span>
                      </div>
                      <div className="flex items-center">
                        <User size={14} className="mr-2 text-green-500" />
                        <span>
                          {emergency.notifiedUsers?.length || 0} users notified
                        </span>
                      </div>
                    </div>

                    {emergency.respondersAccepted?.length > 0 && (
                      <div className="mb-3 p-3 bg-green-50 rounded border-l-4 border-green-400">
                        <p className="text-sm text-green-700 font-medium mb-2">
                          🎉 {emergency.respondersAccepted.length} responder(s) helped with this emergency
                        </p>
                        <div className="space-y-1">
                          {emergency.respondersAccepted.map((responder, index) => (
                            <div key={index} className="flex items-center text-sm text-green-600">
                              <User size={12} className="mr-2" />
                              <span>{responder.userId?.fullName || 'Anonymous Responder'}</span>
                              <span className="ml-2 text-xs text-green-500">
                                ({new Date(responder.acceptedAt).toLocaleTimeString()})
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Status Update Buttons */}
                    {canUpdateStatus(emergency.status) && (
                      <div className="flex space-x-2 pt-3 border-t">
                        {emergency.status === 'active' && (
                          <button
                            onClick={() => updateEmergencyStatus(emergency._id, 'resolved')}
                            disabled={updatingStatus === emergency._id}
                            className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {updatingStatus === emergency._id ? 'Updating...' : 'Mark as Resolved'}
                          </button>
                        )}
                        {emergency.status === 'in_progress' && (
                          <button
                            onClick={() => updateEmergencyStatus(emergency._id, 'resolved')}
                            disabled={updatingStatus === emergency._id}
                            className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {updatingStatus === emergency._id ? 'Updating...' : 'Mark as Resolved'}
                          </button>
                        )}
                        <button
                          onClick={() => updateEmergencyStatus(emergency._id, 'cancelled')}
                          disabled={updatingStatus === emergency._id}
                          className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {updatingStatus === emergency._id ? 'Updating...' : 'Cancel'}
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyHistory;
