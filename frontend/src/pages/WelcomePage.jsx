import React from 'react';
import { Link } from 'react-router-dom';

export default function WelcomePage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">Welcome to AI Benchmark Hub</h1>
      <p className="mb-6">Analyze your sensor data with ease.</p>
      <Link to="/upload" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
        Get Started
      </Link>
    </div>
  );
}