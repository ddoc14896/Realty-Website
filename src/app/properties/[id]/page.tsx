'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { MapPin, Bed, Bath, Square, Calendar, Heart, Share2, Phone, Mail } from "lucide-react";
import { sampleProperties } from "@/lib/sample-data";
import { formatPrice } from "@/lib/utils";
import InteractiveMap from "@/components/maps/InteractiveMap";
import Header from "@/components/Header";

export default function PropertyDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Inquiry form state
  const [inquiryForm, setInquiryForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  useEffect(() => {
    const foundProperty = sampleProperties.find(p => p.id === id);
    setProperty(foundProperty);
    setLoading(false);
    
    // Set default message when property is loaded
    if (foundProperty) {
      setInquiryForm(prev => ({
        ...prev,
        message: `I'm interested in ${foundProperty.title} at ${foundProperty.address}.`
      }));
    }
  }, [id]);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setInquiryForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmitInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...inquiryForm,
          propertyId: property?.id,
        }),
      });

      if (response.ok) {
        setSubmitMessage('Thank you! Your inquiry has been sent successfully. We will contact you soon.');
        setInquiryForm({
          name: '',
          email: '',
          phone: '',
          message: `I'm interested in ${property.title} at ${property.address}.`
        });
      } else {
        const errorData = await response.json();
        setSubmitMessage(`Error: ${errorData.error || 'Failed to send inquiry'}`);
      }
    } catch (error) {
      setSubmitMessage('Error: Unable to send inquiry. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gradient-warm flex items-center justify-center">
        <div className="card max-w-md mx-auto p-12 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center"
               style={{ backgroundColor: 'var(--brown-100)' }}>
            <span className="text-3xl">🏠</span>
          </div>
          <h1 className="text-3xl font-bold mb-4 text-gradient">Property Not Found</h1>
          <p className="text-warm mb-8 leading-relaxed">The property you're looking for doesn't exist or may have been removed.</p>
          <Link href="/properties" className="btn-primary">
            🔍 Browse Properties
          </Link>
        </div>
      </div>
    );
  }

  const primaryImage = property.images.find((img: any) => img.isPrimary) || property.images[0];

  return (
    <div className="min-h-screen bg-gradient-warm bg-pattern">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Enhanced Breadcrumb */}
        <nav className="mb-8">
          <div className="card p-4">
            <div className="flex items-center space-x-3 text-sm">
              <Link href="/" className="nav-link text-sm">🏠 Home</Link>
              <span style={{ color: 'var(--brown-400)' }}>→</span>
              <Link href="/properties" className="nav-link text-sm">🏘️ Properties</Link>
              <span style={{ color: 'var(--brown-400)' }}>→</span>
              <span className="font-semibold" style={{ color: 'var(--brown-800)' }}>{property.title}</span>
            </div>
          </div>
        </nav>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Enhanced Image Gallery */}
            <div className="property-card overflow-hidden">
              <div className="relative">
                <div className="h-[32rem] overflow-hidden" style={{ backgroundColor: 'var(--brown-100)' }}>
                  <img 
                    src={`https://picsum.photos/800/600?random=${property.id}`}
                    alt={primaryImage?.alt || `Property ${property.id} main image`}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `https://via.placeholder.com/800x600/a08875/FFFFFF?text=Property+Image`;
                    }}
                  />
                </div>
                
                {/* Enhanced Action buttons */}
                <div className="absolute top-6 right-6 flex space-x-3">
                  <button 
                    className="p-4 rounded-xl shadow-xl backdrop-blur-md transition-all duration-300 hover:scale-110"
                    style={{ backgroundColor: 'rgba(255,255,255,0.9)' }}
                  >
                    <Heart className="h-5 w-5" style={{ color: 'var(--brown-600)' }} />
                  </button>
                  <button 
                    className="p-4 rounded-xl shadow-xl backdrop-blur-md transition-all duration-300 hover:scale-110"
                    style={{ backgroundColor: 'rgba(255,255,255,0.9)' }}
                  >
                    <Share2 className="h-5 w-5" style={{ color: 'var(--brown-600)' }} />
                  </button>
                </div>

                {/* Enhanced Price badge */}
                <div className="absolute bottom-6 left-6">
                  <div className="property-badge px-6 py-3 text-xl font-bold shadow-2xl">
                    {formatPrice(property.price)}
                  </div>
                </div>

                {/* Property type badge */}
                <div className="absolute top-6 left-6">
                  <span className="px-4 py-2 rounded-xl text-sm font-semibold text-white shadow-lg"
                        style={{ backgroundColor: 'var(--brown-700)' }}>
                    ✨ {property.propertyType}
                  </span>
                </div>
              </div>
              
              {/* Additional Images Gallery */}
              {property.images && property.images.length > 1 && (
                <div className="px-6 pb-4">
                  <div className="grid grid-cols-4 gap-2">
                    {property.images.slice(1, 5).map((image: any, index: number) => (
                      <div key={index} className="aspect-square overflow-hidden rounded-lg">
                        <img 
                          src={`https://picsum.photos/300/300?random=${property.id}-${index + 1}`}
                          alt={image?.alt || `Property ${property.id} gallery image ${index + 1}`}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-200 cursor-pointer"
                          loading="lazy"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = `https://via.placeholder.com/300x300/6B7280/FFFFFF?text=Image+${index + 1}`;
                          }}
                        />
                      </div>
                    ))}
                  </div>
                  {property.images.length > 5 && (
                    <button className="mt-3 text-sm font-medium hover:underline transition-colors" style={{ color: 'var(--brown-600)' }}>
                      View all {property.images.length} photos →
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Property Details */}
            <div className="bg-gradient-warm rounded-xl shadow-lg p-8">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--brown-800)' }}>{property.title}</h1>
                  <p className="text-lg flex items-center" style={{ color: 'var(--brown-600)' }}>
                    <MapPin className="h-5 w-5 mr-2" />
                    {property.address}, {property.city}, {property.state} {property.zipCode}
                  </p>
                </div>
                <div className="text-right">
                  <span className="inline-block bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold">
                    ✨ {property.status}
                  </span>
                </div>
              </div>

              {/* Key Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-6 rounded-xl shadow-sm" style={{ backgroundColor: 'var(--brown-50)' }}>
                  <Bed className="h-8 w-8 mx-auto mb-3" style={{ color: 'var(--brown-600)' }} />
                  <div className="text-2xl font-bold" style={{ color: 'var(--brown-800)' }}>{property.bedrooms}</div>
                  <div className="text-sm font-medium" style={{ color: 'var(--brown-600)' }}>🛏️ Bedrooms</div>
                </div>
                <div className="text-center p-6 rounded-xl shadow-sm" style={{ backgroundColor: 'var(--brown-50)' }}>
                  <Bath className="h-8 w-8 mx-auto mb-3" style={{ color: 'var(--brown-600)' }} />
                  <div className="text-2xl font-bold" style={{ color: 'var(--brown-800)' }}>{property.bathrooms}</div>
                  <div className="text-sm font-medium" style={{ color: 'var(--brown-600)' }}>🚿 Bathrooms</div>
                </div>
                <div className="text-center p-6 rounded-xl shadow-sm" style={{ backgroundColor: 'var(--brown-50)' }}>
                  <Square className="h-8 w-8 mx-auto mb-3" style={{ color: 'var(--brown-600)' }} />
                  <div className="text-2xl font-bold" style={{ color: 'var(--brown-800)' }}>{property.squareFeet?.toLocaleString()}</div>
                  <div className="text-sm font-medium" style={{ color: 'var(--brown-600)' }}>📏 Sq Ft</div>
                </div>
                <div className="text-center p-6 rounded-xl shadow-sm" style={{ backgroundColor: 'var(--brown-50)' }}>
                  <Calendar className="h-8 w-8 mx-auto mb-3" style={{ color: 'var(--brown-600)' }} />
                  <div className="text-2xl font-bold" style={{ color: 'var(--brown-800)' }}>{property.yearBuilt}</div>
                  <div className="text-sm font-medium" style={{ color: 'var(--brown-600)' }}>🏠 Year Built</div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--brown-800)' }}>📝 Description</h2>
                <p className="leading-relaxed" style={{ color: 'var(--brown-700)' }}>{property.description}</p>
              </div>

              {/* Features */}
              {property.features && (
                <div className="mb-8">
                  <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--brown-800)' }}>✨ Features & Amenities</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    {property.features.amenities && (
                      <div>
                        <h3 className="font-semibold mb-3" style={{ color: 'var(--brown-700)' }}>🏠 Amenities</h3>
                        <ul className="space-y-2">
                          {property.features.amenities.map((amenity: string, index: number) => (
                            <li key={index} className="flex items-center" style={{ color: 'var(--brown-700)' }}>
                              <span className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: 'var(--brown-600)' }}></span>
                              {amenity}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <div className="space-y-2">
                      {property.features.parking && (
                        <div className="flex justify-between py-2">
                          <span style={{ color: 'var(--brown-600)' }}>🏿 Parking:</span>
                          <span className="font-semibold" style={{ color: 'var(--brown-800)' }}>{property.features.parking}</span>
                        </div>
                      )}
                      {property.features.heating && (
                        <div className="flex justify-between py-2">
                          <span style={{ color: 'var(--brown-600)' }}>🔥 Heating:</span>
                          <span className="font-semibold" style={{ color: 'var(--brown-800)' }}>{property.features.heating}</span>
                        </div>
                      )}
                      {property.features.flooring && (
                        <div className="flex justify-between py-2">
                          <span style={{ color: 'var(--brown-600)' }}>🏠 Flooring:</span>
                          <span className="font-semibold" style={{ color: 'var(--brown-800)' }}>{property.features.flooring}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Interactive Map */}
            <div className="bg-gradient-warm rounded-xl shadow-lg p-8">
              <h2 className="text-xl font-bold mb-6" style={{ color: 'var(--brown-800)' }}>🗺️ Location & Neighborhood</h2>
              <InteractiveMap
                latitude={property.latitude}
                longitude={property.longitude}
                address={`${property.address}, ${property.city}, ${property.state} ${property.zipCode}`}
                title={property.title}
                className="h-80 w-full"
              />
              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--brown-50)' }}>
                  <div className="font-semibold" style={{ color: 'var(--brown-800)' }}>🏠 Neighborhood</div>
                  <div style={{ color: 'var(--brown-600)' }}>{property.city}, {property.state}</div>
                </div>
                <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--brown-50)' }}>
                  <div className="font-semibold" style={{ color: 'var(--brown-800)' }}>📬 Postal Code</div>
                  <div style={{ color: 'var(--brown-600)' }}>{property.zipCode}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Form */}
            <div className="bg-gradient-warm rounded-xl shadow-lg p-8">
              <h3 className="text-xl font-bold mb-6" style={{ color: 'var(--brown-800)' }}>💬 Interested in this property?</h3>
              
              {submitMessage && (
                <div className={`p-4 rounded-lg mb-4 ${
                  submitMessage.includes('Error') 
                    ? 'bg-red-50 text-red-700 border border-red-200' 
                    : 'bg-green-50 text-green-700 border border-green-200'
                }`}>
                  {submitMessage}
                </div>
              )}
              
              <form className="space-y-4" onSubmit={handleSubmitInquiry}>
                <div>
                  <input
                    type="text"
                    name="name"
                    value={inquiryForm.name}
                    onChange={handleInputChange}
                    placeholder="Full Name"
                    required
                    className="form-input p-4"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    name="email"
                    value={inquiryForm.email}
                    onChange={handleInputChange}
                    placeholder="Email Address"
                    required
                    className="form-input p-4"
                  />
                </div>
                <div>
                  <input
                    type="tel"
                    name="phone"
                    value={inquiryForm.phone}
                    onChange={handleInputChange}
                    placeholder="Phone Number (optional)"
                    className="form-input p-4"
                  />
                </div>
                <div>
                  <textarea
                    rows={4}
                    name="message"
                    value={inquiryForm.message}
                    onChange={handleInputChange}
                    placeholder="Message"
                    required
                    className="form-input p-4 min-h-[120px] resize-vertical"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3 px-4 font-semibold transition-colors ${
                    isSubmitting
                      ? 'bg-gray-400 text-white cursor-not-allowed rounded-lg'
                      : 'btn-primary'
                  }`}
                >
                  {isSubmitting ? 'Sending...' : 'Send Inquiry'}
                </button>
              </form>
            </div>

            {/* Agent Info */}
            <div className="bg-gradient-warm rounded-xl shadow-lg p-8">
              <h3 className="text-xl font-bold mb-6" style={{ color: 'var(--brown-800)' }}>👥 Listed by</h3>
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--brown-100)' }}>
                  <span className="text-xl font-bold" style={{ color: 'var(--brown-600)' }}>
                    {property.owner.name.split(' ').map((n: string) => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <h4 className="font-bold" style={{ color: 'var(--brown-800)' }}>{property.owner.name}</h4>
                  <p className="text-sm font-medium" style={{ color: 'var(--brown-600)' }}>✨ Licensed Real Estate Agent</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5" style={{ color: 'var(--brown-500)' }} />
                  <span style={{ color: 'var(--brown-700)' }}>(555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5" style={{ color: 'var(--brown-500)' }} />
                  <span style={{ color: 'var(--brown-700)' }}>{property.owner.email}</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t">
                <button className="btn-secondary w-full py-3 px-4">
                  👤 View Agent Profile
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-gradient-warm rounded-xl shadow-lg p-8">
              <h3 className="text-xl font-bold mb-6" style={{ color: 'var(--brown-800)' }}>📋 Property Details</h3>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between py-2 border-b border-brown-200">
                  <span style={{ color: 'var(--brown-600)' }}>🏠 Property Type:</span>
                  <span className="font-semibold" style={{ color: 'var(--brown-800)' }}>{property.propertyType}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-brown-200">
                  <span style={{ color: 'var(--brown-600)' }}>📅 Year Built:</span>
                  <span className="font-semibold" style={{ color: 'var(--brown-800)' }}>{property.yearBuilt}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-brown-200">
                  <span style={{ color: 'var(--brown-600)' }}>📐 Square Feet:</span>
                  <span className="font-semibold" style={{ color: 'var(--brown-800)' }}>{property.squareFeet?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-brown-200">
                  <span style={{ color: 'var(--brown-600)' }}>💰 Price per Sq Ft:</span>
                  <span className="font-semibold" style={{ color: 'var(--brown-800)' }}>
                    {property.squareFeet ? formatPrice(property.price / property.squareFeet) : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span style={{ color: 'var(--brown-600)' }}>📋 Listed:</span>
                  <span className="font-semibold" style={{ color: 'var(--brown-800)' }}>
                    {property.createdAt.toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>© 2025 Realty Website. Built for Vibe Coding Competition.</p>
        </div>
      </footer>
    </div>
  );
}