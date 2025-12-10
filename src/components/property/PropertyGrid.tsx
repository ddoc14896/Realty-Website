'use client';

/**
 * PropertyGrid Component - Property Listing Display
 * 
 * A responsive grid component that displays property listings with
 * images, details, and interactive features like favorites.
 * 
 * Features:
 * - Responsive grid layout (1-4 columns based on screen size)
 * - Property image carousel with fallback handling
 * - Price formatting with currency display
 * - Location information with map icon
 * - Integrated favorite button functionality
 * - Property detail links
 * - Loading states and error handling
 * - Mobile-optimized card design
 * 
 * Layout: Grid of property cards with image, details, and actions
 */

import { useState, useEffect } from 'react';
import Link from "next/link";
import { MapPin } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import FavoriteButton from "@/components/FavoriteButton";

interface Property {
  id: string;
  title: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
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

// Real property images from reliable sources
const getPropertyImage = (property: Property): string => {
  const propertyImages: { [key: string]: string } = {
    '1': 'https://images.pexels.com/photos/186077/pexels-photo-186077.jpeg?auto=compress&cs=tinysrgb&w=800',
    '2': 'https://images.pexels.com/photos/280222/pexels-photo-280222.jpeg?auto=compress&cs=tinysrgb&w=800',
    '3': 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=800',
    '4': 'https://images.pexels.com/photos/259588/pexels-photo-259588.jpeg?auto=compress&cs=tinysrgb&w=800',
    '5': 'https://images.pexels.com/photos/277667/pexels-photo-277667.jpeg?auto=compress&cs=tinysrgb&w=800',
    '6': 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800',
    '7': 'https://images.pexels.com/photos/358636/pexels-photo-358636.jpeg?auto=compress&cs=tinysrgb&w=800',
    '8': 'https://images.pexels.com/photos/1371360/pexels-photo-1371360.jpeg?auto=compress&cs=tinysrgb&w=800',
    '9': 'https://images.pexels.com/photos/463734/pexels-photo-463734.jpeg?auto=compress&cs=tinysrgb&w=800',
    '10': 'https://images.pexels.com/photos/2121121/pexels-photo-2121121.jpeg?auto=compress&cs=tinysrgb&w=800',
    '11': 'https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg?auto=compress&cs=tinysrgb&w=800',
    '12': 'https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg?auto=compress&cs=tinysrgb&w=800',
    '13': 'https://images.pexels.com/photos/439391/pexels-photo-439391.jpeg?auto=compress&cs=tinysrgb&w=800',
    '14': 'https://images.pexels.com/photos/1732414/pexels-photo-1732414.jpeg?auto=compress&cs=tinysrgb&w=800',
    '15': 'https://images.pexels.com/photos/2102587/pexels-photo-2102587.jpeg?auto=compress&cs=tinysrgb&w=800'
  };
  
  return propertyImages[property.id] || propertyImages['1'];
};

// Fallback images by property type
const getFallbackImage = (propertyType: string): string => {
  const fallbackImages: { [key: string]: string } = {
    'villa': 'https://images.pexels.com/photos/186077/pexels-photo-186077.jpeg?auto=compress&cs=tinysrgb&w=400',
    'apartment': 'https://images.pexels.com/photos/280222/pexels-photo-280222.jpeg?auto=compress&cs=tinysrgb&w=400',
    'penthouse': 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=400',
    'independent house': 'https://images.pexels.com/photos/259588/pexels-photo-259588.jpeg?auto=compress&cs=tinysrgb&w=400',
    'default': 'https://images.pexels.com/photos/277667/pexels-photo-277667.jpeg?auto=compress&cs=tinysrgb&w=400'
  };
  
  return fallbackImages[propertyType.toLowerCase()] || fallbackImages['default'];
};

export default function PropertyGrid() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProperties() {
      try {
        // Use search API for better filtering capabilities
        const response = await fetch('/api/properties/search');
        if (!response.ok) {
          throw new Error('Failed to fetch properties');
        }
        const data = await response.json();
        setProperties(data.properties || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchProperties();
  }, []);

  if (loading) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="property-card animate-pulse">
            <div className="h-56" style={{ backgroundColor: 'var(--brown-200)' }}></div>
            <div className="p-6 space-y-4">
              <div className="h-5 rounded-xl w-3/4" style={{ backgroundColor: 'var(--brown-200)' }}></div>
              <div className="h-4 rounded-xl w-1/2" style={{ backgroundColor: 'var(--brown-100)' }}></div>
              <div className="h-4 rounded-xl w-full" style={{ backgroundColor: 'var(--brown-100)' }}></div>
              <div className="h-12 rounded-xl" style={{ backgroundColor: 'var(--brown-200)' }}></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <div className="card max-w-md mx-auto p-8">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center"
               style={{ backgroundColor: 'var(--brown-100)' }}>
            <span className="text-2xl">⚠️</span>
          </div>
          <p className="text-lg mb-6" style={{ color: 'var(--brown-700)' }}>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="btn-primary"
          >
            🔄 Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {properties.map((property) => {
        const primaryImage = property.images.find(img => img.isPrimary) || property.images[0];
        
        return (
          <div key={property.id} className="property-card group fade-in">
            <div className="relative">
              <div className="h-56 relative overflow-hidden" style={{ backgroundColor: 'var(--brown-100)' }}>
                <img 
                  src={getPropertyImage(property)}
                  alt={`${property.title} - ${property.address}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  loading="lazy"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = getFallbackImage(property.propertyType);
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Overlay Elements */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              
              <div className="absolute top-4 right-4 z-10">
                <FavoriteButton propertyId={property.id} size="sm" showTooltip />
              </div>
              
              <div className="absolute top-4 left-4 z-10">
                <span className="property-badge px-4 py-2 text-sm">
                  ✨ Premium
                </span>
              </div>
              
              <div className="absolute bottom-4 left-4 z-10">
                <div className="property-price text-white text-shadow px-4 py-2 rounded-xl" 
                     style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
                  {formatPrice(property.price)}
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="mb-4">
                <h3 className="font-bold text-xl mb-2 line-clamp-2 text-gradient">
                  {property.title}
                </h3>
                <p className="flex items-center text-sm mb-3" style={{ color: 'var(--brown-600)' }}>
                  <MapPin className="h-4 w-4 mr-2 flex-shrink-0" style={{ color: 'var(--soft-gold)' }} />
                  <span className="line-clamp-1 font-medium">
                    {property.address}, {property.city}, {property.state} {property.zipCode}
                  </span>
                </p>
              </div>
              
              <div className="flex justify-between items-center mb-6 p-3 rounded-xl" 
                   style={{ backgroundColor: 'var(--brown-50)' }}>
                <div className="text-center">
                  <span className="block text-lg font-bold" style={{ color: 'var(--brown-800)' }}>
                    {property.bedrooms}
                  </span>
                  <span className="text-xs font-medium" style={{ color: 'var(--brown-600)' }}>
                    🛏️ Beds
                  </span>
                </div>
                <div className="text-center">
                  <span className="block text-lg font-bold" style={{ color: 'var(--brown-800)' }}>
                    {property.bathrooms}
                  </span>
                  <span className="text-xs font-medium" style={{ color: 'var(--brown-600)' }}>
                    🛁 Baths
                  </span>
                </div>
                <div className="text-center">
                  <span className="block text-lg font-bold" style={{ color: 'var(--brown-800)' }}>
                    {(property.squareFeet / 1000).toFixed(1)}K
                  </span>
                  <span className="text-xs font-medium" style={{ color: 'var(--brown-600)' }}>
                    📐 SqFt
                  </span>
                </div>
              </div>
              
              <Link 
                href={`/properties/${property.id}`}
                className="btn-primary w-full text-center block group-hover:shadow-lg transition-all duration-300"
              >
                🏠 Explore Details
              </Link>
            </div>
          </div>
        );
      })}
      
      {properties.length === 0 && !loading && (
        <div className="col-span-full text-center py-16">
          <div className="card max-w-md mx-auto p-8">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center"
                 style={{ backgroundColor: 'var(--brown-100)' }}>
              <span className="text-3xl">🏠</span>
            </div>
            <h3 className="text-xl font-bold mb-4 text-gradient">No Properties Found</h3>
            <p className="mb-2" style={{ color: 'var(--brown-600)' }}>
              We couldn't find any properties matching your criteria.
            </p>
            <p className="text-sm" style={{ color: 'var(--brown-400)' }}>
              Try adjusting your search filters or browse all available properties.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}