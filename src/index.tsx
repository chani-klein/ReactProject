import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'; // אם יש לך קובץ CSS כלשהו
import App from './App'; // ודא ש- App נמצא בתיקיית src

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
