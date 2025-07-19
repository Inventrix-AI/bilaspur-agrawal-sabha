import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    
    console.log('🚨 Emergency login attempt:', email)
    
    // Hardcoded emergency credentials
    if (email === 'admin@bilaspuragrawalsabha.com' && password === 'admin123') {
      console.log('✅ Emergency login successful')
      
      // Create JWT token
      const token = jwt.sign(
        {
          userId: 1,
          email: 'admin@bilaspuragrawalsabha.com',
          role: 'Super Admin',
          name: 'System Administrator'
        },
        process.env.NEXTAUTH_SECRET || 'fallback-secret',
        { expiresIn: '7d' }
      )
      
      const response = NextResponse.json({
        success: true,
        message: 'Emergency login successful',
        user: {
          id: 1,
          name: 'System Administrator',
          email: 'admin@bilaspuragrawalsabha.com',
          role: 'Super Admin'
        },
        token,
        redirectTo: '/admin'
      })
      
      // Set auth cookie
      response.cookies.set('emergency-auth', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/'
      })
      
      return response
    }
    
    return NextResponse.json({
      success: false,
      error: 'Invalid emergency credentials'
    }, { status: 401 })
    
  } catch (error) {
    console.error('🚨 Emergency login error:', error)
    return NextResponse.json({
      success: false,
      error: 'Emergency login failed'
    }, { status: 500 })
  }
}