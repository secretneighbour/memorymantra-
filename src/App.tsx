import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AccessibilityProvider } from './context/AccessibilityContext';
import { RoleProvider } from './context/RoleContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { DotMatrixBackground } from './components/DotMatrixBackground';
import { Watermark } from './components/Watermark';
import { RoleSwitcherModal } from './components/RoleSwitcherModal';
import { AICompanionDrawer } from './components/AICompanionDrawer';

// Pages
import { LandingPage } from './pages/LandingPage';
import { PatientDashboard } from './pages/PatientDashboard';
import { GamesHub } from './pages/GamesHub';
import { MemoryCompanionPage } from './pages/MemoryCompanionPage';
import { RemindersPage } from './pages/RemindersPage';
import { ProgressPage } from './pages/ProgressPage';
import { CaregiverDashboard } from './pages/CaregiverDashboard';
import { PatientProfilePage } from './pages/PatientProfilePage';
import { DoctorDashboard } from './pages/DoctorDashboard';
import { SettingsPage } from './pages/SettingsPage';

// Games
import { MemoryMatchGame } from './games/MemoryMatchGame';
import { SequenceRecallGame } from './games/SequenceRecallGame';
import { WordConnectGame } from './games/WordConnectGame';
import { PictureRecognitionGame } from './games/PictureRecognitionGame';

// Scroll to top helper on route navigation
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, [pathname]);

  return null;
};

export const App: React.FC = () => {
  return (
    <AccessibilityProvider>
      <RoleProvider>
        <Router>
          <ScrollToTop />
          <div className="relative min-h-screen flex flex-col justify-between selection:bg-ner-terracotta selection:text-white">
            <DotMatrixBackground />
            <Watermark />
            <Navbar />

            {/* Global Modals & Drawers */}
            <RoleSwitcherModal />
            <AICompanionDrawer />

            <main className="flex-grow z-10">
              <Routes>
                {/* Landing & Presentation */}
                <Route path="/" element={<LandingPage />} />

                {/* Patient Flow */}
                <Route path="/patient" element={<PatientDashboard />} />
                <Route path="/games" element={<GamesHub />} />
                <Route path="/games/memory" element={<MemoryMatchGame />} />
                <Route path="/games/sequence" element={<SequenceRecallGame />} />
                <Route path="/games/words" element={<WordConnectGame />} />
                <Route path="/games/recognition" element={<PictureRecognitionGame />} />
                
                {/* Memory & Reminders */}
                <Route path="/memory" element={<MemoryCompanionPage />} />
                <Route path="/reminders" element={<RemindersPage />} />
                <Route path="/progress" element={<ProgressPage />} />

                {/* Caregiver & Doctor Dashboards */}
                <Route path="/caregiver" element={<CaregiverDashboard />} />
                <Route path="/patient-profile" element={<PatientProfilePage />} />
                <Route path="/doctor" element={<DoctorDashboard />} />

                {/* Settings */}
                <Route path="/settings" element={<SettingsPage />} />

                {/* Fallback */}
                <Route path="*" element={<LandingPage />} />
              </Routes>
            </main>

            <Footer />
          </div>
        </Router>
      </RoleProvider>
    </AccessibilityProvider>
  );
};

export default App;
