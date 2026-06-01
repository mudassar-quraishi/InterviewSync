import React, { useState, useEffect } from 'react'
import { fetchBookings, acceptBooking, rejectBooking, completeBooking, getAllCandidates, deleteCandidate } from '../../services/api'
import { toast } from 'react-hot-toast'
import StatusBadge from '../../components/StatusBadge'
import Spinner from '../../components/Spinner'
import ConfirmDialog from '../../components/ConfirmDialog'
import { Users, Mail, Phone, Calendar, Clock, MapPin, Search, CheckCircle, XCircle, Award, CheckSquare, User, ClipboardList, UserMinus } from 'lucide-react'

export default function ManageCandidates() {
  const [activeTab, setActiveTab] = useState('bookings') // 'bookings' or 'candidates'
  const [bookings, setBookings] = useState([])
  const [candidates, setCandidates] = useState([])
  const [loadingBookings, setLoadingBookings] = useState(true)
  const [loadingCandidates, setLoadingCandidates] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL') // ALL, PENDING, ACCEPTED, REJECTED, COMPLETED
  const [actionLoadingId, setActionLoadingId] = useState(null)
  const [candidateToDelete, setCandidateToDelete] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    loadBookings()
    loadCandidates()
  }, [])

  async function loadBookings() {
    setLoadingBookings(true)
    try {
      const data = await fetchBookings()
      const sorted = data.sort((a, b) => new Date(b.bookingDate) - new Date(a.bookingDate))
      setBookings(sorted)
    } catch (err) {
      toast.error('Failed to load bookings: ' + err.message)
    } finally {
      setLoadingBookings(false)
    }
  }

  async function loadCandidates() {
    setLoadingCandidates(true)
    try {
      const data = await getAllCandidates()
      setCandidates(data)
    } catch (err) {
      toast.error('Failed to load candidates pool: ' + err.message)
    } finally {
      setLoadingCandidates(false)
    }
  }

  async function handleAccept(id) {
    setActionLoadingId(id)
    try {
      await acceptBooking(id)
      toast.success('Interview accepted!')
      loadBookings()
    } catch (err) {
      toast.error('Failed to accept booking: ' + err.message)
    } finally {
      setActionLoadingId(null)
    }
  }

  async function handleReject(id) {
    setActionLoadingId(id)
    try {
      await rejectBooking(id)
      toast.success('Interview rejected')
      loadBookings()
    } catch (err) {
      toast.error('Failed to reject booking: ' + err.message)
    } finally {
      setActionLoadingId(null)
    }
  }

  async function handleComplete(id) {
    setActionLoadingId(id)
    try {
      await completeBooking(id)
      toast.success('Interview marked as Completed!')
      loadBookings()
    } catch (err) {
      toast.error('Failed to complete booking: ' + err.message)
    } finally {
      setActionLoadingId(null)
    }
  }

  async function handleDeleteCandidate() {
    if (!candidateToDelete) return
    setIsDeleting(true)
    try {
      await deleteCandidate(candidateToDelete.id)
      toast.success('Candidate deleted successfully!')
      setCandidateToDelete(null)
      loadCandidates()
      loadBookings()
    } catch (err) {
      toast.error('Failed to delete candidate: ' + err.message)
    } finally {
      setIsDeleting(false)
    }
  }

  // Filter Bookings logic
  const filteredBookings = bookings.filter(b => {
    const matchesStatus = statusFilter === 'ALL' || b.status === statusFilter
    const candidateName = b.candidateName?.toLowerCase() || ''
    const candidateEmail = b.candidateEmail?.toLowerCase() || ''
    const location = b.location?.toLowerCase() || ''
    const search = searchQuery.toLowerCase()
    
    return matchesStatus && (candidateName.includes(search) || candidateEmail.includes(search) || location.includes(search))
  })

  // Filter Candidates logic
  const filteredCandidates = candidates.filter(c => {
    const candidateName = c.fullName?.toLowerCase() || ''
    const candidateEmail = c.email?.toLowerCase() || ''
    const candidatePhone = c.phone?.toLowerCase() || ''
    const search = searchQuery.toLowerCase()
    
    return candidateName.includes(search) || candidateEmail.includes(search) || candidatePhone.includes(search)
  })

  return (
    <div className="max-w-6xl mx-auto font-sans">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-outfit text-3xl font-bold text-slate-900 tracking-tight">Candidates & Bookings</h1>
          <p className="text-slate-500 text-sm mt-1">
            {activeTab === 'bookings' 
              ? 'Review candidate interview bookings, accept/reject requests, and log completed interviews'
              : 'View all registered candidates and candidate directory details'}
          </p>
        </div>

        {/* Tab Selector pills */}
        <div className="flex bg-slate-200/60 p-1 rounded-xl self-start sm:self-center">
          <button
            onClick={() => { setActiveTab('bookings'); setSearchQuery(''); }}
            className={`py-1.5 px-3.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-200 flex items-center gap-1.5 ${
              activeTab === 'bookings' ? 'bg-indigo-600 text-white shadow' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ClipboardList size={14} />
            Bookings
          </button>
          <button
            onClick={() => { setActiveTab('candidates'); setSearchQuery(''); }}
            className={`py-1.5 px-3.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-200 flex items-center gap-1.5 ${
              activeTab === 'candidates' ? 'bg-indigo-600 text-white shadow' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users size={14} />
            Registered Pool
          </button>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
            <Search size={16} />
          </span>
          <input
            type="text"
            placeholder={activeTab === 'bookings' ? "Search candidate name, email, or location..." : "Search by candidate name, email, or phone..."}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-600 rounded-xl pl-10 pr-4 py-2 text-sm outline-none transition"
          />
        </div>

        {/* Status Tabs (only visible for Bookings tab) */}
        {activeTab === 'bookings' && (
          <div className="flex flex-wrap gap-1.5 bg-slate-100 p-1 rounded-xl">
            {['ALL', 'PENDING', 'ACCEPTED', 'REJECTED', 'COMPLETED'].map(status => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`py-1.5 px-3 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                  statusFilter === status
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Bookings View */}
      {activeTab === 'bookings' && (
        loadingBookings ? (
          <div className="py-20 flex justify-center"><Spinner size="lg" /></div>
        ) : filteredBookings.length === 0 ? (
          <div className="bg-white text-center py-16 border border-slate-200 rounded-2xl text-slate-400 shadow-sm">
            <ClipboardList className="mx-auto w-12 h-12 mb-3 opacity-40 text-indigo-500" />
            <p className="text-sm font-medium">No bookings match the current search or filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredBookings.map(booking => (
              <div
                key={booking.id}
                className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col justify-between hover:shadow-md transition-all duration-200"
              >
                {/* Header */}
                <div className="p-5 border-b border-slate-100 flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-outfit font-bold text-slate-900 text-base">{booking.candidateName}</h3>
                    <div className="flex flex-col gap-0.5 text-xs text-slate-500 mt-1">
                      <span className="flex items-center gap-1.5">
                        <Mail size={13} className="text-slate-400" />
                        {booking.candidateEmail}
                      </span>
                      {booking.candidatePhone && (
                        <span className="flex items-center gap-1.5">
                          <Phone size={13} className="text-slate-400" />
                          {booking.candidatePhone}
                        </span>
                      )}
                    </div>
                  </div>
                  <StatusBadge status={booking.status} />
                </div>

                {/* Body */}
                <div className="p-5 bg-slate-50/50 space-y-3 flex-grow">
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Scheduled Interview Details</div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-indigo-500" />
                      <span>{booking.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-indigo-500" />
                      <span>{booking.startTime} - {booking.endTime}</span>
                    </div>
                    <div className="sm:col-span-2 flex items-center gap-2">
                      <MapPin size={14} className="text-indigo-500 shrink-0" />
                      <span className="truncate" title={booking.location}>{booking.location}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Interview Type: <strong>{booking.interviewType}</strong></span>
                    <span>Booked: {new Date(booking.bookingDate).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Actions Footer */}
                {booking.status === 'PENDING' && (
                  <div className="p-4 bg-white border-t border-slate-100 flex gap-2 justify-end">
                    <button
                      onClick={() => handleReject(booking.id)}
                      disabled={actionLoadingId !== null}
                      className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1 px-3 py-1.5 border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-semibold transition"
                    >
                      <XCircle size={14} />
                      Reject
                    </button>
                    <button
                      onClick={() => handleAccept(booking.id)}
                      disabled={actionLoadingId !== null}
                      className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-100 hover:shadow transition"
                    >
                      <CheckCircle size={14} />
                      Accept Booking
                    </button>
                  </div>
                )}

                {booking.status === 'ACCEPTED' && (
                  <div className="p-4 bg-white border-t border-slate-100 flex gap-2 justify-end">
                    <button
                      onClick={() => handleComplete(booking.id)}
                      disabled={actionLoadingId !== null}
                      className="w-full inline-flex items-center justify-center gap-1 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-emerald-100 hover:shadow transition"
                    >
                      <CheckSquare size={14} />
                      Mark Interview as Completed
                    </button>
                  </div>
                )}

                {booking.status === 'COMPLETED' && (
                  <div className="p-3.5 bg-slate-50 border-t border-slate-100 text-center text-xs font-semibold text-slate-400 flex items-center justify-center gap-1">
                    <Award size={14} className="text-indigo-400" />
                    Hiring assessment stage closed
                  </div>
                )}

                {booking.status === 'REJECTED' && (
                  <div className="p-3.5 bg-slate-50 border-t border-slate-100 text-center text-xs font-semibold text-rose-500/70 flex items-center justify-center gap-1">
                    <XCircle size={14} />
                    Booking rejected by team
                  </div>
                )}
              </div>
            ))}
          </div>
        )
      )}

      {/* Candidates Pool View */}
      {activeTab === 'candidates' && (
        loadingCandidates ? (
          <div className="py-20 flex justify-center"><Spinner size="lg" /></div>
        ) : filteredCandidates.length === 0 ? (
          <div className="bg-white text-center py-16 border border-slate-200 rounded-2xl text-slate-400 shadow-sm">
            <Users className="mx-auto w-12 h-12 mb-3 opacity-40 text-indigo-500" />
            <p className="text-sm font-medium">No candidates registered in the pool yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCandidates.map(candidate => (
              <div
                key={candidate.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow transition-all duration-200 flex flex-col justify-between"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-outfit font-bold text-base shadow-sm shrink-0">
                      {candidate.fullName?.charAt(0)?.toUpperCase() || 'C'}
                    </div>
                    <div>
                      <h3 className="font-outfit font-bold text-slate-900 text-sm leading-none">{candidate.fullName}</h3>
                      <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block mt-1">Candidate Profile</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setCandidateToDelete(candidate)}
                    className="p-1.5 rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition shrink-0"
                    title="Delete Candidate"
                  >
                    <UserMinus size={16} />
                  </button>
                </div>

                <div className="space-y-2 text-xs text-slate-600 pt-3 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <Mail size={14} className="text-slate-400" />
                    <span className="truncate" title={candidate.email}>{candidate.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={14} className="text-slate-400" />
                    <span>{candidate.phone || <span className="text-slate-400 italic">No phone number</span>}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* Confirm Delete Candidate Dialog */}
      <ConfirmDialog
        open={candidateToDelete !== null}
        title="Delete Candidate"
        message={`Are you sure you want to delete candidate "${candidateToDelete?.fullName}"? This will permanently delete their account, cancel all their active and historical interview bookings, and release their reserved time slots.`}
        onConfirm={handleDeleteCandidate}
        onCancel={() => setCandidateToDelete(null)}
        confirmText={isDeleting ? 'Deleting...' : 'Delete Candidate'}
        danger={true}
      />
    </div>
  )
}
