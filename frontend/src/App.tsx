import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
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
import { PageTransition } from './components/layout/PageTransition';

const AnimatedRoutes: React.FC = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><LandingPage /></PageTransition>} />
        <Route path="/dashboard" element={<PageTransition><Dashboard /></PageTransition>} />
        <Route path="/telemetry" element={<PageTransition><TelemetryAnalysis /></PageTransition>} />
        <Route path="/comparison" element={<PageTransition><DriverComparison /></PageTransition>} />
        <Route path="/drivers" element={<PageTransition><Drivers /></PageTransition>} />
        <Route path="/race-analysis" element={<PageTransition><RaceAnalysis /></PageTransition>} />
        <Route path="/circuits" element={<PageTransition><Circuits /></PageTransition>} />
        <Route path="/simulator" element={<PageTransition><StrategySimulator /></PageTransition>} />
        <Route path="/champions" element={<PageTransition><Champions /></PageTransition>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
};

export const App: React.FC = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <AnimatedRoutes />
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
