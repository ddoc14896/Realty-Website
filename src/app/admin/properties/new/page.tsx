'use client';

import { useState } from 'react';
import Link from "next/link";
import AdminGuard from "@/components/AdminGuard";
import { 
  Save,
  X,
  Upload,
  MapPin,
  Home,
  IndianRupee,
  Calendar,
  Square,
  Bed,
  Bath,
  Car,
  Wifi,
  Zap,
  Shield,
  Trees,
  Waves,
  Sun,
  CheckCircle,
  AlertCircle
} from "lucide-react";

interface PropertyFormData {
  title: string;
  description: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  latitude: string;
  longitude: string;
  price: string;
  propertyType: string;
  status: string;
  bedrooms: string;
  bathrooms: string;
  squareFeet: string;
  yearBuilt: string;
  parking: string;
  amenities: string[];
  images: File[];
}

const PROPERTY_TYPES = [
  { value: 'HOUSE', label: 'Independent House' },
  { value: 'APARTMENT', label: 'Apartment' },
  { value: 'VILLA', label: 'Villa' },
  { value: 'PENTHOUSE', label: 'Penthouse' },
  { value: 'STUDIO', label: 'Studio' },
  { value: 'DUPLEX', label: 'Duplex' },
  { value: 'PLOT', label: 'Plot/Land' }
];

const STATUS_OPTIONS = [
  { value: 'FOR_SALE', label: 'For Sale' },
  { value: 'FOR_RENT', label: 'For Rent' },
  { value: 'SOLD', label: 'Sold' },
  { value: 'RENTED', label: 'Rented' }
];

const AMENITIES_LIST = [
  { id: 'parking', label: 'Car Parking', icon: Car },
  { id: 'wifi', label: 'Wi-Fi', icon: Wifi },
  { id: 'power_backup', label: 'Power Backup', icon: Zap },
  { id: 'security', label: '24/7 Security', icon: Shield },
  { id: 'garden', label: 'Garden/Landscaping', icon: Trees },
  { id: 'swimming_pool', label: 'Swimming Pool', icon: Waves },
  { id: 'solar_panels', label: 'Solar Panels', icon: Sun },
  { id: 'gym', label: 'Gym/Fitness Center', icon: Home },
  { id: 'elevator', label: 'Elevator', icon: Home },
  { id: 'balcony', label: 'Balcony', icon: Home },
  { id: 'terrace', label: 'Terrace', icon: Home },
  { id: 'modular_kitchen', label: 'Modular Kitchen', icon: Home }
];

const CHENNAI_LOCATIONS = [
  'Adyar', 'Anna Nagar', 'Besant Nagar', 'Chepauk', 'Egmore', 'Guindy',
  'Kodambakkam', 'Mylapore', 'Nungambakkam', 'OMR (Old Mahabalipuram Road)',
  'Porur', 'T. Nagar', 'Vadapalani', 'Velachery', 'Marina Beach Area'
];

export default function AddNewPropertyPage() {
  const [formData, setFormData] = useState<PropertyFormData>({
    title: '',
    description: '',
    address: '',
    city: 'Chennai',
    state: 'Tamil Nadu',
    zipCode: '',
    latitude: '',
    longitude: '',
    price: '',
    propertyType: 'APARTMENT',
    status: 'FOR_SALE',
    bedrooms: '2',
    bathrooms: '2',
    squareFeet: '',
    yearBuilt: '',
    parking: '1',
    amenities: [],
    images: []
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  const totalSteps = 4;

  const handleInputChange = (field: keyof PropertyFormData, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleAmenityToggle = (amenityId: string) => {
    const currentAmenities = formData.amenities;
    const newAmenities = currentAmenities.includes(amenityId)
      ? currentAmenities.filter(id => id !== amenityId)
      : [...currentAmenities, amenityId];
    handleInputChange('amenities', newAmenities);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData(prev => ({ ...prev, images: [...prev.images, ...files] }));
    
    // Create preview URLs
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImages(prev => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
    setPreviewImages(prev => prev.filter((_, i) => i !== index));
  };

  const validateStep = (step: number): boolean => {
    const newErrors: {[key: string]: string} = {};

    switch (step) {
      case 1:
        if (!formData.title.trim()) newErrors.title = 'Property title is required';
        if (!formData.propertyType) newErrors.propertyType = 'Property type is required';
        if (!formData.price.trim()) newErrors.price = 'Price is required';
        if (formData.price && isNaN(Number(formData.price))) newErrors.price = 'Price must be a valid number';
        break;
      case 2:
        if (!formData.address.trim()) newErrors.address = 'Address is required';
        if (!formData.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';
        break;
      case 3:
        if (!formData.bedrooms.trim()) newErrors.bedrooms = 'Number of bedrooms is required';
        if (!formData.bathrooms.trim()) newErrors.bathrooms = 'Number of bathrooms is required';
        if (!formData.squareFeet.trim()) newErrors.squareFeet = 'Square footage is required';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setSaving(true);
    try {
      const submitData = {
        ...formData,
        price: Number(formData.price),
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        squareFeet: Number(formData.squareFeet),
        yearBuilt: formData.yearBuilt ? Number(formData.yearBuilt) : undefined,
        latitude: formData.latitude ? Number(formData.latitude) : undefined,
        longitude: formData.longitude ? Number(formData.longitude) : undefined,
        parking: Number(formData.parking)
      };

      const response = await fetch('/api/properties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      if (response.ok) {
        alert('Property added successfully!');
        window.location.href = '/admin/properties';
      } else {
        throw new Error('Failed to create property');
      }
    } catch (error) {
      alert('Error creating property. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const getStepTitle = (step: number) => {
    switch (step) {
      case 1: return 'Basic Information';
      case 2: return 'Location Details';
      case 3: return 'Property Features';
      case 4: return 'Amenities & Images';
      default: return '';
    }
  };

  return (
    <AdminGuard>
      <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/admin/properties" className="flex items-center space-x-2">
              <span className="text-xl font-bold text-gray-900">🏠 Add New Property</span>
            </Link>
            <nav className="flex space-x-8">
              <Link href="/admin/properties" className="text-gray-700 hover:text-brown-600 font-medium">
                Back to Properties
              </Link>
              <Link href="/admin" className="text-gray-700 hover:text-brown-600 font-medium">
                Admin
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {Array.from({ length: totalSteps }, (_, index) => {
              const stepNumber = index + 1;
              const isActive = stepNumber === currentStep;
              const isCompleted = stepNumber < currentStep;
              
              return (
                <div key={stepNumber} className="flex items-center">
                  <div 
                    className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                      isCompleted 
                        ? 'bg-green-600 border-green-600 text-white'
                        : isActive 
                        ? 'text-white'
                        : 'border-gray-300 text-gray-400'
                    }`}
                    style={isActive ? { borderColor: 'var(--brown-600)', backgroundColor: 'var(--brown-600)' } : {}}
                  >
                    {isCompleted ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <span className="text-sm font-medium">{stepNumber}</span>
                    )}
                  </div>
                  <div className="ml-3 hidden sm:block">
                    <p 
                      className={`text-sm font-medium ${
                        isCompleted ? 'text-green-600' : 'text-gray-500'
                      }`}
                      style={isActive ? { color: 'var(--brown-600)' } : {}}
                    >
                      Step {stepNumber}
                    </p>
                    <p className="text-xs text-gray-500">{getStepTitle(stepNumber)}</p>
                  </div>
                  {index < totalSteps - 1 && (
                    <div className={`hidden sm:block w-16 h-0.5 mx-4 ${
                      stepNumber < currentStep ? 'bg-green-600' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {getStepTitle(currentStep)}
          </h2>

          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g., Luxury 3BHK Apartment in Anna Nagar"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className={`form-input ${
                    errors.title ? 'border-red-500' : ''
                  }`}
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.title}
                  </p>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Property Type *
                  </label>
                  <select
                    value={formData.propertyType}
                    onChange={(e) => handleInputChange('propertyType', e.target.value)}
                    className="form-input"
                  >
                    {PROPERTY_TYPES.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status *
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="form-input"
                  >
                    {STATUS_OPTIONS.map(status => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price (₹) *
                </label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="15000000"
                    value={formData.price}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, '');
                      handleInputChange('price', value);
                    }}
                    className={`form-input pl-12 ${
                      errors.price ? 'border-red-500' : ''
                    }`}
                  />
                </div>
                {formData.price && !isNaN(Number(formData.price)) && (
                  <p className="mt-1 text-sm text-gray-500">
                    Preview: ₹{Number(formData.price).toLocaleString('en-IN')}
                  </p>
                )}
                {errors.price && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.price}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  rows={4}
                  placeholder="Describe the property features, location benefits, and unique selling points..."
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="form-input"
                />
              </div>
            </div>
          )}

          {/* Step 2: Location Details */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Address *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
                  <textarea
                    rows={3}
                    placeholder="e.g., 15, 6th Avenue, Besant Nagar Beach Road"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className={`form-input pl-12 ${
                      errors.address ? 'border-red-500' : ''
                    }`}
                  />
                </div>
                {errors.address && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.address}
                  </p>
                )}
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className="form-input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State
                  </label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    className="form-input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ZIP Code *
                  </label>
                  <input
                    type="text"
                    placeholder="600090"
                    value={formData.zipCode}
                    onChange={(e) => handleInputChange('zipCode', e.target.value)}
                    className={`form-input ${
                      errors.zipCode ? 'border-red-500' : ''
                    }`}
                  />
                  {errors.zipCode && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.zipCode}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Area/Locality (Chennai)
                </label>
                <select
                  value={formData.address.includes(',') ? '' : formData.address}
                  onChange={(e) => {
                    if (e.target.value) {
                      handleInputChange('address', e.target.value + ', Chennai');
                    }
                  }}
                  className="form-input"
                >
                  <option value="">Select area or type custom address above</option>
                  {CHENNAI_LOCATIONS.map(location => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Latitude (Optional)
                  </label>
                  <input
                    type="number"
                    step="any"
                    placeholder="13.0827"
                    value={formData.latitude}
                    onChange={(e) => handleInputChange('latitude', e.target.value)}
                    className="form-input"
                  />
                  <p className="mt-1 text-xs text-gray-500">For map display</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Longitude (Optional)
                  </label>
                  <input
                    type="number"
                    step="any"
                    placeholder="80.2707"
                    value={formData.longitude}
                    onChange={(e) => handleInputChange('longitude', e.target.value)}
                    className="form-input"
                  />
                  <p className="mt-1 text-xs text-gray-500">For map display</p>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Property Features */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bedrooms *
                  </label>
                  <div className="relative">
                    <Bed className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <select
                      value={formData.bedrooms}
                      onChange={(e) => handleInputChange('bedrooms', e.target.value)}
                      className={`form-input pl-12 ${
                        errors.bedrooms ? 'border-red-500' : ''
                      }`}
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                        <option key={num} value={num}>{num} Bedroom{num > 1 ? 's' : ''}</option>
                      ))}
                    </select>
                  </div>
                  {errors.bedrooms && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.bedrooms}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bathrooms *
                  </label>
                  <div className="relative">
                    <Bath className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <select
                      value={formData.bathrooms}
                      onChange={(e) => handleInputChange('bathrooms', e.target.value)}
                      className={`form-input pl-12 ${
                        errors.bathrooms ? 'border-red-500' : ''
                      }`}
                    >
                      {[1, 2, 3, 4, 5, 6].map(num => (
                        <option key={num} value={num}>{num} Bathroom{num > 1 ? 's' : ''}</option>
                      ))}
                    </select>
                  </div>
                  {errors.bathrooms && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.bathrooms}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Square Feet *
                  </label>
                  <div className="relative">
                    <Square className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="number"
                      placeholder="1200"
                      value={formData.squareFeet}
                      onChange={(e) => handleInputChange('squareFeet', e.target.value)}
                      className={`form-input pl-12 ${
                        errors.squareFeet ? 'border-red-500' : ''
                      }`}
                    />
                  </div>
                  {errors.squareFeet && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.squareFeet}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Year Built
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="number"
                      placeholder="2020"
                      min="1900"
                      max="2025"
                      value={formData.yearBuilt}
                      onChange={(e) => handleInputChange('yearBuilt', e.target.value)}
                      className="form-input pl-12"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Car Parking
                </label>
                <div className="relative">
                  <Car className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <select
                    value={formData.parking}
                    onChange={(e) => handleInputChange('parking', e.target.value)}
                    className="form-input pl-12"
                  >
                    <option value="0">No Parking</option>
                    {[1, 2, 3, 4, 5].map(num => (
                      <option key={num} value={num}>{num} Car{num > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Amenities & Images */}
          {currentStep === 4 && (
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Select Amenities</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {AMENITIES_LIST.map(amenity => {
                    const Icon = amenity.icon;
                    const isSelected = formData.amenities.includes(amenity.id);
                    
                    return (
                      <button
                        key={amenity.id}
                        type="button"
                        onClick={() => handleAmenityToggle(amenity.id)}
                        className={`flex items-center space-x-3 p-4 border-2 rounded-lg transition-all ${
                          isSelected 
                            ? 'border-brown-500 bg-brown-50 text-brown-700' 
                            : 'border-gray-200 hover:border-brown-300 text-gray-700'
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        <span className="text-sm font-medium">{amenity.label}</span>
                        {isSelected && <CheckCircle className="h-4 w-4 ml-auto" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Property Images</h3>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-lg text-gray-900">Upload Property Images</p>
                    <p className="text-sm text-gray-500">Drag and drop or click to browse</p>
                  </label>
                </div>

                {previewImages.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                    {previewImages.map((src, index) => (
                      <div key={index} className="relative">
                        <img
                          src={src}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <button
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
            <div>
              {currentStep > 1 && (
                <button
                  onClick={prevStep}
                  className="flex items-center space-x-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-brown-50 transition-colors"
                >
                  <span>Previous</span>
                </button>
              )}
            </div>

            <div className="text-sm text-gray-500">
              Step {currentStep} of {totalSteps}
            </div>

            <div>
              {currentStep < totalSteps ? (
                <button
                  onClick={nextStep}
                  className="btn-primary flex items-center space-x-2"
                >
                  <span>Next</span>
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={saving}
                  className="btn-primary flex items-center space-x-2 disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      <span>Creating...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      <span>Create Property</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
    </AdminGuard>
  );
}