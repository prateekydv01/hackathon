import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import EditProfileModal from './EditProfileModal';
import { updateUserProfile, getUserProfile } from '../api';

const ProfilePage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUser = useSelector(state => state.auth.userData);
  
  const [user, setUser] = useState(null);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Replace mock with actual API call
  const fetchUserProfile = async (id) => {
    try {
      setError(null);
      const response = await getUserProfile(id);
      setUser(response.data.data);
    } catch (apiError) {
      console.error('Error fetching user profile:', apiError);
      
      if (apiError.response?.status === 404) {
        setError('User not found');
      } else if (apiError.response?.status === 401) {
        setError('Access denied');
      } else {
        setError(apiError.response?.data?.message || 'Failed to load user profile');
      }
      
      setUser(null);
    }
  };

  // Load profile data
  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (!userId || userId === currentUser?._id) {
          // Own profile
          setUser(currentUser);
          setIsOwnProfile(true);
        } else {
          // Other user's profile
          setIsOwnProfile(false);
          await fetchUserProfile(userId);
        }
      } catch (err) {
        console.error('Error loading profile:', err);
        setError('Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [userId, currentUser]);

  const handleEditProfile = async (updatedData) => {
    try {
      const response = await updateUserProfile(updatedData);
      
      // Update local state
      setUser(response.data.data);
      setShowEditModal(false);
      
      // Show success message
      alert('Profile updated successfully!');
      
      // Update Redux store if it's own profile
      if (isOwnProfile) {
        // dispatch(updateAuthUser(response.data.data)); // If you have this action
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update profile';
      alert(`Error: ${errorMessage}`);
    }
  };

  const getProfessionIcon = (profession) => {
    const icons = {
      'Accountant': '💼',
      'Barber': '✂️',
      'Carpenter': '🔨',
      'Chef': '👨‍🍳',
      'Cleaner': '🧹',
      'Doctor': '🩺',
      'Driver': '🚗',
      'Electrician': '⚡',
      'Engineer': '👷‍♂️',
      'Gardener': '🌱',
      'Lawyer': '⚖️',
      'Maid': '🧽',
      'Mechanic': '🔧',
      'Musician': '🎸',
      'Nurse': '💉',
      'Painter': '🎨',
      'Photographer': '📷',
      'Plumber': '🔧',
      'Receptionist': '📋',
      'Security Guard': '🛡️',
      'Student': '📚',
      'Teacher': '📖',
      'Tutor': '📝',
      'Waiter': '🍽️',
      'Other': '👤'
    };
    return icons[profession] || icons['Other'];
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{error}</h2>
          <p className="text-gray-600 mb-6">
            {error === 'User not found' 
              ? "The profile you're looking for doesn't exist or has been removed."
              : error === 'Access denied'
              ? "You don't have permission to view this profile."
              : "We couldn't load the profile right now. Please try again."}
          </p>
          <div className="space-y-3">
            <button 
              onClick={() => navigate(-1)}
              className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors">
              Go Back
            </button>
            <button 
              onClick={() => window.location.reload()}
              className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors">
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // No user data
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Profile not available</h2>
          <button 
            onClick={() => navigate(-1)}
            className="text-purple-600 hover:underline">
            Go back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
            <span className="text-xl">←</span>
            <span>Back</span>
          </button>
          
          <h1 className="text-xl font-semibold text-gray-800">
            {isOwnProfile ? 'My Profile' : `${user.fullName}'s Profile`}
          </h1>
          
          <div className="w-16"></div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Cover Section */}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-8 relative">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
              {/* Profile Picture */}
              <div className="relative">
                <img 
                  src={user.avatar || 'https://via.placeholder.com/150x150?text=User'}
                  alt={user.fullName}
                  className="w-32 h-32 rounded-2xl object-cover border-4 border-white shadow-lg"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/150x150?text=User'
                  }}
                />
              </div>

              {/* Basic Info */}
              <div className="text-center md:text-left text-white flex-1">
                <h2 className="text-3xl font-bold mb-2">{user.fullName}</h2>
                <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                  <span className="text-2xl">{getProfessionIcon(user.profession)}</span>
                  <span className="text-xl font-semibold">{user.profession}</span>
                </div>
                
                {/* Rating */}
                {user.rating && (
                  <div className="flex items-center justify-center md:justify-start gap-1 mb-2">
                    <span className="text-yellow-400 text-lg">⭐</span>
                    <span className="font-semibold">{user.rating}</span>
                    <span className="text-purple-200">({user.reviewCount || 0} reviews)</span>
                  </div>
                )}

                {/* Location */}
                <div className="flex items-center justify-center md:justify-start gap-1 text-purple-200">
                  {/* <span className="text-lg">📍</span> */}
                  {/* <span>{user.location?.address || 'Location not set'}</span> */}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3">
                {isOwnProfile ? (
                  <button
                    onClick={() => setShowEditModal(true)}
                    className="flex items-center gap-2 bg-white text-purple-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors shadow-lg">
                    <span className="text-lg">✏️</span>
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex gap-3">
                   
                    <button 
                      onClick={() => user.contactNumber && (window.location.href = `tel:${user.contactNumber}`)}
                      className="flex items-center gap-2 bg-white text-purple-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors shadow-lg">
                      <span className="text-lg">📞</span>
                      Call
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Stats */}
            {(user.completedJobs || user.reviewCount) && (
              <div className="grid grid-cols-3 gap-6 mb-8 text-center">
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="text-2xl font-bold text-purple-600">{user.completedJobs || 0}</div>
                  <div className="text-gray-600 font-medium">Jobs Completed</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="text-2xl font-bold text-purple-600">{user.reviewCount || 0}</div>
                  <div className="text-gray-600 font-medium">Reviews</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="text-2xl font-bold text-purple-600">
                    {user.joinedDate ? new Date().getFullYear() - new Date(user.joinedDate).getFullYear() : 0}+
                  </div>
                  <div className="text-gray-600 font-medium">Years Experience</div>
                </div>
              </div>
            )}

            {/* About Section */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4">About</h3>
              <p className="text-gray-600 leading-relaxed">
                {user.aboutMe || 'No description available.'}
              </p>
            </div>

            {/* Contact Information */}
            {(isOwnProfile || user.contactNumber || user.email) && (
              <div className="border-t pt-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(isOwnProfile || user.email) && (
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-purple-600 text-lg">📧</span>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-800">Email</div>
                        <div className="text-gray-600">{user.email}</div>
                      </div>
                    </div>
                  )}
                  
                  {(isOwnProfile || user.contactNumber) && (
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-600 text-lg">📞</span>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-800">Phone</div>
                        <div className="text-gray-600">{user.contactNumber}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <EditProfileModal
          user={user}
          onSave={handleEditProfile}
          onClose={() => setShowEditModal(false)}
        />
      )}
    </div>
  );
};

export default ProfilePage;
