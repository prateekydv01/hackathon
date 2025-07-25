// components/EmergencyForm.jsx
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createEmergencyAsync, selectEmergencyLoading } from '../store/emergencySlice';
import { Car, Heart, AlertTriangle, Shield, Edit3, MapPin, Phone } from 'lucide-react';

const EmergencyForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loading = useSelector(selectEmergencyLoading);
  
  const [formData, setFormData] = useState({
    emergencyType: '',
    customIssue: '',
    description: '',
    priority: 'medium'
  });

  const emergencyTypes = [
    { value: 'accident', label: 'Accident', icon: Car, color: 'text-red-500', bg: 'bg-red-50 border-red-200' },
    { value: 'health', label: 'Health Emergency', icon: Heart, color: 'text-pink-500', bg: 'bg-pink-50 border-pink-200' },
    { value: 'fire', label: 'Fire Emergency', icon: AlertTriangle, color: 'text-orange-500', bg: 'bg-orange-50 border-orange-200' },
    { value: 'theft', label: 'Theft/Security', icon: Shield, color: 'text-purple-500', bg: 'bg-purple-50 border-purple-200' },
    { value: 'other', label: 'Other', icon: Edit3, color: 'text-gray-500', bg: 'bg-gray-50 border-gray-200' }
  ];

  const priorityLevels = [
    { value: 'low', label: 'Low', color: 'bg-green-100 text-green-800 border-green-200' },
    { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
    { value: 'high', label: 'High', color: 'bg-orange-100 text-orange-800 border-orange-200' },
    { value: 'critical', label: 'Critical', color: 'bg-red-100 text-red-800 border-red-200' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.emergencyType || !formData.description) {
      alert('Please fill in all required fields');
      return;
    }

    if (formData.emergencyType === 'other' && !formData.customIssue) {
      alert('Please describe the custom issue');
      return;
    }

    try {
      await dispatch(createEmergencyAsync(formData)).unwrap();
      navigate('/emergency');
    } catch (error) {
      console.error('Error creating emergency:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="bg-red-600 text-white p-6 rounded-t-lg">
          <h1 className="text-xl font-bold flex items-center">
            <AlertTriangle className="mr-2" />
            Report Emergency
          </h1>
          <p className="text-red-100 text-sm mt-1">
            Your location will be shared with nearby helpers
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-b-lg shadow-lg p-6 space-y-6">
          {/* Emergency Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Emergency Type *
            </label>
            <div className="grid grid-cols-2 gap-3">
              {emergencyTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setFormData({...formData, emergencyType: type.value})}
                    className={`p-4 border-2 rounded-lg flex flex-col items-center space-y-2 transition-all ${
                      formData.emergencyType === type.value
                        ? `${type.bg} border-current scale-105`
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className={`w-6 h-6 ${formData.emergencyType === type.value ? type.color : 'text-gray-400'}`} />
                    <span className={`text-sm font-medium text-center ${
                      formData.emergencyType === type.value ? 'text-gray-800' : 'text-gray-600'
                    }`}>
                      {type.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Issue Input */}
          {formData.emergencyType === 'other' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Describe the Issue *
              </label>
              <input
                type="text"
                value={formData.customIssue}
                onChange={(e) => setFormData({...formData, customIssue: e.target.value})}
                placeholder="What kind of emergency is this?"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          )}

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Provide more details about the emergency..."
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          {/* Priority Level */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Priority Level
            </label>
            <div className="grid grid-cols-2 gap-3">
              {priorityLevels.map((priority) => (
                <button
                  key={priority.value}
                  type="button"
                  onClick={() => setFormData({...formData, priority: priority.value})}
                  className={`p-3 rounded-lg text-sm font-medium border-2 transition-all ${
                    formData.priority === priority.value
                      ? `${priority.color} border-current scale-105`
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {priority.label}
                </button>
              ))}
            </div>
          </div>

          {/* Location Info */}
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
            <div className="flex items-center text-blue-700">
              <MapPin className="w-5 h-5 mr-2" />
              <div>
                <p className="font-medium">Location Sharing</p>
                <p className="text-sm text-blue-600">
                  Your current location will be shared with nearby helpers within 2km
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={() => navigate('/emergency')}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-red-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Phone className="w-4 h-4 mr-2" />
                  Send Emergency Alert
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmergencyForm;
