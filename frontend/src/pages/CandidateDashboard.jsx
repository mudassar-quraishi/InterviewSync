import React from 'react'
import SlotList from '../components/SlotList'

export default function CandidateDashboard(){
  return (
    <div className="max-w-5xl mx-auto">
      <h2 className="text-lg font-semibold mb-4">Available Slots</h2>
      <SlotList />
    </div>
  )
}
