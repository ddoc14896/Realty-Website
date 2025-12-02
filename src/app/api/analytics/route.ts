import { NextRequest, NextResponse } from 'next/server'
import { sampleProperties, sampleInquiries, sampleUsers } from '@/lib/sample-data'

export async function GET() {
  try {
    // Calculate analytics data
    const totalProperties = sampleProperties.length
    const activeListings = sampleProperties.filter(p => p.status === 'FOR_SALE').length
    const soldProperties = sampleProperties.filter(p => p.status === 'SOLD').length
    const rentProperties = sampleProperties.filter(p => p.status === 'FOR_RENT').length
    
    const totalInquiries = sampleInquiries.length
    const pendingInquiries = sampleInquiries.filter(i => i.status === 'PENDING').length
    const respondedInquiries = sampleInquiries.filter(i => i.status === 'RESPONDED').length
    
    const totalUsers = sampleUsers.length
    const activeUsers = sampleUsers.length // All users are considered active in sample data
    
    // Calculate average property price
    const totalPrice = sampleProperties.reduce((sum, p) => sum + p.price, 0)
    const averagePrice = totalPrice / totalProperties
    
    // Get property type distribution
    const propertyTypes = sampleProperties.reduce((acc, property) => {
      acc[property.propertyType] = (acc[property.propertyType] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    // Get recent activity (last 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    
    const recentProperties = sampleProperties.filter(p => 
      new Date(p.createdAt) >= sevenDaysAgo
    ).length
    
    const recentInquiries = sampleInquiries.filter(i => 
      new Date(i.createdAt) >= sevenDaysAgo
    ).length
    
    // Monthly trend (mock data for demo)
    const monthlyData = [
      { month: 'Jan', properties: 8, inquiries: 25 },
      { month: 'Feb', properties: 12, inquiries: 32 },
      { month: 'Mar', properties: 15, inquiries: 45 },
      { month: 'Apr', properties: 10, inquiries: 38 },
      { month: 'May', properties: 18, inquiries: 52 },
      { month: 'Jun', properties: 14, inquiries: 41 }
    ]
    
    // Top performing properties (by inquiry count)
    const propertyInquiryCounts = sampleInquiries.reduce((acc, inquiry) => {
      acc[inquiry.propertyId] = (acc[inquiry.propertyId] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    const topProperties = sampleProperties
      .map(property => ({
        ...property,
        inquiryCount: propertyInquiryCounts[property.id] || 0
      }))
      .sort((a, b) => b.inquiryCount - a.inquiryCount)
      .slice(0, 5)
    
    return NextResponse.json({
      overview: {
        totalProperties,
        activeListings,
        soldProperties,
        rentProperties,
        totalInquiries,
        pendingInquiries,
        respondedInquiries,
        totalUsers,
        activeUsers,
        averagePrice: Math.round(averagePrice),
        recentProperties,
        recentInquiries
      },
      propertyTypes,
      monthlyTrend: monthlyData,
      topProperties,
      recentActivity: {
        properties: sampleProperties
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 5),
        inquiries: sampleInquiries
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 5)
      }
    })
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}