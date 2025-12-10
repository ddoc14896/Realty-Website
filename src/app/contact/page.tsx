'use client';

import { useState, useEffect } from 'react';
import Link from "next/link";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import Header from "@/components/Header";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function ContactPage() {
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16 fade-in">
          <h1 className="heading-section">Let's Connect</h1>
          <p className="text-xl text-warm max-w-3xl mx-auto leading-relaxed">
            Ready to find your perfect home? Our expert team is here to guide you through 
            every step of your real estate journey.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Enhanced Contact Form */}
          <div className="card p-10">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gradient mb-3">📧 Send us a Message</h2>
              <p className="text-warm">We'll get back to you within 24 hours</p>
            </div>
            
            <form className="space-y-8">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-bold mb-3" style={{ color: 'var(--brown-700)' }}>
                    👤 First Name *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    required
                    className="form-input p-4"
                    placeholder="Enter your first name"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-bold mb-3" style={{ color: 'var(--brown-700)' }}>
                    👤 Last Name *
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    required
                    className="form-input p-4"
                    placeholder="Enter your last name"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-bold mb-3" style={{ color: 'var(--brown-700)' }}>
                  📧 Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  className="form-input p-4"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-bold mb-3" style={{ color: 'var(--brown-700)' }}>
                  📞 Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  className="form-input p-4"
                  placeholder="(555) 123-4567"
                />
              </div>

              <div>
                <label htmlFor="propertyType" className="block text-sm font-bold mb-3" style={{ color: 'var(--brown-700)' }}>
                  🏡 Interested In
                </label>
                <select
                  id="propertyType"
                  className="form-input p-4"
                >
                  <option value="">Select your interest...</option>
                  <option value="buying">🏠 Buying a Property</option>
                  <option value="selling">💰 Selling a Property</option>
                  <option value="renting">🔑 Renting a Property</option>
                  <option value="investment">📈 Investment Opportunities</option>
                  <option value="general">💬 General Inquiry</option>
                </select>
              </div>

              <div>
                <label htmlFor="budget" className="block text-sm font-bold mb-3" style={{ color: 'var(--brown-700)' }}>
                  💰 Budget Range
                </label>
                <select
                  id="budget"
                  className="form-input p-4"
                >
                  <option value="">Select your budget...</option>
                  <option value="under-200k">💵 Under $200,000</option>
                  <option value="200k-500k">💰 $200,000 - $500,000</option>
                  <option value="500k-1m">💎 $500,000 - $1,000,000</option>
                  <option value="1m-2m">🏆 $1,000,000 - $2,000,000</option>
                  <option value="above-2m">👑 Above $2,000,000</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-bold mb-3" style={{ color: 'var(--brown-700)' }}>
                  💭 Message *
                </label>
                <textarea
                  id="message"
                  rows={6}
                  required
                  className="form-input p-4 min-h-[150px] resize-vertical"
                  placeholder="Tell us about your real estate needs and how our team can assist you..."
                ></textarea>
              </div>

              <button
                type="submit"
                className="btn-primary w-full py-4 px-8 text-lg font-semibold"
              >
                ✨ Send Message
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            {/* Contact Details */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-semibold mb-6">Contact Information</h2>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <Phone className="h-6 w-6 mt-1" style={{ color: 'var(--brown-600)' }} />
                  <div>
                    <h3 className="font-semibold">Phone</h3>
                    <p className="text-gray-600">(555) 123-4567</p>
                    <p className="text-gray-600">(555) 987-6543</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Mail className="h-6 w-6 mt-1" style={{ color: 'var(--brown-600)' }} />
                  <div>
                    <h3 className="font-semibold">Email</h3>
                    <p className="text-gray-600">info@realtywebsite.com</p>
                    <p className="text-gray-600">support@realtywebsite.com</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <MapPin className="h-6 w-6 mt-1" style={{ color: 'var(--brown-600)' }} />
                  <div>
                    <h3 className="font-semibold">Office Address</h3>
                    <p className="text-gray-600">
                      123 Real Estate Boulevard<br />
                      Suite 456<br />
                      Local Development City, ST 12345
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Clock className="h-6 w-6 mt-1" style={{ color: 'var(--brown-600)' }} />
                  <div>
                    <h3 className="font-semibold">Business Hours</h3>
                    <div className="text-gray-600 space-y-1">
                      <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                      <p>Saturday: 10:00 AM - 4:00 PM</p>
                      <p>Sunday: By Appointment</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <h3 className="text-xl font-semibold mb-4">Find Us</h3>
              <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Interactive map will be loaded here</p>
                  <p className="text-sm text-gray-400">Mapbox integration coming soon</p>
                </div>
              </div>
            </div>

            {/* Quick Tips */}
            <div className="bg-gradient-warm rounded-xl p-8 shadow-lg">
              <h3 className="text-xl font-bold mb-6" style={{ color: 'var(--brown-800)' }}>💡 Quick Tips</h3>
              <ul className="space-y-3 text-base" style={{ color: 'var(--brown-700)' }}>
                <li className="flex items-center space-x-3">
                  <span className="text-lg">📞</span>
                  <span>Include your preferred contact method</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="text-lg">🏠</span>
                  <span>Mention specific properties you're interested in</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="text-lg">📅</span>
                  <span>Let us know your timeline for buying/selling</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="text-lg">📊</span>
                  <span>Ask about our free market analysis</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-lg font-bold">🏠 Realty Website</span>
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