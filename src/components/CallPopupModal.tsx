"use client"

import type React from "react"

interface Call {
  id: string
  callerName: string
  // Add other properties as needed
}

interface CallPopupModalProps {
  call: Call | null
  onClose: () => void
  respondToCall: (callId: string, response: string) => void // Modified to accept a response
}

const CallPopupModal: React.FC<CallPopupModalProps> = ({ call, onClose, respondToCall }) => {
  if (!call) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-md shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Incoming Call</h2>
        <p>Caller: {call.callerName}</p>
        <div className="mt-4 flex justify-around">
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => {
              respondToCall(call.id, "going") // Updated line
              onClose()
            }}
          >
            Answer
          </button>
          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => {
              respondToCall(call.id, "cant") // Updated line
              onClose()
            }}
          >
            Decline
          </button>
          <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default CallPopupModal
