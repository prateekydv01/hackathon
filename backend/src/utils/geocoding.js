// utils/geocoding.js (Backend version)
import axios from 'axios';

// Cache to avoid repeated API calls
const geocodeCache = new Map();

export const getCityFromCoordinates = async (latitude, longitude) => {
    const cacheKey = `${latitude.toFixed(4)},${longitude.toFixed(4)}`;
    
    // Check cache first
    if (geocodeCache.has(cacheKey)) {
        console.log(`📍 Using cached location for ${cacheKey}`);
        return geocodeCache.get(cacheKey);
    }

    try {
        console.log(`📍 Geocoding coordinates: ${latitude}, ${longitude}`);
        
        const response = await axios.get(
            `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${process.env.OPENCAGE_API_KEY}&limit=1`
        );
        
        if (response.data.results && response.data.results.length > 0) {
            const result = response.data.results[0];
            const components = result.components;
            
            // Create detailed address
            const city = components.city || 
                        components.town || 
                        components.village || 
                        components.municipality ||
                        'Unknown City';
            
            const state = components.state || 
                         components.province || 
                         components.region || '';
            
            const country = components.country || '';
            
            // Format: "City, State, Country" or just "City" if others are missing
            let fullAddress = city;
            if (state) fullAddress += `, ${state}`;
            if (country) fullAddress += `, ${country}`;
            
            console.log(`📍 Geocoded to: ${fullAddress}`);
            
            // Cache the result
            geocodeCache.set(cacheKey, fullAddress);
            return fullAddress;
        }
        
        console.log('📍 No geocoding results found');
        return 'Unknown Location';
        
    } catch (error) {
        console.error('❌ Geocoding error:', error.message);
        return 'Location Error';
    }
};

// Alternative function for more detailed address
export const getDetailedAddressFromCoordinates = async (latitude, longitude) => {
    try {
        const response = await axios.get(
            `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${process.env.OPENCAGE_API_KEY}&limit=1`
        );
        
        if (response.data.results && response.data.results.length > 0) {
            const result = response.data.results[0];
            return {
                formatted: result.formatted,
                city: result.components.city || result.components.town || 'Unknown',
                state: result.components.state || result.components.province || '',
                country: result.components.country || '',
                postcode: result.components.postcode || '',
                road: result.components.road || '',
                suburb: result.components.suburb || result.components.neighbourhood || ''
            };
        }
        
        return null;
    } catch (error) {
        console.error('Detailed geocoding error:', error);
        return null;
    }
};
