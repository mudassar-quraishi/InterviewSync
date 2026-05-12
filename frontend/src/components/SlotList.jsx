import React from 'react'

export default function SlotList({slots=[]}){
  return (
    <div className="grid gap-4">
      {slots.length===0 ? (
        <div className="text-sm text-slate-500">No slots available</div>
      ) : (
        slots.map(s => (
          <div key={s.id} className="p-4 bg-white rounded shadow-sm">
            <div className="font-medium text-slate-800">{s.date} {s.startTime} - {s.endTime}</div>
            <div className="text-sm text-slate-500">Available: {s.available ? 'Yes' : 'No'}</div>
          </div>
        ))
      )}
    </div>
  )
}
