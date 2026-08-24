import React, { useState } from 'react';
import {
  LayoutDashboard,
  BookOpen,
  Calendar,
  CheckSquare,
  BarChart2,
  User as UserIcon,
  LogOut,
  Menu,
  X,
  GraduationCap,
  Sparkles,
} from 'lucide-react';
import { useStudy } from '../../context/StudyContext';
import { ActiveTab } from '../../types';

interface HeaderProps {
  onOpenAuth: () => void;
  onTryForFree?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenAuth, onTryForFree }) => {
  const { activeTab, setActiveTab, user, logout, isLoggedIn, loginAsGuest } = useStudy();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleFreeAccess = () => {
    if (onTryForFree) {
      onTryForFree();
    } else {
      loginAsGuest();
    }
  };

  const navItems: { id: ActiveTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'subjects', label: 'Subjects', icon: BookOpen },
    { id: 'planner', label: 'Study Planner', icon: Calendar },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'progress', label: 'Progress', icon: BarChart2 },
    { id: 'profile', label: 'Profile', icon: UserIcon },
  ];

  const handleNavClick = (tab: ActiveTab) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
      {/* Top micro banner for tagline */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1 px-4 text-center tracking-wide font-medium hidden sm:block">
        StudyEase &bull; <span className="text-slate-400">Plan. Learn. Track. Improve.</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <button
              id="brand-logo-btn"
              onClick={() => handleNavClick('dashboard')}
              className="flex items-center gap-2.5 text-left focus:outline-hidden"
            >
              <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-slate-900">StudyEase</span>
                <span className="block text-[10px] uppercase font-semibold tracking-wider text-blue-600 sm:hidden">
                  Plan &bull; Learn &bull; Track
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Navigation */}
          {isLoggedIn ? (
            <nav className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    id={`nav-${item.id}`}
                    onClick={() => handleNavClick(item.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-500'}`} />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          ) : null}

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {isLoggedIn ? (
              <div className="hidden md:flex items-center gap-3 pl-3 border-l border-slate-200">
                <button
                  id="user-profile-badge-btn"
                  onClick={() => handleNavClick('profile')}
                  className="flex items-center gap-2 text-left p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-semibold flex items-center justify-center text-xs">
                    {user?.fullName.charAt(0).toUpperCase() || 'S'}
                  </div>
                  <span className="text-xs font-medium text-slate-700 max-w-[120px] truncate">
                    {user?.fullName || 'Student'}
                  </span>
                </button>
                <button
                  id="nav-logout-btn"
                  onClick={logout}
                  title="Logout"
                  className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  aria-label="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  id="header-try-free-btn"
                  onClick={handleFreeAccess}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg shadow-2xs transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  Try for Free
                </button>
                <button
                  id="header-login-btn"
                  onClick={onOpenAuth}
                  className="px-3.5 py-2 text-xs sm:text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs transition-colors cursor-pointer"
                >
                  Sign In
                </button>
              </div>
            )}

            {/* Mobile menu button */}
            {isLoggedIn && (
              <button
                id="mobile-menu-toggle-btn"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
                aria-label="Toggle navigation menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {isMobileMenuOpen && isLoggedIn && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-4 space-y-1 shadow-md animate-in slide-in-from-top duration-150">
          <div className="px-3 py-2 mb-2 bg-slate-50 rounded-lg flex items-center justify-between border border-slate-100">
            <div>
              <p className="text-xs font-semibold text-slate-800">{user?.fullName}</p>
              <p className="text-[11px] text-slate-500 truncate max-w-[220px]">{user?.email}</p>
            </div>
            <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-medium">
              Student
            </span>
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`mobile-nav-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 font-semibold'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-500'}`} />
                {item.label}
              </button>
            );
          })}

          <div className="pt-2 mt-2 border-t border-slate-100">
            <button
              id="mobile-logout-btn"
              onClick={() => {
                setIsMobileMenuOpen(false);
                logout();
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-rose-600 hover:bg-rose-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Log Out
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
