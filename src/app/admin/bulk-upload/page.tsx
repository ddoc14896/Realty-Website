'use client';

import { useState, useRef } from 'react';
import Link from "next/link";
import AdminGuard from "@/components/AdminGuard";
import { 
  Upload,
  Download,
  FileText,
  CheckCircle,
  AlertCircle,
  X,
  RefreshCw
} from "lucide-react";

interface UploadResult {
  success: boolean;
  message: string;
  processed: number;
  errors: Array<{
    row: number;
    field: string;
    message: string;
  }>;
}

export default function AdminBulkUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<UploadResult | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const selectedFile = files[0];
      if (selectedFile.type === 'text/csv' || selectedFile.name.endsWith('.csv')) {
        setFile(selectedFile);
        setResult(null);
      } else {
        alert('Please select a CSV file');
      }
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const selectedFile = files[0];
      if (selectedFile.type === 'text/csv' || selectedFile.name.endsWith('.csv')) {
        setFile(selectedFile);
        setResult(null);
      } else {
        alert('Please select a CSV file');
      }
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/bulk-upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        message: 'Upload failed. Please try again.',
        processed: 0,
        errors: []
      });
    } finally {
      setUploading(false);
    }
  };

  const downloadSample = () => {
    const sampleData = [
      'title,description,address,city,state,zipCode,latitude,longitude,price,propertyType,status,bedrooms,bathrooms,squareFeet,yearBuilt',
      'Beautiful Villa,Spacious villa with garden,123 Main St,Chennai,Tamil Nadu,600001,13.0827,80.2707,15000000,HOUSE,FOR_SALE,4,3,2500,2020',
      'Modern Apartment,Contemporary apartment in city center,456 Park Ave,Chennai,Tamil Nadu,600002,13.0878,80.2785,8000000,APARTMENT,FOR_SALE,2,2,1200,2021'
    ];
    
    const csvContent = sampleData.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'property_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const clearFile = () => {
    setFile(null);
    setResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <AdminGuard>
      <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/admin" className="flex items-center space-x-2">
              <span className="text-xl font-bold text-gray-900">🏠 Admin - Bulk Upload</span>
            </Link>
            <nav className="flex space-x-8">
              <Link href="/" className="text-gray-700 hover:text-brown-600 font-medium">
                Home
              </Link>
              <Link href="/admin" className="text-gray-700 hover:text-brown-600 font-medium">
                Admin
              </Link>
              <button className="bg-red-100 text-red-600 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors">
                Logout
              </button>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Bulk Property Upload</h1>
          <p className="text-gray-600 mt-2">Upload multiple properties using a CSV file</p>
        </div>

        {/* Instructions */}
        <div className="bg-brown-50 border border-brown-200 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-brown-900 mb-4">Upload Instructions</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-brown-800 mb-2">Required Fields:</h4>
              <ul className="text-sm text-brown-700 space-y-1">
                <li>• title - Property title</li>
                <li>• address - Street address</li>
                <li>• city - City name</li>
                <li>• state - State/Province</li>
                <li>• price - Property price (in INR)</li>
                <li>• propertyType - HOUSE, APARTMENT, VILLA, etc.</li>
                <li>• status - FOR_SALE, FOR_RENT, SOLD, RENTED</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-brown-800 mb-2">Optional Fields:</h4>
              <ul className="text-sm text-brown-700 space-y-1">
                <li>• description - Property description</li>
                <li>• zipCode - Postal code</li>
                <li>• latitude, longitude - GPS coordinates</li>
                <li>• bedrooms, bathrooms - Room counts</li>
                <li>• squareFeet - Property size</li>
                <li>• yearBuilt - Construction year</li>
              </ul>
            </div>
          </div>
          <div className="mt-4">
            <button
              onClick={downloadSample}
              className="btn-primary inline-flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>Download Sample CSV</span>
            </button>
          </div>
        </div>

        {/* Upload Area */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="space-y-6">
            {/* File Drop Zone */}
            <div
              className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive
                  ? 'border-brown-500 bg-brown-50'
                  : file
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {file ? (
                <div className="flex items-center justify-center space-x-4">
                  <FileText className="h-12 w-12 text-green-600" />
                  <div className="text-left">
                    <p className="text-lg font-medium text-green-900">{file.name}</p>
                    <p className="text-sm text-green-600">
                      {(file.size / 1024).toFixed(1)} KB • Ready to upload
                    </p>
                  </div>
                  <button
                    onClick={clearFile}
                    className="text-red-600 hover:text-red-800"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              ) : (
                <div>
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4">
                    <p className="text-lg text-gray-900">Drop your CSV file here</p>
                    <p className="text-sm text-gray-500 mt-1">or click to browse</p>
                  </div>
                </div>
              )}
              
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileInput}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>

            {/* Upload Button */}
            {file && (
              <div className="text-center">
                <button
                  onClick={handleUpload}
                  disabled={uploading}
                  className="btn-primary inline-flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? (
                    <>
                      <RefreshCw className="h-5 w-5 animate-spin" />
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="h-5 w-5" />
                      <span>Upload Properties</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Upload Results */}
        {result && (
          <div className={`mt-8 rounded-lg p-6 ${
            result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
          }`}>
            <div className="flex items-start space-x-3">
              {result.success ? (
                <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
              ) : (
                <AlertCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" />
              )}
              <div className="flex-1">
                <h3 className={`text-lg font-semibold ${
                  result.success ? 'text-green-900' : 'text-red-900'
                }`}>
                  {result.success ? 'Upload Successful' : 'Upload Failed'}
                </h3>
                <p className={`mt-1 ${result.success ? 'text-green-700' : 'text-red-700'}`}>
                  {result.message}
                </p>
                
                {result.processed > 0 && (
                  <p className={`mt-2 text-sm ${result.success ? 'text-green-600' : 'text-red-600'}`}>
                    {result.processed} properties processed successfully
                  </p>
                )}

                {result.errors.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-red-900 mb-2">
                      Errors found ({result.errors.length}):
                    </h4>
                    <div className="bg-white border border-red-200 rounded-md p-3 max-h-40 overflow-y-auto">
                      {result.errors.map((error, index) => (
                        <div key={index} className="text-sm text-red-700 py-1">
                          Row {error.row}: {error.field} - {error.message}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {result.success && (
                  <div className="mt-4">
                    <Link
                      href="/admin/properties"
                      className="inline-flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <span>View Properties</span>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Upload History */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Uploads</h3>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-gray-200 last:border-b-0">
                <div className="flex items-center space-x-3">
                  <FileText className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      properties_batch_{i}.csv
                    </p>
                    <p className="text-xs text-gray-500">
                      Uploaded {i} days ago • {Math.floor(Math.random() * 50) + 10} properties
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                    Success
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    </AdminGuard>
  );
}