import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. Please upload CSV or Excel file.' }, { status: 400 })
    }

    // Read file content
    const content = await file.text()
    
    // Simple CSV parsing (in production, use proper CSV parser)
    const lines = content.split('\n').filter(line => line.trim())
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/"/g, ''))
    
    // Expected headers for property CSV
    const requiredHeaders = ['title', 'address', 'city', 'state', 'zipcode', 'price', 'propertytype', 'bedrooms', 'bathrooms', 'squarefeet']
    const missingHeaders = requiredHeaders.filter(h => !headers.includes(h))
    
    if (missingHeaders.length > 0) {
      return NextResponse.json({
        error: `Missing required columns: ${missingHeaders.join(', ')}`,
        expectedFormat: {
          headers: requiredHeaders,
          example: 'title,address,city,state,zipcode,price,propertytype,bedrooms,bathrooms,squarefeet'
        }
      }, { status: 400 })
    }

    // Parse data rows
    const properties = []
    const errors = []
    
    for (let i = 1; i < lines.length; i++) {
      try {
        const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''))
        
        if (values.length !== headers.length) {
          errors.push(`Row ${i + 1}: Column count mismatch`)
          continue
        }

        const property: any = {}
        headers.forEach((header, index) => {
          property[header] = values[index]
        })

        // Validate and transform data
        const validatedProperty = {
          id: `bulk-${Date.now()}-${i}`,
          title: property.title,
          address: property.address,
          city: property.city,
          state: property.state,
          zipCode: property.zipcode,
          price: parseFloat(property.price),
          propertyType: property.propertytype.toUpperCase(),
          bedrooms: parseInt(property.bedrooms),
          bathrooms: parseInt(property.bathrooms),
          squareFeet: parseInt(property.squarefeet),
          status: 'ACTIVE',
          latitude: 34.0522 + (Math.random() - 0.5) * 0.1, // Random coordinates for demo
          longitude: -118.2437 + (Math.random() - 0.5) * 0.1,
          description: `${property.title} located in ${property.city}`,
          images: [],
          owner: {
            name: 'Bulk Import Admin',
            email: 'admin@realtywebsite.com'
          },
          slug: property.title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-') + '-' + Date.now(),
          createdAt: new Date(),
          features: {
            amenities: [],
            parking: 'TBD',
            heating: 'TBD',
            flooring: 'TBD'
          }
        }

        // Basic validation
        if (isNaN(validatedProperty.price) || validatedProperty.price <= 0) {
          errors.push(`Row ${i + 1}: Invalid price`)
          continue
        }
        
        if (isNaN(validatedProperty.bedrooms) || validatedProperty.bedrooms < 0) {
          errors.push(`Row ${i + 1}: Invalid bedrooms`)
          continue
        }

        properties.push(validatedProperty)
      } catch (error) {
        errors.push(`Row ${i + 1}: ${error instanceof Error ? error.message : 'Parse error'}`)
      }
    }

    return NextResponse.json({
      success: true,
      processed: properties.length,
      errors: errors,
      properties: properties.slice(0, 5), // Return first 5 as preview
      message: `Successfully processed ${properties.length} properties${errors.length > 0 ? ` with ${errors.length} errors` : ''}`
    })
  } catch (error) {
    console.error('Bulk upload error:', error)
    return NextResponse.json(
      { error: 'Failed to process file' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Bulk upload endpoint for CSV/Excel files',
    expectedFormat: {
      headers: ['title', 'address', 'city', 'state', 'zipcode', 'price', 'propertytype', 'bedrooms', 'bathrooms', 'squarefeet'],
      example: 'Modern Loft,123 Main St,Los Angeles,CA,90210,500000,APARTMENT,2,2,1200'
    },
    supportedTypes: ['text/csv', '.xlsx', '.xls']
  })
}