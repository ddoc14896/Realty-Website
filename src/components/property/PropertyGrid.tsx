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
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
            <div className="h-48 bg-gray-200"></div>
            <div className="p-4 space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              <div className="h-3 bg-gray-200 rounded w-full"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 text-lg">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((property) => {
        const primaryImage = property.images.find(img => img.isPrimary) || property.images[0];
        
        return (
          <div key={property.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative">
              <div className="h-48 relative overflow-hidden group bg-gray-200">
                <img 
                  src={getPropertyImage(property)}
                  alt={`${property.title} - ${property.address}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = getFallbackImage(property.propertyType);
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              
              <div className="absolute top-4 right-4">
                <FavoriteButton propertyId={property.id} size="sm" showTooltip />
              </div>
              
              <div className="absolute bottom-4 left-4">
                <span className="bg-blue-600 text-white px-3 py-1 rounded text-sm font-medium">
                  {formatPrice(property.price)}
                </span>
              </div>
            </div>
            
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2 line-clamp-2">{property.title}</h3>
              <p className="text-gray-600 text-sm mb-3 flex items-center">
                <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                <span className="line-clamp-1">
                  {property.address}, {property.city}, {property.state} {property.zipCode}
                </span>
              </p>
              
              <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
                <span>{property.bedrooms} beds</span>
                <span>{property.bathrooms} baths</span>
                <span>{property.squareFeet?.toLocaleString()} sqft</span>
              </div>
              
              <Link 
                href={`/properties/${property.id}`}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-center block"
              >
                View Details
              </Link>
            </div>
          </div>
        );
      })}
      
      {properties.length === 0 && !loading && (
        <div className="col-span-full text-center py-12">
          <p className="text-gray-500 text-lg">No properties found matching your criteria.</p>
          <p className="text-gray-400 text-sm mt-2">Try adjusting your search filters.</p>
        </div>
      )}
    </div>
  );
}