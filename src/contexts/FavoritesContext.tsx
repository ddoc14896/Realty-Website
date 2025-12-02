'use client';

/**
 * Favorites Context - Global wishlist/favorites management
 * 
 * Provides a centralized system for managing user favorites that works both
 * for authenticated users (API-based) and anonymous users (localStorage-based).
 * Handles automatic synchronization when users log in.
 * 
 * Features:
 * - Anonymous user support via localStorage
 * - Authenticated user support via API
 * - Automatic sync when users log in
 * - Real-time updates across all components
 * - Error handling and graceful fallbacks
 */

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

// User interface for authenticated users
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

// Context interface defining all available favorites operations
interface FavoritesContextType {
  favorites: string[];
  loading: boolean;
  user: User | null;
  isFavorite: (propertyId: string) => boolean;
  addToFavorites: (propertyId: string) => Promise<void>;
  removeFromFavorites: (propertyId: string) => Promise<void>;
  toggleFavorite: (propertyId: string) => Promise<void>;
  getFavoritesCount: () => number;
  loadFavorites: () => Promise<void>;
  syncFavoritesOnLogin: (newUser: User) => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

interface FavoritesProviderProps {
  children: ReactNode;
}

/**
 * Favorites Provider Component
 * 
 * Wraps the application to provide global favorites functionality.
 * Manages state for both authenticated and anonymous users with automatic
 * synchronization when users log in.
 */
export const FavoritesProvider = ({ children }: FavoritesProviderProps) => {
  // Core state management
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  // Load user and initial favorites on mount
  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }

    // Load favorites - either from localStorage (anonymous) or API (logged in)
    loadFavorites();
  }, []);

  // Listen for user login/logout changes
  useEffect(() => {
    const handleStorageChange = () => {
      const userData = localStorage.getItem('user');
      const newUser = userData ? JSON.parse(userData) : null;
      
      if (JSON.stringify(newUser) !== JSON.stringify(user)) {
        setUser(newUser);
        loadFavorites();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for manual user state changes
    const interval = setInterval(handleStorageChange, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [user]);

  const loadFavorites = async () => {
    try {
      const userData = localStorage.getItem('user');
      
      if (userData) {
        // User is logged in - fetch from API
        const user = JSON.parse(userData);
        const response = await fetch(`/api/favorites?userId=${user.id}`);
        if (response.ok) {
          const data = await response.json();
          setFavorites(data.favorites || []);
        }
      } else {
        // Anonymous user - load from localStorage
        const localFavorites = localStorage.getItem('favorites');
        setFavorites(localFavorites ? JSON.parse(localFavorites) : []);
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
      // Fallback to localStorage
      const localFavorites = localStorage.getItem('favorites');
      setFavorites(localFavorites ? JSON.parse(localFavorites) : []);
    }
  };

  const addToFavorites = async (propertyId: string) => {
    if (favorites.includes(propertyId)) return;

    setLoading(true);
    try {
      const newFavorites = [...favorites, propertyId];
      setFavorites(newFavorites);

      const userData = localStorage.getItem('user');
      
      if (userData) {
        // User is logged in - save to API
        const user = JSON.parse(userData);
        const response = await fetch('/api/favorites', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId: user.id, propertyId }),
        });

        if (!response.ok) {
          // Revert on API error
          setFavorites(favorites);
          throw new Error('Failed to add to favorites');
        }
      } else {
        // Anonymous user - save to localStorage
        localStorage.setItem('favorites', JSON.stringify(newFavorites));
      }
    } catch (error) {
      console.error('Error adding to favorites:', error);
      // Revert on error
      setFavorites(favorites);
    } finally {
      setLoading(false);
    }
  };

  const removeFromFavorites = async (propertyId: string) => {
    if (!favorites.includes(propertyId)) return;

    setLoading(true);
    try {
      const newFavorites = favorites.filter(id => id !== propertyId);
      setFavorites(newFavorites);

      const userData = localStorage.getItem('user');
      
      if (userData) {
        // User is logged in - remove from API
        const user = JSON.parse(userData);
        const response = await fetch(`/api/favorites?userId=${user.id}&propertyId=${propertyId}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          // Revert on API error
          setFavorites(favorites);
          throw new Error('Failed to remove from favorites');
        }
      } else {
        // Anonymous user - update localStorage
        localStorage.setItem('favorites', JSON.stringify(newFavorites));
      }
    } catch (error) {
      console.error('Error removing from favorites:', error);
      // Revert on error
      setFavorites(favorites);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (propertyId: string) => {
    if (favorites.includes(propertyId)) {
      await removeFromFavorites(propertyId);
    } else {
      await addToFavorites(propertyId);
    }
  };

  const isFavorite = (propertyId: string) => {
    return favorites.includes(propertyId);
  };

  const getFavoritesCount = () => {
    return favorites.length;
  };

  // Sync localStorage favorites with API when user logs in
  const syncFavoritesOnLogin = async (newUser: User) => {
    try {
      const localFavorites = localStorage.getItem('favorites');
      if (localFavorites) {
        const favoritesArray = JSON.parse(localFavorites);
        
        // Sync each favorite to the API
        for (const propertyId of favoritesArray) {
          try {
            await fetch('/api/favorites', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ userId: newUser.id, propertyId }),
            });
          } catch (error) {
            console.error(`Error syncing favorite ${propertyId}:`, error);
          }
        }
        
        // Clear localStorage favorites after sync
        localStorage.removeItem('favorites');
        
        // Reload favorites from API
        await loadFavorites();
      }
    } catch (error) {
      console.error('Error syncing favorites on login:', error);
    }
  };

  const value: FavoritesContextType = {
    favorites,
    loading,
    user,
    isFavorite,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    getFavoritesCount,
    loadFavorites,
    syncFavoritesOnLogin,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};