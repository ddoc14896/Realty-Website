'use client';

import { useState, useEffect } from 'react';
import Link from "next/link";
import { MapPin, Grid, List } from "lucide-react";
import Header from "@/components/Header";
import PropertySearch from "@/components/search/PropertySearch";
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

interface SearchFilters {
  query: string;
  location: string;
  minPrice: string;
  maxPrice: string;
  propertyType: string;
  bedrooms: string;
  bathrooms: string;
  status: string;
}

interface SearchResponse {
  properties: Property[];
  pagination: {
    page: number;
    limit: number;
    totalResults: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
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

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    totalResults: 0,
    totalPages: 1,
    hasNext: false,
    hasPrev: false
  });
  const [currentFilters, setCurrentFilters] = useState<SearchFilters>({
    query: '',
    location: '',
    minPrice: '',
    maxPrice: '',
    propertyType: '',
    bedrooms: '',
    bathrooms: '',
    status: 'FOR_SALE'
  });
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const fetchProperties = async (filters: SearchFilters, page: number = 1) => {
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '12',
        ...Object.fromEntries(
          Object.entries(filters).filter(([_, value]) => value !== '')
        )
      });

      const response = await fetch(`/api/properties/search?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch properties');
      }
      
      const data: SearchResponse = await response.json();
      setProperties(data.properties);
      setPagination(data.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (filters: SearchFilters) => {
    setCurrentFilters(filters);
    fetchProperties(filters, 1);
  };

  const handlePageChange = (page: number) => {
    fetchProperties(currentFilters, page);
  };

  useEffect(() => {
    fetchProperties(currentFilters);
  }, []);

  const renderPropertyCard = (property: Property) => {
    const primaryImage = property.images.find(img => img.isPrimary) || property.images[0];
    
    return (
      <div key={property.id} className={`property-card group grid-item ${
        viewMode === 'list' ? 'flex flex-row w-full list-view' : ''
      }`}>
        <div className={`relative ${viewMode === 'list' ? 'w-80 flex-shrink-0' : ''}`}>
          <div className={`${viewMode === 'list' ? 'h-48' : 'h-56'} relative overflow-hidden cursor-pointer`} 
               style={{ backgroundColor: 'var(--brown-100)' }}>
            <img 
              src={getPropertyImage(property)}
              alt={`${property.title} - ${property.address}`}
              className="property-image w-full h-full object-cover"
              loading="lazy"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = getFallbackImage(property.propertyType);
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 ease-apple"></div>
          </div>
          
          <div className="absolute top-4 left-4">
            <span className="property-badge text-xs px-3 py-1">
              ✨ {property.propertyType}
            </span>
          </div>
          
          <div className="absolute top-4 right-4 z-10">
            <FavoriteButton propertyId={property.id} size="sm" showTooltip />
          </div>
          
          <div className="absolute bottom-4 left-4">
            <div className="property-badge text-lg font-bold px-4 py-2 shadow-xl">
              {formatPrice(property.price)}
            </div>
          </div>
          
          <div className="absolute bottom-4 right-4">
            <span className="px-3 py-1 rounded-xl text-xs font-semibold text-white shadow-lg"
                  style={{ backgroundColor: 'var(--brown-700)' }}>
              📸 {property.images?.length || 0}
            </span>
          </div>
        </div>
        
        <div className="p-6 flex-1">
          <div className="mb-4">
            <h3 className="font-bold text-xl mb-3 line-clamp-2 text-gradient">{property.title}</h3>
            <div className="flex items-start space-x-2">
              <MapPin className="h-4 w-4 mt-1 flex-shrink-0" style={{ color: 'var(--brown-500)' }} />
              <span className="text-sm line-clamp-2 font-medium" style={{ color: 'var(--brown-600)' }}>
                {property.address}, {property.city}, {property.state} {property.zipCode}
              </span>
            </div>
          </div>
          
          <div className={`grid ${viewMode === 'list' ? 'grid-cols-4 gap-3' : 'grid-cols-3 gap-2'} mb-6`}>
            <div className="text-center p-3 rounded-xl" style={{ backgroundColor: 'var(--brown-50)' }}>
              <div className="text-lg font-bold" style={{ color: 'var(--brown-800)' }}>{property.bedrooms}</div>
              <div className="text-xs font-medium" style={{ color: 'var(--brown-600)' }}>🛏️ Beds</div>
            </div>
            <div className="text-center p-3 rounded-xl" style={{ backgroundColor: 'var(--brown-50)' }}>
              <div className="text-lg font-bold" style={{ color: 'var(--brown-800)' }}>{property.bathrooms}</div>
              <div className="text-xs font-medium" style={{ color: 'var(--brown-600)' }}>🛁 Baths</div>
            </div>
            <div className="text-center p-3 rounded-xl" style={{ backgroundColor: 'var(--brown-50)' }}>
              <div className="text-lg font-bold" style={{ color: 'var(--brown-800)' }}>
                {(property.squareFeet / 1000).toFixed(1)}K
              </div>
              <div className="text-xs font-medium" style={{ color: 'var(--brown-600)' }}>📐 SqFt</div>
            </div>
            {viewMode === 'list' && (
              <div className="text-center p-3 rounded-xl" style={{ backgroundColor: 'var(--cream)' }}>
                <div className="text-sm font-bold" style={{ color: 'var(--brown-800)' }}>Premium</div>
                <div className="text-xs font-medium" style={{ color: 'var(--brown-600)' }}>✨ Type</div>
              </div>
            )}
          </div>
          
          <Link 
            href={`/properties/${property.id}`}
            className={`btn-primary text-center bounce ${
              viewMode === 'list' ? 'inline-block px-8 py-3' : 'w-full block'
            }`}
          >
            🏠 Explore Property
          </Link>
        </div>
      </div>
    );
  };
  return (
    <div className="min-h-screen bg-gradient-warm bg-pattern">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12 fade-in">
          <h1 className="heading-section">Discover Premium Properties</h1>
          <p className="text-lg text-warm max-w-2xl mx-auto leading-relaxed">
            Explore our curated collection of exceptional homes and investment opportunities
          </p>
        </div>
        
        {/* Search Component */}
        <PropertySearch onSearch={handleSearch} isLoading={loading} />

        {/* Enhanced View Toggle and Results Count */}
        <div className="card p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-warm">
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded-full animate-pulse" style={{ backgroundColor: 'var(--soft-gold)' }}></div>
                  <span className="font-medium">Discovering properties...</span>
                </div>
              ) : (
                <div className="text-center md:text-left">
                  <span className="text-lg font-bold" style={{ color: 'var(--brown-800)' }}>
                    {properties.length} Premium Properties
                  </span>
                  <span className="block md:inline text-sm">
                    {' '}of <span className="font-semibold" style={{ color: 'var(--soft-gold)' }}>{pagination.totalResults}</span> available
                  </span>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/properties/map" className="btn-accent flex items-center space-x-2 text-sm">
                <MapPin className="h-4 w-4" />
                <span>🗺️ Map View</span>
              </Link>
              <div className="flex rounded-xl overflow-hidden border-2 shadow-lg" style={{ borderColor: 'var(--brown-300)' }}>
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`view-toggle-btn px-4 py-2 ${
                    viewMode === 'grid' ? 'active text-white' : 'hover:bg-gradient-warm'
                  }`}
                  style={{
                    backgroundColor: viewMode === 'grid' ? 'var(--brown-600)' : 'transparent',
                    color: viewMode === 'grid' ? 'white' : 'var(--brown-700)'
                  }}
                  title="Grid View"
                >
                  <Grid className="h-5 w-5" />
                </button>
                <button 
                  onClick={() => setViewMode('list')}
                  className={`view-toggle-btn px-4 py-2 ${
                    viewMode === 'list' ? 'active text-white' : 'hover:bg-gradient-warm'
                  }`}
                  style={{
                    backgroundColor: viewMode === 'list' ? 'var(--brown-600)' : 'transparent',
                    color: viewMode === 'list' ? 'white' : 'var(--brown-700)'
                  }}
                  title="List View"
                >
                  <List className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Loading State */}
        {loading && (
          <div className={`${viewMode === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3' : 'space-y-6'} gap-8`}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className={`property-card animate-pulse ${
                viewMode === 'list' ? 'flex flex-row w-full' : ''
              }`}>
                <div className={`${viewMode === 'list' ? 'w-80 h-48 flex-shrink-0' : 'h-56'}`} 
                     style={{ backgroundColor: 'var(--brown-200)' }}></div>
                <div className="p-6 space-y-4 flex-1">
                  <div className="h-5 rounded-xl w-3/4" style={{ backgroundColor: 'var(--brown-200)' }}></div>
                  <div className="h-4 rounded-xl w-1/2" style={{ backgroundColor: 'var(--brown-100)' }}></div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="h-12 rounded-xl" style={{ backgroundColor: 'var(--brown-100)' }}></div>
                    <div className="h-12 rounded-xl" style={{ backgroundColor: 'var(--brown-100)' }}></div>
                    <div className="h-12 rounded-xl" style={{ backgroundColor: 'var(--brown-100)' }}></div>
                  </div>
                  <div className="h-12 rounded-xl" style={{ backgroundColor: 'var(--brown-200)' }}></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Enhanced Error State */}
        {error && !loading && (
          <div className="text-center py-16">
            <div className="card max-w-md mx-auto p-8">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center"
                   style={{ backgroundColor: 'var(--brown-100)' }}>
                <span className="text-2xl">⚠️</span>
              </div>
              <p className="text-lg mb-6" style={{ color: 'var(--brown-700)' }}>{error}</p>
              <button 
                onClick={() => fetchProperties(currentFilters)} 
                className="btn-primary"
              >
                🔄 Try Again
              </button>
            </div>
          </div>
        )}

        {/* Properties Grid/List */}
        {!loading && !error && (
          <>
            <div className={`${viewMode === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-6 list-container'}`}>
              {properties.map(renderPropertyCard)}
            </div>

            {/* No Results */}
            {properties.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No properties found matching your criteria.</p>
                <p className="text-gray-400 text-sm mt-2">Try adjusting your search filters.</p>
              </div>
            )}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="mt-12 flex justify-center">
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={!pagination.hasPrev}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    const page = i + 1;
                    return (
                      <button 
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-4 py-2 rounded-lg ${
                          page === pagination.page 
                            ? 'bg-blue-600 text-white' 
                            : 'border border-gray-300 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                  
                  <button 
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={!pagination.hasNext}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>© 2025 Realty Website. Built for Vibe Coding Competition.</p>
        </div>
      </footer>
    </div>
  );
}