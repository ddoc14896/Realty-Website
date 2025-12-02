/**
 * Favorites API Routes - Wishlist Management Backend
 * 
 * Provides RESTful API endpoints for managing user favorites/wishlist.
 * Supports both authenticated users (via userId) and anonymous users (via sessionId).
 * 
 * Endpoints:
 * - GET: Retrieve user's favorite properties
 * - POST: Add property to favorites
 * - DELETE: Remove property from favorites
 * 
 * Features:
 * - Dual user support (authenticated & anonymous)
 * - In-memory storage (replace with database in production)
 * - Automatic session ID generation for anonymous users
 * - Error handling and validation
 * - CORS-friendly JSON responses
 */

import { NextRequest, NextResponse } from 'next/server'

// In-memory favorites storage (in production, this would be in a database)
// Key: userId or sessionId, Value: array of property IDs
const userFavorites = new Map<string, string[]>()

/**
 * Generate a unique session ID for anonymous users
 * Format: anonymous_[random]_[timestamp]
 */
function generateSessionId(): string {
  return 'anonymous_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const sessionId = searchParams.get('sessionId')
    
    const identifier = userId || sessionId;
    
    if (!identifier) {
      return NextResponse.json(
        { error: 'User ID or Session ID is required' },
        { status: 400 }
      )
    }

    const favorites = userFavorites.get(identifier) || []
    
    return NextResponse.json({
      userId: identifier,
      favorites,
      count: favorites.length,
      isAnonymous: !userId
    })
  } catch (error) {
    console.error('Error fetching favorites:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { userId, sessionId, propertyId } = data
    
    const identifier = userId || sessionId;
    
    if (!identifier || !propertyId) {
      return NextResponse.json(
        { error: 'User ID/Session ID and Property ID are required' },
        { status: 400 }
      )
    }

    // Get current favorites for user/session
    const currentFavorites = userFavorites.get(identifier) || []
    
    // Check if property is already favorited
    if (currentFavorites.includes(propertyId)) {
      return NextResponse.json(
        { error: 'Property is already in favorites' },
        { status: 400 }
      )
    }

    // Add property to favorites
    const updatedFavorites = [...currentFavorites, propertyId]
    userFavorites.set(identifier, updatedFavorites)

    return NextResponse.json({
      message: 'Property added to favorites',
      userId: identifier,
      propertyId,
      favorites: updatedFavorites,
      count: updatedFavorites.length,
      isAnonymous: !userId
    })
  } catch (error) {
    console.error('Error adding to favorites:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const sessionId = searchParams.get('sessionId')
    const propertyId = searchParams.get('propertyId')
    
    const identifier = userId || sessionId;
    
    if (!identifier || !propertyId) {
      return NextResponse.json(
        { error: 'User ID/Session ID and Property ID are required' },
        { status: 400 }
      )
    }

    // Get current favorites for user/session
    const currentFavorites = userFavorites.get(identifier) || []
    
    // Remove property from favorites
    const updatedFavorites = currentFavorites.filter(id => id !== propertyId)
    userFavorites.set(identifier, updatedFavorites)

    return NextResponse.json({
      message: 'Property removed from favorites',
      userId: identifier,
      propertyId,
      favorites: updatedFavorites,
      count: updatedFavorites.length,
      isAnonymous: !userId
    })
  } catch (error) {
    console.error('Error removing from favorites:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}