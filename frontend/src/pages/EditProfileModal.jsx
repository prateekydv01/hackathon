import React, { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

const EditProfileModal = ({ user, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    fullName: user.fullName || '',
    contactNumber: user.contactNumber || '',
    profession: user.profession || '',
    aboutMe: user.aboutMe || '',
    location: user.location?.address || ''
  });
  
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updateData = new FormData();
      Object.keys(formData).forEach(key => {
        updateData.append(key, formData[key]);
      });
      
      if (avatar) {
        updateData.append('avatar', avatar);
      }

      await onSave(updateData);
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">Edit Profile</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <XMarkIcon className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Avatar Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Profile Picture
            </label>
            <div className="flex items-center gap-4">
              <img 
                src={user.avatar || 'https://via.placeholder.com/80x80?text=User'}
                alt="Current avatar"
                className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
              />
            </div>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Contact Number */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Contact Number *
            </label>
            <input
              type="tel"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Profession */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Profession *
            </label>
            <select
              name="profession"
              value={formData.profession}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
              <option value="">Select Profession</option>
              <option value="Accountant">Accountant</option>
              <option value="Barber">Barber</option>
              <option value="Carpenter">Carpenter</option>
              <option value="Chef">Chef</option>
              <option value="Cleaner">Cleaner</option>
              <option value="Doctor">Doctor</option>
              <option value="Driver">Driver</option>
              <option value="Electrician">Electrician</option>
              <option value="Engineer">Engineer</option>
              <option value="Gardener">Gardener</option>
              <option value="Lawyer">Lawyer</option>
              <option value="Maid">Maid</option>
              <option value="Mechanic">Mechanic</option>
              <option value="Musician">Musician</option>
              <option value="Nurse">Nurse</option>
              <option value="Painter">Painter</option>
              <option value="Photographer">Photographer</option>
              <option value="Plumber">Plumber</option>
              <option value="Receptionist">Receptionist</option>
              <option value="Security Guard">Security Guard</option>
              <option value="Student">Student</option>
              <option value="Teacher">Teacher</option>
              <option value="Tutor">Tutor</option>
              <option value="Waiter">Waiter</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* About Me */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              About Me
            </label>
            <textarea
              name="aboutMe"
              value={formData.aboutMe}
              onChange={handleInputChange}
              rows={4}
              placeholder="Tell others about your services, experience, and expertise..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="City, State, Country"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold">
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors font-semibold">
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
