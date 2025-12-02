'use client';

import { useState } from 'react';
import Link from "next/link";
import AdminGuard from "@/components/AdminGuard";
import { 
  Save,
  X,
  Upload,
  User,
  Mail,
  Phone,
  Shield,
  MapPin,
  Building,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  UserPlus
} from "lucide-react";

interface UserFormData {
  name: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  department: string;
  joiningDate: string;
  salary: string;
  profileImage: File | null;
  emergencyContact: string;
  emergencyPhone: string;
  notes: string;
}

const USER_ROLES = [
  { value: 'user', label: 'User', description: 'Regular user with basic access' },
  { value: 'agent', label: 'Agent', description: 'Property agent with sales access' },
  { value: 'admin', label: 'Admin', description: 'Full administrative access' }
];

const USER_STATUS = [
  { value: 'active', label: 'Active', color: 'text-green-600' },
  { value: 'pending', label: 'Pending', color: 'text-yellow-600' },
  { value: 'inactive', label: 'Inactive', color: 'text-red-600' }
];

const DEPARTMENTS = [
  'Sales',
  'Marketing', 
  'Operations',
  'Customer Service',
  'Finance',
  'Human Resources',
  'IT Support',
  'Legal'
];

const CHENNAI_AREAS = [
  'Adyar',
  'Anna Nagar',
  'Besant Nagar',
  'Mylapore',
  'T. Nagar',
  'Velachery',
  'OMR (IT Corridor)',
  'ECR (East Coast Road)',
  'Nungambakkam',
  'Express Avenue',
  'Guindy',
  'Tambaram',
  'Chromepet',
  'Pallavaram',
  'Sholinganallur'
];

export default function AddUserPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);
  
  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    email: '',
    phone: '',
    role: 'user',
    status: 'active',
    address: '',
    city: 'Chennai',
    state: 'Tamil Nadu',
    zipCode: '',
    department: '',
    joiningDate: new Date().toISOString().split('T')[0],
    salary: '',
    profileImage: null,
    emergencyContact: '',
    emergencyPhone: '',
    notes: ''
  });

  const handleInputChange = (field: keyof UserFormData, value: string | File | null) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.name && formData.email && formData.phone);
      case 2:
        return !!(formData.role && formData.status && formData.department);
      case 3:
        return !!(formData.address && formData.city && formData.zipCode);
      case 4:
        return true; // Optional step
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep) && currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simulate API call with realistic delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create the complete user object for local storage (simulating API)
      const newUser = {
        id: String(Date.now()),
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
        status: formData.status,
        department: formData.department,
        joiningDate: formData.joiningDate,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        emergencyContact: formData.emergencyContact,
        emergencyPhone: formData.emergencyPhone,
        salary: formData.salary,
        notes: formData.notes,
        createdAt: new Date().toISOString(),
        propertiesCount: 0,
        lastLogin: null
      };
      
      // Store in localStorage for the admin users page to pick up
      // In real implementation, this would be an API call
      localStorage.setItem('newUserCreated', JSON.stringify(newUser));
      
      setSubmitStatus('success');
      setTimeout(() => {
        window.location.href = '/admin/users?newUser=created';
      }, 2000);
      
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3, 4].map((step, index) => (
        <div key={step} className="flex items-center">
          <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
            step <= currentStep 
              ? 'border-blue-500 bg-blue-500 text-white' 
              : 'border-gray-300 text-gray-400'
          }`}>
            {step < currentStep ? <CheckCircle className="h-5 w-5" /> : step}
          </div>
          {index < 3 && (
            <div className={`w-16 h-0.5 ${
              step < currentStep ? 'bg-blue-500' : 'bg-gray-300'
            }`} />
          )}
        </div>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <User className="h-5 w-5 mr-2 text-blue-600" />
          Basic Information
        </h3>
        <p className="text-sm text-gray-600 mb-6">Enter the user's basic details and contact information.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="Enter full name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            required
            placeholder="user@example.com"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            required
            placeholder="+91 90000 00000"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Shield className="h-5 w-5 mr-2 text-blue-600" />
          Role & Access
        </h3>
        <p className="text-sm text-gray-600 mb-6">Configure user role, permissions, and employment details.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            User Role <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.role}
            onChange={(e) => handleInputChange('role', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {USER_ROLES.map(role => (
              <option key={role.value} value={role.value}>{role.label}</option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">
            {USER_ROLES.find(r => r.value === formData.role)?.description}
          </p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Account Status <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.status}
            onChange={(e) => handleInputChange('status', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {USER_STATUS.map(status => (
              <option key={status.value} value={status.value}>{status.label}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Department <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.department}
            onChange={(e) => handleInputChange('department', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select Department</option>
            {DEPARTMENTS.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Joining Date
          </label>
          <input
            type="date"
            value={formData.joiningDate}
            onChange={(e) => handleInputChange('joiningDate', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <MapPin className="h-5 w-5 mr-2 text-blue-600" />
          Address Information
        </h3>
        <p className="text-sm text-gray-600 mb-6">Provide the user's address and location details.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Address <span className="text-red-500">*</span>
          </label>
          <textarea
            required
            rows={3}
            placeholder="Enter full address"
            value={formData.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Area/Location
          </label>
          <select
            value={formData.city}
            onChange={(e) => handleInputChange('city', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="Chennai">Chennai</option>
            {CHENNAI_AREAS.map(area => (
              <option key={area} value={area}>{area}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            PIN Code <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="600001"
            value={formData.zipCode}
            onChange={(e) => handleInputChange('zipCode', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Building className="h-5 w-5 mr-2 text-blue-600" />
          Additional Details
        </h3>
        <p className="text-sm text-gray-600 mb-6">Optional additional information and emergency contacts.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Emergency Contact Name
          </label>
          <input
            type="text"
            placeholder="Emergency contact person"
            value={formData.emergencyContact}
            onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Emergency Phone
          </label>
          <input
            type="tel"
            placeholder="+91 90000 00000"
            value={formData.emergencyPhone}
            onChange={(e) => handleInputChange('emergencyPhone', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Monthly Salary (₹)
          </label>
          <input
            type="number"
            placeholder="50000"
            value={formData.salary}
            onChange={(e) => handleInputChange('salary', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Profile Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleInputChange('profileImage', e.target.files?.[0] || null)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notes
          </label>
          <textarea
            rows={4}
            placeholder="Additional notes about the user..."
            value={formData.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );

  if (submitStatus === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">User Created Successfully!</h2>
            <p className="text-gray-600 mb-6">
              The new user account has been created and added to the system.
            </p>
            <Link
              href="/admin/users"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              View All Users
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (submitStatus === 'error') {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <AlertCircle className="mx-auto h-16 w-16 text-red-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Creation Failed</h2>
            <p className="text-gray-600 mb-6">
              There was an error creating the user account. Please try again.
            </p>
            <button
              onClick={() => setSubmitStatus(null)}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AdminGuard>
      <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <UserPlus className="h-6 w-6 mr-2 text-blue-600" />
                Add New User
              </h1>
              <p className="text-gray-600 mt-1">Create a new user account with detailed information</p>
            </div>
            <Link
              href="/admin/users"
              className="flex items-center px-4 py-2 text-gray-600 bg-white rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            {renderStepIndicator()}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Step {currentStep} of 4: {
                  currentStep === 1 ? 'Basic Information' :
                  currentStep === 2 ? 'Role & Access' :
                  currentStep === 3 ? 'Address Information' :
                  'Additional Details'
                }
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
            {currentStep === 4 && renderStep4()}

            <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
              <div>
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={handlePrevious}
                    className="flex items-center px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Previous
                  </button>
                )}
              </div>
              
              <div className="flex space-x-3">
                {currentStep < 4 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={!validateStep(currentStep)}
                    className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                        Creating User...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Create User
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
    </AdminGuard>
  );
}