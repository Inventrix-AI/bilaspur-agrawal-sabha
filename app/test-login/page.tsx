'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'

export default function TestLoginPage() {
  const [results, setResults] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState('')

  const testDbConnection = async () => {
    setLoading('db-test')
    try {
      const response = await fetch('/api/debug/db-test')
      const data = await response.json()
      setResults((prev) => ({ ...prev, dbTest: data }))
    } catch (error) {
      setResults((prev) => ({ ...prev, dbTest: { error: (error as Error).message } }))
    }
    setLoading('')
  }

  const testGetUsers = async () => {
    setLoading('users')
    try {
      const response = await fetch('/api/debug/users')
      const data = await response.json()
      setResults((prev) => ({ ...prev, users: data }))
    } catch (error) {
      setResults((prev) => ({ ...prev, users: { error: (error as Error).message } }))
    }
    setLoading('')
  }

  const forceSeed = async () => {
    setLoading('force-seed')
    try {
      const response = await fetch('/api/force-seed')
      const data = await response.json()
      setResults((prev) => ({ ...prev, forceSeed: data }))
    } catch (error) {
      setResults((prev) => ({ ...prev, forceSeed: { error: (error as Error).message } }))
    }
    setLoading('')
  }

  const testNextAuthLogin = async () => {
    setLoading('nextauth')
    try {
      const result = await signIn('credentials', {
        email: 'admin@bilaspuragrawalsabha.com',
        password: 'admin123',
        redirect: false
      })
      setResults((prev) => ({ ...prev, nextAuthLogin: result }))
    } catch (error) {
      setResults((prev) => ({ ...prev, nextAuthLogin: { error: (error as Error).message } }))
    }
    setLoading('')
  }

  const testDirectLogin = async () => {
    setLoading('direct')
    try {
      const response = await fetch('/api/direct-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'admin@bilaspuragrawalsabha.com',
          password: 'admin123'
        })
      })
      const data = await response.json()
      setResults((prev) => ({ ...prev, directLogin: data }))
    } catch (error) {
      setResults((prev) => ({ ...prev, directLogin: { error: (error as Error).message } }))
    }
    setLoading('')
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Login System Test Suite</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <button
          onClick={testDbConnection}
          disabled={loading === 'db-test'}
          className="bg-blue-500 text-white p-3 rounded disabled:bg-gray-400"
        >
          {loading === 'db-test' ? 'Testing...' : 'Test DB Connection'}
        </button>
        
        <button
          onClick={testGetUsers}
          disabled={loading === 'users'}
          className="bg-green-500 text-white p-3 rounded disabled:bg-gray-400"
        >
          {loading === 'users' ? 'Loading...' : 'Get Users'}
        </button>
        
        <button
          onClick={forceSeed}
          disabled={loading === 'force-seed'}
          className="bg-yellow-500 text-white p-3 rounded disabled:bg-gray-400"
        >
          {loading === 'force-seed' ? 'Seeding...' : 'Force Seed DB'}
        </button>
        
        <button
          onClick={testNextAuthLogin}
          disabled={loading === 'nextauth'}
          className="bg-purple-500 text-white p-3 rounded disabled:bg-gray-400"
        >
          {loading === 'nextauth' ? 'Testing...' : 'Test NextAuth Login'}
        </button>
        
        <button
          onClick={testDirectLogin}
          disabled={loading === 'direct'}
          className="bg-red-500 text-white p-3 rounded disabled:bg-gray-400"
        >
          {loading === 'direct' ? 'Testing...' : 'Test Direct Login'}
        </button>
      </div>

      <div className="space-y-4">
        {Object.entries(results).map(([key, value]) => (
          <div key={key} className="border p-4 rounded">
            <h3 className="font-semibold text-lg mb-2">{key}</h3>
            <pre className="bg-gray-100 p-2 rounded overflow-x-auto text-sm">
              {JSON.stringify(value, null, 2)}
            </pre>
          </div>
        ))}
      </div>
      
      <div className="mt-8 p-4 bg-blue-50 rounded">
        <h2 className="font-semibold mb-2">Test Sequence:</h2>
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li>Test DB Connection first</li>
          <li>Force Seed to create admin user</li>
          <li>Get Users to verify admin exists</li>
          <li>Test NextAuth Login</li>
          <li>Test Direct Login as backup</li>
        </ol>
      </div>
    </div>
  )
}