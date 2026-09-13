import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AccessibilityProvider } from './context/AccessibilityContext';
import { RoleProvider } from './context/RoleContext';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { DotMatrixBackground } from './components/DotMatrixBackground';
import { RoleSwitcherModal } from './components/RoleSwitcherModal';
import { AICompanionDrawer } from './components/AICompanionDrawer';
import { OfflineBanner } from './components/OfflineBanner';

// Pages
import { LandingPage } from './pages/LandingPage';
import { RoleSelectionPage } from './pages/RoleSelectionPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { EmailVerificationPage } from './pages/EmailVerificationPage';
import { AuthCallbackPage } from './pages/AuthCallbackPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { PatientDashboard } from './pages/PatientDashboard';
import { GamesHub } from './pages/GamesHub';
import { MemoriesPage } from './pages/MemoriesPage';
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
import { PatternFinderGame } from './games/PatternFinderGame';
import { PictureRecognitionGame } from './games/PictureRecognitionGame';
import { RoutineRecallGame } from './games/RoutineRecallGame';
import { EmotionRecognitionGame } from './games/EmotionRecognitionGame';
import { WordConnectGame } from './games/WordConnectGame';
import { MarketMemoryGame } from './games/MarketMemoryGame';
import { NameFaceRecallGame } from './games/NameFaceRecallGame';

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
        <AuthProvider>
          <Router>
            <ScrollToTop />
            <div className="relative min-h-screen flex flex-col justify-between selection:bg-ner-terracotta selection:text-white">
              <DotMatrixBackground />
              <Navbar />

              {/* Global Modals & Drawers */}
              <RoleSwitcherModal />
              <AICompanionDrawer />
              <OfflineBanner />

              <main className="flex-grow z-10">
                <Routes>
                  {/* Landing & Role Selection */}
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/role-selection" element={<RoleSelectionPage />} />

                  {/* Authentication Routes */}
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signin" element={<LoginPage />} />
                  <Route path="/signup" element={<SignupPage />} />
                  <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                  <Route path="/verify-email" element={<EmailVerificationPage />} />
                  <Route path="/auth/callback" element={<AuthCallbackPage />} />
                  <Route path="/reset-password" element={<ResetPasswordPage />} />

                  {/* Patient Flow */}
                  <Route path="/patient" element={<PatientDashboard />} />
                  <Route path="/games" element={<GamesHub />} />
                  <Route path="/games/memory" element={<MemoryMatchGame />} />
                  <Route path="/games/sequence" element={<SequenceRecallGame />} />
                  <Route path="/games/pattern" element={<PatternFinderGame />} />
                  <Route path="/games/object" element={<PictureRecognitionGame />} />
                  <Route path="/games/recognition" element={<PictureRecognitionGame />} />
                  <Route path="/games/routine" element={<RoutineRecallGame />} />
                  <Route path="/games/emotion" element={<EmotionRecognitionGame />} />
                  <Route path="/games/words" element={<WordConnectGame />} />
                  <Route path="/games/market" element={<MarketMemoryGame />} />
                  <Route path="/games/faces" element={<NameFaceRecallGame />} />
                  
                  {/* Memory Vault & Companion */}
                  <Route path="/memory" element={<MemoriesPage />} />
                  <Route path="/memories" element={<MemoriesPage />} />
                  <Route path="/memory-companion" element={<MemoryCompanionPage />} />
                  <Route path="/reminders" element={<RemindersPage />} />
                  <Route path="/progress" element={<ProgressPage />} />

                  {/* Caregiver & Doctor Dashboards */}
                  <Route path="/caregiver" element={<CaregiverDashboard />} />
                  <Route path="/patient-profile" element={<PatientProfilePage />} />
                  <Route path="/doctor" element={<DoctorDashboard />} />

                  {/* Settings & Accessibility */}
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="/accessibility" element={<SettingsPage />} />

                  {/* Fallback */}
                  <Route path="*" element={<LandingPage />} />
                </Routes>
              </main>

              <Footer />
            </div>
          </Router>
        </AuthProvider>
      </RoleProvider>
    </AccessibilityProvider>
  );
};

export default App;
