import React, { useState, useEffect } from 'react'
import { fetchSlots, createBooking } from '../../services/api'
import { toast } from 'react-hot-toast'
import Spinner from '../../components/Spinner'
import { Calendar, Clock, MapPin, Search, Video, Compass, AlertCircle, Sparkles } from 'lucide-react'

export default function AvailableSlots() {
  const [slots, setSlots] = useState([])
  const [loading, setLoading] = useState(true)
  const [dateFilter, setDateFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('ALL') // ALL, ONLINE, OFFLINE
  const [bookingSlotId, setBookingSlotId] = useState(null)

  useEffect(() => {
    loadSlots()
  }, [])

  async function loadSlots() {
    setLoading(true)
    try {
      // Pass true to only fetch available slots where bookedCount < maxCandidates
      const data = await fetchSlots(true)
      // Sort slots by date/time
      const sorted = data.sort((a, b) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime))
      setSlots(sorted)
    } catch (err) {
      toast.error('Failed to load available slots: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleBook(slotId) {
    setBookingSlotId(slotId)
    try {
      await createBooking(slotId)
      toast.success('Interview slot booked successfully!')
      loadSlots()
    } catch (err) {
      // Backend validates double booking or seat availability
      toast.error(err.message || 'Failed to book slot')
    } finally {
      setBookingSlotId(null)
    }
  }

  // Filter slots locally based on user inputs
  const filteredSlots = slots.filter(slot => {
    const matchesDate = !dateFilter || slot.date === dateFilter
    const matchesType = typeFilter === 'ALL' || slot.interviewType === typeFilter
    return matchesDate && matchesType
  })

  return (
    <div className="max-w-6xl mx-auto font-sans">
      <div className="mb-8">
        <h1 className="font-outfit text-3xl font-bold text-slate-900 tracking-tight">Available Interview Slots</h1>
        <p className="text-slate-500 text-sm mt-1">Browse and book open interview times provided by the recruiting team</p>
      </div>

      {/* Filter panel */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 mb-6 flex flex-col sm:flex-row items-center gap-4 justify-between">
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          {/* Date Picker */}
          <div className="w-full sm:w-48">
            <input
              type="date"
              value={dateFilter}
              onChange={e => setDateFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-600 rounded-xl px-3.5 py-2 text-sm outline-none transition"
            />
          </div>

          {/* Type Filter */}
          <div className="flex bg-slate-100 p-1 rounded-xl w-full sm:w-auto">
            {['ALL', 'ONLINE', 'OFFLINE'].map(type => (
              <button
                key={type}
                onClick={() => setTypeFilter(type)}
                className={`flex-1 sm:flex-initial py-1.5 px-3 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                  typeFilter === type
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {(dateFilter || typeFilter !== 'ALL') && (
          <button
            onClick={() => { setDateFilter(''); setTypeFilter('ALL'); }}
            className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold transition"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Slots List */}
      {loading ? (
        <div className="py-20 flex justify-center"><Spinner size="lg" /></div>
      ) : filteredSlots.length === 0 ? (
        <div className="bg-white text-center py-16 border border-slate-200 rounded-2xl text-slate-400 shadow-sm">
          <Compass className="mx-auto w-12 h-12 mb-3 opacity-40 text-indigo-500" />
          <p className="text-sm font-medium">No open interview slots found matching your filter parameters.</p>
          <p className="text-xs mt-1 text-slate-400">Please check back later or modify your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSlots.map(slot => {
            const seatsLeft = slot.maxCandidates - slot.bookedCount
            return (
              <div
                key={slot.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md hover:border-indigo-200 transition-all duration-200"
              >
                {/* Header card indicator */}
                <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                  <span className={`inline-flex items-center gap-1 py-0.5 px-2 rounded-full text-[10px] font-bold ${
                    slot.interviewType === 'ONLINE'
                      ? 'bg-sky-50 text-sky-700 border border-sky-100'
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                  }`}>
                    {slot.interviewType === 'ONLINE' ? <Video size={10} /> : <MapPin size={10} />}
                    {slot.interviewType}
                  </span>
                  <span className={`text-[10px] font-bold ${seatsLeft <= 1 ? 'text-rose-600' : 'text-slate-500'}`}>
                    {seatsLeft} {seatsLeft === 1 ? 'seat' : 'seats'} remaining
                  </span>
                </div>

                {/* Details */}
                <div className="p-5 space-y-4 flex-grow">
                  <div>
                    <h3 className="font-outfit font-bold text-slate-900 text-lg flex items-center gap-2">
                      <Calendar size={18} className="text-indigo-600" />
                      {slot.date}
                    </h3>
                    <div className="flex items-center gap-1.5 text-slate-500 text-sm mt-1">
                      <Clock size={15} />
                      <span>{slot.startTime} - {slot.endTime}</span>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-start gap-2 text-xs text-slate-600">
                    <MapPin size={15} className="text-slate-400 shrink-0 mt-0.5" />
                    <span className="break-all" title={slot.location}>{slot.location}</span>
                  </div>
                </div>

                {/* Footer book button */}
                <div className="p-4 bg-slate-50/50 border-t border-slate-100">
                  <button
                    onClick={() => handleBook(slot.id)}
                    disabled={bookingSlotId !== null}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-xl text-sm transition-all shadow-md shadow-indigo-100 hover:shadow flex items-center justify-center gap-1.5 disabled:bg-slate-300"
                  >
                    {bookingSlotId === slot.id ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Booking...
                      </span>
                    ) : (
                      <>
                        <Sparkles size={15} />
                        Book Interview
                      </>
                    )}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
