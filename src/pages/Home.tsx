import React from 'react';
import { useNavigate } from 'react-router';
import '../style/Home.css';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="overlay">
        <h1 className="main-title">
          הורידו כעת את האפליקציה<br />
          הירשמו עכשיו כדי שתוכלו<br />
          בזמן אמת להציל חיים
        </h1>
        <div className="button-group">
          <button className="btn-register" onClick={() => navigate('/register-user')}>
            להרשמה
          </button>
          <button className="btn-volunteer" onClick={() => navigate('/register-volunteer')}>
            הרשם <br /> כמתנדב
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
