import { NextRequest, NextResponse } from 'next/server'
import { sampleUsers } from '@/lib/sample-data'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // In a real app, you would hash and compare passwords
    // For demo purposes, we'll use simple validation
    const user = sampleUsers.find(u => u.email === email)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Simple password check (in production, use bcrypt)
    const validPasswords: { [key: string]: string } = {
      'admin@realtywebsite.com': 'admin123',
      'sarah@realtywebsite.com': 'broker123'
    }

    if (validPasswords[email] !== password) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Create session token (in production, use proper JWT)
    const sessionToken = Buffer.from(`${user.id}:${Date.now()}`).toString('base64')

    const response = NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      token: sessionToken
    })

    // Set HTTP-only cookie
    response.cookies.set('session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 86400 // 24 hours
    })

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE() {
  const response = NextResponse.json({ message: 'Logged out successfully' })
  
  response.cookies.set('session', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0
  })

  return response
}