import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Navigation, Phone, Clock, CheckCircle, ArrowLeft } from 'lucide-react';

const RouteNavigationPage = () => {
  const { emergencyId } = useParams();
  const navigate = useNavigate();
  const [routeData, setRouteData] = useState(null);
  const [emergency, setEmergency] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRouteData();
  }, [emergencyId]);

  const fetchRouteData = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/emergency/${emergencyId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setEmergency(data.data);
        generateRouteData(data.data);
      }
    } catch (error) {
      console.error('Error fetching route data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateRouteData = (emergencyData) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const fromCoords = [position.coords.longitude, position.coords.latitude];
        const toCoords = emergencyData.location.coordinates;
        
        setRouteData({
          from: { coordinates: fromCoords },
          to: { coordinates: toCoords, address: emergencyData.address },
          emergency: emergencyData
        });
      });
    }
  };

  const openGoogleMaps = () => {
    if (routeData) {
      const [fromLng, fromLat] = routeData.from.coordinates;
      const [toLng, toLat] = routeData.to.coordinates;
      const url = `https://www.google.com/maps/dir/${fromLat},${fromLng}/${toLat},${toLng}`;
      window.open(url, '_blank');
    }
  };

  const openAppleMaps = () => {
    if (routeData) {
      const [fromLng, fromLat] = routeData.from.coordinates;
      const [toLng, toLat] = routeData.to.coordinates;
      const url = `http://maps.apple.com/?saddr=${fromLat},${fromLng}&daddr=${toLat},${toLng}`;
      window.open(url, '_blank');
    }
  };

  const markAsResolved = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/emergency/update-status/${emergencyId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status: 'resolved' })
      });
      
      if (response.ok) {
        navigate('/emergency');
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading route information...</p>
        </div>
      </div>
    );
  }

  if (!routeData || !emergency) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Route data not available</p>
          <button
            onClick={() => navigate('/emergency')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="bg-blue-600 text-white p-4 rounded-t-lg">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/emergency')}
              className="mr-3 p-1 hover:bg-blue-700 rounded"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-lg font-bold flex items-center">
                <Navigation className="mr-2" />
                Navigation to Emergency
              </h1>
              <p className="text-blue-100 text-sm">Help is on the way!</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-b-lg shadow-lg">
          {/* Emergency Info */}
          <div className="p-4 border-b">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-semibold text-lg capitalize">
                {emergency.emergencyType === 'other' ? emergency.customIssue : emergency.emergencyType}
              </h2>
              <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-medium">
                {emergency.priority} priority
              </span>
            </div>
            <p className="text-gray-600 text-sm mb-3">{emergency.description}</p>
            
            {/* Sender info */}
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded">
              <img
                src={emergency.sender.avatar}
                alt={emergency.sender.fullName}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="font-medium">{emergency.sender.fullName}</p>
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="w-3 h-3 mr-1" />
                  <a href={`tel:${emergency.sender.contactNumber}`} className="text-blue-600">
                    {emergency.sender.contactNumber}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Location Info */}
          <div className="p-4 border-b">
            <div className="flex items-center mb-2">
              <MapPin className="w-4 h-4 mr-2 text-red-500" />
              <h3 className="font-medium">Destination</h3>
            </div>
            <p className="text-gray-600 text-sm pl-6">{routeData.to.address}</p>
          </div>

          {/* Time Info */}
          <div className="p-4 border-b">
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="w-4 h-4 mr-2" />
              <span>Emergency reported: {new Date(emergency.createdAt).toLocaleString()}</span>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="p-4 space-y-3">
            <button
              onClick={openGoogleMaps}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 flex items-center justify-center font-medium"
            >
              <Navigation className="w-4 h-4 mr-2" />
              Open in Google Maps
            </button>
            
            <button
              onClick={openAppleMaps}
              className="w-full bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700 flex items-center justify-center font-medium"
            >
              <Navigation className="w-4 h-4 mr-2" />
              Open in Apple Maps
            </button>

            <div className="pt-4 border-t">
              <button
                onClick={markAsResolved}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 flex items-center justify-center font-medium"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Mark as Resolved
              </button>
            </div>

            <button
              onClick={() => navigate('/emergency')}
              className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RouteNavigationPage;
