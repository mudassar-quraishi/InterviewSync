import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { fetchBookings } from '../services/api'
import { toast } from 'react-hot-toast'
import Spinner from '../components/Spinner'
import StatusBadge from '../components/StatusBadge'
import { Calendar, Clock, MapPin, Video, Compass, ClipboardList, CheckCircle2, ChevronRight, ArrowUpRight } from 'lucide-react'

export default function CandidateDashboard() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  async function loadDashboardData() {
    setLoading(true)
    try {
      const data = await fetchBookings()
      setBookings(data)
    } catch (err) {
      toast.error('Failed to load candidate stats: ' + err.message)
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

  // Calculate metrics
  const total = bookings.length
  const pending = bookings.filter(b => b.status === 'PENDING').length
  const accepted = bookings.filter(b => b.status === 'ACCEPTED').length
  const completed = bookings.filter(b => b.status === 'COMPLETED').length

  // Find next upcoming accepted interview
  const upcomingInterview = bookings
    .filter(b => b.status === 'ACCEPTED')
    .sort((a, b) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime))[0]

  return (
    <div className="max-w-5xl mx-auto font-sans">
      {/* Greetings */}
      <div className="mb-8">
        <h1 className="font-outfit text-3xl font-bold text-slate-900 tracking-tight">Candidate Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">Book slots and track the live status of your job applications</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Total Bookings</div>
            <div className="text-2xl font-bold font-outfit text-slate-900">{total}</div>
            <div className="text-[10px] text-slate-400">All submissions</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <ClipboardList size={22} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Pending Review</div>
            <div className="text-2xl font-bold font-outfit text-amber-600">{pending}</div>
            <div className="text-[10px] text-slate-400">Awaiting HR feedback</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
            <Clock size={22} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Confirmed</div>
            <div className="text-2xl font-bold font-outfit text-blue-600">{accepted}</div>
            <div className="text-[10px] text-slate-400">Interviews scheduled</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
            <Calendar size={22} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Completed</div>
            <div className="text-2xl font-bold font-outfit text-emerald-600">{completed}</div>
            <div className="text-[10px] text-slate-400">Interviews finished</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
            <CheckCircle2 size={22} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Next Scheduled Interview Card */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h2 className="font-outfit text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Calendar size={18} className="text-indigo-600" />
              Your Next Scheduled Interview
            </h2>

            {!upcomingInterview ? (
              <div className="text-center py-10 border border-dashed border-slate-200 rounded-xl text-slate-400">
                <Calendar size={32} className="mx-auto opacity-40 mb-2" />
                <p className="text-xs">No upcoming confirmed interviews scheduled.</p>
                <Link to="/available-slots" className="text-xs text-indigo-600 font-semibold hover:underline mt-2 inline-block">
                  Book a slot now &rarr;
                </Link>
              </div>
            ) : (
              <div className="p-4 rounded-xl border border-indigo-100 bg-indigo-50/20 space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="font-outfit font-bold text-slate-900 text-lg">{upcomingInterview.date}</h3>
                    <div className="flex items-center gap-1.5 text-slate-500 text-xs mt-0.5">
                      <Clock size={13} />
                      <span>{upcomingInterview.startTime} - {upcomingInterview.endTime}</span>
                    </div>
                  </div>
                  <span className={`inline-flex items-center gap-1 py-0.5 px-2 rounded-full text-[9px] font-bold bg-sky-50 text-sky-700 border border-sky-100`}>
                    {upcomingInterview.interviewType === 'ONLINE' ? <Video size={9} /> : <MapPin size={9} />}
                    {upcomingInterview.interviewType}
                  </span>
                </div>

                <div className="flex items-start gap-2.5 text-xs text-slate-600 border-t border-indigo-100/50 pt-3">
                  <MapPin size={15} className="text-slate-400 shrink-0 mt-0.5" />
                  <span className="break-all">{upcomingInterview.location}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Panel */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col gap-4">
            <h2 className="font-outfit text-base font-bold text-slate-800">Quick Actions</h2>
            
            <Link
              to="/available-slots"
              className="group p-4 bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 rounded-xl transition flex items-center justify-between"
            >
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition">Book Interview</div>
                <div className="text-[10px] text-slate-400">View available schedule slots</div>
              </div>
              <ChevronRight size={16} className="text-slate-400 group-hover:text-indigo-500 group-hover:translate-x-0.5 transition" />
            </Link>

            <Link
              to="/my-bookings"
              className="group p-4 bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 rounded-xl transition flex items-center justify-between"
            >
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition">My Schedule</div>
                <div className="text-[10px] text-slate-400">Track and manage active bookings</div>
              </div>
              <ChevronRight size={16} className="text-slate-400 group-hover:text-indigo-500 group-hover:translate-x-0.5 transition" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
