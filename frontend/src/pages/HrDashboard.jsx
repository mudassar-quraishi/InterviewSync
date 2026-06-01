import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { fetchDashboardStats, fetchSlots, fetchBookings } from '../services/api'
import { toast } from 'react-hot-toast'
import Spinner from '../components/Spinner'
import StatusBadge from '../components/StatusBadge'
import { Calendar, Users, Clock, CheckCircle2, ChevronRight, Video, MapPin, AlertCircle, ArrowUpRight } from 'lucide-react'

export default function HrDashboard() {
  const [stats, setStats] = useState(null)
  const [recentBookings, setRecentBookings] = useState([])
  const [upcomingSlots, setUpcomingSlots] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  async function loadDashboardData() {
    setLoading(true)
    try {
      const [statsData, slotsData, bookingsData] = await Promise.all([
        fetchDashboardStats(),
        fetchSlots(),
        fetchBookings()
      ])
      
      setStats(statsData)
      
      // Get upcoming slots (active ones sorted by date)
      const sortedSlots = slotsData
        .sort((a, b) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime))
        .slice(0, 5)
      setUpcomingSlots(sortedSlots)

      // Get latest bookings
      const sortedBookings = bookingsData
        .sort((a, b) => new Date(b.bookingDate) - new Date(a.bookingDate))
        .slice(0, 5)
      setRecentBookings(sortedBookings)

    } catch (err) {
      toast.error('Failed to load dashboard data: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto font-sans">
      {/* Greeting Header */}
      <div className="mb-8">
        <h1 className="font-outfit text-3xl font-bold text-slate-900 tracking-tight">Recruitment Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">Review live applicant statistics and upcoming interview times</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Total Slots</div>
            <div className="text-2xl font-bold font-outfit text-slate-900">{stats?.totalSlots || 0}</div>
            <div className="text-[10px] text-slate-400">Available schedules</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Calendar size={22} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Candidates</div>
            <div className="text-2xl font-bold font-outfit text-slate-900">{stats?.totalCandidates || 0}</div>
            <div className="text-[10px] text-slate-400">Registered pool</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Users size={22} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Pending Bookings</div>
            <div className="text-2xl font-bold font-outfit text-amber-600">{stats?.pendingInterviews || 0}</div>
            <div className="text-[10px] text-slate-400">Requires review</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
            <Clock size={22} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Completed</div>
            <div className="text-2xl font-bold font-outfit text-emerald-600">{stats?.completedInterviews || 0}</div>
            <div className="text-[10px] text-slate-400">Interviews finished</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
            <CheckCircle2 size={22} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Bookings List */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-outfit text-lg font-bold text-slate-800 flex items-center gap-2">
                <Users size={18} className="text-indigo-600" />
                Recent Booking Applications
              </h2>
              <Link to="/candidates" className="text-xs text-indigo-600 font-semibold hover:underline flex items-center gap-0.5">
                View all
                <ChevronRight size={14} />
              </Link>
            </div>

            {recentBookings.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs border border-dashed border-slate-200 rounded-xl">
                No recent interview bookings found.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {recentBookings.map(booking => (
                  <div key={booking.id} className="py-3.5 flex items-center justify-between gap-4">
                    <div>
                      <div className="text-sm font-semibold text-slate-900">{booking.candidateName}</div>
                      <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
                        <span>{booking.date}</span>
                        <span>&bull;</span>
                        <span>{booking.startTime}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <StatusBadge status={booking.status} />
                      <Link
                        to="/candidates"
                        className="p-1 rounded bg-slate-50 border border-slate-200 text-slate-400 hover:text-indigo-600 transition"
                      >
                        <ArrowUpRight size={14} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Upcoming Slots List */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-outfit text-lg font-bold text-slate-800 flex items-center gap-2">
                <Calendar size={18} className="text-indigo-600" />
                Availability Slots (Upcoming)
              </h2>
              <Link to="/slots" className="text-xs text-indigo-600 font-semibold hover:underline flex items-center gap-0.5">
                Manage
                <ChevronRight size={14} />
              </Link>
            </div>

            {upcomingSlots.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs border border-dashed border-slate-200 rounded-xl">
                No slots found. Create new time availabilities.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {upcomingSlots.map(slot => (
                  <div key={slot.id} className="py-3.5 flex items-center justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                        <span>{slot.date}</span>
                        <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-bold ${
                          slot.interviewType === 'ONLINE'
                            ? 'bg-sky-50 text-sky-700'
                            : 'bg-emerald-50 text-emerald-700'
                        }`}>
                          {slot.interviewType}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5 truncate flex items-center gap-1.5">
                        <MapPin size={11} className="text-slate-400 shrink-0" />
                        <span className="truncate">{slot.location}</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-xs font-semibold text-slate-700 flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
                        <Users size={12} className="text-slate-400" />
                        {slot.bookedCount} / {slot.maxCandidates}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
