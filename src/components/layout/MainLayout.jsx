import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function MainLayout({
  unreadAlertsCount = 3,
  vehicleCount = 12,
  maintenanceAlert = true,
  onOpenNotifications,
  onOpenHelp,
  onOpenCommandPalette,
  children
}) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const getSectionTitle = () => {
    const pathname = location.pathname;
    if (pathname.startsWith('/trips/')) return 'Trip Details';
    if (pathname.startsWith('/trips')) return 'Trip Operations';
    if (pathname.startsWith('/driver')) return 'Driver Portal';
    if (pathname.startsWith('/geofencing')) return 'Geofencing & Alerts';
    if (pathname.startsWith('/vehicles')) return 'Vehicles';
    if (pathname.startsWith('/tracking')) return 'Live Tracking';
    if (pathname.startsWith('/analytics')) return 'Fleet Analytics';
    if (pathname.startsWith('/maintenance')) return 'Maintenance';
    if (pathname.startsWith('/drivers')) return 'Drivers';
    if (pathname.startsWith('/reports')) return 'Reports';
    if (pathname.startsWith('/routes')) return 'Routes';
    if (pathname.startsWith('/fuel')) return 'Fuel & Energy';
    if (pathname.startsWith('/profile')) return 'Operator Profile';
    if (pathname.startsWith('/settings')) return 'Settings';
    return 'Overview';
  };

  return (
    <div className="flex min-h-screen bg-[#F4F7FB] text-slate-800 font-sans relative selection:bg-blue-100 selection:text-[#2879E8] autrail-layout-shell transition-colors duration-200">
      {/* Subtle Specular Top Reflection */}
      <div
        className="fixed top-0 left-0 w-full h-96 pointer-events-none z-0 opacity-60"
        style={{
          background: 'radial-gradient(ellipse 70% 40% at 25% -5%, rgba(40, 121, 232, 0.04) 0%, transparent 65%)'
        }}
      />

      {/* Sidebar (Desktop static + Mobile slide-over drawer) */}
      <Sidebar
        vehicleCount={vehicleCount}
        maintenanceAlert={maintenanceAlert}
        onOpenHelp={onOpenHelp}
        mobileOpen={mobileNavOpen}
        onCloseMobile={() => setMobileNavOpen(false)}
      />

      {/* Main Viewport Container */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 flex-1 flex flex-col">
          {/* Top Navbar */}
          <Navbar
            currentSection={getSectionTitle()}
            unreadAlertsCount={unreadAlertsCount}
            onNotificationsClick={onOpenNotifications}
            onProfileClick={() => navigate('/settings')}
            onOpenCommandPalette={onOpenCommandPalette}
            onToggleMobileNav={() => setMobileNavOpen((prev) => !prev)}
          />

          {/* Page Viewport Body */}
          <main className="flex-1 py-5 sm:py-6">
            {children}
          </main>

          {/* Solid Liquid Glass Fleet Footer */}
          <footer className="py-4 border-t border-slate-200/80 flex flex-wrap items-center justify-between text-xs text-slate-500 mt-auto gap-3">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
              <span>AUTRAIL Fleet Intelligence Engine • v2.4</span>
            </div>
            <div className="flex items-center gap-3.5 text-slate-400">
              <span
                className="hover:text-[#2879E8] transition-colors cursor-pointer"
                onClick={() => navigate('/settings')}
              >
                Settings
              </span>
              <span>•</span>
              <span
                className="hover:text-[#2879E8] transition-colors cursor-pointer"
                onClick={() => navigate('/reports')}
              >
                Compliance
              </span>
              <span>•</span>
              <span>© {new Date().getFullYear()} AUTRAIL Inc.</span>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
