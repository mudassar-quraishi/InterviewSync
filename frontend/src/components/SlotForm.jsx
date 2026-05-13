import React, { useState } from 'react'

export default function SlotForm({ onCreateSlot }) {
  const [date, setDate] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    if (!date || !startTime || !endTime) {
      setError('All fields required')
      return
    }

    try {
      await onCreateSlot(date, startTime, endTime)
      setDate('')
      setStartTime('')
      setEndTime('')
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (e) {
      setError(String(e))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white rounded shadow-sm mb-4">
      <h3 className="font-semibold mb-3">Create Interview Slot</h3>
      
      {error && <div className="text-sm text-red-600 mb-2">{error}</div>}
      {success && <div className="text-sm text-green-600 mb-2">Slot created!</div>}

      <div className="grid grid-cols-3 gap-3 mb-3">
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          className="border rounded px-3 py-2 text-sm"
        />
        <input
          type="time"
          value={startTime}
          onChange={e => setStartTime(e.target.value)}
          className="border rounded px-3 py-2 text-sm"
        />
        <input
          type="time"
          value={endTime}
          onChange={e => setEndTime(e.target.value)}
          className="border rounded px-3 py-2 text-sm"
        />
      </div>

      <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded text-sm">
        Create Slot
      </button>
    </form>
  )
}
