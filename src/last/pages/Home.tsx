import React from 'react'
import RegistrationButtons from '../components/RegistrationButtons'
import '../index.css'

const Home = () => {
  return (
    <div
      style={{
        backgroundImage: "url('/ambulance-bg.jpg')",
        backgroundSize: 'cover',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <div
        style={{
          backgroundColor: 'rgba(255,255,255,0.85)',
          padding: 40,
          borderRadius: 16,
          textAlign: 'center'
        }}
      >
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: 30 }}>
          הירשמו עכשיו כדי שתוכלו בזמן אמת להציל חיים
        </h1>
        <RegistrationButtons />
      </div>
    </div>
  )
}

export default Home
