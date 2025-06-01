
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProjectPage from './pages/ProjectPage';
import DashboardPage from './pages/DashboardPage';
import { InvestmentProvider } from './contexts/InvestmentContext';

const App: React.FC = () => {
  return (
    <InvestmentProvider>
      <HashRouter>
        <div className="flex flex-col min-h-screen font-sans">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/project/:projectId" element={<ProjectPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </HashRouter>
    </InvestmentProvider>
  );
};

export default App;
