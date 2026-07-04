import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

// Import all your pages
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import UploadPage from './pages/UploadPage'; // <-- We imported the new page here

export default function App() {
  return (
    <BrowserRouter>
      {/* The Master Layout: Flex column keeps the navbar at top and pages filling the rest */}
      <div className="flex flex-col h-screen w-screen overflow-y-auto bg-slate-50">
        
        {/* The Blue Navigation Bar */}
        <nav className="bg-blue-600 text-white px-6 py-4 flex gap-6 shrink-0 z-50 shadow-md">
          <Link to="/" className="font-medium hover:text-blue-200 transition">Home</Link>
          <Link to="/upload" className="font-medium hover:text-blue-200 transition">Upload</Link>
          <Link to="/dashboard" className="font-medium hover:text-blue-200 transition">Dashboard</Link>
        </nav>
        
        {/* The Page Container */}
        <main className="flex-grow relative h-full w-full overflow-y-auto">
          <Routes>
            <Route path="/" element={<HomePage />} />
            
            {/* We replaced the "Coming Soon" text with your actual UploadPage component */}
            <Route path="/upload" element={<UploadPage />} />
            
            <Route path="/dashboard" element={<DashboardPage />} />
          </Routes>
        </main>

      </div>
    </BrowserRouter>
  );
}