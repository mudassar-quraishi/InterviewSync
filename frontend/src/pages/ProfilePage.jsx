import React from 'react'
import { useAuth } from '../context/AuthContext'
import { User, Mail, Phone, Building2, Shield, CalendarDays } from 'lucide-react'

export default function ProfilePage() {
  const { user } = useAuth()

  return (
    <div className="max-w-3xl mx-auto font-sans">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="font-outfit text-3xl font-bold text-slate-900 tracking-tight">My Profile</h1>
        <p className="text-slate-500 text-sm mt-1">Manage and view your credentials and account details</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Banner decorative header */}
        <div className="h-32 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 relative">
          <div className="absolute -bottom-10 left-8">
            <div className="w-20 h-20 rounded-2xl bg-indigo-50 border-4 border-white flex items-center justify-center text-indigo-600 shadow-md font-outfit text-3xl font-extrabold">
              {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
            </div>
          </div>
        </div>

        {/* Profile details */}
        <div className="pt-14 pb-8 px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6 mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">{user?.fullName}</h2>
              <p className="text-sm text-slate-500">{user?.email}</p>
            </div>
            <div>
              <span className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100 uppercase tracking-wide">
                <Shield size={12} />
                {user?.role === 'HR' ? 'HR / Recruiter' : 'Candidate'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100">
              <User className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Full Name</div>
                <div className="text-sm font-semibold text-slate-700 mt-1">{user?.fullName}</div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100">
              <Mail className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Email Address</div>
                <div className="text-sm font-semibold text-slate-700 mt-1">{user?.email}</div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100">
              <Phone className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Phone Number</div>
                <div className="text-sm font-semibold text-slate-700 mt-1">
                  {user?.phone || <span className="text-slate-400 italic">Not provided</span>}
                </div>
              </div>
            </div>

            {user?.role === 'HR' ? (
              <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100">
                <Building2 className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Company Name</div>
                  <div className="text-sm font-semibold text-slate-700 mt-1">{user?.companyName}</div>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100 opacity-60">
                <Building2 className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Company Name</div>
                  <div className="text-sm font-semibold text-slate-400 italic mt-1">Not applicable for candidates</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
