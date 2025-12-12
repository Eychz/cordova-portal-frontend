'use client';

import { useEffect, useState, useCallback } from 'react';
import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';

// Let TypeScript know about the global `google` from Google Maps script
declare const google: any;

// Cordova, Cebu mainland bounding box
const CORDOVA_BOUNDS = {
  latMin: 10.2300,
  latMax: 10.2900,
  lngMin: 123.9300,
  lngMax: 123.9900,
};

// Default center (Cordova Municipal Hall area)
const DEFAULT_CENTER = { lat: 10.2580, lng: 123.9550 };

interface EventLocationMapProps {
  initialLat?: number;
  initialLng?: number;
  onLocationChange: (lat: number, lng: number, address: string) => void;
}

// Add your Google Maps API key here or use environment variable
const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY_HERE';

export default function EventLocationMap({ initialLat, initialLng, onLocationChange }: EventLocationMapProps) {
  const [markerPosition, setMarkerPosition] = useState(
    initialLat && initialLng 
      ? { lat: initialLat, lng: initialLng } 
      : DEFAULT_CENTER
  );
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Reverse geocode to get address from coordinates
  const reverseGeocode = useCallback(async (lat: number, lng: number) => {
    try {
      const geocoder = new google.maps.Geocoder();
      const response = await geocoder.geocode({
        location: { lat, lng },
      });

      if (response.results && response.results.length > 0) {
        // Try to find the most specific address
        let address = response.results[0].formatted_address;
        
        // Look for a result that includes Cordova
        const cordovaResult = response.results.find((result: any) => 
          result.formatted_address.includes('Cordova')
        );
        
        if (cordovaResult) {
          address = cordovaResult.formatted_address;
        }
        
        return address;
      }
      return 'Cordova, Cebu, Philippines';
    } catch (error) {
      console.error('Geocoding error:', error);
      return 'Cordova, Cebu, Philippines';
    }
  }, []);

  const handleMapClick = useCallback(async (event: any) => {
    if (!event.detail?.latLng) return;

    const lat = event.detail.latLng.lat;
    const lng = event.detail.latLng.lng;

    // Check if within Cordova bounds
    if (
      lat < CORDOVA_BOUNDS.latMin ||
      lat > CORDOVA_BOUNDS.latMax ||
      lng < CORDOVA_BOUNDS.lngMin ||
      lng > CORDOVA_BOUNDS.lngMax
    ) {
      alert('Please select a location within Cordova, Cebu area.');
      return;
    }

    setMarkerPosition({ lat, lng });
    const address = await reverseGeocode(lat, lng);
    onLocationChange(lat, lng, address);
  }, [reverseGeocode, onLocationChange]);

  const handleMarkerDragEnd = useCallback(async (event: any) => {
    if (!event.latLng) return;

    const lat = typeof event.latLng.lat === 'function' ? event.latLng.lat() : event.latLng.lat;
    const lng = typeof event.latLng.lng === 'function' ? event.latLng.lng() : event.latLng.lng;

    // Check if within Cordova bounds
    if (
      lat < CORDOVA_BOUNDS.latMin ||
      lat > CORDOVA_BOUNDS.latMax ||
      lng < CORDOVA_BOUNDS.lngMin ||
      lng > CORDOVA_BOUNDS.lngMax
    ) {
      alert('Please select a location within Cordova, Cebu area.');
      setMarkerPosition(markerPosition); // Reset to previous position
      return;
    }

    setMarkerPosition({ lat, lng });
    const address = await reverseGeocode(lat, lng);
    onLocationChange(lat, lng, address);
  }, [markerPosition, reverseGeocode, onLocationChange]);

  if (!mounted) {
    return (
      <div className="w-full h-[400px] bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">Loading map...</p>
      </div>
    );
  }

  if (GOOGLE_MAPS_API_KEY === 'YOUR_API_KEY_HERE') {
    return (
      <div className="w-full h-[400px] bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-300 dark:border-yellow-700 rounded-lg flex items-center justify-center p-6">
        <div className="text-center">
          <p className="text-yellow-800 dark:text-yellow-300 font-semibold mb-2">
            ⚠️ Google Maps API Key Required
          </p>
          <p className="text-sm text-yellow-700 dark:text-yellow-400">
            Add your API key to <code className="bg-yellow-100 dark:bg-yellow-800 px-2 py-1 rounded">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> in .env.local
          </p>
          <a 
            href="https://developers.google.com/maps/documentation/javascript/get-api-key" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm text-yellow-600 dark:text-yellow-300 hover:underline mt-2 inline-block"
          >
            Get API Key →
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-[400px] rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-700">
      <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
        <Map
          defaultCenter={markerPosition}
          defaultZoom={14}
          mapId="cordova-event-map"
          onClick={handleMapClick}
          gestureHandling="greedy"
          disableDefaultUI={false}
        >
          <AdvancedMarker
            position={markerPosition}
            draggable={true}
            onDragEnd={handleMarkerDragEnd}
          >
            <Pin
              background="#D1001F"
              borderColor="#8B0000"
              glyphColor="#FFFFFF"
            />
          </AdvancedMarker>
        </Map>
      </APIProvider>
    </div>
  );
}
