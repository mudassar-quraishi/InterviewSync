import React from 'react'
import { AlertTriangle, X } from 'lucide-react'

export default function ConfirmDialog({ open, title, message, onConfirm, onCancel, confirmText = 'Confirm', danger = false }) {
  if (!open) return null

  return (
    <div
      className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4 transition-opacity duration-300"
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-2xl shadow-xl max-w-sm w-full border border-slate-100 p-6 relative flex flex-col items-center text-center transform scale-100 transition-all duration-300"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition"
        >
          <X size={18} />
        </button>

        <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${
          danger ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-500'
        }`}>
          <AlertTriangle size={24} />
        </div>

        <h3 className="font-outfit text-lg font-bold text-slate-900 mb-2">{title}</h3>
        <p className="text-xs text-slate-500 leading-relaxed mb-6">{message}</p>

        <div className="flex gap-3 w-full">
          <button
            onClick={onCancel}
            className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2 rounded-xl text-xs transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 font-semibold py-2 rounded-xl text-xs text-white transition shadow-sm ${
              danger
                ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-100 hover:shadow-md'
                : 'bg-indigo-600 hover:bg-indigo-750 shadow-indigo-150 hover:shadow-md'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}
