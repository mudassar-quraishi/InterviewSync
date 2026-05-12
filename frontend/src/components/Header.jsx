import React from 'react'

export default function Header(){
  return (
    <header className="bg-white border-b">
      <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="text-xl font-bold text-indigo-600">InterviewSync</div>
        <nav className="space-x-4 text-sm text-slate-600">
          <a href="#" className="hover:text-indigo-600">Candidate</a>
          <a href="#" className="hover:text-indigo-600">HR</a>
        </nav>
      </div>
    </header>
  )
}
