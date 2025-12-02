'use client';

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface MapComponentProps {
  properties?: Array<{
    id: string;
    title: string;
    latitude: number;
    longitude: number;
    price: number;
    address: string;
  }>;
  center?: [number, number];
  zoom?: number;
  height?: string;
}

export default function MapComponent({ 
  properties = [], 
  center = [-118.2437, 34.0522], // Default to LA
  zoom = 10,
  height = "400px"
}: MapComponentProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    // Check if we have a valid Mapbox token
    const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
    
    if (!mapboxToken || mapboxToken === 'pk.your_mapbox_access_token_here') {
      // Show fallback map when no token is available
      return;
    }

    if (map.current) return; // Initialize map only once

    mapboxgl.accessToken = mapboxToken;

    map.current = new mapboxgl.Map({
      container: mapContainer.current!,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: center,
      zoom: zoom,
    });

    map.current.on('load', () => {
      setMapLoaded(true);
      
      // Add properties as markers
      properties.forEach((property) => {
        if (map.current) {
          // Create custom marker element
          const markerElement = document.createElement('div');
          markerElement.className = 'custom-marker';
          markerElement.innerHTML = `
            <div style="
              background: #2563eb;
              color: white;
              padding: 4px 8px;
              border-radius: 6px;
              font-size: 12px;
              font-weight: bold;
              box-shadow: 0 2px 4px rgba(0,0,0,0.2);
              cursor: pointer;
              transform: translate(-50%, -100%);
            ">
              $${(property.price / 1000).toFixed(0)}k
            </div>
          `;

          // Create popup
          const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
            <div style="padding: 10px;">
              <h3 style="margin: 0 0 8px 0; font-size: 14px; font-weight: bold;">${property.title}</h3>
              <p style="margin: 0 0 4px 0; font-size: 12px; color: #666;">${property.address}</p>
              <p style="margin: 0; font-size: 14px; font-weight: bold; color: #2563eb;">
                $${property.price.toLocaleString()}
              </p>
              <a href="/properties/${property.id}" style="
                display: inline-block;
                margin-top: 8px;
                padding: 4px 12px;
                background: #2563eb;
                color: white;
                text-decoration: none;
                border-radius: 4px;
                font-size: 12px;
              ">View Details</a>
            </div>
          `);

          // Add marker to map
          new mapboxgl.Marker(markerElement)
            .setLngLat([property.longitude, property.latitude])
            .setPopup(popup)
            .addTo(map.current);
        }
      });
    });

    // Cleanup
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [properties, center, zoom]);

  // Fallback map when Mapbox token is not available
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
  
  if (!mapboxToken || mapboxToken === 'pk.your_mapbox_access_token_here') {
    return (
      <div 
        style={{ height }}
        className="bg-gradient-to-br from-blue-100 to-green-100 rounded-lg flex items-center justify-center border-2 border-dashed border-blue-300"
      >
        <div className="text-center p-8">
          <div className="text-6xl mb-4">🗺️</div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Interactive Map</h3>
          <p className="text-gray-600 text-sm mb-4">
            Map will display property locations with markers
          </p>
          {properties.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs text-gray-500">Properties on map:</p>
              {properties.slice(0, 3).map((property) => (
                <div key={property.id} className="text-xs bg-white bg-opacity-70 rounded px-2 py-1">
                  📍 {property.title} - ${(property.price / 1000).toFixed(0)}k
                </div>
              ))}
              {properties.length > 3 && (
                <p className="text-xs text-gray-500">+{properties.length - 3} more properties</p>
              )}
            </div>
          )}
          <p className="text-xs text-gray-400 mt-4">
            Add Mapbox token to enable interactive map
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ height }} className="rounded-lg overflow-hidden">
      <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />
      {!mapLoaded && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-600">Loading map...</p>
          </div>
        </div>
      )}
    </div>
  );
}