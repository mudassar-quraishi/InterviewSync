import React, { useEffect, useState } from 'react'
import SlotList from '../components/SlotList'
import BookingList from '../components/BookingList'
import { fetchSlots, createBooking, getMyBookings } from '../services/api'

export default function CandidateDashboard({user}){
  const [slots, setSlots] = useState([])
  const [loading, setLoading] = useState(false)
  const [bookings, setBookings] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => { 
    loadSlots()
    if (user?.id) loadBookings(user.id)
  }, [user])

  async function loadSlots(){
    setLoading(true)
    try{
      const data = await fetchSlots()
      setSlots(data)
    }catch(e){
      setError(String(e))
    }finally{ setLoading(false) }
  }

  async function loadBookings(id){
    try{
      const data = await getMyBookings(id)
      setBookings(data)
    }catch(e){
      setError(String(e))
    }
  }

  async function handleBook(slotId){
    setError(null)
    try{
      await createBooking(user.id, slotId)
      await loadSlots()
      await loadBookings(user.id)
    }catch(e){
      setError(String(e))
    }
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Available Slots</h2>
        <button onClick={() => loadSlots()} className="px-3 py-1 bg-indigo-600 text-white rounded text-sm">Refresh</button>
      </div>

      {error && <div className="mb-4 text-sm text-red-600">{error}</div>}

      {loading ? (
        <div className="text-sm text-slate-500">Loading slots…</div>
      ) : (
        <div className="grid gap-4">
          {slots.length===0 && <div className="text-sm text-slate-500">No slots available</div>}
          {slots.map(s => (
            <div key={s.id} className="p-4 bg-white rounded shadow-sm flex items-center justify-between">
              <div>
                <div className="font-medium text-slate-800">{s.date} {s.startTime} - {s.endTime}</div>
                <div className="text-sm text-slate-500">Available: {s.available ? 'Yes' : 'No'}</div>
              </div>
              <div>
                <button disabled={!s.available} onClick={() => handleBook(s.id)} className={`px-3 py-1 rounded text-sm ${s.available ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-slate-200 text-slate-400'}`}>
                  Book
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8">
        <h3 className="text-md font-semibold mb-3">My Bookings</h3>
        <BookingList bookings={bookings} />
      </div>
    </div>
  )
}
