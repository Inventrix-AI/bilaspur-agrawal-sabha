'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function EmergencyLoginPage() {
  const [email, setEmail] = useState('admin@bilaspuragrawalsabha.com')
  const [password, setPassword] = useState('admin123')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const response = await fetch('/api/emergency-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (data.success) {
        setMessage('✅ Emergency login successful! Redirecting...')
        setTimeout(() => {
          router.push('/admin')
        }, 1000)
      } else {
        setMessage('❌ ' + (data.error || 'Login failed'))
      }
    } catch (error) {
      setMessage('❌ Network error occurred')
    }

    setLoading(false)
  }

  const runDiagnosis = async () => {
    setLoading(true)
    setMessage('🔍 Running diagnosis...')

    try {
      const response = await fetch('/api/diagnose')
      const data = await response.json()
      
      setMessage(`
📊 Diagnosis Results:
Environment: ${data.environment}
Database URL: ${data.databaseUrl}
NextAuth Secret: ${data.nextAuthSecret}
User Count: ${data.tests?.user_count || 'Unknown'}
Admin Exists: ${data.tests?.admin_user_exists ? 'YES' : 'NO'}
Password Test: ${data.tests?.password_verification ? 'PASS' : 'FAIL'}
Fresh Hash Test: ${data.tests?.fresh_hash_test ? 'PASS' : 'FAIL'}
      `)
    } catch (error) {
      setMessage('❌ Diagnosis failed')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-center mb-6 text-red-600">
          🚨 Emergency Login
        </h1>
        
        <div className="mb-6">
          <button
            onClick={runDiagnosis}
            disabled={loading}
            className="w-full bg-blue-500 text-white p-3 rounded mb-4 disabled:bg-gray-400"
          >
            {loading ? 'Running...' : '🔍 Run Full Diagnosis'}
          </button>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-500 text-white p-3 rounded disabled:bg-gray-400"
          >
            {loading ? 'Logging in...' : '🚨 Emergency Login'}
          </button>
        </form>

        {message && (
          <div className="mt-4 p-3 bg-gray-100 rounded">
            <pre className="text-sm whitespace-pre-wrap">{message}</pre>
          </div>
        )}

        <div className="mt-6 text-sm text-gray-600">
          <p><strong>Default Credentials:</strong></p>
          <p>Email: admin@bilaspuragrawalsabha.com</p>
          <p>Password: admin123</p>
        </div>
      </div>
    </div>
  )
}