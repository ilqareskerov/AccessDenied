import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar'; // Updated path
import Footer from './components/layout/Footer'; // Updated path
import HomePage from './pages/HomePage';
import ProjectPage from './pages/ProjectPage';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage'; // Added
import RegisterPage from './pages/RegisterPage'; // Added
// import { AuthProvider } from './contexts/AuthContext'; // TODO: Add Auth Context later for managing login state
import './index.css'; // Import Tailwind CSS

const App: React.FC = () => {
  // TODO: Add logic to check auth state and protect routes like Dashboard
  // const { isAuthenticated } = useAuth(); // Example with context

  return (
    // <AuthProvider> // Wrap with AuthProvider later
      <BrowserRouter>
        <div className="flex flex-col min-h-screen font-sans bg-gray-100"> {/* Basic background */}
          <Navbar />
          <main className="flex-grow container mx-auto px-4 py-8"> {/* Main content area */}
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/project/:projectId" element={<ProjectPage />} />
              <Route path="/dashboard" element={<DashboardPage />} /> {/* TODO: Protect this route */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              {/* Add routes for Project Creation, Admin later */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    // </AuthProvider>
  );
};

export default App;

