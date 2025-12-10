'use client';

import { useState, useEffect } from 'react';
import Link from "next/link";
import { 
  Plus, 
  Home, 
  Users, 
  FileText, 
  BarChart3, 
  Upload,
  Settings,
  Eye,
  Edit,
  Trash2
} from "lucide-react";
import { formatPrice } from "@/lib/utils";
import AdminGuard from "@/components/AdminGuard";

interface DashboardStats {
  totalProperties: number;
  activeListings: number;
  newInquiries: number;
  totalUsers: number;
}

interface Property {
  id: string;
  title: string;
  address: string;
  city: string;
  propertyType: string;
  price: number;
  status: string;
}

export default function AdminPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProperties: 0,
    activeListings: 0,
    newInquiries: 0,
    totalUsers: 0
  });
  const [recentProperties, setRecentProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch properties
      const propertiesResponse = await fetch('/api/properties/search');
      const propertiesData = await propertiesResponse.json();
      const properties = propertiesData.properties || [];
      
      // Calculate stats
      const totalProperties = properties.length;
      const activeListings = properties.filter((p: Property) => p.status === 'FOR_SALE' || p.status === 'FOR_RENT').length;
      
      setStats({
        totalProperties,
        activeListings,
        newInquiries: 23, // This would come from inquiries API
        totalUsers: 1247  // This would come from users API
      });
      
      setRecentProperties(properties.slice(0, 5));
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminGuard>
      <div className="min-h-screen bg-gradient-warm fade-in">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md shadow-lg border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold text-gray-900">🏠 Realty Website - Admin</span>
            </Link>
            <nav className="flex space-x-8">
              <Link href="/" className="nav-link px-3 py-2">
                Home
              </Link>
              <Link href="/properties" className="nav-link px-3 py-2">
                Properties
              </Link>
              <Link href="/admin" className="nav-link active px-3 py-2" style={{ color: 'var(--brown-600)' }}>
                Admin
              </Link>
              <button className="btn-secondary px-4 py-2 text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400">
                Logout
              </button>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-64 property-card p-6 slide-in">
            <h2 className="text-lg font-semibold mb-6">Admin Panel</h2>
            <nav className="space-y-2">
              <Link href="/admin" className="nav-link flex items-center space-x-3 px-3 py-2 rounded-lg" style={{ backgroundColor: 'var(--brown-100)', color: 'var(--brown-700)' }}>
                <BarChart3 className="h-5 w-5" />
                <span>Dashboard</span>
              </Link>
              <Link href="/admin/properties" className="nav-link flex items-center space-x-3 px-3 py-2 rounded-lg bounce">
                <Home className="h-5 w-5" />
                <span>Properties</span>
              </Link>
              <Link href="/admin/users" className="nav-link flex items-center space-x-3 px-3 py-2 rounded-lg bounce">
                <Users className="h-5 w-5" />
                <span>Users</span>
              </Link>
              <Link href="/admin/inquiries" className="nav-link flex items-center space-x-3 px-3 py-2 rounded-lg bounce">
                <FileText className="h-5 w-5" />
                <span>Inquiries</span>
              </Link>
              <Link href="/admin/bulk-upload" className="nav-link flex items-center space-x-3 px-3 py-2 rounded-lg bounce">
                <Upload className="h-5 w-5" />
                <span>Bulk Upload</span>
              </Link>
              <Link href="/admin/settings" className="nav-link flex items-center space-x-3 px-3 py-2 rounded-lg bounce">
                <Settings className="h-5 w-5" />
                <span>Settings</span>
              </Link>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Dashboard Stats */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <div className="property-card p-6 grid-item">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm" style={{ color: 'var(--brown-600)' }}>Total Properties</p>
                    <p className="text-2xl font-bold property-price">
                      {loading ? <span className="animate-pulse">...</span> : stats.totalProperties}
                    </p>
                  </div>
                  <Home className="h-8 w-8 pulse" style={{ color: 'var(--brown-600)' }} />
                </div>
              </div>
              
              <div className="property-card p-6 grid-item">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm" style={{ color: 'var(--brown-600)' }}>Active Listings</p>
                    <p className="text-2xl font-bold property-price text-green-600">
                      {loading ? <span className="animate-pulse">...</span> : stats.activeListings}
                    </p>
                  </div>
                  <Eye className="h-8 w-8 pulse text-green-600" />
                </div>
              </div>
              
              <div className="property-card p-6 grid-item">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm" style={{ color: 'var(--brown-600)' }}>New Inquiries</p>
                    <p className="text-2xl font-bold property-price text-yellow-600">
                      {loading ? <span className="animate-pulse">...</span> : stats.newInquiries}
                    </p>
                  </div>
                  <FileText className="h-8 w-8 pulse text-yellow-600" />
                </div>
              </div>
              
              <div className="property-card p-6 grid-item">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm" style={{ color: 'var(--brown-600)' }}>Total Users</p>
                    <p className="text-2xl font-bold property-price text-purple-600">
                      {loading ? <span className="animate-pulse">...</span> : stats.totalUsers.toLocaleString()}
                    </p>
                  </div>
                  <Users className="h-8 w-8 pulse text-purple-600" />
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="property-card p-6 mb-8 bounce">
              <h3 className="text-lg font-bold mb-4 text-gradient">Quick Actions</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <Link href="/admin/properties/new" className="btn-primary flex items-center space-x-3 px-4 py-3 pulse">
                  <Plus className="h-5 w-5" />
                  <span>Add New Property</span>
                </Link>
                <Link href="/admin/bulk-upload" className="btn-accent flex items-center space-x-3 px-4 py-3">
                  <Upload className="h-5 w-5" />
                  <span>Bulk Upload CSV</span>
                </Link>
                <Link href="/admin/inquiries" className="flex items-center space-x-3 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                  <FileText className="h-5 w-5" />
                  <span>View Inquiries</span>
                </Link>
              </div>
            </div>

            {/* Recent Properties */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Recent Properties</h3>
                <Link href="/admin/properties" className="font-medium hover:underline" style={{ color: 'var(--brown-600)' }}>
                  View All
                </Link>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Property</th>
                      <th className="text-left py-2">Type</th>
                      <th className="text-left py-2">Price</th>
                      <th className="text-left py-2">Status</th>
                      <th className="text-left py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      Array.from({ length: 5 }, (_, i) => (
                        <tr key={i} className="border-b hover:bg-gray-50 animate-pulse">
                          <td className="py-3">
                            <div>
                              <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
                              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                            </div>
                          </td>
                          <td className="py-3">
                            <div className="h-6 bg-gray-200 rounded w-16"></div>
                          </td>
                          <td className="py-3">
                            <div className="h-4 bg-gray-200 rounded w-20"></div>
                          </td>
                          <td className="py-3">
                            <div className="h-6 bg-gray-200 rounded w-16"></div>
                          </td>
                          <td className="py-3">
                            <div className="flex space-x-2">
                              <div className="h-4 w-4 bg-gray-200 rounded"></div>
                              <div className="h-4 w-4 bg-gray-200 rounded"></div>
                              <div className="h-4 w-4 bg-gray-200 rounded"></div>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      recentProperties.map((property) => (
                        <tr key={property.id} className="border-b hover:bg-gray-50">
                          <td className="py-3">
                            <div>
                              <p className="font-medium line-clamp-1">{property.title}</p>
                              <p className="text-gray-600 text-xs line-clamp-1">{property.address}, {property.city}</p>
                            </div>
                          </td>
                          <td className="py-3">
                            <span className="px-2 py-1 rounded text-xs" style={{ backgroundColor: 'var(--brown-100)', color: 'var(--brown-800)' }}>
                              {property.propertyType}
                            </span>
                          </td>
                          <td className="py-3">{formatPrice(property.price)}</td>
                          <td className="py-3">
                            <span className={`px-2 py-1 rounded text-xs ${
                              property.status === 'FOR_SALE' || property.status === 'FOR_RENT'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {property.status.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="py-3">
                            <div className="flex space-x-2">
                              <Link href={`/properties/${property.id}`} className="font-medium hover:underline" style={{ color: 'var(--brown-600)' }}>
                                <Eye className="h-4 w-4" />
                              </Link>
                              <Link href={`/admin/properties/${property.id}/edit`} className="text-yellow-600 hover:text-yellow-800">
                                <Edit className="h-4 w-4" />
                              </Link>
                              <button className="text-red-600 hover:text-red-800">
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent Inquiries */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Recent Inquiries</h3>
                <Link href="/admin/inquiries" className="font-medium hover:underline" style={{ color: 'var(--brown-600)' }}>
                  View All
                </Link>
              </div>
              
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="border-l-4 pl-4 py-3 rounded-r" style={{ borderColor: 'var(--brown-500)', backgroundColor: 'var(--brown-50)' }}>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">John Doe {i}</p>
                        <p className="text-sm text-gray-600">Interested in: Beautiful Family Home {i}</p>
                        <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                      </div>
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">
                        Pending
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>© 2025 Realty Website Admin Panel. Built for Vibe Coding Competition.</p>
        </div>
      </footer>
    </div>
    </AdminGuard>
  );
}