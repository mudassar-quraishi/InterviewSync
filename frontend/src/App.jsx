import React from 'react'
import Header from './components/Header'
import pages from './pages'

export default function App(){
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="p-6">
        <h1 className="text-2xl font-semibold text-slate-800">InterviewSync (Frontend)</h1>
        <p className="mt-4 text-slate-600">This is a minimal scaffold. Replace with your dashboard pages.</p>
      </main>
    </div>
  )
}
