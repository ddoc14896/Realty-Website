'use client';

import { useState, useEffect } from 'react';
import Link from "next/link";
import AdminGuard from "@/components/AdminGuard";
import { 
  Users,
  Mail,
  Phone,
  Calendar,
  Shield,
  UserPlus,
  Search,
  Filter,
  Edit,
  Trash2,
  Crown,
  User
} from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'admin' | 'agent' | 'user';
  status: 'active' | 'inactive' | 'pending';
  lastLogin?: string;
  createdAt: string;
  propertiesCount?: number;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'John Admin',
      email: 'admin@realty.com',
      phone: '+91 98765 43210',
      role: 'admin',
      status: 'active',
      lastLogin: '2025-12-02T10:30:00Z',
      createdAt: '2025-01-01T00:00:00Z',
      propertiesCount: 45
    },
    {
      id: '2', 
      name: 'Sarah Agent',
      email: 'sarah@realty.com',
      phone: '+91 98765 43211',
      role: 'agent',
      status: 'active',
      lastLogin: '2025-12-02T09:15:00Z',
      createdAt: '2025-02-15T00:00:00Z',
      propertiesCount: 23
    },
    {
      id: '3',
      name: 'Mike Customer',
      email: 'mike@gmail.com',
      phone: '+91 98765 43212',
      role: 'user',
      status: 'active',
      lastLogin: '2025-12-01T18:45:00Z',
      createdAt: '2025-11-20T00:00:00Z',
      propertiesCount: 0
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'user' as 'admin' | 'agent' | 'user',
    status: 'active' as 'active' | 'inactive' | 'pending'
  });

  useEffect(() => {
    fetchUsers();
    
    // Check if we're coming from user creation
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('newUser') === 'created') {
      const newUserData = localStorage.getItem('newUserCreated');
      if (newUserData) {
        const newUser = JSON.parse(newUserData);
        setUsers(prev => [newUser, ...prev]);
        localStorage.removeItem('newUserCreated');
        
        // Show success message
        setTimeout(() => {
          alert(`User "${newUser.name}" has been successfully created!`);
        }, 500);
        
        // Clean up URL
        window.history.replaceState(null, '', '/admin/users');
      }
    }
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Simulate API call - in real app this would fetch from /api/users
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Users are already set in initial state
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setNewUser({
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      role: user.role,
      status: user.status
    });
    setShowEditModal(true);
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !newUser.name || !newUser.email) return;
    
    setLoading(true);
    try {
      const updatedUser: User = {
        ...selectedUser,
        ...newUser
      };
      
      setUsers(prev => prev.map(user => 
        user.id === selectedUser.id ? updatedUser : user
      ));
      setShowEditModal(false);
      setSelectedUser(null);
      setNewUser({
        name: '',
        email: '',
        phone: '',
        role: 'user',
        status: 'active'
      });
      alert('User updated successfully!');
    } catch (error) {
      alert('Failed to update user');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }
    
    try {
      setUsers(prev => prev.filter(user => user.id !== userId));
      alert('User deleted successfully!');
    } catch (error) {
      alert('Failed to delete user');
    }
  };

  const handleStatusChange = async (userId: string, newStatus: 'active' | 'inactive' | 'pending') => {
    try {
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, status: newStatus } : user
      ));
    } catch (error) {
      alert('Failed to update user status');
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Crown className="h-4 w-4 text-purple-600" />;
      case 'agent': return <Shield className="h-4 w-4" style={{ color: 'var(--brown-600)' }} />;
      case 'user': return <User className="h-4 w-4 text-green-600" />;
      default: return <User className="h-4 w-4 text-gray-600" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'agent': return '';
      case 'user': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <AdminGuard>
      <div className="min-h-screen bg-gradient-warm fade-in">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md shadow-lg border-b slide-in-top">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/admin" className="flex items-center space-x-2 bounce-in">
              <span className="text-xl font-bold text-gray-900">🏠 Admin - Users</span>
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
            <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
            <p className="text-gray-600 mt-2">Manage user accounts, roles, and permissions</p>
          </div>
          <Link
            href="/admin/users/new"
            className="btn-primary flex items-center space-x-2 px-4 py-2 bounce-in"
          >
            <UserPlus className="h-5 w-5 pulse" />
            <span>Add User</span>
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
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-input pl-10 pr-4 py-2 w-full"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="agent">Agent</option>
                <option value="user">User</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Actions</label>
              <button 
                onClick={fetchUsers}
                className="nav-link w-full flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200"
              >
                <Filter className="h-4 w-4 pulse" />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="property-card bg-white rounded-lg shadow-md overflow-hidden slide-in-up">
          <div className="px-6 py-4 border-b border-gray-200 fade-in">
            <h3 className="text-lg font-medium text-gray-900">
              Users ({filteredUsers.length})
            </h3>
          </div>

          {loading ? (
            <div className="px-6 py-12 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto" style={{ borderColor: 'var(--brown-600)' }}></div>
              <p className="mt-2 text-gray-600">Loading users...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Properties
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Login
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user, index) => (
                  <tr key={user.id} className="grid-item hover:bg-gray-50 fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12">
                          <div className="h-12 w-12 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--brown-100)' }}>
                            <Users className="h-6 w-6" style={{ color: 'var(--brown-600)' }} />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.name}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center space-x-4">
                            <span className="flex items-center space-x-1">
                              <Mail className="h-3 w-3" />
                              <span>{user.email}</span>
                            </span>
                            {user.phone && (
                              <span className="flex items-center space-x-1">
                                <Phone className="h-3 w-3" />
                                <span>{user.phone}</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {getRoleIcon(user.role)}
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={user.status}
                        onChange={(e) => handleStatusChange(user.id, e.target.value as 'active' | 'inactive' | 'pending')}
                        className={`text-xs font-semibold rounded px-2 py-1 border-0 focus:ring-2 ${getStatusColor(user.status)}`}
                        style={{ '--tw-ring-color': 'var(--brown-500)' }}
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="pending">Pending</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.propertiesCount || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => handleEditUser(user)}
                          className="nav-link font-medium hover:underline p-2"
                          style={{ color: 'var(--brown-600)' }}
                          title="Edit User"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteUser(user.id)}
                          className="nav-link text-red-600 hover:text-red-900 p-2"
                          title="Delete User"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                  ))}
                  
                  {filteredUsers.length === 0 && !loading && (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center">
                        <Users className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
                        <p className="mt-1 text-sm text-gray-500">
                          {searchTerm || filterRole !== 'all' || filterStatus !== 'all'
                            ? 'Try adjusting your search filters.'
                            : 'Get started by adding a new user.'
                          }
                        </p>
                        <div className="mt-6">
                          <Link
                            href="/admin/users/new"
                            className="btn-primary inline-flex items-center"
                          >
                            <UserPlus className="h-4 w-4 mr-2" />
                            Add User
                          </Link>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Edit User Modal */}
        {showEditModal && selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit User</h3>
              
              <form onSubmit={handleUpdateUser} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    placeholder="Enter full name"
                    value={newUser.name}
                    onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="Enter email address"
                    value={newUser.email}
                    onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="Enter phone number"
                    value={newUser.phone}
                    onChange={(e) => setNewUser(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                    <select
                      value={newUser.role}
                      onChange={(e) => setNewUser(prev => ({ ...prev, role: e.target.value as 'admin' | 'agent' | 'user' }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="user">User</option>
                      <option value="agent">Agent</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      value={newUser.status}
                      onChange={(e) => setNewUser(prev => ({ ...prev, status: e.target.value as 'active' | 'inactive' | 'pending' }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="active">Active</option>
                      <option value="pending">Pending</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false);
                      setSelectedUser(null);
                      setNewUser({
                        name: '',
                        email: '',
                        phone: '',
                        role: 'user',
                        status: 'active'
                      });
                    }}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!newUser.name || !newUser.email || loading}
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Updating...' : 'Update User'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
    </AdminGuard>
  );
}