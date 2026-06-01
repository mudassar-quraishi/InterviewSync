import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register as apiRegister } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-hot-toast'
import { Clock, Mail, Lock, User, Phone, Building2, UserPlus, AlertCircle } from 'lucide-react'

export default function RegisterPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [role, setRole] = useState('CANDIDATE') // 'CANDIDATE' or 'HR'
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    // Client-side validations
    if (password.length < 6) {
      setError('Password must be at least 6 characters long')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)
    try {
      // call api register: register(fullName, email, password, role, phone, companyName)
      const response = await apiRegister(
        fullName,
        email,
        password,
        role,
        phone || null,
        null
      )
      // Login candidate or HR directly after registration
      login(response)
      toast.success('Registration successful!')
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Registration failed. Please check your fields and try again.')
      toast.error('Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[35rem] h-[35rem] rounded-full bg-indigo-300/30 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[35rem] h-[35rem] rounded-full bg-purple-300/30 blur-[100px] pointer-events-none" />

      <div className="max-w-md w-full relative z-10 my-8">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-200 mb-4">
            <Clock size={28} />
          </div>
          <h1 className="font-outfit text-3xl font-extrabold text-slate-900 tracking-tight">Create Account</h1>
          <p className="text-sm text-slate-500 mt-2">Join InterviewSync today to coordinate slots</p>
        </div>

        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/60 p-8">
          {/* Role selector tabs */}
          <div className="flex bg-slate-100 p-1.5 rounded-xl mb-6">
            <button
              type="button"
              onClick={() => { setRole('CANDIDATE'); setCompanyName(''); }}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                role === 'CANDIDATE' ? 'bg-indigo-600 text-white shadow' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Candidate
            </button>
            <button
              type="button"
              onClick={() => setRole('HR')}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                role === 'HR' ? 'bg-indigo-600 text-white shadow' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              HR / Recruiter
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-100 flex items-start gap-3 text-rose-700 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                  <User size={16} />
                </span>
                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-600 rounded-xl pl-10 pr-4 py-2.5 text-sm transition outline-none"
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                  <Mail size={16} />
                </span>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-600 rounded-xl pl-10 pr-4 py-2.5 text-sm transition outline-none"
                  placeholder="john@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                Phone Number <span className="text-[10px] text-slate-400 lowercase font-normal">(optional)</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                  <Phone size={16} />
                </span>
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-600 rounded-xl pl-10 pr-4 py-2.5 text-sm transition outline-none"
                  placeholder="+1 (555) 019-2834"
                />
              </div>
            </div>



            <div>
              <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                  <Lock size={16} />
                </span>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-600 rounded-xl pl-10 pr-4 py-2.5 text-sm transition outline-none"
                  placeholder="•••••••• (min 6 chars)"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                  <Lock size={16} />
                </span>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-600 rounded-xl pl-10 pr-4 py-2.5 text-sm transition outline-none"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-indigo-100 hover:shadow-indigo-200 transition-all flex items-center justify-center gap-2 disabled:bg-slate-300 disabled:shadow-none mt-2"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating Account...
                </span>
              ) : (
                <>
                  <UserPlus size={18} />
                  Sign Up as {role === 'HR' ? 'HR / Recruiter' : 'Candidate'}
                </>
              )}
            </button>
          </form>

          <div className="mt-6 border-t border-slate-100 pt-5 text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-indigo-600 hover:underline">
              Log in
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
