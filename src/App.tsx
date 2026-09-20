import React, { useEffect } from 'react';
import { BrowserRouter, HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AccessibilityProvider } from './context/AccessibilityContext';
import { RoleProvider } from './context/RoleContext';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { DotMatrixBackground } from './components/DotMatrixBackground';
import { RoleSwitcherModal } from './components/RoleSwitcherModal';
import { AICompanionDrawer } from './components/AICompanionDrawer';
import { OfflineBanner } from './components/OfflineBanner';
import { PageNarrator } from './components/PageNarrator';
import { MobileBottomNav } from './components/MobileBottomNav';

import { 
  ProtectedRoute, 
  PublicIntroRoute, 
  PublicAuthRoute, 
  RoleDashboardRedirect 
} from './components/auth/AuthGuard';
import { Navigate } from 'react-router-dom';
import { PageTransition } from './components/motion/MotionPrimitives';

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
import { PlacesPage } from './pages/PlacesPage';
import { PresentationPage } from './pages/PresentationPage';
import { WalkthroughModal } from './components/WalkthroughModal';
import { EmergencyHelpModal } from './components/EmergencyHelpModal';
import { AccessibilityModal } from './components/AccessibilityModal';

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

// Check if running in Electron environment or file protocol
const isElectron = typeof window !== 'undefined' && (
  window.location.protocol === 'file:' ||
  Boolean((window as any).electronAPI) ||
  (typeof navigator !== 'undefined' && navigator.userAgent.toLowerCase().includes('electron'))
);

const Router = isElectron ? HashRouter : BrowserRouter;

// AppRoutes: Renders application routes with smooth, accessible page transitions
const AppRoutes: React.FC = () => {
  const location = useLocation();

  return (
    <PageTransition key={location.pathname} className="w-full flex-grow flex flex-col">
      <Routes location={location}>
        {/* Public Introduction & Presentation Routes */}
        <Route path="/" element={<PublicIntroRoute><LandingPage /></PublicIntroRoute>} />
        <Route path="/intro" element={<PublicIntroRoute><LandingPage /></PublicIntroRoute>} />
        <Route path="/presentation" element={<PresentationPage />} />

        {/* Public Authentication Routes */}
        <Route path="/login" element={<PublicAuthRoute><LoginPage /></PublicAuthRoute>} />
        <Route path="/signin" element={<PublicAuthRoute><LoginPage /></PublicAuthRoute>} />
        <Route path="/signup" element={<PublicAuthRoute><SignupPage /></PublicAuthRoute>} />
        <Route path="/forgot-password" element={<PublicAuthRoute><ForgotPasswordPage /></PublicAuthRoute>} />
        <Route path="/verify-email" element={<EmailVerificationPage />} />
        <Route path="/auth/callback" element={<AuthCallbackPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* Protected Patient & General Care Flow */}
        <Route path="/patient" element={<ProtectedRoute><PatientDashboard /></ProtectedRoute>} />
        <Route path="/role-selection" element={<ProtectedRoute><RoleSelectionPage /></ProtectedRoute>} />
        <Route path="/dashboard" element={<RoleDashboardRedirect />} />
        <Route path="/app" element={<RoleDashboardRedirect />} />

        {/* Protected Games Suite */}
        <Route path="/games" element={<ProtectedRoute><GamesHub /></ProtectedRoute>} />
        <Route path="/games/memory" element={<ProtectedRoute><MemoryMatchGame /></ProtectedRoute>} />
        <Route path="/games/sequence" element={<ProtectedRoute><SequenceRecallGame /></ProtectedRoute>} />
        <Route path="/games/pattern" element={<ProtectedRoute><PatternFinderGame /></ProtectedRoute>} />
        <Route path="/games/object" element={<ProtectedRoute><PictureRecognitionGame /></ProtectedRoute>} />
        <Route path="/games/recognition" element={<ProtectedRoute><PictureRecognitionGame /></ProtectedRoute>} />
        <Route path="/games/routine" element={<ProtectedRoute><RoutineRecallGame /></ProtectedRoute>} />
        <Route path="/games/emotion" element={<ProtectedRoute><EmotionRecognitionGame /></ProtectedRoute>} />
        <Route path="/games/words" element={<ProtectedRoute><WordConnectGame /></ProtectedRoute>} />
        <Route path="/games/market" element={<ProtectedRoute><MarketMemoryGame /></ProtectedRoute>} />
        <Route path="/games/faces" element={<ProtectedRoute><NameFaceRecallGame /></ProtectedRoute>} />
        
        {/* Protected Memory Vault & Companion */}
        <Route path="/memory" element={<ProtectedRoute><MemoriesPage /></ProtectedRoute>} />
        <Route path="/memories" element={<ProtectedRoute><MemoriesPage /></ProtectedRoute>} />
        <Route path="/memory-companion" element={<ProtectedRoute><MemoryCompanionPage /></ProtectedRoute>} />
        <Route path="/ai-companion" element={<ProtectedRoute><MemoryCompanionPage /></ProtectedRoute>} />
        <Route path="/reminders" element={<ProtectedRoute><RemindersPage /></ProtectedRoute>} />
        <Route path="/progress" element={<ProtectedRoute><ProgressPage /></ProtectedRoute>} />
        <Route path="/places" element={<ProtectedRoute><PlacesPage /></ProtectedRoute>} />

        {/* Protected Caregiver & Doctor Dashboards */}
        <Route path="/caregiver" element={<ProtectedRoute><CaregiverDashboard /></ProtectedRoute>} />
        <Route path="/patient-profile" element={<ProtectedRoute><PatientProfilePage /></ProtectedRoute>} />
        <Route path="/doctor" element={<ProtectedRoute><DoctorDashboard /></ProtectedRoute>} />
        <Route path="/professional" element={<ProtectedRoute><DoctorDashboard /></ProtectedRoute>} />

        {/* Public Settings & Accessibility (Available Without Sign-In) */}
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/accessibility" element={<SettingsPage />} />

        {/* Intelligent Fallback */}
        <Route path="*" element={<RoleDashboardRedirect />} />
      </Routes>
    </PageTransition>
  );
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

              {/* Global Modals, Drawers & Voice Narrator */}
              <AccessibilityModal />
              <RoleSwitcherModal />
              <AICompanionDrawer />
              <OfflineBanner />
              <PageNarrator />
              <WalkthroughModal />
              <EmergencyHelpModal />

              <main className="flex-grow z-10 pb-20 md:pb-0 flex flex-col">
                <AppRoutes />
              </main>

              {/* Native-feel Mobile Bottom Navigation */}
              <MobileBottomNav />

              <Footer />
            </div>
          </Router>
        </AuthProvider>
      </RoleProvider>
    </AccessibilityProvider>
  );
};


export default App;
