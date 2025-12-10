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
    <header className="bg-white/90 backdrop-blur-md shadow-lg border-b" style={{ borderColor: 'var(--border)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl" style={{ backgroundColor: 'var(--brown-100)' }}>
              <Home className="h-8 w-8" style={{ color: 'var(--brown-700)' }} />
            </div>
            <Link href="/" className="text-2xl font-bold text-gradient">
              UrbanNest Realty
            </Link>
          </div>
          
          <nav className="flex items-center space-x-8">
            <Link href="/properties" className="nav-link">
              Properties
            </Link>
            <Link href="/properties/map" className="nav-link">
              Map View
            </Link>
            <Link href="/favorites" className="nav-link flex items-center space-x-2">
              <Heart className="h-4 w-4" />
              <span>Favorites</span>
              {getFavoritesCount() > 0 && (
                <span className="property-badge text-xs px-2 py-1 ml-1">
                  {getFavoritesCount()}
                </span>
              )}
            </Link>
            <Link href="/contact" className="nav-link">
              Contact
            </Link>
            
            {/* User Menu or Login Dropdown */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="nav-link flex items-center space-x-3 px-4 py-2 rounded-xl border-2 transition-all duration-300"
                  style={{ 
                    borderColor: 'var(--brown-300)',
                    backgroundColor: 'var(--warm-white)'
                  }}
                >
                  <div className="p-1 rounded-lg" style={{ backgroundColor: 'var(--brown-100)' }}>
                    <User className="h-4 w-4" style={{ color: 'var(--brown-700)' }} />
                  </div>
                  <span className="font-medium">{user.name}</span>
                  <span className={`px-3 py-1 text-xs rounded-full font-semibold ${getRoleColor(user.role)}`}>
                    {user.role}
                  </span>
                  <ChevronDown className="h-4 w-4" />
                </button>
                
                {showDropdown && (
                  <div className="absolute right-0 mt-3 w-56 rounded-2xl shadow-xl py-2 z-50 border-2" 
                       style={{ 
                         backgroundColor: 'var(--warm-white)',
                         borderColor: 'var(--brown-200)'
                       }}>
                    {user.role === 'ADMIN' && (
                      <Link
                        href="/admin"
                        className="block px-6 py-3 text-sm font-medium transition-all duration-200 hover:bg-gradient-warm"
                        style={{ color: 'var(--brown-700)' }}
                        onClick={() => setShowDropdown(false)}
                      >
                        🏢 Admin Panel
                      </Link>
                    )}
                    <Link
                      href="/profile"
                      className="block px-6 py-3 text-sm font-medium transition-all duration-200 hover:bg-gradient-warm"
                      style={{ color: 'var(--brown-700)' }}
                      onClick={() => setShowDropdown(false)}
                    >
                      👤 Profile
                    </Link>
                    <div className="border-t mx-4 my-2" style={{ borderColor: 'var(--brown-200)' }}></div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-6 py-3 text-sm font-medium transition-all duration-200 hover:bg-red-50"
                      style={{ color: '#dc2626' }}
                    >
                      <LogOut className="h-4 w-4 mr-3" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setShowLoginDropdown(!showLoginDropdown)}
                  className="btn-primary flex items-center space-x-2"
                >
                  <span>Login</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
                
                {showLoginDropdown && (
                  <div className="absolute right-0 mt-3 w-56 rounded-2xl shadow-xl py-2 z-50 border-2"
                       style={{ 
                         backgroundColor: 'var(--warm-white)',
                         borderColor: 'var(--brown-200)'
                       }}>
                    <Link
                      href="/login"
                      className="block px-6 py-3 text-sm font-medium transition-all duration-200 hover:bg-gradient-warm"
                      style={{ color: 'var(--brown-700)' }}
                      onClick={() => setShowLoginDropdown(false)}
                    >
                      👤 Login as User
                    </Link>
                    <Link
                      href="/login"
                      className="block px-6 py-3 text-sm font-medium transition-all duration-200 hover:bg-gradient-warm"
                      style={{ color: 'var(--brown-700)' }}
                      onClick={() => setShowLoginDropdown(false)}
                    >
                      🏘️ Login as Agent
                    </Link>
                    <Link
                      href="/login"
                      className="block px-6 py-3 text-sm font-medium transition-all duration-200 hover:bg-gradient-warm"
                      style={{ color: 'var(--brown-700)' }}
                      onClick={() => setShowLoginDropdown(false)}
                    >
                      👑 Login as Admin
                    </Link>
                    <div className="border-t mx-4 my-2" style={{ borderColor: 'var(--brown-200)' }}></div>
                    <Link
                      href="/signup"
                      className="block px-6 py-3 text-sm font-bold transition-all duration-200 hover:bg-gradient-warm text-gold-gradient"
                      onClick={() => setShowLoginDropdown(false)}
                    >
                      ✨ Sign Up
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