import jwt from "jsonwebtoken"

export interface JWTPayload {
  userId: number
  email: string
  role: string
  memberId?: number
}

export interface AuthResult {
  success: boolean
  user?: JWTPayload
  error?: string
}

export async function signJWT(payload: JWTPayload): Promise<string> {
  try {
    const token = jwt.sign(
      payload,
      process.env.NEXTAUTH_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    )
    return token
  } catch (error) {
    throw new Error('Failed to sign JWT token')
  }
}

export async function verifyJWT(request: Request): Promise<AuthResult> {
  try {
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { success: false, error: 'Missing or invalid authorization header' }
    }

    const token = authHeader.substring(7) // Remove 'Bearer ' prefix
    
    const payload = jwt.verify(
      token,
      process.env.NEXTAUTH_SECRET || 'fallback-secret'
    ) as JWTPayload

    return { success: true, user: payload }
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return { success: false, error: 'Invalid token' }
    }
    if (error instanceof jwt.TokenExpiredError) {
      return { success: false, error: 'Token expired' }
    }
    return { success: false, error: 'Token verification failed' }
  }
}