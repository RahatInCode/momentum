import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { Card } from '../common/Card'

export const AuthForm = () => {
  const { signIn, signUp, resetPassword, loading } = useAuth()
  const [mode, setMode] = useState('signin') // 'signin' | 'signup' | 'reset'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [message, setMessage] = useState(null) // { type: 'error'|'success', text }

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage(null)

    if (mode === 'signup') {
      if (formData.password !== formData.confirmPassword) {
        return setMessage({ type: 'error', text: 'Passwords do not match' })
      }
      if (formData.password.length < 8) {
        return setMessage({ type: 'error', text: 'Password must be at least 8 characters' })
      }
      const result = await signUp(formData.email, formData.password, formData.name)
      if (!result.success) setMessage({ type: 'error', text: result.error })
    }

    if (mode === 'signin') {
      const result = await signIn(formData.email, formData.password)
      if (!result.success) setMessage({ type: 'error', text: result.error })
    }

    if (mode === 'reset') {
      const result = await resetPassword(formData.email)
      if (result.success) {
        setMessage({ type: 'success', text: 'If the email exists, a reset link has been sent.' })
      } else {
        setMessage({ type: 'error', text: result.error })
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-0 p-4">
      <Card className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-text-primary">Momentum</h1>
          <p className="text-sm text-text-muted mt-1">
            {mode === 'signin' && 'Welcome back'}
            {mode === 'signup' && 'Create your account'}
            {mode === 'reset' && 'Reset your password'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Name</label>
              <input
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
                className="w-full px-3 py-2 bg-surface-1 border border-surface-3 rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-medium"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Email</label>
            <input
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full px-3 py-2 bg-surface-1 border border-surface-3 rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-medium"
            />
          </div>

          {mode !== 'reset' && (
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Password</label>
              <input
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-3 py-2 bg-surface-1 border border-surface-3 rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-medium"
              />
            </div>
          )}

          {mode === 'signup' && (
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Confirm Password</label>
              <input
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-3 py-2 bg-surface-1 border border-surface-3 rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-medium"
              />
            </div>
          )}

          {/* Message */}
          {message && (
            <div
              className={`p-3 rounded-lg text-sm ${
                message.type === 'error'
                  ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                  : 'bg-green-500/10 text-green-400 border border-green-500/20'
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-accent-medium text-white rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading
              ? 'Please wait...'
              : mode === 'signin'
              ? 'Sign In'
              : mode === 'signup'
              ? 'Create Account'
              : 'Send Reset Link'}
          </button>
        </form>

        {/* Mode Switcher Links */}
        <div className="mt-6 text-center text-sm text-text-muted space-y-2">
          {mode === 'signin' && (
            <>
              <div>
                Don't have an account?{' '}
                <button onClick={() => setMode('signup')} className="text-accent-medium hover:underline">
                  Sign up
                </button>
              </div>
              <div>
                <button onClick={() => setMode('reset')} className="text-accent-medium hover:underline">
                  Forgot password?
                </button>
              </div>
            </>
          )}
          {mode === 'signup' && (
            <div>
              Already have an account?{' '}
              <button onClick={() => setMode('signin')} className="text-accent-medium hover:underline">
                Sign in
              </button>
            </div>
          )}
          {mode === 'reset' && (
            <button onClick={() => setMode('signin')} className="text-accent-medium hover:underline">
              Back to sign in
            </button>
          )}
        </div>
      </Card>
    </div>
  )
}

export default AuthForm