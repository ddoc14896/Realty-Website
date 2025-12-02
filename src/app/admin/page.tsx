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
      <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold text-gray-900">🏠 Realty Website - Admin</span>
            </Link>
            <nav className="flex space-x-8">
              <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium">
                Home
              </Link>
              <Link href="/properties" className="text-gray-700 hover:text-blue-600 font-medium">
                Properties
              </Link>
              <Link href="/admin" className="text-blue-600 font-medium">
                Admin
              </Link>
              <button className="bg-red-100 text-red-600 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors">
                Logout
              </button>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-64 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-6">Admin Panel</h2>
            <nav className="space-y-2">
              <Link href="/admin" className="flex items-center space-x-3 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg">
                <BarChart3 className="h-5 w-5" />
                <span>Dashboard</span>
              </Link>
              <Link href="/admin/properties" className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                <Home className="h-5 w-5" />
                <span>Properties</span>
              </Link>
              <Link href="/admin/users" className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                <Users className="h-5 w-5" />
                <span>Users</span>
              </Link>
              <Link href="/admin/inquiries" className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                <FileText className="h-5 w-5" />
                <span>Inquiries</span>
              </Link>
              <Link href="/admin/bulk-upload" className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                <Upload className="h-5 w-5" />
                <span>Bulk Upload</span>
              </Link>
              <Link href="/admin/settings" className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                <Settings className="h-5 w-5" />
                <span>Settings</span>
              </Link>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Dashboard Stats */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Properties</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {loading ? '...' : stats.totalProperties}
                    </p>
                  </div>
                  <Home className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Active Listings</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {loading ? '...' : stats.activeListings}
                    </p>
                  </div>
                  <Eye className="h-8 w-8 text-green-600" />
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">New Inquiries</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {loading ? '...' : stats.newInquiries}
                    </p>
                  </div>
                  <FileText className="h-8 w-8 text-yellow-600" />
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Users</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {loading ? '...' : stats.totalUsers.toLocaleString()}
                    </p>
                  </div>
                  <Users className="h-8 w-8 text-purple-600" />
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <Link href="/admin/properties/new" className="flex items-center space-x-3 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Plus className="h-5 w-5" />
                  <span>Add New Property</span>
                </Link>
                <Link href="/admin/bulk-upload" className="flex items-center space-x-3 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
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
                <Link href="/admin/properties" className="text-blue-600 hover:text-blue-800">
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
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
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
                              <Link href={`/properties/${property.id}`} className="text-blue-600 hover:text-blue-800">
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
                <Link href="/admin/inquiries" className="text-blue-600 hover:text-blue-800">
                  View All
                </Link>
              </div>
              
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="border-l-4 border-blue-500 pl-4 py-3 bg-blue-50 rounded-r">
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