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
  children
}) {
  const location = useLocation();
  const navigate = useNavigate();

  const getSectionTitle = () => {
    const path = location.pathname.replace('/', '');
    switch (path) {
      case 'vehicles':
        return 'Vehicles';
      case 'tracking':
        return 'Live Tracking';
      case 'analytics':
        return 'Fleet Analytics';
      case 'maintenance':
        return 'Maintenance';
      case 'drivers':
        return 'Drivers';
      case 'reports':
        return 'Reports';
      case 'routes':
        return 'Routes';
      case 'fuel':
        return 'Fuel & Energy';
      case 'settings':
        return 'Settings';
      case 'overview':
      default:
        return 'Overview';
    }
  };

  return (
    <div className="flex min-h-screen bg-[#101116] text-[#f0f0f4] font-sans">
      {/* Sidebar */}
      <Sidebar
        vehicleCount={vehicleCount}
        maintenanceAlert={maintenanceAlert}
        onOpenHelp={onOpenHelp}
      />

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="max-w-[1600px] w-full mx-auto px-10 max-lg:px-6 max-md:px-4 flex-1 flex flex-col">
          {/* Top Navbar */}
          <Navbar
            currentSection={getSectionTitle()}
            unreadAlertsCount={unreadAlertsCount}
            onNotificationsClick={onOpenNotifications}
            onProfileClick={() => navigate('/settings')}
          />

          {/* Page Body */}
          <main className="flex-1 py-4">
            {children}
          </main>

          {/* Autrail Footer */}
          <footer className="flex flex-wrap items-center gap-4 text-[#666a76] font-mono text-[8px] tracking-[0.6px] py-6 mt-auto border-t border-[#1c1e25]">
            <span>© 2025 AUTRAIL</span>
            <span className="font-sans text-[9px] tracking-normal text-[#777b87]">
              Built for the road ahead.
            </span>
            <div className="ml-auto flex items-center gap-1.5 text-[#777b87]">
              <span>SYSTEM STATUS</span>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#75d5a2] shadow-[0_0_6px_#75d5a2] mx-1 beacon-pulse"></span>
              <span className="text-[#8be0b3] font-mono">OPERATIONAL</span>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
