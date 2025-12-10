'use client';

import { useState, useEffect } from 'react';
import Link from "next/link";
import { Search, MapPin, Star, Home, Compass } from "lucide-react";
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
    <div className="min-h-screen bg-gradient-warm bg-pattern">
      <Header />

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16 fade-in">
          <div className="mb-8">
            <span className="inline-block px-6 py-2 rounded-full text-sm font-semibold mb-6 property-badge">
              🏆 Premium Real Estate Experience
            </span>
          </div>
          <h1 className="heading-hero mb-8">
            Discover Your 
            <span className="text-gold-gradient"> Perfect </span>
            Sanctuary
          </h1>
          <p className="text-xl mb-12 max-w-4xl mx-auto leading-relaxed" style={{ color: 'var(--brown-600)' }}>
            Embark on a journey to find exceptional properties that resonate with your lifestyle. 
            Our curated selection offers luxury, comfort, and unmatched quality in every detail.
          </p>
          
          {/* Enhanced Search Bar */}
          <div className="max-w-3xl mx-auto mb-12">
            <div className="relative group">
              <input
                type="text"
                placeholder="Enter location, property type, or your dream home features..."
                className="form-input pl-6 pr-6 py-6 text-lg shadow-xl w-full group-hover:shadow-2xl"
                style={{ 
                  fontSize: '1.1rem',
                  borderRadius: '1rem'
                }}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <button className="btn-accent px-8 py-3">
                  Search
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link 
              href="/properties"
              className="btn-primary inline-flex items-center text-lg px-10 py-4 pulse-gold"
            >
              <MapPin className="mr-3 h-6 w-6" />
              Explore Properties
            </Link>
            <Link 
              href="/properties/map"
              className="btn-secondary inline-flex items-center text-lg px-10 py-4"
            >
              <Home className="mr-3 h-6 w-6" />
              View on Map
            </Link>
          </div>
        </div>

        {/* Enhanced Feature Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-20 slide-in-left">
          <div className="card p-10 text-center group hover:scale-105">
            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center transition-all duration-300"
                 style={{ backgroundColor: 'var(--brown-100)' }}>
              <Search className="h-8 w-8" style={{ color: 'var(--brown-700)' }} />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-gradient">Intelligent Search</h3>
            <p className="text-warm leading-relaxed">
              Our AI-powered search understands your preferences, filtering through thousands of properties 
              to present only the most relevant matches for your lifestyle.
            </p>
            <div className="mt-6 pt-6 border-t" style={{ borderColor: 'var(--brown-200)' }}>
              <span className="text-sm font-semibold" style={{ color: 'var(--soft-gold)' }}>
                ✨ Smart Matching Algorithm
              </span>
            </div>
          </div>

          <div className="card p-10 text-center group hover:scale-105">
            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center transition-all duration-300"
                 style={{ backgroundColor: 'var(--brown-100)' }}>
              <Compass className="h-8 w-8" style={{ color: 'var(--brown-700)' }} />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-gradient">Interactive Discovery</h3>
            <p className="text-warm leading-relaxed">
              Immerse yourself in detailed property exploration with satellite imagery, 
              street views, and neighborhood insights at your fingertips.
            </p>
            <div className="mt-6 pt-6 border-t" style={{ borderColor: 'var(--brown-200)' }}>
              <span className="text-sm font-semibold" style={{ color: 'var(--soft-gold)' }}>
                🗺️ Premium Map Experience
              </span>
            </div>
          </div>

          <div className="card p-10 text-center group hover:scale-105">
            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center transition-all duration-300"
                 style={{ backgroundColor: 'var(--brown-100)' }}>
              <Star className="h-8 w-8" style={{ color: 'var(--brown-700)' }} />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-gradient">Curated Collections</h3>
            <p className="text-warm leading-relaxed">
              Build your personal portfolio of dream properties with our intelligent 
              wishlist system that learns and suggests similar exceptional homes.
            </p>
            <div className="mt-6 pt-6 border-t" style={{ borderColor: 'var(--brown-200)' }}>
              <span className="text-sm font-semibold" style={{ color: 'var(--soft-gold)' }}>
                💖 Personalized Recommendations
              </span>
            </div>
          </div>
        </div>

        {/* Enhanced CTA Section */}
        <div className="bg-gradient-brown rounded-3xl p-12 md:p-16 text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="mb-8">
              <span className="inline-block px-6 py-2 rounded-full text-sm font-semibold mb-6" 
                    style={{ backgroundColor: 'var(--soft-gold)', color: 'white' }}>
                🏡 Your Dream Awaits
              </span>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Ready to Begin Your
              <span className="block text-gold-gradient">Property Journey?</span>
            </h2>
            <p className="text-xl opacity-90 mb-12 max-w-3xl mx-auto leading-relaxed">
              Join our exclusive community of discerning homeowners who discovered their 
              perfect sanctuary through our premium real estate platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link 
                href="/properties"
                className="px-10 py-4 bg-white font-bold rounded-xl hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105 text-lg"
                style={{ color: 'var(--brown-800)' }}
              >
                🏠 Browse Properties
              </Link>
              {user?.role === 'ADMIN' && (
                <Link 
                  href="/admin"
                  className="px-10 py-4 border-2 border-white text-white font-bold rounded-xl hover:bg-white transition-all duration-300 transform hover:scale-105 text-lg"
                  style={{ ':hover': { color: 'var(--brown-800)' } }}
                >
                  🎯 Admin Dashboard
                </Link>
              )}
              <Link 
                href="/contact"
                className="px-10 py-4 border-2 border-white text-white font-bold rounded-xl hover:bg-white transition-all duration-300 transform hover:scale-105 text-lg"
                style={{ ':hover': { color: 'var(--brown-800)' } }}
              >
                💬 Get In Touch
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Enhanced Footer */}
      <footer className="mt-20" style={{ backgroundColor: 'var(--brown-900)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-4 gap-12">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 rounded-2xl" style={{ backgroundColor: 'var(--soft-gold)' }}>
                  <Home className="h-8 w-8 text-white" />
                </div>
                <div>
                  <span className="text-2xl font-bold text-white">UrbanNest</span>
                  <p className="text-sm" style={{ color: 'var(--soft-gold)' }}>Premium Real Estate</p>
                </div>
              </div>
              <p className="text-lg leading-relaxed mb-6" style={{ color: 'var(--brown-300)' }}>
                Crafting exceptional real estate experiences through innovation, 
                expertise, and unwavering commitment to finding your perfect home.
              </p>
              <div className="flex space-x-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 cursor-pointer" 
                     style={{ backgroundColor: 'var(--brown-800)' }}>
                  <span className="text-white">📘</span>
                </div>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 cursor-pointer" 
                     style={{ backgroundColor: 'var(--brown-800)' }}>
                  <span className="text-white">📸</span>
                </div>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 cursor-pointer" 
                     style={{ backgroundColor: 'var(--brown-800)' }}>
                  <span className="text-white">🐦</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-bold mb-6 text-white text-lg">Quick Navigation</h3>
              <div className="space-y-4">
                <Link href="/properties" className="block font-medium transition-all duration-200 hover:translate-x-2" 
                      style={{ color: 'var(--brown-300)' }}>
                  🏠 Properties
                </Link>
                <Link href="/properties/map" className="block font-medium transition-all duration-200 hover:translate-x-2" 
                      style={{ color: 'var(--brown-300)' }}>
                  🗺️ Map View
                </Link>
                <Link href="/favorites" className="block font-medium transition-all duration-200 hover:translate-x-2" 
                      style={{ color: 'var(--brown-300)' }}>
                  💖 Favorites
                </Link>
                <Link href="/contact" className="block font-medium transition-all duration-200 hover:translate-x-2" 
                      style={{ color: 'var(--brown-300)' }}>
                  📞 Contact
                </Link>
                {user?.role === 'ADMIN' && (
                  <Link href="/admin" className="block font-medium transition-all duration-200 hover:translate-x-2" 
                        style={{ color: 'var(--soft-gold)' }}>
                    👑 Admin Panel
                  </Link>
                )}
              </div>
            </div>

            <div>
              <h3 className="font-bold mb-6 text-white text-lg">Property Portfolio</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--soft-gold)' }}></span>
                  <span style={{ color: 'var(--brown-300)' }}>Luxury Homes</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--soft-gold)' }}></span>
                  <span style={{ color: 'var(--brown-300)' }}>Modern Apartments</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--soft-gold)' }}></span>
                  <span style={{ color: 'var(--brown-300)' }}>Commercial Spaces</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--soft-gold)' }}></span>
                  <span style={{ color: 'var(--brown-300)' }}>Investment Properties</span>
                </div>
              </div>
              
              <div className="mt-8 p-4 rounded-xl" style={{ backgroundColor: 'var(--brown-800)' }}>
                <h4 className="font-semibold text-white mb-2">📧 Stay Updated</h4>
                <p className="text-sm mb-3" style={{ color: 'var(--brown-300)' }}>
                  Get premium property alerts
                </p>
                <p style={{ color: 'var(--soft-gold)' }}>info@urbannest.com</p>
              </div>
            </div>
          </div>
          
          <div className="border-t mt-12 pt-8 text-center" style={{ borderColor: 'var(--brown-800)' }}>
            <p style={{ color: 'var(--brown-400)' }}>
              © 2025 UrbanNest Realty. Crafted with ❤️ for Vibe Coding Competition.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
