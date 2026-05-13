import React, { useEffect, useState } from 'react'
import SlotForm from '../components/SlotForm'
import BookingManagement from '../components/BookingManagement'
import { createSlot, fetchSlots, updateBookingStatus } from '../services/api'

export default function HrDashboard({user}){
  const [slots, setSlots] = useState([])
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => { loadData() }, [])

  async function loadData(){
    setLoading(true)
    try{
      const slotData = await fetchSlots()
      setSlots(slotData)
      const bookingList = slotData.flatMap(s => 
        s.bookings ? s.bookings.map(b => ({...b, date: s.date, startTime: s.startTime, endTime: s.endTime})) : []
      )
      setBookings(bookingList)
    }catch(e){
      setError(String(e))
    }finally{ setLoading(false) }
  }

  async function handleCreateSlot(date, startTime, endTime){
    try{
      await createSlot(date, startTime, endTime)
      await loadData()
    }catch(e){
      throw e
    }
  }

  async function handleUpdateStatus(bookingId, status){
    try{
      await updateBookingStatus(bookingId, status)
      await loadData()
    }catch(e){
      throw e
    }
  }

  return (
    <div className="max-w-5xl mx-auto">
      <h2 className="text-lg font-semibold mb-6">HR Dashboard</h2>

      {error && <div className="text-sm text-red-600 mb-4">{error}</div>}

      <SlotForm onCreateSlot={handleCreateSlot} />

      <div className="mt-8">
        <h3 className="text-md font-semibold mb-3">All Interview Slots</h3>
        {loading ? (
          <div className="text-sm text-slate-500">Loading…</div>
        ) : slots.length === 0 ? (
          <div className="text-sm text-slate-500">No slots created yet</div>
        ) : (
          <div className="space-y-2">
            {slots.map(s => (
              <div key={s.id} className="p-3 bg-slate-100 rounded text-sm">
                <div className="font-medium">{s.date} {s.startTime} - {s.endTime}</div>
                <div className="text-slate-600">Available: {s.available ? 'Yes' : 'No'}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-8">
        <h3 className="text-md font-semibold mb-3">Candidate Bookings</h3>
        <BookingManagement bookings={bookings} onUpdateStatus={handleUpdateStatus} />
      </div>
    </div>
  )
}
