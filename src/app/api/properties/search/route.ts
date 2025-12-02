import { NextRequest, NextResponse } from 'next/server'
import { sampleProperties } from '@/lib/sample-data'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || ''
    const location = searchParams.get('location')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const propertyType = searchParams.get('type')
    const bedrooms = searchParams.get('bedrooms')
    const bathrooms = searchParams.get('bathrooms')
    const status = searchParams.get('status')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    
    let filteredProperties = [...sampleProperties]
    
    // Text search in title and description
    if (query) {
      const searchTerm = query.toLowerCase()
      filteredProperties = filteredProperties.filter(property =>
        property.title.toLowerCase().includes(searchTerm) ||
        property.description.toLowerCase().includes(searchTerm) ||
        property.address.toLowerCase().includes(searchTerm)
      )
    }
    
    // Location filter
    if (location) {
      filteredProperties = filteredProperties.filter(property =>
        property.city.toLowerCase().includes(location.toLowerCase()) ||
        property.state.toLowerCase().includes(location.toLowerCase())
      )
    }
    
    // Price range filter
    if (minPrice) {
      filteredProperties = filteredProperties.filter(property =>
        property.price >= parseInt(minPrice)
      )
    }
    
    if (maxPrice) {
      filteredProperties = filteredProperties.filter(property =>
        property.price <= parseInt(maxPrice)
      )
    }
    
    // Property type filter
    if (propertyType) {
      filteredProperties = filteredProperties.filter(property =>
        property.propertyType.toLowerCase() === propertyType.toLowerCase()
      )
    }
    
    // Bedrooms filter
    if (bedrooms) {
      const bedroomCount = parseInt(bedrooms)
      if (bedroomCount > 0) {
        filteredProperties = filteredProperties.filter(property =>
          property.bedrooms === bedroomCount
        )
      }
    }
    
    // Bathrooms filter
    if (bathrooms) {
      const bathroomCount = parseFloat(bathrooms)
      if (bathroomCount > 0) {
        filteredProperties = filteredProperties.filter(property =>
          property.bathrooms >= bathroomCount
        )
      }
    }
    
    // Status filter
    if (status) {
      filteredProperties = filteredProperties.filter(property =>
        property.status.toLowerCase() === status.toLowerCase()
      )
    }
    
    // Pagination
    const totalResults = filteredProperties.length
    const totalPages = Math.ceil(totalResults / limit)
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedProperties = filteredProperties.slice(startIndex, endIndex)
    
    return NextResponse.json({
      properties: paginatedProperties,
      pagination: {
        page,
        limit,
        totalResults,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      },
      filters: {
        query,
        location,
        minPrice,
        maxPrice,
        propertyType,
        bedrooms,
        bathrooms,
        status
      }
    })
  } catch (error) {
    console.error('Error searching properties:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}