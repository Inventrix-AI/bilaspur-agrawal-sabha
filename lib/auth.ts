import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export const authOptions: NextAuthOptions = {
  debug: true, // Enable debug mode
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        console.log('🚀 NextAuth: Starting authorization process')
        console.log('📧 Email:', credentials?.email)
        console.log('🔗 Database URL present:', !!process.env.DATABASE_URL)
        
        if (!credentials?.email || !credentials?.password) {
          console.log('❌ NextAuth: Missing email or password')
          return null
        }

        try {
          console.log('🔍 NextAuth: Searching for user in database...')
          
          // Test database connection first
          await prisma.$connect()
          console.log('✅ NextAuth: Database connected')
          
          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email.toLowerCase().trim()
            },
            include: {
              member: true
            }
          })

          console.log('👤 NextAuth: User search result:', {
            found: !!user,
            email: user?.email,
            id: user?.id,
            hasPassword: !!user?.password,
            passwordLength: user?.password?.length
          })

          if (!user) {
            console.log('❌ NextAuth: User not found in database')
            return null
          }

          console.log('🔐 NextAuth: Comparing passwords...')
          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          )

          console.log('🔐 NextAuth: Password comparison result:', isPasswordValid)

          if (!isPasswordValid) {
            console.log('❌ NextAuth: Password does not match')
            // Let's also test with a fresh hash for debugging
            const testHash = await bcrypt.hash('admin123', 12)
            const testResult = await bcrypt.compare('admin123', testHash)
            console.log('🧪 NextAuth: Test hash comparison:', testResult)
            return null
          }

          console.log('✅ NextAuth: Authorization successful!')
          
          const result = {
            id: user.id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
            memberId: user.member?.id
          }
          
          console.log('📦 NextAuth: Returning user object:', result)
          return result
          
        } catch (error) {
          console.error('❌ NextAuth: Critical error during authorization:', error)
          console.error('Stack trace:', error instanceof Error ? error.stack : 'No stack trace')
          return null
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user, account }) {
      console.log('🔄 NextAuth: JWT callback triggered')
      if (user) {
        console.log('👤 NextAuth: Setting JWT token data for user:', user.email)
        token.role = (user as any).role
        token.memberId = (user as any).memberId
      }
      return token
    },
    async session({ session, token }) {
      console.log('🔄 NextAuth: Session callback triggered')
      if (token) {
        session.user.id = token.sub!
        session.user.role = token.role as string
        session.user.memberId = token.memberId as number
        console.log('👤 NextAuth: Session data set for:', session.user.email)
      }
      return session
    }
  },
  pages: {
    signIn: "/login",
    error: "/login"
  },
  secret: process.env.NEXTAUTH_SECRET,
  logger: {
    error(code, metadata) {
      console.error('NextAuth Error:', code, metadata)
    },
    warn(code) {
      console.warn('NextAuth Warning:', code)
    },
    debug(code, metadata) {
      console.log('NextAuth Debug:', code, metadata)
    }
  }
}