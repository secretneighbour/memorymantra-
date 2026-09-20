import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useRole } from '../../context/RoleContext';
import { AuthLoadingSplash } from './AuthLoadingSplash';

/**
 * Resolves the authenticated home dashboard path based on role.
 */
export const getRoleDashboardPath = (role?: string): string => {
  if (role === 'doctor') return '/doctor';
  if (role === 'caregiver') return '/caregiver';
  return '/patient';
};

/**
 * Protects authenticated-only routes.
 * If authentication check is in progress: shows branded loading splash (no flash).
 * If unauthenticated: securely redirects to /login with return URL and replaces history.
 * If authenticated: renders protected content.
 */
export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <AuthLoadingSplash message="VERIFYING CARE CREDENTIALS" />;
  }

  if (!isAuthenticated) {
    const returnUrl = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?redirect=${returnUrl}`} replace state={{ from: location }} />;
  }

  return <>{children}</>;
};

/**
 * Guard for the Introduction / Landing page (/ and /intro).
 * Requirement: The Introduction is ONLY visible when the user is NOT logged in.
 * If authenticated: immediately redirects to appropriate dashboard (no intro shown/flashed).
 * If unauthenticated: renders the public LandingPage.
 */
export const PublicIntroRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const { role } = useRole();

  if (isLoading) {
    return <AuthLoadingSplash message="RESTORING CARE SESSION" />;
  }

  if (isAuthenticated) {
    const targetPath = getRoleDashboardPath(user?.role || role);
    return <Navigate to={targetPath} replace />;
  }

  return <>{children}</>;
};

/**
 * Guard for public authentication pages (/login, /signup, /forgot-password).
 * If already authenticated: immediately redirects to user dashboard or return URL.
 * If unauthenticated: renders auth page children.
 */
export const PublicAuthRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const { role } = useRole();
  const location = useLocation();

  if (isLoading) {
    return <AuthLoadingSplash message="PREPARING AUTHENTICATION" />;
  }

  if (isAuthenticated) {
    const params = new URLSearchParams(location.search);
    const returnUrl = params.get('redirect');
    const targetPath = returnUrl && returnUrl.startsWith('/') 
      ? returnUrl 
      : getRoleDashboardPath(user?.role || role);
    return <Navigate to={targetPath} replace />;
  }

  return <>{children}</>;
};

/**
 * Generic redirector for /dashboard, /app, or fallback matching.
 * Directs authenticated users to their role dashboard, or unauthenticated users to the introduction.
 */
export const RoleDashboardRedirect: React.FC = () => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const { role } = useRole();

  if (isLoading) {
    return <AuthLoadingSplash message="CONNECTING TO DASHBOARD" />;
  }

  if (isAuthenticated) {
    return <Navigate to={getRoleDashboardPath(user?.role || role)} replace />;
  }

  return <Navigate to="/" replace />;
};
