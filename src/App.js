import { BrowserRouter as Router } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "tailwindcss/tailwind.css";
import "./styles/index.css";

import AppRouter from "./appRouter";
import { AppProvider } from "./contexts/appContext";
import { Loader } from "./components";

function App() {
  return (
    <div className="App">
      <Router basename={"/"}>
        <AppProvider>
          <Loader />
          <ToastContainer position="top-center" autoClose={3000} />
          <AppRouter />
        </AppProvider>
      </Router>
    </div>
  );
}

export default App;
