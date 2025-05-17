import React from 'react'
// import '../Call/'

import { Call } from '../../types/Call.types'

interface Props {
  call: Call
}

const CallDetails: React.FC<Props> = ({ call }) => {
  return (
    <div className="call-container">
      <div className="call-content">
        <h1 className="call-title">קריאה #{call.id}</h1>

        <div className="call-grid">
          <div>מיקום X: {call.locationX}</div>
          <div>מיקום Y: {call.locationY}</div>
          <div>דחיפות: {call.urgencyLevel ?? '—'}</div>
          <div>סטטוס: {call.status ?? '—'}</div>
          <div>מתנדבים: {call.numVolanteer}</div>
        </div>

        {call.imageUrl && (
          <div className="call-image">
            <img src={call.imageUrl} alt="תמונה מהזירה" />
          </div>
        )}

        {call.description && (
          <>
            <h2 className="section-title">תיאור</h2>
            <p className="call-description">{call.description}</p>
          </>
        )}

        <h2 className="section-title">מתנדבים:</h2>
        <ul>
          {call.volunteerCalls.map(v => (
            <li key={v.id}>{v.name} - {v.status}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default CallDetails
