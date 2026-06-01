import React from 'react'

const statusConfig = {
  PENDING: { bg: 'bg-amber-100', text: 'text-amber-800', dot: 'bg-amber-500', label: 'Pending' },
  ACCEPTED: { bg: 'bg-emerald-100', text: 'text-emerald-800', dot: 'bg-emerald-500', label: 'Accepted' },
  REJECTED: { bg: 'bg-red-100', text: 'text-red-800', dot: 'bg-red-500', label: 'Rejected' },
  COMPLETED: { bg: 'bg-blue-100', text: 'text-blue-800', dot: 'bg-blue-500', label: 'Completed' }
}

export default function StatusBadge({ status }) {
  const config = statusConfig[status] || statusConfig.PENDING

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`}></span>
      {config.label}
    </span>
  )
}
