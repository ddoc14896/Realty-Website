'use client';

import { useState, useEffect } from 'react';
import Link from "next/link";
import AdminGuard from "@/components/AdminGuard";
import { 
  Plus, 
  Home, 
  Search,
  Edit,
  Trash2,
  Eye,
  Filter,
  MoreVertical
} from "lucide-react";
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
  status: string;
  images: Array<{
    url: string;
    alt: string;
    isPrimary: boolean;
  }>;
}

export default function AdminPropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
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
  };

  const handleDeleteProperty = async (propertyId: string) => {
    if (!confirm('Are you sure you want to delete this property?')) return;
    
    try {
      const response = await fetch(`/api/properties/${propertyId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setProperties(properties.filter(p => p.id !== propertyId));
      } else {
        alert('Failed to delete property');
      }
    } catch (err) {
      alert('Error deleting property');
    }
  };

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || property.propertyType.toLowerCase().includes(filterType.toLowerCase());
    const matchesStatus = filterStatus === 'all' || property.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <AdminGuard>
      <div className="min-h-screen bg-gradient-warm fade-in">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md shadow-lg border-b slide-in-top" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/admin" className="flex items-center space-x-2 bounce-in">
              <span className="text-xl font-bold text-gray-900">🏠 Admin - Properties</span>
            </Link>
            <nav className="flex space-x-2">
              <Link href="/" className="nav-link px-4 py-2 mx-2">
                Home
              </Link>
              <Link href="/admin" className="nav-link px-4 py-2 mx-2">
                Admin
              </Link>
              <button className="nav-link bg-red-100 text-red-600 px-4 py-2 mx-2 rounded-lg hover:bg-red-200">
                Logout
              </button>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 slide-in-right">
        {/* Page Header */}
        <div className="flex justify-between items-center mb-8 fade-in">
          <div className="slide-in-left">
            <h1 className="text-3xl font-bold text-gray-900">Property Management</h1>
            <p className="text-gray-600 mt-2">Manage all properties in your database</p>
          </div>
          <Link 
            href="/admin/properties/new"
            className="btn-primary flex items-center space-x-2 px-4 py-2 bounce-in"
          >
            <Plus className="h-5 w-5 pulse" />
            <span>Add Property</span>
          </Link>
        </div>

        {/* Filters and Search */}
        <div className="property-card bg-white rounded-lg shadow-md p-6 mb-8 fade-in">
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search properties..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-input pl-10 pr-4 py-2 w-full"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="form-input w-full px-3 py-2"
              >
                <option value="all">All Types</option>
                <option value="house">House</option>
                <option value="apartment">Apartment</option>
                <option value="villa">Villa</option>
                <option value="penthouse">Penthouse</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="form-input w-full px-3 py-2"
              >
                <option value="all">All Status</option>
                <option value="FOR_SALE">For Sale</option>
                <option value="FOR_RENT">For Rent</option>
                <option value="SOLD">Sold</option>
                <option value="RENTED">Rented</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Actions</label>
              <button
                onClick={fetchProperties}
                className="w-full flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Filter className="h-4 w-4" />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>

        {/* Properties Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Properties ({filteredProperties.length})
            </h3>
          </div>

          {loading ? (
            <div className="px-6 py-12 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto" style={{ borderColor: 'var(--brown-600)' }}></div>
              <p className="mt-2 text-gray-600">Loading properties...</p>
            </div>
          ) : error ? (
            <div className="px-6 py-12 text-center">
              <p className="text-red-600">{error}</p>
              <button 
                onClick={fetchProperties}
                className="btn-primary mt-4 px-4 py-2"
              >
                Try Again
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Property
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredProperties.map((property) => (
                    <tr key={property.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12">
                            <div className="h-12 w-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--brown-100)' }}>
                              <Home className="h-6 w-6" style={{ color: 'var(--brown-600)' }} />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 line-clamp-1">
                              {property.title}
                            </div>
                            <div className="text-sm text-gray-500 line-clamp-1">
                              {property.address}, {property.city}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full" style={{ backgroundColor: 'var(--brown-100)', color: 'var(--brown-800)' }}>
                          {property.propertyType}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatPrice(property.price)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          property.status === 'FOR_SALE' ? 'bg-green-100 text-green-800' :
                          property.status === 'FOR_RENT' ? 'bg-yellow-100 text-yellow-800' :
                          property.status === 'SOLD' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {property.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {property.bedrooms}BR • {property.bathrooms}BA • {property.squareFeet?.toLocaleString()} sqft
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <Link 
                            href={`/properties/${property.id}`}
                            className="font-medium hover:underline"
                            style={{ color: 'var(--brown-600)' }}
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                          <Link 
                            href={`/admin/properties/${property.id}/edit`}
                            className="text-yellow-600 hover:text-yellow-900"
                          >
                            <Edit className="h-4 w-4" />
                          </Link>
                          <button 
                            onClick={() => handleDeleteProperty(property.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredProperties.length === 0 && !loading && (
                <div className="px-6 py-12 text-center">
                  <Home className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No properties found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {searchTerm || filterType !== 'all' || filterStatus !== 'all' 
                      ? 'Try adjusting your search filters.'
                      : 'Get started by adding a new property.'
                    }
                  </p>
                  <div className="mt-6">
                    <Link 
                      href="/admin/properties/new"
                      className="btn-primary inline-flex items-center px-4 py-2 text-sm font-medium"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Property
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
    </AdminGuard>
  );
}