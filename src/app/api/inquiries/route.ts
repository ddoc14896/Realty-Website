import { NextRequest, NextResponse } from 'next/server'
import { sampleInquiries } from '@/lib/sample-data'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const propertyId = searchParams.get('propertyId')
    
    let filteredInquiries = [...sampleInquiries]
    
    if (status) {
      filteredInquiries = filteredInquiries.filter(inquiry => inquiry.status === status)
    }
    
    if (propertyId) {
      filteredInquiries = filteredInquiries.filter(inquiry => inquiry.propertyId === propertyId)
    }
    
    return NextResponse.json({
      inquiries: filteredInquiries,
      total: filteredInquiries.length
    })
  } catch (error) {
    console.error('Error fetching inquiries:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    // Validate required fields
    const requiredFields = ['name', 'email', 'message', 'propertyId']
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        )
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(data.email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Create new inquiry
    const newInquiry = {
      id: `inquiry-${Date.now()}`,
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      message: data.message,
      status: 'PENDING',
      propertyId: data.propertyId,
      userId: data.userId || null,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    // In a real app, you would save this to the database
    // For demo, we'll just return the created inquiry
    return NextResponse.json(newInquiry, { status: 201 })
  } catch (error) {
    console.error('Error creating inquiry:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const data = await request.json()
    
    if (!id) {
      return NextResponse.json(
        { error: 'Inquiry ID is required' },
        { status: 400 }
      )
    }

    // In a real app, you would update the inquiry in the database
    const updatedInquiry = {
      id,
      ...data,
      updatedAt: new Date()
    }

    return NextResponse.json(updatedInquiry)
  } catch (error) {
    console.error('Error updating inquiry:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}