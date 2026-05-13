import React, { useEffect, useState } from 'react'
import Header from './components/Header'
import AuthPage from './pages/AuthPage'
import CandidateDashboard from './pages/CandidateDashboard'
import HrDashboard from './pages/HrDashboard'

export default function App(){
  const [user, setUser] = useState(null)
  const [role, setRole] = useState('candidate')

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser)
      setUser(parsedUser)
      setRole(parsedUser.role === 'HR' ? 'hr' : 'candidate')
    }
  }, [])

  function handleAuthSuccess(userData) {
    setUser(userData)
    setRole(userData.role === 'HR' ? 'hr' : 'candidate')
  }

  function handleLogout() {
    localStorage.removeItem('user')
    setUser(null)
    setRole('candidate')
  }

  if (!user) {
    return <AuthPage onAuthSuccess={handleAuthSuccess} />
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header role={role} setRole={setRole} user={user} onLogout={handleLogout} />
      <main className="p-6">
        {role === 'candidate' ? <CandidateDashboard user={user} /> : <HrDashboard user={user} />}
      </main>
    </div>
  )
}
