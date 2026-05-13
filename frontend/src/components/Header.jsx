import React from 'react'

export default function Header({role='candidate', setRole, user, onLogout}){
  return (
    <header className="bg-white border-b">
      <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="text-xl font-bold text-indigo-600">InterviewSync</div>
        <div className="flex items-center gap-4">
          <nav className="space-x-2 text-sm">
            <button onClick={() => setRole('candidate')} className={`px-4 py-2 rounded ${role==='candidate' ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-700'}`}>
              Candidate
            </button>
            <button onClick={() => setRole('hr')} className={`px-4 py-2 rounded ${role==='hr' ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-700'}`}>
              HR
            </button>
          </nav>
          <div className="border-l pl-4 flex items-center gap-3">
            <div className="text-sm">
              <div className="font-semibold">{user?.name}</div>
              <div className="text-xs text-slate-500">{user?.role}</div>
            </div>
            <button onClick={onLogout} className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700">
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
