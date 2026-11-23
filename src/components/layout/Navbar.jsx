import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  Command,
  WifiOff,
  User,
  Settings,
  LogOut,
  ChevronDown,
  ChevronRight,
  Sparkles,
  Check,
  Sun,
  Moon,
  Layers,
  Menu
} from 'lucide-react';
import useNetworkStatus from '../../hooks/useNetworkStatus';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export default function Navbar({
  currentSection = 'Overview',
  unreadAlertsCount = 3,
  onNotificationsClick,
  onProfileClick,
  onOpenCommandPalette,
  onToggleMobileNav
}) {
  const navigate = useNavigate();
  const { isOnline } = useNetworkStatus();
  const { profile, logout } = useAuth();
  const { theme, setTheme, toggleDayNight, isDark, themes } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const themeDropdownRef = useRef(null);

  // Close dropdown on outside click or escape
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
      if (themeDropdownRef.current && !themeDropdownRef.current.contains(e.target)) {
        setThemeDropdownOpen(false);
      }
    }
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        setDropdownOpen(false);
        setThemeDropdownOpen(false);
      }
    }

    if (dropdownOpen || themeDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [dropdownOpen, themeDropdownOpen]);

  const handleLogout = async () => {
    setDropdownOpen(false);
    await logout();
    navigate('/login', { replace: true });
  };

  const getInitials = (name) => {
    if (!name) return 'OP';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const userInitials = getInitials(profile?.fullName || 'Suryansh Tyagi');

  return (
    <header className="h-16 max-md:h-14 flex items-center justify-between border-b border-slate-200/90 px-0 select-none relative z-30">
      {/* Breadcrumb & Mobile Drawer Trigger */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onToggleMobileNav}
          className="md:hidden p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
          <span
            className="hover:text-slate-900 transition-colors cursor-pointer hidden sm:inline"
            onClick={() => navigate('/overview')}
          >
            Workspace
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0 hidden sm:inline" />
          <span className="text-slate-900 font-semibold text-sm capitalize">
            {currentSection}
          </span>
        </div>
      </div>

      {/* Top Actions */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        {/* Quick Command Hint */}
        <button
          type="button"
          onClick={onOpenCommandPalette}
          className="hidden lg:flex items-center gap-2 h-9 px-3 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900 text-xs transition-all shadow-2xs cursor-pointer"
          title="Press Ctrl+K or ⌘K to open command search"
        >
          <Command className="w-3.5 h-3.5 text-[#2879E8]" />
          <span className="font-medium">Quick Jump</span>
          <kbd className="px-1.5 py-0.5 bg-slate-100 rounded text-[10px] font-mono border border-slate-200/80 text-slate-500">
            ⌘K
          </kbd>
        </button>

        {/* Live System Status Beacon */}
        <div className="max-md:hidden flex items-center">
          {isOnline ? (
            <div className="flex items-center gap-1.5 h-8 px-2.5 rounded-lg bg-emerald-50/90 border border-emerald-200/70 text-emerald-700 text-xs font-medium shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
              <span>All systems active</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 h-8 px-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium">
              <WifiOff className="w-3.5 h-3.5 text-amber-600" />
              <span>Offline mode</span>
            </div>
          )}
        </div>

        {/* Theme Quick Switcher & Day/Night 1-Click Toggle */}
        <div className="relative flex items-center" ref={themeDropdownRef}>
          <div className="flex items-center rounded-lg bg-white border border-slate-200 shadow-2xs p-0.5">
            <button
              type="button"
              onClick={toggleDayNight}
              aria-label={isDark ? 'Switch to Day Glass' : 'Switch to Liquid Obsidian (Night)'}
              title={isDark ? 'Return to Day Glass' : 'Switch to Liquid Obsidian (Night)'}
              className="flex items-center gap-1.5 h-8 px-2 text-slate-600 hover:text-slate-900 transition-all rounded-md hover:bg-slate-100/70 cursor-pointer text-xs font-medium"
            >
              {theme === 'dark-liquid-glass' ? (
                <Moon className="w-3.5 h-3.5 text-sky-400" />
              ) : theme === 'ice-liquid-glass' ? (
                <Sparkles className="w-3.5 h-3.5 text-sky-600" />
              ) : theme === 'crystal-liquid-glass' ? (
                <Layers className="w-3.5 h-3.5 text-indigo-600" />
              ) : (
                <Sun className="w-3.5 h-3.5 text-amber-500" />
              )}
              <span className="hidden sm:inline text-xs text-slate-800 truncate max-w-[80px]">
                {theme === 'dark-liquid-glass'
                  ? 'Obsidian'
                  : theme === 'ice-liquid-glass'
                  ? 'Ice'
                  : theme === 'crystal-liquid-glass'
                  ? 'Crystal'
                  : 'Day'}
              </span>
            </button>

            {/* Specular Variants Dropdown Trigger */}
            <button
              type="button"
              onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
              aria-label="Select glass finish"
              title="Select specular glass finish"
              className={`h-8 px-1.5 rounded-md hover:bg-slate-100/70 text-slate-400 hover:text-slate-800 transition-all cursor-pointer border-l border-slate-200 ${
                themeDropdownOpen ? 'bg-blue-50 text-[#2879E8]' : ''
              }`}
            >
              <ChevronDown
                className={`w-3 h-3 transition-transform duration-200 ${
                  themeDropdownOpen ? 'rotate-180 text-[#2879E8]' : ''
                }`}
              />
            </button>
          </div>

          {/* Theme Dropdown Menu */}
          {themeDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-72 bg-white/98 backdrop-blur-xl border border-slate-200/90 rounded-xl shadow-lg p-2 text-xs text-slate-900 animate-in fade-in zoom-in-95 duration-150 z-50">
              <div className="px-2.5 py-1.5 border-b border-slate-100 mb-1 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-xs text-slate-900 block">
                    Glass Theme Finishes
                  </span>
                  <span className="text-[10px] text-slate-500">
                    Select surface specular profile
                  </span>
                </div>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-blue-50 text-[#2879E8] border border-blue-200/60">
                  SOLID GLASS
                </span>
              </div>

              <div className="space-y-0.5">
                {themes.map((t) => {
                  const isActive = theme === t.id;
                  const Icon =
                    t.icon === 'Sun'
                      ? Sun
                      : t.icon === 'Sparkles'
                      ? Sparkles
                      : t.icon === 'Layers'
                      ? Layers
                      : Moon;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => {
                        setTheme(t.id);
                        setThemeDropdownOpen(false);
                      }}
                      className={`w-full flex items-start gap-2.5 p-2 rounded-lg text-left transition-all cursor-pointer ${
                        isActive
                          ? 'bg-blue-50 border border-blue-200/60'
                          : 'hover:bg-slate-50 border border-transparent'
                      }`}
                    >
                      <div
                        className="w-6 h-6 rounded-md flex items-center justify-center shrink-0 border border-white shadow-2xs"
                        style={{ backgroundColor: `${t.accentColor}18`, color: t.accentColor }}
                      >
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span
                            className={`text-xs font-semibold truncate ${
                              isActive ? 'text-slate-900' : 'text-slate-700'
                            }`}
                          >
                            {t.name}
                          </span>
                          {isActive && (
                            <Check className="w-3.5 h-3.5 text-[#2879E8] shrink-0" />
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                          {t.desc}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Notifications Icon Button */}
        <button
          type="button"
          onClick={onNotificationsClick}
          aria-label="View notifications"
          className="relative h-9 w-9 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 flex items-center justify-center transition-colors shadow-2xs cursor-pointer"
        >
          <Bell className="w-4 h-4" />
          {unreadAlertsCount > 0 && (
            <span
              className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#2879E8] rounded-full"
              aria-hidden="true"
            />
          )}
        </button>

        {/* User Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            aria-expanded={dropdownOpen}
            aria-haspopup="true"
            className="flex items-center gap-2 h-9 px-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all cursor-pointer shadow-2xs group"
          >
            {profile?.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt={profile.fullName || 'User'}
                className="w-6 h-6 rounded-md object-cover border border-slate-200 shrink-0"
                style={{ width: '24px', height: '24px', maxWidth: '24px', maxHeight: '24px' }}
              />
            ) : (
              <div
                className="w-6 h-6 rounded-md flex items-center justify-center bg-blue-50 text-[#2879E8] text-[10px] font-semibold border border-blue-200/60 shrink-0"
                style={{ width: '24px', height: '24px' }}
              >
                {userInitials}
              </div>
            )}

            <div className="hidden md:flex flex-col text-left leading-none">
              <span className="text-xs font-semibold text-slate-800 group-hover:text-[#2879E8] transition-colors truncate max-w-[110px]">
                {profile?.fullName || 'Suryansh Tyagi'}
              </span>
            </div>

            <ChevronDown
              className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                dropdownOpen ? 'rotate-180 text-[#2879E8]' : ''
              }`}
            />
          </button>

          {/* User Profile Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white/98 backdrop-blur-xl border border-slate-200/90 rounded-xl shadow-lg p-2 text-xs text-slate-900 animate-in fade-in zoom-in-95 duration-150 z-50">
              {/* Profile Card Header */}
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 mb-1 flex items-center gap-2.5">
                {profile?.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt={profile.fullName || 'User'}
                    className="w-9 h-9 rounded-lg object-cover border border-slate-200 shrink-0"
                    style={{ width: '36px', height: '36px', maxWidth: '36px', maxHeight: '36px' }}
                  />
                ) : (
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center bg-blue-50 text-[#2879E8] text-xs font-bold border border-blue-200/60 shrink-0"
                    style={{ width: '36px', height: '36px' }}
                  >
                    {userInitials}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-xs text-slate-900 truncate">
                    {profile?.fullName || 'Suryansh Tyagi'}
                  </div>
                  <div className="text-[11px] text-slate-500 truncate mt-0.5">
                    {profile?.email || 'suryansh.tyagi@autrail.io'}
                  </div>
                  <div className="mt-1 inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-blue-50 text-[#2879E8] border border-blue-200/60">
                    <Sparkles className="w-2.5 h-2.5" />
                    {profile?.role || 'Administrator'}
                  </div>
                </div>
              </div>

              {/* Menu items */}
              <button
                type="button"
                onClick={() => {
                  setDropdownOpen(false);
                  navigate('/profile');
                }}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-left hover:bg-slate-100 text-slate-700 hover:text-slate-900 transition-colors cursor-pointer font-medium"
              >
                <User className="w-3.5 h-3.5 text-[#2879E8]" />
                <span>My Profile</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setDropdownOpen(false);
                  navigate('/settings');
                }}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-left hover:bg-slate-100 text-slate-700 hover:text-slate-900 transition-colors cursor-pointer font-medium"
              >
                <Settings className="w-3.5 h-3.5 text-slate-600" />
                <span>Account Settings</span>
              </button>

              <div className="h-px bg-slate-100 my-1" />

              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-left hover:bg-rose-50 text-rose-600 hover:text-rose-700 transition-colors cursor-pointer font-medium"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-500" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
