import React, { useState } from 'react'

export default function BookingManagement({ bookings = [], onUpdateStatus }) {
  const [updating, setUpdating] = useState(null)
  const [error, setError] = useState(null)

  async function handleStatusChange(bookingId, newStatus) {
    setError(null)
    try {
      setUpdating(bookingId)
      await onUpdateStatus(bookingId, newStatus)
    } catch (e) {
      setError(String(e))
    } finally {
      setUpdating(null)
    }
  }

  if (!bookings || bookings.length === 0) {
    return <div className="text-sm text-slate-500">No bookings yet</div>
  }

  return (
    <div>
      {error && <div className="text-sm text-red-600 mb-3">{error}</div>}
      <div className="space-y-3">
        {bookings.map(b => (
          <div key={b.id} className="p-4 bg-white rounded shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">{b.date} {b.startTime} - {b.endTime}</div>
                <div className="text-sm text-slate-600">{b.userName} ({b.userEmail})</div>
                <div className="text-sm text-slate-500 mt-1">
                  Status: <span className="font-semibold">{b.status}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleStatusChange(b.id, 'SELECTED')}
                  disabled={updating === b.id}
                  className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 disabled:bg-slate-300"
                >
                  Select
                </button>
                <button
                  onClick={() => handleStatusChange(b.id, 'REJECTED')}
                  disabled={updating === b.id}
                  className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 disabled:bg-slate-300"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
