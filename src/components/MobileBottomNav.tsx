import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useRole } from '../context/RoleContext';
import { useAccessibility } from '../context/AccessibilityContext';
import { 
  Home, 
  HeartHandshake, 
  Gamepad2, 
  Sparkles, 
  Bot,
  Brain,
  Users,
  MapPin
} from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const location = useLocation();
  const { role, setIsAICompanionOpen } = useRole();
  const { t } = useAccessibility();

  // Highlight active role path
  const carePath = role === 'caregiver' ? '/caregiver' : role === 'doctor' ? '/doctor' : '/patient';
  const careLabel = role === 'caregiver' ? t.roleCaregiver : role === 'doctor' ? t.doctorRoleTitle : t.navCare;

  const navItems = [
    {
      label: t.navHome,
      path: '/',
      icon: Home,
    },
    {
      label: careLabel,
      path: carePath,
      icon: role === 'patient' ? HeartHandshake : role === 'caregiver' ? Users : Brain,
    },
    {
      label: t.navGames,
      path: '/games',
      icon: Gamepad2,
    },
    {
      label: 'Places',
      path: '/places',
      icon: MapPin,
    },
  ];

  return (
    <aside 
      aria-label="Mobile Navigation Bar"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-ner-border/90 px-2 pt-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-[0_-4px_20px_rgba(0,0,0,0.06)]"
    >
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {navItems.slice(0, 2).map((item) => {
          const isActive = location.pathname === item.path || 
            (item.path !== '/' && location.pathname.startsWith(item.path));
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl min-w-[56px] min-h-[48px] transition-all duration-200 active:scale-95 ${
                isActive 
                  ? 'text-ner-black font-bold' 
                  : 'text-ner-black/50 hover:text-ner-black/80'
              }`}
            >
              <div className={`p-1 rounded-xl transition-colors ${isActive ? 'bg-ner-black/10 text-ner-black' : ''}`}>
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
              </div>
              <span className="text-[10px] font-mono tracking-tight mt-0.5 leading-tight block">
                {item.label}
              </span>
            </NavLink>
          );
        })}

        {/* Center Floating AI Companion Button */}
        <div className="relative -top-3">
          <button
            onClick={() => setIsAICompanionOpen(true)}
            className="w-12 h-12 rounded-full bg-ner-black text-white shadow-xl flex flex-col items-center justify-center border-2 border-white active:scale-90 transition-transform group"
            aria-label="Open Smriti AI Memory Companion"
          >
            <Bot className="w-5 h-5 text-ner-terracotta group-hover:scale-110 transition-transform" />
            <span className="w-1.5 h-1.5 rounded-full bg-ner-sage animate-ping absolute top-2 right-2"></span>
          </button>
          <span className="text-[9px] font-mono font-bold tracking-tight text-ner-black/70 text-center block mt-1">
            Smriti AI
          </span>
        </div>

        {navItems.slice(2, 4).map((item) => {
          const isActive = location.pathname === item.path || 
            (item.path !== '/' && location.pathname.startsWith(item.path));
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl min-w-[56px] min-h-[48px] transition-all duration-200 active:scale-95 ${
                isActive 
                  ? 'text-ner-black font-bold' 
                  : 'text-ner-black/50 hover:text-ner-black/80'
              }`}
            >
              <div className={`p-1 rounded-xl transition-colors ${isActive ? 'bg-ner-black/10 text-ner-black' : ''}`}>
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
              </div>
              <span className="text-[10px] font-mono tracking-tight mt-0.5 leading-tight block">
                {item.label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </aside>
  );
};
