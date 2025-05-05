// import { Provider } from "react-redux";
// import store from "./redux/store";
// import Router from "./routes/Router";
// import InitializedAuth from "./auth/InitializedAuth";

// function App() {
//   return (
//     <Provider store={store}>
//       <InitializedAuth />
//       <Router />
//     </Provider>
//   );
// }

import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <Router>
    <AppRoutes />
    </Router>
  );
}

export default App;


