import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Command, Wifi, WifiOff, User, Settings, LogOut, ChevronDown, Shield } from 'lucide-react';
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
    <header className="h-[70px] max-md:h-[58px] flex items-center justify-between border-b border-[#252730] px-0 select-none relative z-30">
      {/* Breadcrumb */}
      <div className="text-[11px] text-[#888b97] flex items-center">
        <span>Workspace</span>
        <span className="px-2.5 text-[#555] font-mono">/</span>
        <b className="text-[#dedee5] font-semibold capitalize">{currentSection}</b>
      </div>

      {/* Top Actions */}
      <div className="flex items-center gap-4">
        {/* Quick Command Hint */}
        <button
          type="button"
          onClick={onOpenCommandPalette}
          className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-bg-surface hover:bg-bg-hover border border-border-default text-text-muted hover:text-text-primary text-[11px] font-mono transition-colors"
          title="Press Ctrl+K or ⌘K to open command search"
        >
          <Command className="w-3 h-3 text-primary" />
          <span>Quick Jump</span>
          <kbd className="px-1.5 py-0.2 bg-bg-primary rounded text-[9px] border border-border-default/60">⌘K</kbd>
        </button>

        {/* Live System Status Beacon */}
        <div className="max-md:hidden flex items-center text-[10px] font-mono">
          {isOnline ? (
            <div className="flex items-center text-[#9ca19f]">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#75d5a2] shadow-[0_0_8px_#75d5a2] mr-2 beacon-pulse"></span>
              All systems operational
            </div>
          ) : (
            <div className="flex items-center text-status-warning bg-status-warning/10 px-2 py-0.5 rounded border border-status-warning/30">
              <WifiOff className="w-3 h-3 mr-1.5 text-status-warning animate-pulse" />
              Gateway Offline
            </div>
          )}
        </div>

        {/* Notifications Icon Button */}
        <button
          type="button"
          onClick={onNotificationsClick}
          aria-label="View notifications"
          className="relative p-1.5 text-[#a5a6b0] hover:text-[#f0f0f4] transition-colors rounded-md hover:bg-[#1c1e25]"
        >
          <Bell className="w-4 h-4" />
          {unreadAlertsCount > 0 && (
            <span
              className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#d99d70] rounded-full shadow-[0_0_4px_#d99d70]"
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
            className="flex items-center gap-2.5 p-1 rounded-lg hover:bg-[#1c1e25] transition-colors cursor-pointer group"
          >
            {profile?.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt={profile.fullName || 'User'}
                className="w-7 h-7 rounded-full object-cover border border-[#b49aff]/40 group-hover:ring-2 group-hover:ring-[#b49aff]/50 transition-all shrink-0"
              />
            ) : (
              <div className="w-7 h-7 rounded-full flex items-center justify-center bg-[#514365] text-[#e9dfff] text-[10px] font-bold group-hover:ring-2 group-hover:ring-[#b49aff]/50 transition-all shrink-0">
                {userInitials}
              </div>
            )}

            <div className="hidden md:flex flex-col text-left leading-none">
              <span className="text-xs font-semibold text-[#eee] group-hover:text-[#b49aff] transition-colors truncate max-w-[120px]">
                {profile?.fullName || 'Suryansh Tyagi'}
              </span>
              <span className="text-[9px] text-[#7d808c] font-mono mt-0.5">
                {profile?.role || 'Administrator'}
              </span>
            </div>

            <ChevronDown className={`w-3 h-3 text-[#777] transition-transform duration-200 ${dropdownOpen ? 'rotate-180 text-[#b49aff]' : ''}`} />
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-[#17191f] border border-[#2b2e38] rounded-xl shadow-2xl p-1.5 text-xs text-[#eee] animate-fadeIn z-50">
              {/* Profile Card Header */}
              <div className="p-2.5 border-b border-[#252730] mb-1">
                <div className="font-bold text-sm text-[#f0f0f4] truncate">
                  {profile?.fullName || 'Suryansh Tyagi'}
                </div>
                <div className="text-[11px] text-[#858894] truncate">
                  {profile?.email || 'suryansh.tyagi@autrail.io'}
                </div>
                <div className="mt-1.5 inline-block text-[9px] font-mono px-2 py-0.5 rounded-full bg-[#b49aff]/15 text-[#b49aff] border border-[#b49aff]/30 font-semibold">
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
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left hover:bg-[#20222a] text-[#ddd] hover:text-[#fff] transition-colors cursor-pointer"
              >
                <User className="w-3.5 h-3.5 text-[#b49aff]" />
                <span>My Profile</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setDropdownOpen(false);
                  navigate('/settings');
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left hover:bg-[#20222a] text-[#ddd] hover:text-[#fff] transition-colors cursor-pointer"
              >
                <Settings className="w-3.5 h-3.5 text-[#8be0b3]" />
                <span>Account Settings</span>
              </button>

              <div className="h-px bg-[#252730] my-1" />

              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left hover:bg-red-950/40 text-red-400 hover:text-red-300 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5 text-red-400" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
