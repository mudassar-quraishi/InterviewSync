const API_BASE_URL = 'http://localhost:8080/api'

function getToken() {
  try {
    const user = JSON.parse(localStorage.getItem('user'))
    return user?.token || null
  } catch {
    return null
  }
}

function authHeaders() {
  const token = getToken()
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`
  return headers
}

async function handleResponse(res) {
  if (res.status === 401) {
    localStorage.removeItem('user')
    window.location.href = '/login'
    throw new Error('Session expired. Please login again.')
  }
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.message || `Request failed with status ${res.status}`)
  }
  const text = await res.text()
  return text ? JSON.parse(text) : null
}

// Auth
export async function register(fullName, email, password, role, phone, companyName) {
  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fullName, email, password, role, phone, companyName })
  })
  return handleResponse(res)
}

export async function login(email, password) {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })
  return handleResponse(res)
}

// Slots
export async function fetchSlots(availableOnly = false) {
  const url = availableOnly ? `${API_BASE_URL}/slots?available=true` : `${API_BASE_URL}/slots`
  const res = await fetch(url, { headers: authHeaders() })
  return handleResponse(res)
}

export async function fetchSlotById(id) {
  const res = await fetch(`${API_BASE_URL}/slots/${id}`, { headers: authHeaders() })
  return handleResponse(res)
}

export async function createSlot(data) {
  const res = await fetch(`${API_BASE_URL}/slots`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data)
  })
  return handleResponse(res)
}

export async function updateSlot(id, data) {
  const res = await fetch(`${API_BASE_URL}/slots/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(data)
  })
  return handleResponse(res)
}

export async function deleteSlot(id) {
  const res = await fetch(`${API_BASE_URL}/slots/${id}`, {
    method: 'DELETE',
    headers: authHeaders()
  })
  return handleResponse(res)
}

// Bookings
export async function createBooking(interviewSlotId) {
  const res = await fetch(`${API_BASE_URL}/bookings`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ interviewSlotId })
  })
  return handleResponse(res)
}

export async function fetchBookings() {
  const res = await fetch(`${API_BASE_URL}/bookings`, { headers: authHeaders() })
  return handleResponse(res)
}

export async function fetchBookingById(id) {
  const res = await fetch(`${API_BASE_URL}/bookings/${id}`, { headers: authHeaders() })
  return handleResponse(res)
}

export async function cancelBooking(id) {
  const res = await fetch(`${API_BASE_URL}/bookings/${id}`, {
    method: 'DELETE',
    headers: authHeaders()
  })
  return handleResponse(res)
}

export async function acceptBooking(id) {
  const res = await fetch(`${API_BASE_URL}/bookings/${id}/accept`, {
    method: 'PUT',
    headers: authHeaders()
  })
  return handleResponse(res)
}

export async function rejectBooking(id) {
  const res = await fetch(`${API_BASE_URL}/bookings/${id}/reject`, {
    method: 'PUT',
    headers: authHeaders()
  })
  return handleResponse(res)
}

export async function completeBooking(id) {
  const res = await fetch(`${API_BASE_URL}/bookings/${id}/complete`, {
    method: 'PUT',
    headers: authHeaders()
  })
  return handleResponse(res)
}

// Dashboard
export async function fetchDashboardStats() {
  const res = await fetch(`${API_BASE_URL}/dashboard/stats`, { headers: authHeaders() })
  return handleResponse(res)
}

// Candidates
export async function getAllCandidates() {
  const res = await fetch(`${API_BASE_URL}/auth/candidates`, { headers: authHeaders() })
  return handleResponse(res)
}

export async function deleteCandidate(id) {
  const res = await fetch(`${API_BASE_URL}/auth/candidates/${id}`, {
    method: 'DELETE',
    headers: authHeaders()
  })
  return handleResponse(res)
}

