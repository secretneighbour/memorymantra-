import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useRole } from '../context/RoleContext';
import { useAccessibility } from '../context/AccessibilityContext';
import { useAuth } from '../context/AuthContext';
import { 
  Menu, 
  X, 
  Bot, 
  Settings, 
  User, 
  Users, 
  Stethoscope,
  LogIn,
  LogOut,
  Globe,
  Check
} from 'lucide-react';
import { nerLanguages } from '../data/translations';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const { role, setIsRoleModalOpen, setIsAICompanionOpen } = useRole();
  const { t, language, setLanguage } = useAccessibility();
  const { user, isAuthenticated, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement>(null);

  // Close language menu on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(e.target as Node)) {
        setLangMenuOpen(false);
      }
    };
    if (langMenuOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [langMenuOpen]);

  const currentLangMeta = nerLanguages.find((l) => l.code === language) || nerLanguages[0];

  const navLinks = [
    { label: t.navHome, path: '/' },
    { label: t.navCare, path: '/patient' },
    { label: t.navGames, path: '/games' },
    { label: t.navMemory, path: '/memory' },
    { label: t.navProgress, path: '/progress' },
    { label: t.navCircle, path: '/caregiver' },
    { label: t.navDoctor, path: '/doctor' },
  ];

  const getRoleLabel = () => {
    if (role === 'patient') return t.rolePatient;
    if (role === 'caregiver') return t.roleCaregiver;
    return t.roleDoctor;
  };

  return (
    <header className="fixed top-3 sm:top-5 left-1/2 -translate-x-1/2 z-50 w-[96%] max-w-6xl transition-all duration-300 pointer-events-none">
      <div className="frost-white-intense rounded-full px-3 sm:px-5 py-2 shadow-xl border border-ner-border/90 flex items-center justify-between gap-3 pointer-events-auto">
        
        {/* Left: Nothing-style Dot-Matrix Glyph + Logo */}
        <Link 
          to="/"
          className="flex items-center gap-2.5 group focus:outline-none shrink-0"
        >
          {/* Authentic dot matrix icon SVG */}
          <div className="w-8 h-8 rounded-full bg-ner-black text-white flex items-center justify-center p-1.5 shadow-sm group-hover:bg-ner-terracotta transition-colors">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="3" cy="3" r="1.5" fill="currentColor" />
              <circle cx="8" cy="3" r="1.5" fill="currentColor" />
              <circle cx="13" cy="3" r="1.5" fill="currentColor" />
              <circle cx="3" cy="8" r="1.5" fill="currentColor" />
              <circle cx="8" cy="8" r="1.5" fill="#DE4A30" />
              <circle cx="13" cy="8" r="1.5" fill="currentColor" />
              <circle cx="3" cy="13" r="1.5" fill="currentColor" />
              <circle cx="8" cy="13" r="1.5" fill="currentColor" />
              <circle cx="13" cy="13" r="1.5" fill="currentColor" />
            </svg>
          </div>

          <div className="flex flex-col">
            <span className="font-mono text-xs sm:text-sm font-bold tracking-widest text-ner-black uppercase group-hover:text-ner-terracotta transition-colors">
              {t.appName.toUpperCase()}
            </span>
          </div>
          <span className="hidden md:inline-block text-[10px] text-ner-black/40 font-mono pl-1 uppercase tracking-wider">
            (R)
          </span>
        </Link>

        {/* Center: Desktop Navigation Bar */}
        <nav className="hidden lg:flex items-center gap-1 bg-ner-offwhite/70 p-1 rounded-full border border-ner-border/60">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path || 
              (link.path !== '/' && location.pathname.startsWith(link.path));
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all duration-200 ${
                  isActive
                    ? 'bg-ner-black text-white shadow-sm font-semibold'
                    : 'text-ner-black/70 hover:text-ner-black hover:bg-black/5'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right: Actions, Role Pill & Auth */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Role Pill Switcher */}
          <button
            onClick={() => setIsRoleModalOpen(true)}
            className="px-2 sm:px-3 py-1.5 rounded-full bg-ner-offwhite hover:bg-white border border-ner-border flex items-center gap-1 sm:gap-1.5 text-xs font-semibold text-ner-black transition-all shadow-sm active:scale-95"
            title={t.navRoleSwitcher}
          >
            {role === 'patient' && <User className="w-3.5 h-3.5 text-ner-terracotta shrink-0" />}
            {role === 'caregiver' && <Users className="w-3.5 h-3.5 text-ner-sage shrink-0" />}
            {role === 'doctor' && <Stethoscope className="w-3.5 h-3.5 text-ner-calmBlue shrink-0" />}
            <span className="text-[10px] sm:text-[11px] font-mono font-bold uppercase">{getRoleLabel()}</span>
            <span className="hidden sm:inline text-[10px] text-ner-terracotta font-mono underline ml-0.5">{t.navSwitch}</span>
          </button>

          {/* AI Memory Companion Quick Launcher */}
          <button
            onClick={() => setIsAICompanionOpen(true)}
            className="hidden md:flex px-3 py-1.5 rounded-full bg-ner-black text-white hover:bg-ner-black/85 items-center gap-1.5 text-xs font-medium transition-all shadow-sm active:scale-95"
            title={t.aiCompanionTitle}
          >
            <Bot className="w-3.5 h-3.5 text-ner-terracotta" />
            <span className="text-[11px] font-semibold">{t.navAIDemo}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-ner-sage animate-ping"></span>
          </button>

          {/* Authentication Pill (Sign In / User Profile) */}
          {isAuthenticated && user ? (
            <div className="flex items-center gap-1 pl-0.5">
              <span 
                className="hidden sm:inline-block px-2.5 py-1 rounded-full bg-ner-black/5 border border-ner-border text-[11px] font-mono font-bold text-ner-black max-w-[110px] truncate"
                title={`Signed in as ${user.name} (${user.email})`}
              >
                {user.name.split(' ')[0]}
              </span>
              <button
                onClick={signOut}
                className="p-1.5 sm:p-2 rounded-full hover:bg-rose-50 text-ner-black/70 hover:text-rose-600 transition-colors"
                title={t.navLogout}
                aria-label={t.navLogout}
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className={`hidden sm:flex px-3 py-1.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider items-center gap-1.5 transition-all shadow-sm active:scale-95 ${
                location.pathname === '/login'
                  ? 'bg-ner-black text-white'
                  : 'bg-ner-offwhite hover:bg-ner-black hover:text-white border border-ner-border text-ner-black'
              }`}
              title={t.navLogin}
            >
              <LogIn className="w-3.5 h-3.5 text-ner-terracotta" />
              <span>{t.navLogin}</span>
            </Link>
          )}

          {/* Regional Language Switcher Pill */}
          <div className="relative" ref={langMenuRef}>
            <button
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="px-2 sm:px-2.5 py-1.5 rounded-full bg-ner-offwhite hover:bg-white border border-ner-border flex items-center gap-1 text-xs font-semibold text-ner-black transition-all shadow-sm active:scale-95"
              title="Switch Page & Narration Language"
              aria-label="Switch Language"
            >
              <Globe className="w-3.5 h-3.5 text-ner-calmBlue shrink-0" />
              <span className="text-[10px] sm:text-[11px] font-mono font-bold max-w-[52px] sm:max-w-[70px] truncate">{currentLangMeta.native}</span>
            </button>

            {langMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 sm:w-60 max-h-80 overflow-y-auto rounded-3xl bg-white border border-ner-border shadow-2xl p-2 z-50 animate-fade-in flex flex-col gap-1">
                <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-ner-black/50 border-b border-ner-border/60 flex items-center justify-between">
                  <span>Language & Voice</span>
                  <span>NER</span>
                </div>
                {nerLanguages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setLanguage(l.code);
                      setLangMenuOpen(false);
                    }}
                    className={`px-3 py-2 rounded-2xl text-left text-xs flex items-center justify-between transition min-h-[40px] ${
                      language === l.code
                        ? 'bg-ner-black text-white font-bold'
                        : 'hover:bg-ner-offwhite text-ner-black'
                    }`}
                  >
                    <div className="flex flex-col">
                      <span className="font-bold">{l.native}</span>
                      <span className={`text-[10px] ${language === l.code ? 'text-white/70' : 'text-ner-black/50'}`}>
                        {l.name}
                      </span>
                    </div>
                    {language === l.code && <Check className="w-4 h-4 text-ner-terracotta" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Accessibility Settings */}
          <Link
            to="/settings"
            className="p-1.5 sm:p-2 rounded-full hover:bg-ner-black/5 text-ner-black transition-colors"
            title={t.navSettings}
            aria-label="Settings"
          >
            <Settings className="w-4 h-4" />
          </Link>

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 rounded-full text-ner-black hover:bg-black/5 active:scale-95"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-2 max-w-sm mx-auto pointer-events-auto frost-white-intense rounded-3xl p-5 shadow-2xl border border-ner-border animate-fade-in">
          <div className="flex flex-col gap-1.5">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-2.5 rounded-2xl text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-ner-black text-white font-semibold'
                      : 'text-ner-black/80 hover:bg-black/5'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            
            {/* Mobile Auth Button */}
            <div className="pt-2">
              {isAuthenticated && user ? (
                <div className="flex items-center justify-between p-3 rounded-2xl bg-ner-offwhite border border-ner-border text-xs">
                  <div>
                    <span className="font-bold text-ner-black block">{user.name}</span>
                    <span className="text-[10px] text-ner-black/50 font-mono">{user.email}</span>
                  </div>
                  <button
                    onClick={() => {
                      signOut();
                      setMobileMenuOpen(false);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-white border border-ner-border text-rose-600 font-mono text-[11px] font-bold"
                  >
                    {t.navLogout}
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 px-4 rounded-2xl bg-ner-black text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2"
                >
                  <LogIn className="w-4 h-4 text-ner-terracotta" />
                  <span>{t.navLogin}</span>
                </Link>
              )}
            </div>

            {/* Mobile Regional Language Selector */}
            <div className="pt-3 mt-2 border-t border-ner-border">
              <div className="flex items-center justify-between text-xs text-ner-black/60 px-1 mb-2">
                <span className="font-mono uppercase font-bold text-[10px] tracking-wider text-ner-black/50 flex items-center gap-1">
                  <Globe className="w-3 h-3 text-ner-calmBlue" />
                  <span>{t.footerLanguageLabel}</span>
                </span>
                <span className="text-[10px] font-mono font-bold text-ner-terracotta">{currentLangMeta.native}</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5 max-h-36 overflow-y-auto pr-0.5">
                {nerLanguages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setLanguage(l.code);
                      setMobileMenuOpen(false);
                    }}
                    className={`p-2 rounded-xl text-left text-xs transition border flex items-center justify-between ${
                      language === l.code
                        ? 'bg-ner-black text-white font-bold border-ner-black'
                        : 'bg-ner-offwhite border-ner-border text-ner-black hover:bg-white'
                    }`}
                  >
                    <span className="truncate">{l.native}</span>
                    {language === l.code && <Check className="w-3.5 h-3.5 text-ner-terracotta shrink-0" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-3 mt-2 border-t border-ner-border flex items-center justify-between text-xs text-ner-black/60 px-2">
              <span>{t.currentRole}: {getRoleLabel()}</span>
              <button 
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsRoleModalOpen(true);
                }}
                className="text-ner-terracotta font-semibold hover:underline"
              >
                {t.changeRole}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
