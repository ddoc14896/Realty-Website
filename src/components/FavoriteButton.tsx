'use client';

/**
 * FavoriteButton Component - Interactive Wishlist Toggle
 * 
 * A reusable heart-shaped button component that allows users to add/remove
 * properties from their favorites/wishlist. Works for both authenticated
 * and anonymous users with visual feedback and loading states.
 * 
 * Features:
 * - Heart icon with filled/unfilled states
 * - Multiple size options (sm, md, lg)
 * - Loading state during API calls
 * - Customizable styling with className prop
 * - Optional tooltip support
 * - Automatic state synchronization with FavoritesContext
 * 
 * Usage: Place on property cards, property detail pages, or any property listing
 */

import { Heart } from 'lucide-react';
import { useFavorites } from '@/contexts/FavoritesContext';

interface FavoriteButtonProps {
  propertyId: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showTooltip?: boolean;
}

export default function FavoriteButton({ 
  propertyId, 
  size = 'md', 
  className = '',
  showTooltip = false 
}: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite, loading } = useFavorites();
  const isFav = isFavorite(propertyId);

  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };

  const buttonSizeClasses = {
    sm: 'p-1',
    md: 'p-2',
    lg: 'p-3'
  };

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!loading) {
      await toggleFavorite(propertyId);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`
        ${buttonSizeClasses[size]}
        bg-white rounded-full shadow-md hover:bg-gray-50 transition-all duration-200 
        ${loading ? 'opacity-50 cursor-wait' : 'hover:scale-110'}
        ${isFav ? 'bg-red-50 hover:bg-red-100' : ''}
        ${className}
      `}
      title={showTooltip ? (isFav ? 'Remove from favorites' : 'Add to favorites') : undefined}
    >
      <Heart 
        className={`
          ${sizeClasses[size]} 
          transition-colors duration-200
          ${isFav ? 'text-red-500 fill-red-500' : 'text-gray-600 hover:text-red-500'}
          ${loading ? 'animate-pulse' : ''}
        `} 
      />
    </button>
  );
}