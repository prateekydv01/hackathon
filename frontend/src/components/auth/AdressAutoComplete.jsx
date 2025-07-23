import React, { useRef, useEffect } from 'react';

const AddressAutocomplete = ({ onAddressSelect, placeholder = "Enter your address" }) => {
  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);

  useEffect(() => {
    // Load Google Maps script if not already loaded
    const loadGoogleMapsScript = () => {
      if (window.google) {
        initializeAutocomplete();
        return;
      }

      // Check if API key is available
      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
      
      if (!apiKey) {
        console.error('Google Maps API key is not defined in environment variables');
        return;
      }

      const script = document.createElement('script');
      // Use import.meta.env instead of process.env for Vite
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.onload = () => {
        initializeAutocomplete();
      };
      script.onerror = () => {
        console.error('Failed to load Google Maps script');
      };
      
      // Check if script already exists
      const existingScript = document.querySelector(`script[src*="maps.googleapis.com"]`);
      if (!existingScript) {
        document.head.appendChild(script);
      } else {
        initializeAutocomplete();
      }
    };

    const initializeAutocomplete = () => {
      if (!window.google || !inputRef.current) return;

      try {
        // Initialize Google Places Autocomplete
        autocompleteRef.current = new window.google.maps.places.Autocomplete(
          inputRef.current,
          {
            types: ['address'],
            componentRestrictions: { country: 'IN' }, // Change as needed
            fields: ['geometry', 'formatted_address', 'name']
          }
        );

        // Listen for place selection
        const listener = autocompleteRef.current.addListener('place_changed', () => {
          const place = autocompleteRef.current.getPlace();
          
          if (place.geometry && place.geometry.location) {
            const coordinates = {
              latitude: place.geometry.location.lat(),
              longitude: place.geometry.location.lng(),
              address: place.formatted_address || place.name
            };
            
            onAddressSelect(coordinates);
            console.log('Address selected:', coordinates);
          } else {
            console.log('No geometry found for selected place');
          }
        });

        return () => {
          if (listener) {
            window.google.maps.event.removeListener(listener);
          }
        };
      } catch (error) {
        console.error('Error initializing autocomplete:', error);
      }
    };

    loadGoogleMapsScript();

    // Cleanup function
    return () => {
      if (autocompleteRef.current) {
        window.google?.maps?.event?.clearInstanceListeners?.(autocompleteRef.current);
      }
    };
  }, [onAddressSelect]);

  return (
    <input
      ref={inputRef}
      type="text"
      placeholder={placeholder}
      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-200 placeholder-gray-400"
    />
  );
};

export default AddressAutocomplete;
