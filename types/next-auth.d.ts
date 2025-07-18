import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name: string
      email: string
      role: string
      memberId?: number
    }
  }

  interface User {
    id: string
    name: string
    email: string
    role: string
    memberId?: number
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string
    memberId?: number
  }
}