// src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import EditorPage from './pages/EditorPage';

function App() {
  return (
    <>
      {/* Toaster for notifications */}
      <Toaster
                position="top-right"
                toastOptions={{
                    style: {
                        background: '#000000', // Pitch black background
                        color: '#FFFFFF',      // White text
                        border: '1px solid #FFFFFF', // White border
                    },
                }}
            ></Toaster>

      {/* Main application routes */}
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/editor/:documentId" element={<EditorPage />} />
      </Routes>
    </>
  );
}

export default App;