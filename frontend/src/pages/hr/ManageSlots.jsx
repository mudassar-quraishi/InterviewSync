import React, { useState, useEffect } from 'react'
import { fetchSlots, createSlot, updateSlot, deleteSlot } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import { toast } from 'react-hot-toast'
import ConfirmDialog from '../../components/ConfirmDialog'
import Spinner from '../../components/Spinner'
import { Calendar, Clock, MapPin, Users, Plus, Edit2, Trash2, X, Video, ShieldAlert } from 'lucide-react'

export default function ManageSlots() {
  const { user } = useAuth()
  const [slots, setSlots] = useState([])
  const [loading, setLoading] = useState(true)
  
  // Form states
  const [date, setDate] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [interviewType, setInterviewType] = useState('ONLINE')
  const [location, setLocation] = useState('')
  const [maxCandidates, setMaxCandidates] = useState(1)
  const [formError, setFormError] = useState('')
  const [creating, setCreating] = useState(false)

  // Edit states
  const [editingSlot, setEditingSlot] = useState(null)
  const [editDate, setEditDate] = useState('')
  const [editStartTime, setEditStartTime] = useState('')
  const [editEndTime, setEditEndTime] = useState('')
  const [editInterviewType, setEditInterviewType] = useState('ONLINE')
  const [editLocation, setEditLocation] = useState('')
  const [editMaxCandidates, setEditMaxCandidates] = useState(1)
  const [editError, setEditError] = useState('')
  const [updating, setUpdating] = useState(false)

  // Delete states
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [slotToDelete, setSlotToDelete] = useState(null)

  useEffect(() => {
    loadSlots()
  }, [])

  async function loadSlots() {
    setLoading(true)
    try {
      const data = await fetchSlots()
      // sort by date and startTime
      const sorted = data.sort((a, b) => {
        const dateCompare = a.date.localeCompare(b.date)
        if (dateCompare !== 0) return dateCompare
        return a.startTime.localeCompare(b.startTime)
      })
      setSlots(sorted)
    } catch (err) {
      toast.error('Failed to load slots: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  // Time overlap check helper
  function checkOverlap(newD, newStart, newEnd, excludeId = null) {
    return slots.some(slot => {
      if (excludeId && slot.id === excludeId) return false
      if (slot.date !== newD) return false
      
      // Overlap formula: StartA < EndB and EndA > StartB
      return newStart < slot.endTime && newEnd > slot.startTime
    })
  }

  async function handleCreate(e) {
    e.preventDefault()
    setFormError('')

    if (!date || !startTime || !endTime || !location || !maxCandidates) {
      setFormError('All fields are required')
      return
    }

    if (startTime >= endTime) {
      setFormError('Start time must be before end time')
      return
    }

    if (maxCandidates < 1) {
      setFormError('Maximum candidates must be at least 1')
      return
    }

    // Check for overlap
    if (checkOverlap(date, startTime, endTime)) {
      setFormError('This slot overlaps with an existing slot on the same date!')
      toast.error('Schedule overlap detected')
      return
    }

    setCreating(true)
    try {
      await createSlot({
        date,
        startTime,
        endTime,
        interviewType,
        location,
        maxCandidates: parseInt(maxCandidates, 10)
      })
      toast.success('Interview slot created successfully')
      
      // Reset form
      setDate('')
      setStartTime('')
      setEndTime('')
      setInterviewType('ONLINE')
      setLocation('')
      setMaxCandidates(1)
      
      loadSlots()
    } catch (err) {
      setFormError(err.message || 'Failed to create slot')
    } finally {
      setCreating(false)
    }
  }

  function startEdit(slot) {
    setEditingSlot(slot)
    setEditDate(slot.date)
    setEditStartTime(slot.startTime)
    setEditEndTime(slot.endTime)
    setEditInterviewType(slot.interviewType)
    setEditLocation(slot.location)
    setEditMaxCandidates(slot.maxCandidates)
    setEditError('')
  }

  async function handleUpdate(e) {
    e.preventDefault()
    setEditError('')

    if (!editDate || !editStartTime || !editEndTime || !editLocation || !editMaxCandidates) {
      setEditError('All fields are required')
      return
    }

    if (editStartTime >= editEndTime) {
      setEditError('Start time must be before end time')
      return
    }

    if (editMaxCandidates < editingSlot.bookedCount) {
      setEditError(`Cannot set max candidates below current booked count (${editingSlot.bookedCount})`)
      return
    }

    // Check for overlap
    if (checkOverlap(editDate, editStartTime, editEndTime, editingSlot.id)) {
      setEditError('This slot overlaps with an existing slot on the same date!')
      toast.error('Schedule overlap detected')
      return
    }

    setUpdating(true)
    try {
      await updateSlot(editingSlot.id, {
        date: editDate,
        startTime: editStartTime,
        endTime: editEndTime,
        interviewType: editInterviewType,
        location: editLocation,
        maxCandidates: parseInt(editMaxCandidates, 10)
      })
      toast.success('Interview slot updated successfully')
      setEditingSlot(null)
      loadSlots()
    } catch (err) {
      setEditError(err.message || 'Failed to update slot')
    } finally {
      setUpdating(false)
    }
  }

  function confirmDelete(slot) {
    setSlotToDelete(slot)
    setDeleteConfirmOpen(true)
  }

  async function handleDelete() {
    setDeleteConfirmOpen(false)
    if (!slotToDelete) return

    try {
      await deleteSlot(slotToDelete.id)
      toast.success('Slot deleted successfully')
      loadSlots()
    } catch (err) {
      toast.error(err.message || 'Cannot delete slot. It might contain bookings.')
    } finally {
      setSlotToDelete(null)
    }
  }

  return (
    <div className="max-w-6xl mx-auto font-sans">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-outfit text-3xl font-bold text-slate-900 tracking-tight">Manage Interview Slots</h1>
          <p className="text-slate-500 text-sm mt-1">Create and modify availability schedules for candidate interviews</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Create Form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sticky top-24">
            <h2 className="font-outfit text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Plus className="text-indigo-600 w-5 h-5" />
              Create New Slot
            </h2>

            {formError && (
              <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-100 flex items-start gap-2 text-rose-700 text-xs">
                <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-600 rounded-xl px-3 py-2 text-sm outline-none transition"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Start Time</label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={e => setStartTime(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-600 rounded-xl px-3 py-2 text-sm outline-none transition"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">End Time</label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={e => setEndTime(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-600 rounded-xl px-3 py-2 text-sm outline-none transition"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Type</label>
                <select
                  value={interviewType}
                  onChange={e => setInterviewType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-600 rounded-xl px-3 py-2 text-sm outline-none transition"
                >
                  <option value="ONLINE">Online (Virtual Meeting)</option>
                  <option value="OFFLINE">Offline (In-Person)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                  {interviewType === 'ONLINE' ? 'Meeting Link' : 'Location / Office'}
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  placeholder={interviewType === 'ONLINE' ? 'e.g. Google Meet URL' : 'e.g. Conf Room A, 4th Floor'}
                  className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-600 rounded-xl px-3 py-2 text-sm outline-none transition"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Max Candidates</label>
                <input
                  type="number"
                  min="1"
                  value={maxCandidates}
                  onChange={e => setMaxCandidates(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-600 rounded-xl px-3 py-2 text-sm outline-none transition"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={creating}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-xl shadow-md hover:shadow transition flex items-center justify-center gap-2 text-sm disabled:bg-slate-300"
              >
                {creating ? 'Creating...' : 'Create Slot'}
              </button>
            </form>
          </div>
        </div>

        {/* Slot List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h2 className="font-outfit text-lg font-bold text-slate-800 mb-4">Availability List</h2>

            {loading ? (
              <div className="py-12 flex justify-center"><Spinner size="lg" /></div>
            ) : slots.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-slate-200 rounded-2xl text-slate-400">
                <Calendar className="mx-auto w-10 h-10 mb-2 opacity-50" />
                <p className="text-sm">No slots created yet. Set up your availability.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {slots.map(slot => (
                  <div
                    key={slot.id}
                    className="p-4 rounded-xl border border-slate-150 hover:border-indigo-200 bg-white shadow-sm transition-all duration-200 hover:shadow"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <Calendar size={15} className="text-indigo-600" />
                          <span className="font-semibold text-slate-900 text-sm">{slot.date}</span>
                          <span className={`inline-flex items-center gap-1 py-0.5 px-2 rounded-full text-[10px] font-bold ${
                            slot.interviewType === 'ONLINE'
                              ? 'bg-sky-50 text-sky-700 border border-sky-100'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                          }`}>
                            {slot.interviewType === 'ONLINE' ? <Video size={10} /> : <MapPin size={10} />}
                            {slot.interviewType}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <Clock size={14} className="text-slate-400" />
                            {slot.startTime} - {slot.endTime}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin size={14} className="text-slate-400" />
                            <span className="max-w-[200px] truncate" title={slot.location}>{slot.location}</span>
                          </span>
                          <span className="flex items-center gap-1 font-medium text-slate-700">
                            <Users size={14} className="text-slate-400" />
                            Seats: {slot.bookedCount} / {slot.maxCandidates}
                          </span>
                        </div>
                        
                        <div className="text-[10px] text-slate-400 italic">
                          Created by: {slot.createdBy?.fullName || 'HR Administrator'}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                        <button
                          onClick={() => startEdit(slot)}
                          className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-200 transition"
                          title="Edit slot"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          onClick={() => confirmDelete(slot)}
                          className="p-2 rounded-lg bg-rose-50 border border-rose-100 text-rose-600 hover:bg-rose-100 hover:text-rose-700 transition"
                          title="Delete slot"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editingSlot && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full border border-slate-100 p-6 relative">
            <button
              onClick={() => setEditingSlot(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition"
            >
              <X size={18} />
            </button>

            <h3 className="font-outfit text-lg font-bold text-slate-950 mb-4">Edit Interview Slot</h3>

            {editError && (
              <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-100 flex items-start gap-2 text-rose-700 text-xs">
                <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{editError}</span>
              </div>
            )}

            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Date</label>
                <input
                  type="date"
                  value={editDate}
                  onChange={e => setEditDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-600 rounded-xl px-3 py-2 text-sm outline-none transition"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Start Time</label>
                  <input
                    type="time"
                    value={editStartTime}
                    onChange={e => setEditStartTime(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-600 rounded-xl px-3 py-2 text-sm outline-none transition"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">End Time</label>
                  <input
                    type="time"
                    value={editEndTime}
                    onChange={e => setEditEndTime(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-600 rounded-xl px-3 py-2 text-sm outline-none transition"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Type</label>
                <select
                  value={editInterviewType}
                  onChange={e => setEditInterviewType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-600 rounded-xl px-3 py-2 text-sm outline-none transition"
                >
                  <option value="ONLINE">Online (Virtual Meeting)</option>
                  <option value="OFFLINE">Offline (In-Person)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                  {editInterviewType === 'ONLINE' ? 'Meeting Link' : 'Location / Office'}
                </label>
                <input
                  type="text"
                  value={editLocation}
                  onChange={e => setEditLocation(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-600 rounded-xl px-3 py-2 text-sm outline-none transition"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Max Candidates</label>
                <input
                  type="number"
                  min="1"
                  value={editMaxCandidates}
                  onChange={e => setEditMaxCandidates(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-600 rounded-xl px-3 py-2 text-sm outline-none transition"
                  required
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingSlot(null)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2 rounded-xl text-sm transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-xl text-sm transition flex items-center justify-center gap-2 disabled:bg-slate-300"
                >
                  {updating ? 'Updating...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={deleteConfirmOpen}
        title="Delete Interview Slot"
        message="Are you sure you want to delete this availability slot? Candidates who booked this slot will be affected. This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => { setDeleteConfirmOpen(false); setSlotToDelete(null); }}
        confirmText="Delete Slot"
        danger={true}
      />
    </div>
  )
}
