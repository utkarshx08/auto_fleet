import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Command, WifiOff, User, Settings, LogOut, ChevronDown, Sparkles } from 'lucide-react';
import useNetworkStatus from '../../hooks/useNetworkStatus';
import { useAuth } from '../../context/AuthContext';

export default function Navbar({
  currentSection = 'Overview',
  unreadAlertsCount = 3,
  onNotificationsClick,
  onProfileClick,
  onOpenCommandPalette
}) {
  const navigate = useNavigate();
  const { isOnline } = useNetworkStatus();
  const { profile, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click or escape
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    function handleKeyDown(e) {
      if (e.key === 'Escape') setDropdownOpen(false);
    }

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [dropdownOpen]);

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
    <header className="h-[70px] max-md:h-[58px] flex items-center justify-between border-b border-[#E2E8F0]/80 px-0 select-none relative z-30">
      {/* Breadcrumb */}
      <div className="text-[12px] text-[#68758A] flex items-center">
        <span className="font-medium hover:text-[#172033] transition-colors cursor-pointer" onClick={() => navigate('/overview')}>Workspace</span>
        <span className="px-2.5 text-[#CBD5E1] font-mono">/</span>
        <b className="text-[#172033] font-bold capitalize">{currentSection}</b>
      </div>

      {/* Top Actions */}
      <div className="flex items-center gap-3.5">
        {/* Quick Command Hint */}
        <button
          type="button"
          onClick={onOpenCommandPalette}
          className="hidden lg:flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-white/90 hover:bg-[#F0F5FC] border border-[#E2E8F0] text-[#68758A] hover:text-[#172033] text-[11px] font-mono transition-all shadow-2xs hover:shadow-sm"
          title="Press Ctrl+K or ⌘K to open command search"
        >
          <Command className="w-3.5 h-3.5 text-[#2879E8]" />
          <span className="font-sans font-medium text-[11px]">Quick Jump</span>
          <kbd className="px-1.5 py-0.5 bg-[#F8FAFD] rounded-md text-[9px] font-mono border border-[#E2E8F0] text-[#68758A]">⌘K</kbd>
        </button>

        {/* Live System Status Beacon */}
        <div className="max-md:hidden flex items-center text-[11px] font-mono">
          {isOnline ? (
            <div className="flex items-center px-2.5 py-1 rounded-xl bg-[#E8F7F0] border border-[#C2E8D7] text-[#16A36A] font-medium shadow-2xs">
              <span className="inline-block w-2 h-2 rounded-full bg-[#16A36A] shadow-[0_0_8px_#16A36A] mr-2 beacon-pulse"></span>
              All systems operational
            </div>
          ) : (
            <div className="flex items-center text-[#E7A329] bg-[#FEF7EA] px-2.5 py-1 rounded-xl border border-[#F8DCB0]">
              <WifiOff className="w-3.5 h-3.5 mr-1.5 text-[#E7A329] animate-pulse" />
              Gateway Offline
            </div>
          )}
        </div>

        {/* Notifications Icon Button */}
        <button
          type="button"
          onClick={onNotificationsClick}
          aria-label="View notifications"
          className="relative p-2 text-[#68758A] hover:text-[#172033] transition-colors rounded-xl bg-white/90 border border-[#E2E8F0] hover:bg-[#F0F5FC] shadow-2xs hover:shadow-sm cursor-pointer"
        >
          <Bell className="w-4 h-4" />
          {unreadAlertsCount > 0 && (
            <span
              className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#2879E8] rounded-full shadow-[0_0_6px_#2879E8]"
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
            className="flex items-center gap-2.5 p-1.5 rounded-xl bg-white/90 border border-[#E2E8F0] hover:bg-[#F0F5FC] hover:border-[#2879E8]/30 transition-all cursor-pointer shadow-2xs hover:shadow-sm group"
          >
            {profile?.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt={profile.fullName || 'User'}
                className="w-7 h-7 rounded-full object-cover border border-[#2879E8]/30 group-hover:ring-2 group-hover:ring-[#2879E8]/30 transition-all shrink-0"
              />
            ) : (
              <div className="w-7 h-7 rounded-full flex items-center justify-center bg-[#EAF3FF] text-[#2879E8] text-[10px] font-bold border border-[#D5E6FB] group-hover:ring-2 group-hover:ring-[#2879E8]/30 transition-all shrink-0">
                {userInitials}
              </div>
            )}

            <div className="hidden md:flex flex-col text-left leading-none">
              <span className="text-xs font-semibold text-[#172033] group-hover:text-[#2879E8] transition-colors truncate max-w-[120px]">
                {profile?.fullName || 'Suryansh Tyagi'}
              </span>
              <span className="text-[9px] text-[#8A97AB] font-mono mt-0.5">
                {profile?.role || 'Administrator'}
              </span>
            </div>

            <ChevronDown className={`w-3.5 h-3.5 text-[#8A97AB] transition-transform duration-200 ${dropdownOpen ? 'rotate-180 text-[#2879E8]' : ''}`} />
          </button>

          {/* Liquid Glass Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-60 bg-white/98 backdrop-blur-2xl border border-white/90 rounded-2xl shadow-liquid-dropdown p-1.5 text-xs text-[#172033] animate-fadeIn z-50">
              {/* Profile Card Header */}
              <div className="p-3 bg-gradient-to-br from-[#F8FAFD] to-[#F1F5F9] rounded-xl border border-[#E2E8F0]/80 mb-1.5">
                <div className="font-bold text-sm text-[#172033] truncate">
                  {profile?.fullName || 'Suryansh Tyagi'}
                </div>
                <div className="text-[11px] text-[#68758A] truncate mt-0.5">
                  {profile?.email || 'suryansh.tyagi@autrail.io'}
                </div>
                <div className="mt-2 inline-flex items-center gap-1 text-[9px] font-mono px-2 py-0.5 rounded-full bg-[#EAF3FF] text-[#2879E8] border border-[#2879E8]/20 font-semibold">
                  <Sparkles className="w-2.5 h-2.5" />
                  {profile?.role || 'Administrator'}
                </div>
              </div>

              {/* Menu items */}
              <button
                type="button"
                onClick={() => {
                  setDropdownOpen(false);
                  navigate('/profile');
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left hover:bg-[#F0F5FC] text-[#172033] hover:text-[#2879E8] transition-colors cursor-pointer font-medium"
              >
                <User className="w-4 h-4 text-[#2879E8]" />
                <span>My Profile</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setDropdownOpen(false);
                  navigate('/settings');
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left hover:bg-[#F0F5FC] text-[#172033] hover:text-[#2879E8] transition-colors cursor-pointer font-medium"
              >
                <Settings className="w-4 h-4 text-[#16A36A]" />
                <span>Account Settings</span>
              </button>

              <div className="h-px bg-[#E2E8F0] my-1" />

              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left hover:bg-[#FDF2F2] text-[#E05252] hover:text-[#C53030] transition-colors cursor-pointer font-medium"
              >
                <LogOut className="w-4 h-4 text-[#E05252]" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
