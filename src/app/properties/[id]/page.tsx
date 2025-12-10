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
  const [shareSuccess, setShareSuccess] = useState(false);

  // Share functionality
  const handleShare = async () => {
    if (!property) return;
    
    const shareData = {
      title: property.title,
      text: `Check out this amazing ${property.propertyType} in ${property.city}! ${formatPrice(property.price)}`,
      url: window.location.href
    };

    try {
      // Check if Web Share API is supported
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(window.location.href);
        setShareSuccess(true);
        setTimeout(() => setShareSuccess(false), 3000);
      }
    } catch (error) {
      console.error('Error sharing:', error);
      // Fallback: try to copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        setShareSuccess(true);
        setTimeout(() => setShareSuccess(false), 3000);
      } catch (clipboardError) {
        console.error('Failed to copy to clipboard:', clipboardError);
      }
    }
  };

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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Property Not Found</h1>
          <p className="text-gray-600 mb-8">The property you're looking for doesn't exist.</p>
          <Link href="/properties" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
            Browse Properties
          </Link>
        </div>
      </div>
    );
  }

  const primaryImage = property.images.find((img: any) => img.isPrimary) || property.images[0];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <span>/</span>
            <Link href="/properties" className="hover:text-blue-600">Properties</Link>
            <span>/</span>
            <span className="text-gray-900">{property.title}</span>
          </div>
        </nav>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative">
                <div className="h-96 bg-gray-100 overflow-hidden">
                  <img 
                    src={`https://picsum.photos/800/600?random=${property.id}`}
                    alt={primaryImage?.alt || `Property ${property.id} main image`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `https://via.placeholder.com/800x600/3B82F6/FFFFFF?text=Property+Image`;
                    }}
                  />
                </div>
                
                {/* Action buttons */}
                <div className="absolute top-4 right-4 flex space-x-2">
                  <button 
                    className="p-3 rounded-full shadow-lg hover:shadow-xl border border-white border-opacity-30 transition-all duration-200"
                    style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(4px)' }}
                  >
                    <Heart className="h-5 w-5 text-red-400" />
                  </button>
                  <button 
                    onClick={handleShare}
                    className="p-3 rounded-full shadow-lg hover:shadow-xl relative border border-white border-opacity-30 transition-all duration-200"
                    style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(4px)' }}
                    title="Share this property"
                  >
                    <Share2 className="h-5 w-5 text-white" />
                    {shareSuccess && (
                      <div className="absolute -bottom-10 right-0 bg-green-500 text-white px-2 py-1 rounded text-xs whitespace-nowrap">
                        Link copied!
                      </div>
                    )}
                  </button>
                </div>

                {/* Price badge */}
                <div className="absolute bottom-4 left-4">
                  <span className="bg-blue-600 text-white px-4 py-2 rounded-lg text-xl font-bold">
                    {formatPrice(property.price)}
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
                    <button className="mt-3 text-blue-600 text-sm hover:text-blue-700 font-medium">
                      View all {property.images.length} photos →
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Property Details */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{property.title}</h1>
                  <p className="text-lg text-gray-600 flex items-center">
                    <MapPin className="h-5 w-5 mr-2" />
                    {property.address}, {property.city}, {property.state} {property.zipCode}
                  </p>
                </div>
                <div className="text-right">
                  <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    {property.status}
                  </span>
                </div>
              </div>

              {/* Key Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Bed className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{property.bedrooms}</div>
                  <div className="text-sm text-gray-600">Bedrooms</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Bath className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{property.bathrooms}</div>
                  <div className="text-sm text-gray-600">Bathrooms</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Square className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{property.squareFeet?.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Sq Ft</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Calendar className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{property.yearBuilt}</div>
                  <div className="text-sm text-gray-600">Year Built</div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-3">Description</h2>
                <p className="text-gray-700 leading-relaxed">{property.description}</p>
              </div>

              {/* Features */}
              {property.features && (
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-3">Features & Amenities</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    {property.features.amenities && (
                      <div>
                        <h3 className="font-medium mb-2">Amenities</h3>
                        <ul className="space-y-1">
                          {property.features.amenities.map((amenity: string, index: number) => (
                            <li key={index} className="flex items-center text-gray-700">
                              <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                              {amenity}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <div className="space-y-2">
                      {property.features.parking && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Parking:</span>
                          <span className="font-medium">{property.features.parking}</span>
                        </div>
                      )}
                      {property.features.heating && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Heating:</span>
                          <span className="font-medium">{property.features.heating}</span>
                        </div>
                      )}
                      {property.features.flooring && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Flooring:</span>
                          <span className="font-medium">{property.features.flooring}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Interactive Map */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Location & Neighborhood</h2>
              <InteractiveMap
                latitude={property.latitude}
                longitude={property.longitude}
                address={`${property.address}, ${property.city}, ${property.state} ${property.zipCode}`}
                title={property.title}
                className="h-80 w-full"
              />
              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div className="bg-gray-50 p-3 rounded">
                  <div className="font-medium text-gray-900">Neighborhood</div>
                  <div className="text-gray-600">{property.city}, {property.state}</div>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <div className="font-medium text-gray-900">Postal Code</div>
                  <div className="text-gray-600">{property.zipCode}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Form */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4">Interested in this property?</h3>
              
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <input
                    type="tel"
                    name="phone"
                    value={inquiryForm.phone}
                    onChange={handleInputChange}
                    placeholder="Phone Number (optional)"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
                    isSubmitting
                      ? 'bg-gray-400 text-white cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {isSubmitting ? 'Sending...' : 'Send Inquiry'}
                </button>
              </form>
            </div>

            {/* Agent Info */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4">Listed by</h3>
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-xl font-bold">
                    {property.owner.name.split(' ').map((n: string) => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{property.owner.name}</h4>
                  <p className="text-gray-600 text-sm">Licensed Real Estate Agent</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-700">(555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-700">{property.owner.email}</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t">
                <button className="w-full bg-gray-100 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors">
                  View Agent Profile
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4">Property Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Property Type:</span>
                  <span className="font-medium">{property.propertyType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Year Built:</span>
                  <span className="font-medium">{property.yearBuilt}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Square Feet:</span>
                  <span className="font-medium">{property.squareFeet?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Price per Sq Ft:</span>
                  <span className="font-medium">
                    {property.squareFeet ? formatPrice(property.price / property.squareFeet) : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Listed:</span>
                  <span className="font-medium">
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