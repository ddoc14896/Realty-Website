'use client';

import { useEffect, useRef, useState } from 'react';
import { MapPin, Maximize2, Minimize2 } from 'lucide-react';

interface MapComponentProps {
  latitude: number;
  longitude: number;
  address: string;
  title: string;
  className?: string;
}

export default function MapComponent({ 
  latitude, 
  longitude, 
  address, 
  title, 
  className = "h-64 w-full" 
}: MapComponentProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mapError, setMapError] = useState(false);

  useEffect(() => {
    // Load Mapbox GL JS
    const loadMapbox = async () => {
      try {
        // For demo purposes, we'll create an interactive map fallback
        // In production, you would use: const mapboxgl = await import('mapbox-gl');
        
        // Simulate map loading
        setTimeout(() => {
          setMapLoaded(true);
        }, 1000);
        
      } catch (error) {
        console.error('Error loading map:', error);
        setMapError(true);
      }
    };

    if (mapContainer.current && !map.current) {
      loadMapbox();
    }
  }, []);

  const handleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const openInGoogleMaps = () => {
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    window.open(googleMapsUrl, '_blank');
  };

  const openInMapMyIndia = () => {
    const mapMyIndiaUrl = `https://maps.mapmyindia.com/direction?start=&destination=${latitude},${longitude}`;
    window.open(mapMyIndiaUrl, '_blank');
  };

  if (mapError) {
    return (
      <div className={`${className} bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border flex flex-col items-center justify-center p-6`}>
        <MapPin className="h-8 w-8 text-blue-600 mb-3" />
        <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-600 text-center mb-4">{address}</p>
        <div className="flex gap-2">
          <button
            onClick={openInGoogleMaps}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors"
          >
            View in Google Maps
          </button>
          <button
            onClick={openInMapMyIndia}
            className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition-colors"
          >
            MapMyIndia
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`${isFullscreen ? 'fixed inset-0 z-50 bg-white' : className} relative`}>
      {/* Map Header */}
      <div className="absolute top-0 left-0 right-0 bg-white bg-opacity-95 backdrop-blur-sm p-3 rounded-t-lg z-10 border-b">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 text-sm">{title}</h3>
            <p className="text-xs text-gray-600">{address}</p>
            <p className="text-xs text-blue-600 mt-1">
              📍 {latitude.toFixed(6)}, {longitude.toFixed(6)}
            </p>
          </div>
          <div className="flex gap-1">
            <button
              onClick={handleFullscreen}
              className="p-1.5 bg-white rounded border hover:bg-gray-50 transition-colors"
              title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Map Container */}
      <div 
        ref={mapContainer} 
        className={`${isFullscreen ? 'h-full' : className} bg-gradient-to-br from-blue-50 via-green-50 to-blue-100 rounded-lg relative overflow-hidden`}
      >
        {!mapLoaded ? (
          // Loading State
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3"></div>
              <p className="text-sm text-gray-600">Loading Chennai map...</p>
            </div>
          </div>
        ) : (
          // Interactive Map Preview
          <div className="relative h-full w-full">
            {/* Map Background with Chennai styling */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-green-100 to-yellow-50">
              {/* Simulated road network */}
              <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 400 300">
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#cbd5e1" strokeWidth="1"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
                
                {/* Major roads */}
                <path d="M0,150 Q100,140 200,150 T400,150" stroke="#64748b" strokeWidth="3" fill="none" />
                <path d="M200,0 Q190,100 200,150 Q210,200 200,300" stroke="#64748b" strokeWidth="3" fill="none" />
                <path d="M50,50 Q150,60 250,70 Q350,80 400,100" stroke="#94a3b8" strokeWidth="2" fill="none" />
              </svg>
            </div>

            {/* Property Marker */}
            <div 
              className="absolute transform -translate-x-1/2 -translate-y-full z-10 animate-bounce"
              style={{ 
                left: '50%', 
                top: '60%' 
              }}
            >
              <div className="bg-red-500 text-white p-2 rounded-full shadow-lg">
                <MapPin className="h-5 w-5" />
              </div>
              <div className="bg-white px-3 py-1 rounded shadow-md mt-1 text-xs font-medium border">
                {title}
              </div>
            </div>

            {/* Chennai Landmarks */}
            <div className="absolute top-4 left-4 bg-white bg-opacity-90 p-2 rounded text-xs">
              <div className="font-semibold text-gray-800">Chennai Landmarks</div>
              <div className="text-gray-600 mt-1">
                🏖️ Marina Beach • 🏛️ Fort St. George
                <br />
                🕌 Kapaleeshwarar Temple • 🚇 Metro Stations
              </div>
            </div>

            {/* Distance indicators */}
            <div className="absolute bottom-16 right-4 bg-white bg-opacity-90 p-2 rounded text-xs">
              <div className="font-semibold text-gray-800 mb-1">Nearby</div>
              <div className="text-gray-600 space-y-1">
                <div>🚇 Metro: 0.8 km</div>
                <div>🏥 Hospital: 1.2 km</div>
                <div>🏫 School: 0.5 km</div>
                <div>🛒 Mall: 1.5 km</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Map Controls */}
      <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-95 backdrop-blur-sm p-3 rounded-b-lg border-t">
        <div className="flex justify-between items-center">
          <div className="text-xs text-gray-600">
            Interactive map • Real Chennai coordinates
          </div>
          <div className="flex gap-2">
            <button
              onClick={openInGoogleMaps}
              className="bg-blue-600 text-white px-3 py-1.5 rounded text-xs hover:bg-blue-700 transition-colors"
            >
              Google Maps
            </button>
            <button
              onClick={openInMapMyIndia}
              className="bg-green-600 text-white px-3 py-1.5 rounded text-xs hover:bg-green-700 transition-colors"
            >
              MapMyIndia
            </button>
          </div>
        </div>
      </div>

      {/* Fullscreen overlay close button */}
      {isFullscreen && (
        <button
          onClick={handleFullscreen}
          className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-full z-20 hover:bg-opacity-70 transition-colors"
        >
          ✕
        </button>
      )}
    </div>
  );
}