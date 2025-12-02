'use client';

import { useState, useEffect } from 'react';
import Link from "next/link";
import { Search, MapPin, Star, Home } from "lucide-react";
import Header from "@/components/Header";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Header />

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Find Your Dream Home
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Discover the perfect property with our comprehensive real estate platform. 
            Search, explore, and connect with the best properties in your area.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search by location, property type, or keyword..."
                className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <Link 
            href="/properties"
            className="inline-flex items-center px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            <MapPin className="mr-2 h-5 w-5" />
            Explore Properties
          </Link>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-8 rounded-xl shadow-lg border">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Search className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Advanced Search</h3>
            <p className="text-gray-600">
              Filter properties by location, price, type, and more to find exactly what you're looking for.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg border">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <MapPin className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Interactive Maps</h3>
            <p className="text-gray-600">
              Explore properties on interactive maps with satellite views and location-based filtering.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg border">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <Star className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Save Favorites</h3>
            <p className="text-gray-600">
              Save your favorite properties and get notified about similar listings in your area.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-blue-600 rounded-2xl p-8 md:p-12 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Find Your Perfect Home?
          </h2>
          <p className="text-xl opacity-90 mb-8">
            Join thousands of satisfied customers who found their dream properties with us.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/properties"
              className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Browse Properties
            </Link>
            {user?.role === 'ADMIN' && (
              <Link 
                href="/admin"
                className="px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-colors"
              >
                List Your Property
              </Link>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Home className="h-6 w-6" />
                <span className="text-lg font-bold">Realty Website</span>
              </div>
              <p className="text-gray-400">
                Your trusted partner in finding the perfect property.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <div className="space-y-2">
                <Link href="/properties" className="block text-gray-400 hover:text-white">Properties</Link>
                <Link href="/contact" className="block text-gray-400 hover:text-white">Contact</Link>
                {user?.role === 'ADMIN' && (
                  <Link href="/admin" className="block text-gray-400 hover:text-white">Admin</Link>
                )}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Property Types</h3>
              <div className="space-y-2">
                <span className="block text-gray-400">Houses</span>
                <span className="block text-gray-400">Apartments</span>
                <span className="block text-gray-400">Commercial</span>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Contact Info</h3>
              <div className="space-y-2">
                <p className="text-gray-400">📧 info@realtywebsite.com</p>
                <p className="text-gray-400">📞 (555) 123-4567</p>
                <p className="text-gray-400">📍 Local Development</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">© 2025 Realty Website. Built for Vibe Coding Competition.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
