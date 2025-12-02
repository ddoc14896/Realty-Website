'use client';

/**
 * AdminGuard Component - Role-based Access Control
 * 
 * A security wrapper component that restricts access to admin-only sections
 * of the application. Validates user authentication and role permissions
 * before allowing access to protected routes.
 * 
 * Features:
 * - User authentication validation
 * - Role-based access control (admin only)
 * - Automatic redirection for unauthorized users
 * - Loading states during authentication checks
 * - User-friendly access denied messages
 * 
 * Usage: Wrap any admin-only component or page with this guard
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShieldX, ArrowLeft } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AdminGuardProps {
  children: React.ReactNode;
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking permissions...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <ShieldX className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">
            You need to be logged in to access the admin panel.
          </p>
          <div className="space-y-3">
            <Link
              href="/login"
              className="block w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Login to Continue
            </Link>
            <Link
              href="/"
              className="flex items-center justify-center w-full text-gray-600 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (user.role !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <ShieldX className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Insufficient Permissions</h2>
          <p className="text-gray-600 mb-2">
            Hi <strong>{user.name}</strong>, you are logged in as:
          </p>
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mb-6">
            {user.role}
          </div>
          <p className="text-gray-600 mb-6">
            Only administrators can access this section. Contact your system administrator if you need admin access.
          </p>
          <div className="space-y-3">
            <Link
              href="/login"
              className="block w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors font-semibold"
            >
              Login as Admin
            </Link>
            <Link
              href="/"
              className="flex items-center justify-center w-full text-gray-600 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}