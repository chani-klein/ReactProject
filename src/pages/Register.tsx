import React from 'react'
import { useLocation } from 'react-router-dom'

const Register = () => {
  const location = useLocation()
  const isVolunteer = new URLSearchParams(location.search).get('type') === 'volunteer'

  return (
    <div style={{ padding: 40 }}>
      <h1>{isVolunteer ? 'הרשמה כמתנדב' : 'הרשמה למערכת'}</h1>
      <form style={{ display: 'flex', flexDirection: 'column', maxWidth: 400, gap: 15 }}>
        <input placeholder="שם מלא" />
        <input placeholder="אימייל" type="email" />
        <input placeholder="סיסמה" type="password" />
        {isVolunteer && <input placeholder="תחום פעילות (עיר/אזור)" />}
        <button type="submit">הרשמה</button>
      </form>
    </div>
  )
}

export default Register
