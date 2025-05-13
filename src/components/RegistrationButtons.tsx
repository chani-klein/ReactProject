import React from 'react'

const RegistrationButtons = () => {
  const buttonStyle = {
    padding: '15px 30px',
    fontSize: '1.2rem',
    border: 'none',
    borderRadius: '30px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  } as React.CSSProperties

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <button
        style={{
          ...buttonStyle,
          backgroundColor: 'red',
          color: 'white',
        }}
        onClick={() => window.location.href = '/register'}
        onMouseOver={(e) => (e.currentTarget.style.opacity = '0.85')}
        onMouseOut={(e) => (e.currentTarget.style.opacity = '1')}
      >
        הרשמה כמשתמש
      </button>

      <button
        style={{
          ...buttonStyle,
          backgroundColor: '#ff3b3b',
          color: 'black',
        }}
        onClick={() => window.location.href = '/register?type=volunteer'}
        onMouseOver={(e) => (e.currentTarget.style.opacity = '0.85')}
        onMouseOut={(e) => (e.currentTarget.style.opacity = '1')}
      >
        הרשמה כמתנדב
      </button>

      <button
        style={{
          ...buttonStyle,
          backgroundColor: '#4CAF50',
          color: 'white',
        }}
        onClick={() => window.location.href = '/emergency'}
        onMouseOver={(e) => (e.currentTarget.style.opacity = '0.85')}
        onMouseOut={(e) => (e.currentTarget.style.opacity = '1')}
      >
        שליחת קריאת חירום
      </button>
    </div>
  )
}

export default RegistrationButtons
