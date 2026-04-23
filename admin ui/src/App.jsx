// src/App.jsx
import { BrowserRouter as Router } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from "./contexts/AuthContext";
import { DashboardProvider } from "./contexts/DashboardContext";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <Router>
      <AuthProvider>
        <DashboardProvider>
          <div className="App">
            <AppRoutes />
          </div>
        </DashboardProvider>
      </AuthProvider>
      
      {/* Toast Notifications */}
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        toastClassName="font-sans"
        progressClassName="bg-gradient-to-r from-emerald-400 to-emerald-600"
      />
    </Router>
  );
}

export default App;