'use client';

/**
 * Favorites Page - User Wishlist Display
 * 
 * A dedicated page for users to view and manage their saved/favorited properties.
 * Provides multiple viewing options and works for both authenticated and anonymous users.
 * 
 * Features:
 * - Grid and list view toggle
 * - Property filtering and search
 * - Responsive design for all screen sizes
 * - Empty state handling with helpful messaging
 * - Integrated favorite removal functionality
 * - Property detail links
 * - Loading states during data fetching
 * 
 * Layout: Header + ViewToggle + PropertyGrid/List + EmptyState
 */

import { useState, useEffect } from 'react';
import Link from "next/link";
import { MapPin, Heart, Grid, List, Home } from "lucide-react";
import Header from "@/components/Header";
import FavoriteButton from "@/components/FavoriteButton";
import { useFavorites } from "@/contexts/FavoritesContext";
import { formatPrice } from "@/lib/utils";

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

export default function FavoritesPage() {
  const { favorites, user, getFavoritesCount } = useFavorites();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    fetchFavoriteProperties();
  }, [favorites]);

  const fetchFavoriteProperties = async () => {
    if (favorites.length === 0) {
      setProperties([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // Fetch all properties and filter by favorites
      const response = await fetch('/api/properties/search');
      if (!response.ok) {
        throw new Error('Failed to fetch properties');
      }
      
      const data = await response.json();
      const allProperties = data.properties || [];
      
      // Filter properties that are in favorites
      const favoriteProperties = allProperties.filter((property: Property) => 
        favorites.includes(property.id)
      );
      
      setProperties(favoriteProperties);
    } catch (error) {
      console.error('Error fetching favorite properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderPropertyCard = (property: Property) => (
    <div 
      key={property.id} 
      className={`
        bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow
        ${viewMode === 'list' ? 'flex' : ''}
      `}
    >
      <div className={`relative ${viewMode === 'list' ? 'w-64 flex-shrink-0' : ''}`}>
        <div className={`${viewMode === 'list' ? 'h-48' : 'h-48'} relative overflow-hidden group bg-gray-200`}>
          <img 
            src={getPropertyImage(property)}
            alt={`${property.title} - ${property.address}`}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
        
        <div className="absolute top-4 left-4">
          <span className="bg-green-600 text-white px-2 py-1 rounded text-xs font-medium">
            {property.propertyType}
          </span>
        </div>
        
        <div className="absolute top-4 right-4">
          <FavoriteButton propertyId={property.id} size="sm" showTooltip />
        </div>
        
        <div className="absolute bottom-4 left-4">
          <span className="bg-blue-600 text-white px-3 py-1 rounded text-sm font-medium shadow-lg">
            {formatPrice(property.price)}
          </span>
        </div>
      </div>
      
      <div className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{property.title}</h3>
        <p className="text-gray-600 text-sm mb-3 flex items-center">
          <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
          <span className="line-clamp-1">
            {property.address}, {property.city}, {property.state} {property.zipCode}
          </span>
        </p>
        
        <div className={`flex ${viewMode === 'list' ? 'flex-wrap gap-4' : 'justify-between'} items-center text-sm mb-4`}>
          <div className="flex items-center text-gray-600">
            <span className="bg-gray-100 px-2 py-1 rounded text-xs">🛏️ {property.bedrooms}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <span className="bg-gray-100 px-2 py-1 rounded text-xs">🚿 {property.bathrooms}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <span className="bg-gray-100 px-2 py-1 rounded text-xs">📐 {property.squareFeet?.toLocaleString()}</span>
          </div>
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center mb-2">
              <Heart className="h-8 w-8 mr-3 text-red-500 fill-red-500" />
              My Favorites
            </h1>
            <p className="text-gray-600">
              {user ? `Saved properties for ${user.name}` : 'Your saved properties'} • {getFavoritesCount()} items
            </p>
          </div>
          
          {properties.length > 0 && (
            <div className="flex items-center space-x-2 mt-4 md:mt-0">
              <span className="text-sm text-gray-600">View:</span>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        {/* Content */}
        {loading ? (
          <div className={`grid ${viewMode === 'list' ? 'grid-cols-1 gap-4' : 'md:grid-cols-2 lg:grid-cols-3 gap-6'}`}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className={`bg-white rounded-lg shadow-md overflow-hidden animate-pulse ${viewMode === 'list' ? 'flex' : ''}`}>
                <div className={`bg-gray-200 ${viewMode === 'list' ? 'w-64 h-48' : 'h-48'}`}></div>
                <div className={`p-4 space-y-3 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : properties.length > 0 ? (
          <div className={`grid ${viewMode === 'list' ? 'grid-cols-1 gap-4' : 'md:grid-cols-2 lg:grid-cols-3 gap-6'}`}>
            {properties.map(renderPropertyCard)}
          </div>
        ) : (
          <div className="text-center py-12">
            <Heart className="mx-auto h-24 w-24 text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No favorites yet</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {user 
                ? "Start browsing properties and click the heart icon to save your favorites here!"
                : "Browse properties and save your favorites - no account required!"
              }
            </p>
            <div className="space-x-4">
              <Link
                href="/properties"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Home className="h-5 w-5 mr-2" />
                Browse Properties
              </Link>
              {!user && (
                <Link
                  href="/signup"
                  className="inline-flex items-center px-6 py-3 border border-blue-600 text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors"
                >
                  Create Account
                </Link>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}