import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import DashboardLayout from './layouts/DashboardLayout'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import HrDashboard from './pages/HrDashboard'
import CandidateDashboard from './pages/CandidateDashboard'
import ManageSlots from './pages/hr/ManageSlots'
import ManageCandidates from './pages/hr/ManageCandidates'
import Reports from './pages/hr/Reports'
import AvailableSlots from './pages/candidate/AvailableSlots'
import MyBookings from './pages/candidate/MyBookings'
import ProfilePage from './pages/ProfilePage'

function DashboardRedirect() {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  return user.role === 'HR' ? <HrDashboard /> : <CandidateDashboard />
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: { borderRadius: '10px', background: '#1e293b', color: '#f8fafc', fontSize: '14px' },
            success: { iconTheme: { primary: '#10b981', secondary: '#f8fafc' } },
            error: { iconTheme: { primary: '#ef4444', secondary: '#f8fafc' } },
          }}
        />
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected routes with sidebar layout */}
          <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route path="/dashboard" element={<DashboardRedirect />} />
            <Route path="/profile" element={<ProfilePage />} />

            {/* HR only routes */}
            <Route path="/slots" element={<ProtectedRoute allowedRoles={['HR']}><ManageSlots /></ProtectedRoute>} />
            <Route path="/candidates" element={<ProtectedRoute allowedRoles={['HR']}><ManageCandidates /></ProtectedRoute>} />
            <Route path="/reports" element={<ProtectedRoute allowedRoles={['HR']}><Reports /></ProtectedRoute>} />

            {/* Candidate only routes */}
            <Route path="/available-slots" element={<ProtectedRoute allowedRoles={['CANDIDATE']}><AvailableSlots /></ProtectedRoute>} />
            <Route path="/my-bookings" element={<ProtectedRoute allowedRoles={['CANDIDATE']}><MyBookings /></ProtectedRoute>} />
          </Route>

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
