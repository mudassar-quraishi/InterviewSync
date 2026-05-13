import React from 'react'

export default function BookingList({bookings=[]}){
  if(!bookings || bookings.length===0) return <div className="text-sm text-slate-500">No bookings yet</div>
  return (
    <div className="space-y-3">
      {bookings.map(b => (
        <div key={b.id} className="p-3 bg-white rounded shadow-sm flex items-center justify-between">
          <div>
            <div className="font-medium">{b.date} {b.startTime} - {b.endTime}</div>
            <div className="text-sm text-slate-500">Status: {b.status}</div>
            <div className="text-sm text-slate-500">HR: {b.userName} ({b.userEmail})</div>
          </div>
        </div>
      ))}
    </div>
  )
}
