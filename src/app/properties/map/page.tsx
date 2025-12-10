'use client';

import { useState, useEffect } from 'react';
import Link from "next/link";
import { MapPin, List, Filter } from "lucide-react";
import Header from "@/components/Header";
import { formatPrice } from "@/lib/utils";

interface Property {
  id: string;
  title: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  latitude: number;
  longitude: number;
  price: number;
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  images: Array<{
    url: string;
    alt: string;
    isPrimary: boolean;
  }>;
}

export default function MapViewPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [mapCenter, setMapCenter] = useState({ lat: 13.0827, lng: 80.2707 }); // Chennai center

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch('/api/properties/search');
        const data = await response.json();
        setProperties(data.properties || []);
      } catch (error) {
        console.error('Error fetching properties:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const handlePropertyClick = (property: Property) => {
    setSelectedProperty(property);
    setMapCenter({ lat: property.latitude, lng: property.longitude });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="h-screen flex">
        {/* Properties Sidebar */}
        <div className="w-96 bg-white shadow-lg overflow-hidden flex flex-col">
          {/* Sidebar Header */}
          <div className="p-4 border-b">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Chennai Properties</h2>
              <div className="flex gap-2">
                <Link 
                  href="/properties"
                  className="p-2 bg-gray-100 rounded hover:bg-gray-200"
                  title="List View"
                >
                  <List className="h-4 w-4" />
                </Link>
                <button className="p-2 bg-blue-100 rounded" title="Map View">
                  <MapPin className="h-4 w-4 text-blue-600" />
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {loading ? 'Loading...' : `${properties.length} properties found`}
            </p>
          </div>

          {/* Properties List */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-4 space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-24 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="divide-y">
                {properties.map((property) => {
                  const primaryImage = property.images.find(img => img.isPrimary) || property.images[0];
                  const isSelected = selectedProperty?.id === property.id;
                  
                  return (
                    <div
                      key={property.id}
                      className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                        isSelected ? 'bg-blue-50 border-r-4 border-blue-500' : ''
                      }`}
                      onClick={() => handlePropertyClick(property)}
                    >
                      <div className="flex space-x-3">
                        <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                          {primaryImage ? (
                            <img 
                              src={`https://picsum.photos/80/80?random=${property.id}`}
                              alt={primaryImage?.alt || `Property ${property.id}`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = `https://via.placeholder.com/80x80/3B82F6/FFFFFF?text=${property.id}`;
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-2xl">
                              🏠
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 truncate text-sm">
                            {property.title}
                          </h3>
                          <p className="text-xs text-gray-600 mt-1 truncate">
                            {property.address}, {property.city}
                          </p>
                          <div className="flex justify-between items-center mt-2">
                            <span className="text-sm font-semibold text-blue-600">
                              {formatPrice(property.price)}
                            </span>
                            <span className="text-xs text-gray-500">
                              {property.bedrooms}BD {property.bathrooms}BA
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Map Area */}
        <div className="flex-1 relative">
          {/* Chennai Interactive Map */}
          <div className="w-full h-full bg-gradient-to-br from-blue-100 via-green-50 to-yellow-50 relative">
            {/* Map Background */}
            <div className="absolute inset-0">
              <svg className="w-full h-full opacity-30" viewBox="0 0 800 600">
                <defs>
                  <pattern id="chennai-grid" width="60" height="60" patternUnits="userSpaceOnUse">
                    <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#94a3b8" strokeWidth="1"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#chennai-grid)" />
                
                {/* Chennai Roads */}
                <path d="M0,300 Q200,280 400,300 Q600,320 800,300" stroke="#64748b" strokeWidth="4" fill="none" />
                <path d="M400,0 Q380,150 400,300 Q420,450 400,600" stroke="#64748b" strokeWidth="4" fill="none" />
                <path d="M100,100 Q300,120 500,140 Q700,160 800,180" stroke="#94a3b8" strokeWidth="3" fill="none" />
                <path d="M0,500 Q200,480 400,500 Q600,520 800,500" stroke="#94a3b8" strokeWidth="3" fill="none" />
                
                {/* Marina Beach Line */}
                <path d="M700,0 L700,600" stroke="#0ea5e9" strokeWidth="6" fill="none" opacity="0.7" />
              </svg>
            </div>

            {/* Property Markers */}
            {properties.map((property, index) => {
              const isSelected = selectedProperty?.id === property.id;
              // Position properties across Chennai map
              const x = ((property.longitude - 80.1) / 0.3) * 100; // Normalize longitude
              const y = ((13.2 - property.latitude) / 0.3) * 100; // Normalize latitude (inverted)
              
              return (
                <div
                  key={property.id}
                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200 ${
                    isSelected ? 'z-20 scale-125' : 'z-10 hover:scale-110'
                  }`}
                  style={{ 
                    left: `${Math.max(5, Math.min(95, x))}%`, 
                    top: `${Math.max(5, Math.min(95, y))}%` 
                  }}
                  onClick={() => handlePropertyClick(property)}
                >
                  <div className={`relative ${isSelected ? 'animate-bounce' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-lg ${
                      isSelected ? 'bg-red-600' : 'bg-blue-600 hover:bg-blue-700'
                    }`}>
                      {index + 1}
                    </div>
                    {isSelected && (
                      <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-white p-3 rounded-lg shadow-xl border min-w-64 z-30">
                        <h4 className="font-semibold text-sm text-gray-900 mb-1">
                          {property.title}
                        </h4>
                        <p className="text-xs text-gray-600 mb-2">
                          {property.address}, {property.city}
                        </p>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-bold text-blue-600">
                            {formatPrice(property.price)}
                          </span>
                          <Link 
                            href={`/properties/${property.id}`}
                            className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                          >
                            View Details
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Chennai Landmarks */}
            <div className="absolute top-4 left-4 bg-white bg-opacity-95 p-4 rounded-lg shadow-lg max-w-xs">
              <h3 className="font-semibold text-gray-900 mb-2">Chennai Property Map</h3>
              <div className="text-xs text-gray-600 space-y-1">
                <div>🏖️ Marina Beach - World's second longest beach</div>
                <div>🏛️ Fort St. George - Historic colonial fort</div>
                <div>🕌 Kapaleeshwarar Temple - Ancient Shiva temple</div>
                <div>💼 IT Corridor - OMR & Velachery tech hubs</div>
                <div>🚇 Metro Network - Extensive rail connectivity</div>
              </div>
            </div>

            {/* Map Legend */}
            <div className="absolute bottom-4 right-4 bg-white bg-opacity-95 p-4 rounded-lg shadow-lg">
              <h4 className="font-medium text-gray-900 mb-2 text-sm">Legend</h4>
              <div className="space-y-2 text-xs">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
                  <span>Available Properties</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-red-600 rounded-full"></div>
                  <span>Selected Property</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-1 bg-blue-500"></div>
                  <span>Marina Beach</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-0.5 bg-gray-600"></div>
                  <span>Major Roads</span>
                </div>
              </div>
            </div>

            {/* External Map Links */}
            <div className="absolute top-4 right-4 flex gap-2">
              <button
                onClick={() => {
                  const lat = selectedProperty?.latitude || 13.0827;
                  const lng = selectedProperty?.longitude || 80.2707;
                  window.open(`https://www.google.com/maps/@${lat},${lng},15z`, '_blank');
                }}
                className="px-3 py-2 rounded shadow-lg hover:shadow-xl text-xs font-medium text-white border border-white border-opacity-30 transition-all duration-200"
                style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(4px)' }}
              >
                Google Maps
              </button>
              <button
                onClick={() => {
                  const lat = selectedProperty?.latitude || 13.0827;
                  const lng = selectedProperty?.longitude || 80.2707;
                  window.open(`https://maps.mapmyindia.com/?lat=${lat}&lng=${lng}&z=15`, '_blank');
                }}
                className="bg-green-600 text-white px-3 py-2 rounded shadow hover:bg-green-700 text-xs font-medium"
              >
                MapMyIndia
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}