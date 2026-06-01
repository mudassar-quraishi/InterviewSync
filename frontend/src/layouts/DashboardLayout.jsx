import React, { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  LayoutDashboard, Calendar, Users, FileText, User, LogOut,
  Menu, X, ChevronRight, Clock
} from 'lucide-react'

export default function DashboardLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  function handleLogout() {
    logout()
    navigate('/login')
  }

  const hrLinks = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/slots', icon: Calendar, label: 'Manage Slots' },
    { to: '/candidates', icon: Users, label: 'Manage Candidates' },
    { to: '/reports', icon: FileText, label: 'Reports' },
    { to: '/profile', icon: User, label: 'Profile' },
  ]

  const candidateLinks = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/available-slots', icon: Calendar, label: 'Available Slots' },
    { to: '/my-bookings', icon: Clock, label: 'My Bookings' },
    { to: '/profile', icon: User, label: 'Profile' },
  ]

  const links = user?.role === 'HR' ? hrLinks : candidateLinks

  return (
    <div className="dashboard-layout">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <Clock size={24} className="text-indigo-400" />
            <span className="sidebar-logo-text">InterviewSync</span>
          </div>
          <button className="sidebar-close-btn" onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {links.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/dashboard'}
              className={({ isActive }) => `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <link.icon size={18} />
              <span>{link.label}</span>
              <ChevronRight size={14} className="sidebar-link-arrow" />
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-avatar">
              {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">{user?.fullName}</div>
              <div className="sidebar-user-role">{user?.role}</div>
            </div>
          </div>
          <button className="sidebar-logout" onClick={handleLogout}>
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="main-content">
        {/* Top bar */}
        <header className="topbar">
          <button className="topbar-menu-btn" onClick={() => setSidebarOpen(true)}>
            <Menu size={22} />
          </button>
          <div className="topbar-right">
            <span className="topbar-greeting">Welcome, <strong>{user?.fullName}</strong></span>
            <div className="topbar-avatar">
              {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
