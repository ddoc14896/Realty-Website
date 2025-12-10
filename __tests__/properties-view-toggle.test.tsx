/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import PropertiesPage from '../src/app/properties/page';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
}));

// Mock components
jest.mock('../src/components/Header', () => {
  return function Header() {
    return <div data-testid="header">Header</div>;
  };
});

jest.mock('../src/components/search/PropertySearch', () => {
  return function PropertySearch({ onSearch }: { onSearch: (filters: any) => void }) {
    return (
      <div data-testid="property-search">
        <button onClick={() => onSearch({ query: 'test' })}>Search</button>
      </div>
    );
  };
});

jest.mock('../src/components/FavoriteButton', () => {
  return function FavoriteButton({ propertyId }: { propertyId: string }) {
    return <button data-testid={`favorite-${propertyId}`}>♡</button>;
  };
});

// Mock fetch API
global.fetch = jest.fn();

const mockPropertiesResponse = {
  properties: [
    {
      id: '1',
      title: 'Luxury Villa in Besant Nagar',
      address: '123 Beach Road',
      city: 'Chennai',
      state: 'Tamil Nadu',
      zipCode: '600090',
      price: 15000000,
      propertyType: 'Villa',
      bedrooms: 4,
      bathrooms: 3,
      squareFeet: 3500,
      images: [
        {
          url: 'https://example.com/image1.jpg',
          alt: 'Villa Image',
          isPrimary: true,
        },
      ],
    },
    {
      id: '2',
      title: 'Modern Apartment in T. Nagar',
      address: '456 Main Street',
      city: 'Chennai',
      state: 'Tamil Nadu',
      zipCode: '600017',
      price: 8500000,
      propertyType: 'Apartment',
      bedrooms: 2,
      bathrooms: 2,
      squareFeet: 1200,
      images: [
        {
          url: 'https://example.com/image2.jpg',
          alt: 'Apartment Image',
          isPrimary: true,
        },
      ],
    },
  ],
  pagination: {
    page: 1,
    limit: 12,
    totalResults: 2,
    totalPages: 1,
    hasNext: false,
    hasPrev: false,
  },
};

describe('Properties Page - View Toggle Functionality', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockPropertiesResponse,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders grid view by default', async () => {
    render(<PropertiesPage />);
    
    // Wait for properties to load
    await waitFor(() => {
      expect(screen.getByText('Luxury Villa in Besant Nagar')).toBeInTheDocument();
    });

    // Check if grid view button is active
    const gridButton = screen.getByTitle('Grid View');
    const listButton = screen.getByTitle('List View');
    
    expect(gridButton).toHaveClass('active');
    expect(listButton).not.toHaveClass('active');
  });

  test('switches to list view when list button is clicked', async () => {
    render(<PropertiesPage />);
    
    // Wait for properties to load
    await waitFor(() => {
      expect(screen.getByText('Luxury Villa in Besant Nagar')).toBeInTheDocument();
    });

    // Click list view button
    const listButton = screen.getByTitle('List View');
    fireEvent.click(listButton);

    // Check if list view button is now active
    expect(listButton).toHaveClass('active');
    
    // Check if grid view button is no longer active
    const gridButton = screen.getByTitle('Grid View');
    expect(gridButton).not.toHaveClass('active');
  });

  test('switches back to grid view when grid button is clicked', async () => {
    render(<PropertiesPage />);
    
    // Wait for properties to load
    await waitFor(() => {
      expect(screen.getByText('Luxury Villa in Besant Nagar')).toBeInTheDocument();
    });

    // Switch to list view first
    const listButton = screen.getByTitle('List View');
    fireEvent.click(listButton);
    expect(listButton).toHaveClass('active');

    // Switch back to grid view
    const gridButton = screen.getByTitle('Grid View');
    fireEvent.click(gridButton);
    
    expect(gridButton).toHaveClass('active');
    expect(listButton).not.toHaveClass('active');
  });

  test('applies correct CSS classes for list view layout', async () => {
    render(<PropertiesPage />);
    
    // Wait for properties to load
    await waitFor(() => {
      expect(screen.getByText('Luxury Villa in Besant Nagar')).toBeInTheDocument();
    });

    // Switch to list view
    const listButton = screen.getByTitle('List View');
    fireEvent.click(listButton);

    // Check if the container has the correct classes
    const container = document.querySelector('.list-container');
    expect(container).toBeInTheDocument();
    expect(container).toHaveClass('space-y-6');
  });

  test('applies correct CSS classes for grid view layout', async () => {
    render(<PropertiesPage />);
    
    // Wait for properties to load
    await waitFor(() => {
      expect(screen.getByText('Luxury Villa in Besant Nagar')).toBeInTheDocument();
    });

    // Grid view should be default, but let's make sure
    const gridButton = screen.getByTitle('Grid View');
    fireEvent.click(gridButton);

    // Check if the container has grid classes
    const container = document.querySelector('div[class*="grid"]');
    expect(container).toBeInTheDocument();
  });

  test('displays properties in both view modes', async () => {
    render(<PropertiesPage />);
    
    // Wait for properties to load
    await waitFor(() => {
      expect(screen.getByText('Luxury Villa in Besant Nagar')).toBeInTheDocument();
      expect(screen.getByText('Modern Apartment in T. Nagar')).toBeInTheDocument();
    });

    // Switch to list view and verify properties are still displayed
    const listButton = screen.getByTitle('List View');
    fireEvent.click(listButton);

    await waitFor(() => {
      expect(screen.getByText('Luxury Villa in Besant Nagar')).toBeInTheDocument();
      expect(screen.getByText('Modern Apartment in T. Nagar')).toBeInTheDocument();
    });

    // Switch back to grid view and verify properties are still displayed
    const gridButton = screen.getByTitle('Grid View');
    fireEvent.click(gridButton);

    await waitFor(() => {
      expect(screen.getByText('Luxury Villa in Besant Nagar')).toBeInTheDocument();
      expect(screen.getByText('Modern Apartment in T. Nagar')).toBeInTheDocument();
    });
  });

  test('maintains view state during property interactions', async () => {
    render(<PropertiesPage />);
    
    // Wait for properties to load
    await waitFor(() => {
      expect(screen.getByText('Luxury Villa in Besant Nagar')).toBeInTheDocument();
    });

    // Switch to list view
    const listButton = screen.getByTitle('List View');
    fireEvent.click(listButton);
    expect(listButton).toHaveClass('active');

    // Interact with a property (click favorite button)
    const favoriteButton = screen.getByTestId('favorite-1');
    fireEvent.click(favoriteButton);

    // Verify list view is still active
    expect(listButton).toHaveClass('active');
  });

  test('view toggle buttons have proper accessibility attributes', async () => {
    render(<PropertiesPage />);
    
    const gridButton = screen.getByTitle('Grid View');
    const listButton = screen.getByTitle('List View');

    expect(gridButton).toHaveAttribute('title', 'Grid View');
    expect(listButton).toHaveAttribute('title', 'List View');
  });

  test('handles loading state correctly in both views', async () => {
    // Mock a delayed fetch response
    (global.fetch as jest.Mock).mockImplementation(
      () => new Promise(resolve => 
        setTimeout(() => resolve({
          ok: true,
          json: async () => mockPropertiesResponse,
        }), 100)
      )
    );

    render(<PropertiesPage />);
    
    // Should show loading skeletons
    const loadingElements = document.querySelectorAll('.animate-pulse');
    expect(loadingElements.length).toBeGreaterThan(0);

    // Switch views during loading
    const listButton = screen.getByTitle('List View');
    fireEvent.click(listButton);
    
    // Loading elements should adapt to list view
    await waitFor(() => {
      const listLoadingElements = document.querySelectorAll('.flex.animate-pulse');
      expect(listLoadingElements.length).toBeGreaterThan(0);
    });
  });
});