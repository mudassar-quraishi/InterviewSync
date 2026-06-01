import React, { useState, useEffect } from 'react'
import { fetchDashboardStats, fetchSlots } from '../../services/api'
import { toast } from 'react-hot-toast'
import Spinner from '../../components/Spinner'
import { FileText, Calendar, Users, CheckCircle, BarChart3, TrendingUp, CheckSquare, Clock, XSquare } from 'lucide-react'

export default function Reports() {
  const [stats, setStats] = useState(null)
  const [slots, setSlots] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    setLoading(true)
    try {
      const [statsData, slotsData] = await Promise.all([
        fetchDashboardStats(),
        fetchSlots()
      ])
      setStats(statsData)
      setSlots(slotsData)
    } catch (err) {
      toast.error('Failed to load reports data: ' + err.message)
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

  // Calculate customized metrics
  const totalSlotsCount = stats?.totalSlots || 0
  const totalCandidatesCount = stats?.totalCandidates || 0
  
  const pending = stats?.pendingInterviews || 0
  const accepted = stats?.acceptedInterviews || 0
  const completed = stats?.completedInterviews || 0
  const rejected = stats?.rejectedInterviews || 0
  const totalBookings = pending + accepted + completed + rejected

  // Seat capacities calculation
  const totalSeats = slots.reduce((acc, curr) => acc + curr.maxCandidates, 0)
  const bookedSeats = slots.reduce((acc, curr) => acc + curr.bookedCount, 0)
  
  const seatUtilizationRate = totalSeats > 0 ? Math.round((bookedSeats / totalSeats) * 100) : 0
  const completionRate = totalBookings > 0 ? Math.round((completed / totalBookings) * 100) : 0
  const approvalRate = totalBookings > 0 ? Math.round(((accepted + completed) / totalBookings) * 100) : 0

  return (
    <div className="max-w-6xl mx-auto font-sans">
      <div className="mb-8">
        <h1 className="font-outfit text-3xl font-bold text-slate-900 tracking-tight">Analytics & Reports</h1>
        <p className="text-slate-500 text-sm mt-1">Live tracking of recruitment statistics and slot utilization</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <BarChart3 size={24} />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Utilization Rate</div>
            <div className="text-2xl font-bold font-outfit text-slate-900 mt-0.5">{seatUtilizationRate}%</div>
            <div className="text-[10px] text-indigo-600 font-medium">Booked vs Available Seats</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle size={24} />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Approval Rate</div>
            <div className="text-2xl font-bold font-outfit text-slate-900 mt-0.5">{approvalRate}%</div>
            <div className="text-[10px] text-emerald-600 font-medium">Accepted Booking Ratio</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
            <TrendingUp size={24} />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Completion Rate</div>
            <div className="text-2xl font-bold font-outfit text-slate-900 mt-0.5">{completionRate}%</div>
            <div className="text-[10px] text-sky-600 font-medium">Closed / Finished Interviews</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-slate-50 text-slate-600 flex items-center justify-center shrink-0">
            <Users size={24} />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Candidates</div>
            <div className="text-2xl font-bold font-outfit text-slate-900 mt-0.5">{totalCandidatesCount}</div>
            <div className="text-[10px] text-slate-500 font-medium">Registered Candidate Pool</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Booking Status breakdown Chart Mockup */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h2 className="font-outfit text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <FileText size={18} className="text-indigo-600" />
            Interview Request Breakdown
          </h2>

          <div className="space-y-5">
            {/* Pending */}
            <div>
              <div className="flex justify-between items-center text-xs mb-1.5">
                <span className="font-medium text-slate-600 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  Pending Review ({pending})
                </span>
                <span className="font-bold text-slate-900">{totalBookings > 0 ? Math.round((pending / totalBookings) * 100) : 0}%</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-amber-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${totalBookings > 0 ? (pending / totalBookings) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* Accepted */}
            <div>
              <div className="flex justify-between items-center text-xs mb-1.5">
                <span className="font-medium text-slate-600 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  Accepted / Scheduled ({accepted})
                </span>
                <span className="font-bold text-slate-900">{totalBookings > 0 ? Math.round((accepted / totalBookings) * 100) : 0}%</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-blue-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${totalBookings > 0 ? (accepted / totalBookings) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* Completed */}
            <div>
              <div className="flex justify-between items-center text-xs mb-1.5">
                <span className="font-medium text-slate-600 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  Completed ({completed})
                </span>
                <span className="font-bold text-slate-900">{totalBookings > 0 ? Math.round((completed / totalBookings) * 100) : 0}%</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${totalBookings > 0 ? (completed / totalBookings) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* Rejected */}
            <div>
              <div className="flex justify-between items-center text-xs mb-1.5">
                <span className="font-medium text-slate-600 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  Rejected ({rejected})
                </span>
                <span className="font-bold text-slate-900">{totalBookings > 0 ? Math.round((rejected / totalBookings) * 100) : 0}%</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-rose-50 h-full rounded-full overflow-hidden"
                >
                  <div
                    className="bg-rose-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${totalBookings > 0 ? (rejected / totalBookings) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="p-3 rounded-xl bg-slate-50">
              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Total Slots</div>
              <div className="text-lg font-bold text-slate-800 mt-0.5">{totalSlotsCount}</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-50">
              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Total Bookings</div>
              <div className="text-lg font-bold text-slate-800 mt-0.5">{totalBookings}</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-50">
              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Seats Offered</div>
              <div className="text-lg font-bold text-slate-800 mt-0.5">{totalSeats}</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-50">
              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Seats Occupied</div>
              <div className="text-lg font-bold text-slate-800 mt-0.5">{bookedSeats}</div>
            </div>
          </div>
        </div>

        {/* Side Panel: Active/Utilization summaries */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="font-outfit text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <CheckSquare size={18} className="text-indigo-600" />
              Recruitment Progress
            </h2>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <Clock size={16} />
                </div>
                <div className="flex-1">
                  <div className="text-xs font-semibold text-slate-700">Pending Actions</div>
                  <div className="text-[11px] text-slate-400">{pending} candidates need approval</div>
                </div>
                <span className="font-bold text-sm text-slate-800 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">{pending}</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Calendar size={16} />
                </div>
                <div className="flex-1">
                  <div className="text-xs font-semibold text-slate-700">Scheduled Interviews</div>
                  <div className="text-[11px] text-slate-400">{accepted} confirmed calendar items</div>
                </div>
                <span className="font-bold text-sm text-slate-800 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">{accepted}</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <CheckCircle size={16} />
                </div>
                <div className="flex-1">
                  <div className="text-xs font-semibold text-slate-700">Hiring Completed</div>
                  <div className="text-[11px] text-slate-400">{completed} candidate evaluations logged</div>
                </div>
                <span className="font-bold text-sm text-slate-800 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">{completed}</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                  <XSquare size={16} />
                </div>
                <div className="flex-1">
                  <div className="text-xs font-semibold text-slate-700">Rejected Applications</div>
                  <div className="text-[11px] text-slate-400">{rejected} bookings rejected</div>
                </div>
                <span className="font-bold text-sm text-slate-800 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">{rejected}</span>
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-slate-100 pt-6">
            <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md">
              <h4 className="text-xs font-bold uppercase tracking-wider opacity-85">Recruitment Advice</h4>
              <p className="text-xs mt-1.5 leading-relaxed opacity-95">
                {seatUtilizationRate > 75 
                  ? "Slot demand is high! Consider creating additional interview slots to avoid candidate booking blockages."
                  : "Excellent slot availability. Promote open slots to prospective candidates to improve hiring turnaround times."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
