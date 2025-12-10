'use client';

import { useState, useEffect } from 'react';
import Link from "next/link";
import { MapPin, Grid, List, Heart } from "lucide-react";
import PropertySearch from "@/components/search/PropertySearch";
import FavoriteButton from "@/components/FavoriteButton";
import { formatPrice } from "@/lib/utils";
import Header from "@/components/Header";

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
      <div key={property.id} className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow ${
        viewMode === 'list' ? 'flex' : ''
      }`}>
        <div className={`relative ${viewMode === 'list' ? 'w-64 flex-shrink-0' : ''}`}>
          <div className={`${viewMode === 'list' ? 'h-40' : 'h-48'} bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center`}>
            {primaryImage ? (
              <div className="text-center">
                <div className="text-4xl mb-2">🏠</div>
                <p className="text-sm text-blue-800">{primaryImage.alt}</p>
              </div>
            ) : (
              <div className="text-center">
                <div className="text-4xl mb-2">🏠</div>
                <p className="text-sm text-blue-800">Property Image</p>
              </div>
            )}
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
        
        <div className="p-4 flex-1">
          <h3 className="font-semibold text-lg mb-2 line-clamp-2">{property.title}</h3>
          <p className="text-gray-600 text-sm mb-3 flex items-center">
            <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
            <span className="line-clamp-1">
              {property.address}, {property.city}, {property.state} {property.zipCode}
            </span>
          </p>
          
          <div className={`flex ${viewMode === 'list' ? 'flex-wrap' : 'justify-between'} items-center text-sm text-gray-600 mb-4 ${
            viewMode === 'list' ? 'gap-4' : ''
          }`}>
            <span>{property.bedrooms} beds</span>
            <span>{property.bathrooms} baths</span>
            <span>{property.squareFeet?.toLocaleString()} sqft</span>
            {viewMode === 'list' && (
              <span className="text-blue-600 font-medium">{property.propertyType}</span>
            )}
          </div>
          
          <Link 
            href={`/properties/${property.id}`}
            className={`bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-center block ${
              viewMode === 'list' ? 'inline-block w-auto' : 'w-full'
            }`}
          >
            View Details
          </Link>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Find Properties</h1>
        
        {/* Search Component */}
        <PropertySearch onSearch={handleSearch} isLoading={loading} />

        {/* View Toggle and Results Count */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-gray-600">
            {loading ? (
              <span>Searching properties...</span>
            ) : (
              <span>
                Showing <span className="font-semibold">{properties.length}</span> of{' '}
                <span className="font-semibold">{pagination.totalResults}</span> properties
              </span>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <MapPin className="h-4 w-4" />
              <span>Map View</span>
            </button>
            <div className="flex border border-gray-300 rounded-lg">
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-l-lg ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-r-lg ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className={`${viewMode === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3' : 'space-y-4'} gap-6`}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className={`bg-white rounded-lg shadow-md overflow-hidden animate-pulse ${
                viewMode === 'list' ? 'flex' : ''
              }`}>
                <div className={`bg-gray-200 ${viewMode === 'list' ? 'w-64 h-40' : 'h-48'}`}></div>
                <div className="p-4 space-y-3 flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-12">
            <p className="text-red-600 text-lg">{error}</p>
            <button 
              onClick={() => fetchProperties(currentFilters)} 
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Properties Grid/List */}
        {!loading && !error && (
          <>
            <div className={`${viewMode === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3' : 'space-y-4'} gap-6`}>
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