'use client';

import { useState, useEffect } from 'react';
import { Search, MapPin, Home, Bed, Bath } from 'lucide-react';

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

interface PropertySearchProps {
  onSearch: (filters: SearchFilters) => void;
  isLoading?: boolean;
}

export default function PropertySearch({ onSearch, isLoading = false }: PropertySearchProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    location: '',
    minPrice: '',
    maxPrice: '',
    propertyType: '',
    bedrooms: '',
    bathrooms: '',
    status: 'FOR_SALE'
  });

  const [isExpanded, setIsExpanded] = useState(false);

  const handleFilterChange = (key: keyof SearchFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(filters);
  };

  const clearFilters = () => {
    setFilters({
      query: '',
      location: '',
      minPrice: '',
      maxPrice: '',
      propertyType: '',
      bedrooms: '',
      bathrooms: '',
      status: 'FOR_SALE'
    });
    onSearch({
      query: '',
      location: '',
      minPrice: '',
      maxPrice: '',
      propertyType: '',
      bedrooms: '',
      bathrooms: '',
      status: 'FOR_SALE'
    });
  };

  const propertyTypes = [
    { value: '', label: 'All Types' },
    { value: 'House', label: 'House' },
    { value: 'Apartment', label: 'Apartment' },
    { value: 'Condo', label: 'Condo' },
    { value: 'Townhouse', label: 'Townhouse' },
    { value: 'Commercial', label: 'Commercial' }
  ];

  const bedroomOptions = [
    { value: '', label: 'Any' },
    { value: '1', label: '1+' },
    { value: '2', label: '2+' },
    { value: '3', label: '3+' },
    { value: '4', label: '4+' },
    { value: '5', label: '5+' }
  ];

  const bathroomOptions = [
    { value: '', label: 'Any' },
    { value: '1', label: '1+' },
    { value: '1.5', label: '1.5+' },
    { value: '2', label: '2+' },
    { value: '2.5', label: '2.5+' },
    { value: '3', label: '3+' }
  ];

  const statusOptions = [
    { value: 'FOR_SALE', label: 'For Sale' },
    { value: 'FOR_RENT', label: 'For Rent' },
    { value: 'SOLD', label: 'Sold' },
    { value: 'RENTED', label: 'Rented' }
  ];

  return (
    <div className="card p-8 mb-8">
      <form onSubmit={handleSearch}>
        {/* Enhanced Search Section */}
        <div className="flex flex-col md:flex-row gap-6 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5" 
                    style={{ color: 'var(--brown-500)' }} />
            <input
              type="text"
              placeholder="🔍 Search properties, neighborhoods, or keywords..."
              value={filters.query}
              onChange={(e) => handleFilterChange('query', e.target.value)}
              className="form-input pl-12 pr-4 py-4 text-base"
              style={{ 
                borderRadius: '1rem',
                fontSize: '1rem'
              }}
            />
          </div>
          
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5" 
                    style={{ color: 'var(--brown-500)' }} />
            <input
              type="text"
              placeholder="📍 Location (City, State)"
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              className="form-input w-full md:w-72 pl-12 pr-4 py-4 text-base"
              style={{ 
                borderRadius: '1rem',
                fontSize: '1rem'
              }}
            />
          </div>
          
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary px-8 py-4 font-semibold"
            >
              {isLoading ? '🔄 Searching...' : '🔍 Search Properties'}
            </button>
            
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="btn-secondary px-6 py-4 font-semibold"
            >
              ⚙️ {isExpanded ? 'Hide' : 'Show'} Filters
            </button>
          </div>
        </div>

        {/* Enhanced Advanced Filters */}
        {isExpanded && (
          <div className="pt-6 mt-6" style={{ borderTop: `2px solid var(--brown-200)` }}>
            <h3 className="text-lg font-bold mb-6 text-gradient">🎯 Advanced Filters</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Property Type */}
              <div>
                <label className="block text-sm font-bold mb-3" style={{ color: 'var(--brown-700)' }}>
                  <Home className="inline h-4 w-4 mr-2" style={{ color: 'var(--soft-gold)' }} />
                  Property Type
                </label>
                <select
                  value={filters.propertyType}
                  onChange={(e) => handleFilterChange('propertyType', e.target.value)}
                  className="form-input p-4 text-base"
                  style={{ borderRadius: '0.75rem' }}
                >
                  {propertyTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-bold mb-3" style={{ color: 'var(--brown-700)' }}>
                  📋 Listing Status
                </label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="form-input p-4 text-base"
                  style={{ borderRadius: '0.75rem' }}
                >
                  {statusOptions.map(status => (
                    <option key={status.value} value={status.value}>{status.label}</option>
                  ))}
                </select>
              </div>

              {/* Bedrooms */}
              <div>
                <label className="block text-sm font-bold mb-3" style={{ color: 'var(--brown-700)' }}>
                  <Bed className="inline h-4 w-4 mr-2" style={{ color: 'var(--soft-gold)' }} />
                  Bedrooms
                </label>
                <select
                  value={filters.bedrooms}
                  onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
                  className="form-input p-4 text-base"
                  style={{ borderRadius: '0.75rem' }}
                >
                  {bedroomOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>

              {/* Bathrooms */}
              <div>
                <label className="block text-sm font-bold mb-3" style={{ color: 'var(--brown-700)' }}>
                  <Bath className="inline h-4 w-4 mr-2" style={{ color: 'var(--soft-gold)' }} />
                  Bathrooms
                </label>
                <select
                  value={filters.bathrooms}
                  onChange={(e) => handleFilterChange('bathrooms', e.target.value)}
                  className="form-input p-4 text-base"
                  style={{ borderRadius: '0.75rem' }}
                >
                  {bathroomOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Enhanced Price Range */}
            <div className="mt-6">
              <h4 className="text-sm font-bold mb-4" style={{ color: 'var(--brown-700)' }}>
                💰 Price Range
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--brown-600)' }}>
                    Minimum Price
                  </label>
                  <input
                    type="number"
                    placeholder="💵 Enter minimum price"
                    value={filters.minPrice}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                    className="form-input p-4 text-base"
                    style={{ borderRadius: '0.75rem' }}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--brown-600)' }}>
                    Maximum Price
                  </label>
                  <input
                    type="number"
                    placeholder="💎 No upper limit"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                    className="form-input p-4 text-base"
                    style={{ borderRadius: '0.75rem' }}
                  />
                </div>
              </div>
            </div>

            {/* Enhanced Action Buttons */}
            <div className="flex flex-col md:flex-row justify-between items-center pt-8 gap-4">
              <button
                type="button"
                onClick={clearFilters}
                className="font-semibold transition-all duration-300 hover:scale-105"
                style={{ color: 'var(--brown-600)' }}
              >
                🗑️ Clear All Filters
              </button>
              
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsExpanded(false)}
                  className="btn-secondary px-6 py-3"
                >
                  ❌ Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary px-8 py-3"
                >
                  ✨ Apply Filters
                </button>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}