import React, { useEffect, useState } from 'react'

interface Location {
  lat: number | null;
  lng: number | null;
}

const Emergency = () => {
  const [location, setLocation] = useState<Location>({ lat: null, lng: null });

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(pos => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      }, err => {
        alert('לא ניתן לאתר מיקום');
      });
    }
  }, []);

  const handleSend = () => {
    // כאן תשלח לשרת שלך
    console.log('שולח קריאה:', location);
    alert('קריאה נשלחה למתנדבים באזור!');
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>שליחת קריאת חירום</h1>
      {location.lat !== null ? (
        <div>
          <p>המיקום שלך: {location.lat}, {location.lng}</p>
          <button onClick={handleSend}>שלח קריאה</button>
        </div>
      ) : (
        <p>מאתר מיקום...</p>
      )}
    </div>
  );
};

export default Emergency;
