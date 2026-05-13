const API_BASE_URL = 'http://localhost:8080/api'

export async function signup(name, email, password, role = 'CANDIDATE') {
  const res = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password, role })
  })
  if (!res.ok) throw new Error('Signup failed')
  return res.json()
}

export async function login(email, password) {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })
  if (!res.ok) throw new Error('Login failed')
  return res.json()
}

export async function fetchSlots() {
  const res = await fetch(`${API_BASE_URL}/slots`)
  if (!res.ok) throw new Error('Failed to fetch slots')
  return res.json()
}

export async function createSlot(date, startTime, endTime) {
  const res = await fetch(`${API_BASE_URL}/slots`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ date, startTime, endTime, available: true })
  })
  if (!res.ok) throw new Error('Failed to create slot')
  return res.json()
}

export async function createBooking(userId, interviewSlotId) {
  const res = await fetch(`${API_BASE_URL}/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, interviewSlotId })
  })
  if (!res.ok) throw new Error('Failed to create booking')
  return res.json()
}

export async function getMyBookings(userId) {
  const res = await fetch(`${API_BASE_URL}/bookings/my?userId=${userId}`)
  if (!res.ok) throw new Error('Failed to fetch bookings')
  return res.json()
}

export async function updateBookingStatus(bookingId, status) {
  const res = await fetch(`${API_BASE_URL}/bookings/${bookingId}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  })
  if (!res.ok) throw new Error('Failed to update booking status')
  return res.json()
}
