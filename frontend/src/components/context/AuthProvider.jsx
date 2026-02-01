import { useState, useEffect, useMemo, useCallback } from 'react'
import { AuthContext } from './AuthContext.jsx'

// This provider works with Firebase, Supabase, or any auth service
// For this example, I'll create a flexible system that works with both

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Check for existing session on mount
  useEffect(() => {
    checkSession()
  }, [])

  const checkSession = async () => {
    try {
      // Check localStorage for existing session
      const storedUser = localStorage.getItem('momentum_user')
      if (storedUser) {
        setUser(JSON.parse(storedUser))
      }
    } catch (err) {
      console.error('Session check error:', err)
    } finally {
      setLoading(false)
    }
  }

  const signUp = useCallback(async (email, password, name) => {
    try {
      setLoading(true)
      setError(null)

      // In production, replace this with actual API call
      // Example with fetch to your backend:
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      })

      if (!response.ok) {
        throw new Error('Sign up failed')
      }

      const data = await response.json()
      
      const userData = {
        id: data.userId,
        email,
        name,
        emailVerified: false,
        createdAt: new Date().toISOString(),
      }

      localStorage.setItem('momentum_user', JSON.stringify(userData))
      localStorage.setItem('momentum_token', data.token)
      setUser(userData)

      return { success: true }
    } catch (err) {
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }, [])

  const signIn = useCallback(async (email, password) => {
    try {
      setLoading(true)
      setError(null)

      // In production, replace with actual API call
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        throw new Error('Invalid credentials')
      }

      const data = await response.json()
      
      const userData = {
        id: data.userId,
        email: data.email,
        name: data.name,
        emailVerified: data.emailVerified,
      }

      localStorage.setItem('momentum_user', JSON.stringify(userData))
      localStorage.setItem('momentum_token', data.token)
      setUser(userData)

      return { success: true }
    } catch (err) {
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }, [])

  const signOut = useCallback(async () => {
    try {
      setLoading(true)
      
      // Optional: Call backend to invalidate token
      const token = localStorage.getItem('momentum_token')
      if (token) {
        await fetch('/api/auth/signout', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        })
      }

      localStorage.removeItem('momentum_user')
      localStorage.removeItem('momentum_token')
      setUser(null)

      return { success: true }
    } catch (err) {
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }, [])

  const resetPassword = useCallback(async (email) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (!response.ok) {
        throw new Error('Password reset failed')
      }

      return { success: true, message: 'Password reset email sent' }
    } catch (err) {
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }, [])

  const updateProfile = useCallback(async (updates) => {
    try {
      setLoading(true)
      setError(null)

      const token = localStorage.getItem('momentum_token')
      const response = await fetch('/api/auth/update-profile', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updates),
      })

      if (!response.ok) {
        throw new Error('Profile update failed')
      }

      const updatedUser = { ...user, ...updates }
      localStorage.setItem('momentum_user', JSON.stringify(updatedUser))
      setUser(updatedUser)

      return { success: true }
    } catch (err) {
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }, [user])

  const value = useMemo(
    () => ({
      user,
      loading,
      error,
      isAuthenticated: !!user,
      signUp,
      signIn,
      signOut,
      resetPassword,
      updateProfile,
    }),
    [user, loading, error, signUp, signIn, signOut, resetPassword, updateProfile]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthProvider