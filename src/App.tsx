import { Provider } from "react-redux";
import store from "./redux/store";
import Router from "./routes/Router";
import InitializedAuth from "./auth/InitializedAuth";

function App() {
  return (
    <Provider store={store}>
      <InitializedAuth />
      <Router />
    </Provider>
  );
}


export default App;
