import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { login as apiLogin } from '../services/api'
import { toast } from 'react-hot-toast'
import { Clock, Mail, Lock, LogIn, AlertCircle } from 'lucide-react'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await apiLogin(email, password)
      login(response)
      toast.success(`Welcome back, ${response.fullName}!`)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Invalid credentials. Please try again.')
      toast.error('Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[35rem] h-[35rem] rounded-full bg-indigo-300/30 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[35rem] h-[35rem] rounded-full bg-purple-300/30 blur-[100px] pointer-events-none" />

      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-200 mb-4">
            <Clock size={28} />
          </div>
          <h1 className="font-outfit text-3xl font-extrabold text-slate-900 tracking-tight">Welcome Back</h1>
          <p className="text-sm text-slate-500 mt-2">Log in to manage or schedule your interviews</p>
        </div>

        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/60 p-8">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-100 flex items-start gap-3 text-rose-700 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                  <Mail size={18} />
                </span>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-600 rounded-xl pl-11 pr-4 py-3 text-sm transition outline-none"
                  placeholder="name@company.com"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Password
                </label>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                  <Lock size={18} />
                </span>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-600 rounded-xl pl-11 pr-4 py-3 text-sm transition outline-none"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-indigo-100 hover:shadow-indigo-200 transition-all flex items-center justify-center gap-2 disabled:bg-slate-300 disabled:shadow-none"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Logging in...
                </span>
              ) : (
                <>
                  <LogIn size={18} />
                  Log In
                </>
              )}
            </button>
          </form>

          <div className="mt-8 border-t border-slate-100 pt-6 text-center text-sm text-slate-500">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-indigo-600 hover:underline">
              Create an account
            </Link>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link to="/" className="text-xs text-slate-400 hover:text-slate-600 transition">
            &larr; Back to Home Page
          </Link>
        </div>
      </div>
    </div>
  )
}
