import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { LandingPage } from './pages/LandingPage';
import { Dashboard } from './pages/Dashboard';
import { TelemetryAnalysis } from './pages/TelemetryAnalysis';
import { DriverComparison } from './pages/DriverComparison';
import { Drivers } from './pages/Drivers';
import { RaceAnalysis } from './pages/RaceAnalysis';
import { Circuits } from './pages/Circuits';
import { StrategySimulator } from './pages/StrategySimulator';
import { Champions } from './pages/Champions';

export const App: React.FC = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/telemetry" element={<TelemetryAnalysis />} />
            <Route path="/comparison" element={<DriverComparison />} />
            <Route path="/drivers" element={<Drivers />} />
            <Route path="/race-analysis" element={<RaceAnalysis />} />
            <Route path="/circuits" element={<Circuits />} />
            <Route path="/simulator" element={<StrategySimulator />} />
            <Route path="/champions" element={<Champions />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
