import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl
    const token = req.nextauth.token

    // Admin routes protection
    if (pathname.startsWith('/admin')) {
      if (!token) {
        return NextResponse.redirect(new URL('/login', req.url))
      }

      // Check if user has admin role
      const userRole = token.role as string
      if (userRole !== 'Super Admin' && userRole !== 'Committee Admin') {
        return NextResponse.redirect(new URL('/', req.url))
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl
        
        // Allow access to non-admin routes
        if (!pathname.startsWith('/admin')) {
          return true
        }

        // For admin routes, require token and admin role
        return !!token && 
               (token.role === 'Super Admin' || token.role === 'Committee Admin')
      },
    },
  }
)

export const config = {
  matcher: ['/admin/:path*']
}