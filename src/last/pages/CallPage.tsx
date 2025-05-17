import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { getCallById } from '../services/CallService'
import { Call } from '../types/Call.types'
import CallDetails from '../components/Call/CallDetails'

const CallPage = () => {
  const { id } = useParams<{ id: string }>()
  const [call, setCall] = useState<Call | null>(null)

  useEffect(() => {
    if (id) {
      getCallById(Number(id)).then(setCall)
    }
  }, [id])

  if (!call) return <div>טוען קריאה...</div>

  return <CallDetails call={call} />
}

export default CallPage
