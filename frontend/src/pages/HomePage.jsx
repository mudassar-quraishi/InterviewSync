import React from 'react'
import { Link } from 'react-router-dom'
import { Calendar, Users, Shield, ArrowRight, CheckCircle2, Clock } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-6 w-6 text-indigo-600" />
            <span className="font-outfit text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              InterviewSync
            </span>
          </div>
          <nav className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition">
              Log in
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm hover:shadow transition"
            >
              Sign up
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-grow">
        <section className="relative overflow-hidden py-20 lg:py-32">
          {/* Subtle decorative background shapes */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 opacity-30 pointer-events-none">
            <div className="absolute top-[-10%] left-[10%] w-[35rem] h-[35rem] rounded-full bg-indigo-300 blur-[120px]" />
            <div className="absolute top-[20%] right-[5%] w-[30rem] h-[30rem] rounded-full bg-purple-300 blur-[120px]" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center max-w-3xl mx-auto">
              <span className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100 mb-6">
                <CheckCircle2 size={12} />
                Now with JWT & Spring Security
              </span>
              <h1 className="font-outfit text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-none mb-6">
                Streamline Your Interview Scheduling Process
              </h1>
              <p className="text-lg sm:text-xl text-slate-600 mb-8 leading-relaxed">
                Connect HR teams and candidates instantly. Create available time slots, book interviews in one click, and track application status live on our secure, full-stack platform.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/register"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 text-base font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg hover:shadow-xl transition-all gap-2 group"
                >
                  Get Started for Free
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/login"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 text-base font-semibold text-slate-700 bg-white hover:bg-slate-100 rounded-xl border border-slate-200 shadow-sm transition"
                >
                  Access Dashboard
                </Link>
              </div>
            </div>

            {/* Visual Teaser */}
            <div className="mt-16 sm:mt-24 border border-slate-200/80 rounded-2xl p-2 bg-slate-200/40 shadow-2xl overflow-hidden max-w-5xl mx-auto">
              <div className="bg-slate-900 rounded-xl overflow-hidden shadow-inner p-4 sm:p-8 aspect-[16/9] flex flex-col justify-between text-slate-200 relative">
                {/* Decorative UI elements inside mockup */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
                  <div className="flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full bg-red-500/80" />
                    <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <span className="w-3 h-3 rounded-full bg-green-500/80" />
                    <span className="text-xs text-slate-500 font-mono ml-4">interview-sync.com/dashboard</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-slate-800 text-xs flex items-center justify-center text-indigo-400 font-bold">HR</span>
                    <span className="text-xs text-slate-400 font-medium">HR Workspace</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-auto">
                  <div className="bg-slate-800/50 border border-slate-700/30 p-4 rounded-lg">
                    <div className="text-slate-500 text-xs font-medium uppercase">Active Slots</div>
                    <div className="text-2xl font-bold font-outfit text-white mt-1">12</div>
                    <div className="text-[10px] text-emerald-400 mt-1">4 booked today</div>
                  </div>
                  <div className="bg-slate-800/50 border border-slate-700/30 p-4 rounded-lg">
                    <div className="text-slate-500 text-xs font-medium uppercase">Total Candidates</div>
                    <div className="text-2xl font-bold font-outfit text-white mt-1">38</div>
                    <div className="text-[10px] text-indigo-400 mt-1">+6 new this week</div>
                  </div>
                  <div className="bg-slate-800/50 border border-slate-700/30 p-4 rounded-lg">
                    <div className="text-slate-500 text-xs font-medium uppercase">Pending Reviews</div>
                    <div className="text-2xl font-bold font-outfit text-amber-400 mt-1">5</div>
                    <div className="text-[10px] text-slate-400 mt-1">Requires HR action</div>
                  </div>
                </div>

                <div className="bg-slate-800/30 border border-slate-800/80 rounded-lg p-4 mt-4">
                  <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-2">
                    <span>Recent Bookings</span>
                    <span className="text-indigo-400">View All</span>
                  </div>
                  <div className="space-y-2">
                    <div className="bg-slate-900/80 border border-slate-800 p-2.5 rounded flex items-center justify-between text-xs">
                      <div>
                        <div className="font-semibold text-white">Sarah Jenkins</div>
                        <div className="text-[10px] text-slate-500">sarah.j@example.com</div>
                      </div>
                      <div className="text-right">
                        <div className="text-slate-300 font-semibold">June 2, 2026 at 10:00 AM</div>
                        <span className="inline-block bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-full text-[10px] mt-1 font-medium">Pending Review</span>
                      </div>
                    </div>
                    <div className="bg-slate-900/80 border border-slate-800 p-2.5 rounded flex items-center justify-between text-xs">
                      <div>
                        <div className="font-semibold text-white">David Miller</div>
                        <div className="text-[10px] text-slate-500">david.m@example.com</div>
                      </div>
                      <div className="text-right">
                        <div className="text-slate-300 font-semibold">June 3, 2026 at 2:30 PM</div>
                        <span className="inline-block bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full text-[10px] mt-1 font-medium">Accepted</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="bg-white py-20 border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="font-outfit text-3xl font-bold text-slate-900 mb-4">
                Designed for Candidates and HR Teams
              </h2>
              <p className="text-slate-600">
                Experience a smooth recruitment workflow with all the features you need.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:shadow-md transition">
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 mb-4">
                  <Calendar size={24} />
                </div>
                <h3 className="font-outfit text-lg font-bold text-slate-900 mb-2">Flexible Slots</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  HR managers can create, edit, and delete interview slots. Customize slot capacities, locations (virtual links or physical addresses), and select types like Online or Offline.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:shadow-md transition">
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 mb-4">
                  <Users size={24} />
                </div>
                <h3 className="font-outfit text-lg font-bold text-slate-900 mb-2">No Double-Booking</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Candidates see available slots with live seat counts, book instantly, and are restricted from double-booking. Automatic capacity tracking keeps booking data in sync.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:shadow-md transition">
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 mb-4">
                  <Shield size={24} />
                </div>
                <h3 className="font-outfit text-lg font-bold text-slate-900 mb-2">JWT Secure APIs</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Backed by Spring Security and JSON Web Token (JWT) standards. Keeps all role-based actions secured and restricts endpoints so candidate data remains private.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-indigo-400" />
            <span className="font-outfit font-bold text-white text-base">InterviewSync</span>
          </div>
          <p className="text-xs">
            &copy; {new Date().getFullYear()} InterviewSync. Built for modern recruiting. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
