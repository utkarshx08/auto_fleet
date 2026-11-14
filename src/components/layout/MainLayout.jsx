import React from 'react';
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
    <div className="flex min-h-screen bg-[#F4F7FB] text-[#172033] font-sans relative selection:bg-[#EAF3FF] selection:text-[#2879E8]">
      {/* Ambient Subtle Radial Blue Lighting */}
      <div
        className="fixed top-0 left-0 w-full h-[520px] pointer-events-none z-0 opacity-70"
        style={{
          background: 'radial-gradient(ellipse 80% 50% at 20% -10%, rgba(40, 121, 232, 0.08) 0%, rgba(234, 243, 255, 0) 70%)'
        }}
      />

      {/* Sidebar */}
      <Sidebar
        vehicleCount={vehicleCount}
        maintenanceAlert={maintenanceAlert}
        onOpenHelp={onOpenHelp}
      />

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        <div className="max-w-[1600px] w-full mx-auto px-8 max-lg:px-6 max-md:px-4 flex-1 flex flex-col">
          {/* Top Navbar */}
          <Navbar
            currentSection={getSectionTitle()}
            unreadAlertsCount={unreadAlertsCount}
            onNotificationsClick={onOpenNotifications}
            onProfileClick={() => navigate('/settings')}
            onOpenCommandPalette={onOpenCommandPalette}
          />

          {/* Page Body */}
          <main className="flex-1 py-5">
            {children}
          </main>

          {/* Liquid Glass Footer */}
          <footer className="py-5 border-t border-[#E2E8F0]/80 flex flex-wrap items-center justify-between text-[11px] text-[#68758A] mt-auto">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#16A36A] shadow-[0_0_8px_#16A36A]/40" />
              <span>AUTRAIL Fleet Intelligence Engine • v2.4</span>
            </div>
            <div className="flex items-center gap-4 text-[#8A97AB]">
              <span className="hover:text-[#2879E8] transition-colors cursor-pointer" onClick={() => navigate('/settings')}>Settings</span>
              <span>•</span>
              <span className="hover:text-[#2879E8] transition-colors cursor-pointer" onClick={() => navigate('/reports')}>Compliance</span>
              <span>•</span>
              <span>© {new Date().getFullYear()} AUTRAIL Inc.</span>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
