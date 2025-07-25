/* src/pages/MapPage.jsx */
import React, { useEffect, useState, useMemo } from 'react';
import {
  GoogleMap,
  Marker,
  InfoWindow,
  useJsApiLoader,
} from '@react-google-maps/api';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchNearbyUsers,
  selectNearbyUsers,
  selectNearbyUsersLoading,
  selectNearbyUsersError,
} from '../store/nearbyUserSlice';

/* ---------- helpers ---------- */
const PROFESSION_COLORS = {
  Accountant: '#059669',
  Barber: '#f97316',
  Carpenter: '#84cc16',
  Chef: '#ec4899',
  Cleaner: '#8b5cf6',
  Doctor: '#ef4444',
  Driver: '#ffffff',
  Electrician: '#f59e0b',
  Engineer: '#0ea5e9',
  Gardener: '#22c55e',
  Lawyer: '#1e40af',
  Maid: '#a855f7',
  Mechanic: '#64748b',
  Musician: '#ffffff',
  Nurse: '#06b6d4',
  Painter: '#8b5cf6',
  Photographer: '#6366f1',
  Plumber: '#3b82f6',
  Receptionist: '#d946ef',
  'Security Guard': '#475569',
  Student: '#10b981',
  Teacher: '#10b981',
  Tutor: '#059669',
  Waiter: '#fb923c',
  Other: '#6b7280',
};

const PROFESSION_ICONS = {
  Accountant: '💼',
  Barber: '✂️',
  Carpenter: '🔨',
  Chef: '👨‍🍳',
  Cleaner: '🧹',
  Doctor: '🩺',
  Driver: '🚗',
  Electrician: '⚡',
  Engineer: '👷‍♂️',
  Gardener: '🌱',
  Lawyer: '⚖️',
  Maid: '🧽',
  Mechanic: '🔧',
  Musician: '🎸',
  Nurse: '💉',
  Painter: '🎨',
  Photographer: '📷',
  Plumber: '🔧',
  Receptionist: '📋',
  'Security Guard': '🛡️',
  Student: '📚',
  Teacher: '📖',
  Tutor: '📝',
  Waiter: '🍽️',
  Other: '👤',
};

const getColor = (p) => PROFESSION_COLORS[p] || PROFESSION_COLORS.Other;
const getIconChar = (p) => PROFESSION_ICONS[p] || PROFESSION_ICONS.Other;

/* ---------- component ---------- */
const MapPage = () => {
  const dispatch = useDispatch();
  const nearbyUsers = useSelector(selectNearbyUsers);
  const loading = useSelector(selectNearbyUsersLoading);
  const error = useSelector(selectNearbyUsersError);
  
  // ✅ Get logged-in user data from auth store
  const currentUser = useSelector(state => state.auth.userData);

  const [userLoc, setUserLoc] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [filter, setFilter] = useState('all');

  /* load Google Maps script only once */
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  /* ✅ get user location from their stored profile data */
  useEffect(() => {
    if (currentUser?.location?.coordinates) {
      // MongoDB stores coordinates as [longitude, latitude]
      const [lng, lat] = currentUser.location.coordinates;
      setUserLoc({ lat, lng });
    } else {
      // Fallback: try browser geolocation if no stored location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) =>
            setUserLoc({ 
              lat: pos.coords.latitude, 
              lng: pos.coords.longitude 
            }),
          () => setUserLoc({ lat: 28.6139, lng: 77.209 }), // Delhi fallback
        );
      } else {
        setUserLoc({ lat: 28.6139, lng: 77.209 }); // Default fallback
      }
    }
  }, [currentUser]);

  /* fetch professionals */
  useEffect(() => {
    if (userLoc) dispatch(fetchNearbyUsers({ profession: filter }));
  }, [userLoc, filter, dispatch]);

  /* filter locally for dropdown */
  const professionals = useMemo(
    () =>
      filter === 'all'
        ? nearbyUsers
        : nearbyUsers.filter((u) => u.profession === filter),
    [nearbyUsers, filter],
  );

  /* loading screen */
  if (!isLoaded || !userLoc)
    return (
      <div className='flex items-center justify-center h-screen'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-20 w-20 border-b-2 border-purple-600 mx-auto mb-4'></div>
          <h2 className='text-xl font-semibold'>Loading map…</h2>
          <p className='text-gray-600 mt-2'>
            {!currentUser?.location?.coordinates 
              ? 'Getting your location...' 
              : 'Loading map...'}
          </p>
        </div>
      </div>
    );

  /* marker factory: colored pin with ONLY icon */
  const svgMarker = (prof) => {
    const color = getColor(prof);
    const iconChar = getIconChar(prof);
    return {
      url:
        'data:image/svg+xml;charset=UTF-8,' +
        encodeURIComponent(`
        <svg width="50" height="50" viewBox="0 0 50 50"
             xmlns="http://www.w3.org/2000/svg">
          <circle cx="25" cy="25" r="22" fill="${color}" stroke="white" stroke-width="4"/>
          <text x="25" y="33" font-size="26" text-anchor="middle" fill="white">${iconChar}</text>
        </svg>`),
      scaledSize: { width: 50, height: 50 },
      anchor: { x: 25, y: 50 },
    };
  };

  return (
    <div className='relative h-screen'>
      {/* header */}
      <div className='absolute inset-x-0 top-0 z-10 bg-white/90 backdrop-blur-sm border-b'>
        <div className='max-w-7xl mx-auto px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-4'>
          <div>
            <h1 className='text-2xl font-bold'>Nearby Professionals</h1>
            <p className='text-gray-600'>
              {loading
                ? 'Loading…'
                : `${professionals.length} within 5 km`}
            </p>
            {/* ✅ Show location source */}
            <p className='text-xs text-gray-500'>
              {currentUser?.location?.coordinates 
                ? '📍 Using your profile location' 
                : '📍 Using browser location'}
            </p>
          </div>

          <div className='flex gap-3'>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className='px-4 py-2 border rounded-lg'>
              <option value='all'>All</option>
              {Object.keys(PROFESSION_ICONS).map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
            <button
              onClick={() => dispatch(fetchNearbyUsers({ profession: filter }))}
              disabled={loading}
              className='px-4 py-2 bg-purple-600 text-white rounded-lg disabled:opacity-50'>
              {loading ? '🔄' : '🔍'} Refresh
            </button>
          </div>
        </div>
      </div>

      {/* map */}
      <GoogleMap
        center={userLoc}
        zoom={13}
        mapContainerStyle={{ width: '100%', height: '100%' }}
        options={{
          zoomControl: true,
          streetViewControl: false,
        }}>
        {/* ✅ user marker with updated title */}
        <Marker
          position={userLoc}
          icon={{
            url:
              'data:image/svg+xml;charset=UTF-8,' +
              encodeURIComponent(`
              <svg width="40" height="40" viewBox="0 0 40 40"
                   xmlns="http://www.w3.org/2000/svg">
                <circle cx="20" cy="20" r="18" fill="#2563eb" stroke="white" stroke-width="4"/>
                <circle cx="20" cy="20" r="6" fill="white"/>
              </svg>`),
            scaledSize: { width: 40, height: 40 },
            anchor: { x: 20, y: 40 },
          }}
          title={currentUser?.fullName || 'Your Location'}
        />

        {/* professional markers */}
        {professionals.map((u) => (
          <Marker
            key={u._id}
            position={{
              lat: u.location?.coordinates[1] || 0,
              lng: u.location?.coordinates[0] || 0,
            }}
            onClick={() => setSelectedUser(u)}
            icon={svgMarker(u.profession)}
          />
        ))}

        {/* info window */}
        {selectedUser && (
          <InfoWindow
            position={{
              lat: selectedUser.location?.coordinates[1] || 0,
              lng: selectedUser.location?.coordinates[0] || 0,
            }}
            onCloseClick={() => setSelectedUser(null)}>
            <div className='p-3 w-60'>
              <div className='flex items-center gap-2 mb-2'>
                <img
                  src={
                    selectedUser.avatar ||
                    'https://via.placeholder.com/50x50?text=User'
                  }
                  alt={selectedUser.fullName}
                  onError={(e) =>
                    (e.target.src =
                      'https://via.placeholder.com/50x50?text=User')
                  }
                  className='w-10 h-10 rounded-full object-cover'
                />
                <div>
                  <h3 className='font-semibold'>{selectedUser.fullName}</h3>
                  <p className='text-sm text-purple-600 flex items-center gap-1'>
                    {getIconChar(selectedUser.profession)}{' '}
                    {selectedUser.profession}
                  </p>
                </div>
              </div>

              <p className='text-sm text-gray-600 mb-2 line-clamp-2'>
                {selectedUser.aboutMe || 'Professional service provider'}
              </p>

              <div className='flex gap-2'>
               
                <button
                  onClick={() =>
                    selectedUser.contactNumber &&
                    (window.location.href = `tel:${selectedUser.contactNumber}`)
                  }
                  className='flex-1 bg-purple-600 text-white py-1 rounded-lg text-sm'>
                  📞 Call
                </button>
              </div>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>

      {/* error banner */}
      {error && (
        <div className='absolute top-20 left-1/2 -translate-x-1/2 bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-lg'>
          {error}
        </div>
      )}

      {/* ✅ Location warning */}
      {!currentUser?.location?.coordinates && (
        <div className='absolute bottom-6 left-6 bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded-lg max-w-xs'>
          <p className='text-sm'>
            <strong>Note:</strong> Using browser location. 
            Update your profile location for more accurate results.
          </p>
        </div>
      )}
    </div>
  );
};

export default MapPage;
