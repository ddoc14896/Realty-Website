'use client';

/**
 * Header Component - Main Navigation & User Interface
 * 
 * The primary navigation header for the entire application.
 * Provides role-based navigation, user authentication status,
 * and quick access to key features like favorites.
 * 
 * Features:
 * - Responsive navigation menu
 * - Role-based menu items (admin links only for admin users)
 * - User authentication status display
 * - Favorites counter with heart icon
 * - Dropdown menus for properties and user account
 * - Login/logout functionality
 * - Mobile-friendly responsive design
 * 
 * Navigation Structure:
 * - Home, Properties, About, Contact (public)
 * - Admin Dashboard (admin only)
 * - Favorites with live counter
 * - User account dropdown with profile/logout
 */

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Home, ChevronDown, User, LogOut, Heart } from 'lucide-react';
import { useFavorites } from '@/contexts/FavoritesContext';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showLoginDropdown, setShowLoginDropdown] = useState(false);
  const router = useRouter();
  const { getFavoritesCount } = useFavorites();

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setShowDropdown(false);
    router.push('/');
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'text-red-600 bg-red-100';
      case 'AGENT': return 'text-blue-600 bg-blue-100';
      case 'BROKER': return 'text-purple-600 bg-purple-100';
      case 'USER': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <Home className="h-8 w-8 text-blue-600" />
            <Link href="/" className="text-xl font-bold text-gray-900">
              Chennai Realty
            </Link>
          </div>
          
          <nav className="flex items-center space-x-8">
            <Link href="/properties" className="text-gray-700 hover:text-blue-600 font-medium">
              Properties
            </Link>
            <Link href="/properties/map" className="text-gray-700 hover:text-blue-600 font-medium">
              Map View
            </Link>
            <Link href="/favorites" className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 font-medium">
              <Heart className="h-4 w-4" />
              <span>Favorites</span>
              {getFavoritesCount() > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5 ml-1">
                  {getFavoritesCount()}
                </span>
              )}
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-blue-600 font-medium">
              Contact
            </Link>
            
            {/* User Menu or Login Dropdown */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 font-medium"
                >
                  <User className="h-5 w-5" />
                  <span>{user.name}</span>
                  <span className={`px-2 py-1 text-xs rounded-full ${getRoleColor(user.role)}`}>
                    {user.role}
                  </span>
                  <ChevronDown className="h-4 w-4" />
                </button>
                
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    {user.role === 'ADMIN' && (
                      <Link
                        href="/admin"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowDropdown(false)}
                      >
                        Admin Panel
                      </Link>
                    )}
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowDropdown(false)}
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setShowLoginDropdown(!showLoginDropdown)}
                  className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 font-medium"
                >
                  <span>Login</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
                
                {showLoginDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <Link
                      href="/login"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowLoginDropdown(false)}
                    >
                      Login as User
                    </Link>
                    <Link
                      href="/login"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowLoginDropdown(false)}
                    >
                      Login as Agent
                    </Link>
                    <Link
                      href="/login"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowLoginDropdown(false)}
                    >
                      Login as Admin
                    </Link>
                    <div className="border-t border-gray-100"></div>
                    <Link
                      href="/signup"
                      className="block px-4 py-2 text-sm text-blue-600 hover:bg-gray-100 font-medium"
                      onClick={() => setShowLoginDropdown(false)}
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}