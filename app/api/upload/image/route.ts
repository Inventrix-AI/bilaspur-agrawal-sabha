import { NextRequest, NextResponse } from "next/server"
import { writeFile } from "fs/promises"
import { join } from "path"
import crypto from "crypto"

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('image') as File
    
    if (!file) {
      return NextResponse.json(
        { error: "No image file provided" },
        { status: 400 }
      )
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only JPEG, PNG, and WebP images are allowed." },
        { status: 400 }
      )
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File size too large. Maximum size is 5MB." },
        { status: 400 }
      )
    }

    // Generate unique filename
    const fileExtension = file.name.split('.').pop()
    const uniqueId = crypto.randomBytes(16).toString('hex')
    const timestamp = Date.now()
    const filename = `profile_${timestamp}_${uniqueId}.${fileExtension}`

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Define upload path
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'profiles')
    const filePath = join(uploadDir, filename)

    // Write file to uploads directory
    await writeFile(filePath, buffer)

    // Return the public URL
    const imageUrl = `/uploads/profiles/${filename}`

    return NextResponse.json(
      {
        success: true,
        imageUrl,
        filename,
        originalName: file.name,
        size: file.size,
        type: file.type
      },
      { status: 200 }
    )

  } catch (error) {
    console.error("Image upload error:", error)
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const filename = searchParams.get('filename')
    
    if (!filename) {
      return NextResponse.json(
        { error: "Filename is required" },
        { status: 400 }
      )
    }

    // Validate filename to prevent path traversal
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return NextResponse.json(
        { error: "Invalid filename" },
        { status: 400 }
      )
    }

    const filePath = join(process.cwd(), 'public', 'uploads', 'profiles', filename)
    
    // Delete the file
    const fs = require('fs').promises
    await fs.unlink(filePath)

    return NextResponse.json(
      { success: true, message: "Image deleted successfully" },
      { status: 200 }
    )

  } catch (error) {
    console.error("Image deletion error:", error)
    return NextResponse.json(
      { error: "Failed to delete image" },
      { status: 500 }
    )
  }
}