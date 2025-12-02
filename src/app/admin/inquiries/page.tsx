'use client';

import { useState, useEffect } from 'react';
import Link from "next/link";
import AdminGuard from "@/components/AdminGuard";
import { 
  Mail,
  Phone,
  Calendar,
  User,
  Home,
  MessageSquare,
  Filter,
  Search,
  CheckCircle,
  Clock,
  AlertCircle,
  Trash2
} from "lucide-react";

interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  propertyId?: string;
  propertyTitle?: string;
  message: string;
  status: 'pending' | 'responded' | 'closed';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  respondedAt?: string;
}

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      const response = await fetch('/api/inquiries');
      if (!response.ok) {
        throw new Error('Failed to fetch inquiries');
      }
      const data = await response.json();
      setInquiries(data.inquiries || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (inquiryId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/inquiries/${inquiryId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (response.ok) {
        setInquiries(inquiries.map(inquiry => 
          inquiry.id === inquiryId 
            ? { ...inquiry, status: newStatus as any, respondedAt: newStatus === 'responded' ? new Date().toISOString() : inquiry.respondedAt }
            : inquiry
        ));
      } else {
        alert('Failed to update inquiry status');
      }
    } catch (err) {
      alert('Error updating inquiry status');
    }
  };

  const handleDelete = async (inquiryId: string) => {
    if (!confirm('Are you sure you want to delete this inquiry?')) return;
    
    try {
      const response = await fetch(`/api/inquiries/${inquiryId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setInquiries(inquiries.filter(inquiry => inquiry.id !== inquiryId));
      } else {
        alert('Failed to delete inquiry');
      }
    } catch (err) {
      alert('Error deleting inquiry');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'responded': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'closed': return <AlertCircle className="h-4 w-4 text-gray-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredInquiries = inquiries.filter(inquiry => {
    const matchesSearch = inquiry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         inquiry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         inquiry.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || inquiry.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || inquiry.priority === filterPriority;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <AdminGuard>
      <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/admin" className="flex items-center space-x-2">
              <span className="text-xl font-bold text-gray-900">🏠 Admin - Inquiries</span>
            </Link>
            <nav className="flex space-x-8">
              <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium">
                Home
              </Link>
              <Link href="/admin" className="text-gray-700 hover:text-blue-600 font-medium">
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
        {/* Page Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Customer Inquiries</h1>
            <p className="text-gray-600 mt-2">Manage customer inquiries and contact requests</p>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">
              {filteredInquiries.filter(i => i.status === 'pending').length} pending responses
            </span>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search inquiries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="responded">Responded</option>
                <option value="closed">Closed</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Priority</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Actions</label>
              <button
                onClick={fetchInquiries}
                className="w-full flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Filter className="h-4 w-4" />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>

        {/* Inquiries List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Inquiries ({filteredInquiries.length})
            </h3>
          </div>

          {loading ? (
            <div className="px-6 py-12 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading inquiries...</p>
            </div>
          ) : error ? (
            <div className="px-6 py-12 text-center">
              <p className="text-red-600">{error}</p>
              <button 
                onClick={fetchInquiries}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Try Again
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredInquiries.map((inquiry) => (
                <div key={inquiry.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(inquiry.status)}
                          <h4 className="text-lg font-medium text-gray-900">{inquiry.name}</h4>
                        </div>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(inquiry.priority)}`}>
                          {inquiry.priority} priority
                        </span>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          inquiry.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          inquiry.status === 'responded' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {inquiry.status}
                        </span>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Mail className="h-4 w-4" />
                            <span>{inquiry.email}</span>
                          </div>
                          {inquiry.phone && (
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <Phone className="h-4 w-4" />
                              <span>{inquiry.phone}</span>
                            </div>
                          )}
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(inquiry.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        
                        {inquiry.propertyId && (
                          <div>
                            <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                              <Home className="h-4 w-4" />
                              <span>Property Interest:</span>
                            </div>
                            <Link 
                              href={`/properties/${inquiry.propertyId}`}
                              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                            >
                              {inquiry.propertyTitle || `Property #${inquiry.propertyId}`}
                            </Link>
                          </div>
                        )}
                      </div>
                      
                      <div className="mb-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <MessageSquare className="h-4 w-4 text-gray-400" />
                          <span className="text-sm font-medium text-gray-700">Message:</span>
                        </div>
                        <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded-lg">
                          {inquiry.message}
                        </p>
                      </div>
                      
                      {inquiry.respondedAt && (
                        <div className="text-xs text-green-600 mb-4">
                          Responded on {new Date(inquiry.respondedAt).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                    
                    <div className="ml-6 flex flex-col space-y-2">
                      <select
                        value={inquiry.status}
                        onChange={(e) => handleStatusUpdate(inquiry.id, e.target.value)}
                        className="text-sm border border-gray-300 rounded px-3 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="pending">Pending</option>
                        <option value="responded">Responded</option>
                        <option value="closed">Closed</option>
                      </select>
                      
                      <button
                        onClick={() => handleDelete(inquiry.id)}
                        className="text-red-600 hover:text-red-800 p-1"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {filteredInquiries.length === 0 && !loading && (
                <div className="px-6 py-12 text-center">
                  <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No inquiries found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {searchTerm || filterStatus !== 'all' || filterPriority !== 'all'
                      ? 'Try adjusting your search filters.'
                      : 'Customer inquiries will appear here when they contact you.'
                    }
                  </p>
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