import { NextRequest, NextResponse } from 'next/server'
import { sampleProperties } from '@/lib/sample-data'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Pagination
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const skip = (page - 1) * limit

    // Filters
    const city = searchParams.get('city')
    const propertyType = searchParams.get('type')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const bedrooms = searchParams.get('bedrooms')
    const bathrooms = searchParams.get('bathrooms')
    const search = searchParams.get('search')

    // Filter sample properties
    let filteredProperties = sampleProperties.filter(property => property.status === 'ACTIVE')

    if (city) {
      filteredProperties = filteredProperties.filter(property => 
        property.city.toLowerCase().includes(city.toLowerCase())
      )
    }
    
    if (propertyType) {
      filteredProperties = filteredProperties.filter(property => 
        property.propertyType === propertyType
      )
    }
    
    if (minPrice) {
      filteredProperties = filteredProperties.filter(property => 
        property.price >= parseFloat(minPrice)
      )
    }
    
    if (maxPrice) {
      filteredProperties = filteredProperties.filter(property => 
        property.price <= parseFloat(maxPrice)
      )
    }
    
    if (bedrooms) {
      filteredProperties = filteredProperties.filter(property => 
        property.bedrooms >= parseInt(bedrooms)
      )
    }
    
    if (bathrooms) {
      filteredProperties = filteredProperties.filter(property => 
        property.bathrooms >= parseInt(bathrooms)
      )
    }
    
    if (search) {
      const searchLower = search.toLowerCase()
      filteredProperties = filteredProperties.filter(property => 
        property.title.toLowerCase().includes(searchLower) ||
        property.description.toLowerCase().includes(searchLower) ||
        property.address.toLowerCase().includes(searchLower) ||
        property.city.toLowerCase().includes(searchLower)
      )
    }

    // Apply pagination
    const total = filteredProperties.length
    const paginatedProperties = filteredProperties.slice(skip, skip + limit)

    return NextResponse.json({
      properties: paginatedProperties,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching properties:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    // Basic validation
    const requiredFields = ['title', 'address', 'city', 'state', 'zipCode', 'price', 'propertyType', 'latitude', 'longitude']
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        )
      }
    }

    // Generate slug from title
    const slug = data.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')

    // Create property object (in real app, this would save to database)
    const newProperty = {
      id: `new-${Date.now()}`,
      ...data,
      slug: `${slug}-${Date.now()}`,
      price: parseFloat(data.price),
      latitude: parseFloat(data.latitude),
      longitude: parseFloat(data.longitude),
      status: 'ACTIVE',
      images: [],
      owner: {
        name: 'Admin User',
        email: 'admin@realtywebsite.com'
      },
      createdAt: new Date(),
    }

    // In a real application, you would save this to the database
    // For now, we'll just return the created property
    return NextResponse.json(newProperty, { status: 201 })
  } catch (error) {
    console.error('Error creating property:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}