import React, { useState, useEffect } from 'react'
import { fetchBookings, cancelBooking } from '../../services/api'
import { toast } from 'react-hot-toast'
import StatusBadge from '../../components/StatusBadge'
import Spinner from '../../components/Spinner'
import ConfirmDialog from '../../components/ConfirmDialog'
import { Calendar, Clock, MapPin, Video, ClipboardList, Trash2, CalendarDays, AlertTriangle } from 'lucide-react'

export default function MyBookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [cancelOpen, setCancelOpen] = useState(false)
  const [bookingToCancel, setBookingToCancel] = useState(null)
  const [canceling, setCanceling] = useState(false)

  useEffect(() => {
    loadBookings()
  }, [])

  async function loadBookings() {
    setLoading(true)
    try {
      const data = await fetchBookings()
      // sort by date/time (newest booking first or upcoming date-based)
      const sorted = data.sort((a, b) => new Date(b.bookingDate) - new Date(a.bookingDate))
      setBookings(sorted)
    } catch (err) {
      toast.error('Failed to load bookings: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  function checkCanCancel(interviewDateStr) {
    try {
      const today = new Date()
      // Reset hours to compare dates only
      today.setHours(0, 0, 0, 0)
      
      const interviewDate = new Date(interviewDateStr)
      interviewDate.setHours(0, 0, 0, 0)
      
      // Can only cancel BEFORE the interview date (today < interviewDate)
      return today < interviewDate
    } catch (e) {
      return false
    }
  }

  function startCancel(booking) {
    setBookingToCancel(booking)
    setCancelOpen(true)
  }

  async function handleCancelConfirm() {
    setCancelOpen(false)
    if (!bookingToCancel) return

    setCanceling(true)
    try {
      await cancelBooking(bookingToCancel.id)
      toast.success('Interview booking cancelled successfully')
      loadBookings()
    } catch (err) {
      toast.error(err.message || 'Failed to cancel booking')
    } finally {
      setCanceling(false)
      setBookingToCancel(null)
    }
  }

  return (
    <div className="max-w-5xl mx-auto font-sans">
      <div className="mb-8">
        <h1 className="font-outfit text-3xl font-bold text-slate-900 tracking-tight">My Bookings</h1>
        <p className="text-slate-500 text-sm mt-1">Track the status of your booked interviews and manage cancellations</p>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center"><Spinner size="lg" /></div>
      ) : bookings.length === 0 ? (
        <div className="bg-white text-center py-16 border border-slate-200 rounded-2xl text-slate-400 shadow-sm">
          <ClipboardList className="mx-auto w-12 h-12 mb-3 opacity-40 text-indigo-500" />
          <p className="text-sm font-medium">You haven't booked any interviews yet.</p>
          <p className="text-xs mt-1 text-slate-400">Head over to the Available Slots screen to schedule one.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map(booking => {
            const canCancel = checkCanCancel(booking.date) && booking.status !== 'REJECTED' && booking.status !== 'COMPLETED'
            return (
              <div
                key={booking.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="space-y-3 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="font-outfit font-bold text-slate-900 text-lg flex items-center gap-2">
                      <Calendar size={18} className="text-indigo-600" />
                      {booking.date}
                    </h3>
                    <span className={`inline-flex items-center gap-1 py-0.5 px-2 rounded-full text-[10px] font-bold ${
                      booking.interviewType === 'ONLINE'
                        ? 'bg-sky-50 text-sky-700 border border-sky-100'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                    }`}>
                      {booking.interviewType === 'ONLINE' ? <Video size={10} /> : <MapPin size={10} />}
                      {booking.interviewType}
                    </span>
                    <StatusBadge status={booking.status} />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 text-xs text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <Clock size={14} className="text-slate-400 shrink-0" />
                      <span>{booking.startTime} - {booking.endTime}</span>
                    </div>
                    <div className="flex items-center gap-1.5 min-w-0">
                      <MapPin size={14} className="text-slate-400 shrink-0" />
                      <span className="truncate" title={booking.location}>{booking.location}</span>
                    </div>
                  </div>

                  <div className="text-[10px] text-slate-400 flex items-center gap-1.5 border-t border-slate-50 pt-2">
                    <CalendarDays size={12} />
                    <span>Booking requested on: {new Date(booking.bookingDate).toLocaleString()}</span>
                  </div>
                </div>

                <div className="shrink-0 flex flex-col items-start md:items-end gap-2.5">
                  {canCancel ? (
                    <button
                      onClick={() => startCancel(booking)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 border border-rose-200 hover:border-rose-300 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl text-xs font-semibold shadow-sm transition"
                    >
                      <Trash2 size={14} />
                      Cancel Booking
                    </button>
                  ) : (
                    booking.status !== 'REJECTED' && booking.status !== 'COMPLETED' && (
                      <div className="flex items-center gap-1.5 text-rose-600 bg-rose-50/50 border border-rose-100/50 rounded-xl p-2.5 text-[10px] font-medium max-w-[240px]">
                        <AlertTriangle size={14} className="shrink-0" />
                        <span>Cancellations are locked on or after the scheduled date.</span>
                      </div>
                    )
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Cancel Confirmation Dialog */}
      <ConfirmDialog
        open={cancelOpen}
        title="Cancel Interview Booking"
        message="Are you sure you want to cancel your scheduled interview slot? This will free up the seat for other candidates, and this action cannot be undone."
        onConfirm={handleCancelConfirm}
        onCancel={() => { setCancelOpen(false); setBookingToCancel(null); }}
        confirmText="Cancel Booking"
        danger={true}
      />
    </div>
  )
}
