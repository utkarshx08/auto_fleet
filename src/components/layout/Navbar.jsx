import React from 'react';
import { Bell, Command, Wifi, WifiOff } from 'lucide-react';
import useNetworkStatus from '../../hooks/useNetworkStatus';

export default function Navbar({
  currentSection = 'Overview',
  unreadAlertsCount = 3,
  onNotificationsClick,
  onProfileClick
}) {
  const { isOnline } = useNetworkStatus();

  return (
    <header className="h-[70px] max-md:h-[58px] flex items-center justify-between border-b border-[#252730] px-0 select-none">
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
          onClick={() => {
            window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true, ctrlKey: true }));
          }}
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

        {/* User Avatar */}
        <button
          type="button"
          onClick={onProfileClick}
          aria-label="Open profile settings"
          className="w-7 h-7 rounded-full flex items-center justify-center bg-[#514365] text-[#e9dfff] text-[10px] font-bold hover:ring-2 hover:ring-[#b49aff]/40 transition-all cursor-pointer"
        >
          JD
        </button>
      </div>
    </header>
  );
}

