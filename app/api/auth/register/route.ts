import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import crypto from "crypto"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      name, 
      email, 
      password, 
      phone,
      firmName,
      business,
      locality,
      gotra,
      profileImageUrl
    } = body

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      )
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long" },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Generate email verification token
    const emailVerificationToken = crypto.randomBytes(32).toString("hex")
    const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    // Create user
    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        phone: phone?.trim() || null,
        role: "Member",
        status: "Active",
        isEmailVerified: false,
        emailVerificationToken,
        emailVerificationExpires
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        createdAt: true
      }
    })

    // Create member profile with detailed information
    await prisma.member.create({
      data: {
        userId: user.id,
        businessName: firmName?.trim() || null,
        businessCategory: business?.trim() || null,
        locality: locality?.trim() || null,
        gotra: gotra?.trim() || null,
        profileImageUrl: profileImageUrl || null,
        membershipType: "Regular",
        status: "Active",
        joinedDate: new Date(),
        isApproved: false, // Requires admin approval
      }
    })

    // TODO: Send verification email
    // In a production environment, you would send an email here with the verification link
    // const verificationUrl = `${process.env.NEXTAUTH_URL}/api/auth/verify-email?token=${emailVerificationToken}`
    // await sendVerificationEmail(user.email, user.name, verificationUrl)

    return NextResponse.json(
      {
        message: "Registration successful! Please check your email to verify your account. Your membership is pending admin approval.",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        },
        requiresEmailVerification: true
      },
      { status: 201 }
    )

  } catch (error) {
    console.error("Registration error:", error)
    
    // Handle Prisma unique constraint violations
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: "Internal server error during registration" },
      { status: 500 }
    )
  }
}