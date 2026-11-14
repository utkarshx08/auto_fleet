import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutGrid,
  Truck,
  Navigation,
  ShieldAlert,
  TrendingUp,
  Wrench,
  Users,
  FileText,
  Route,
  Zap,
  Settings,
  ArrowUpRight,
  ChevronDown,
  ChevronRight,
  MoreHorizontal,
  Compass,
  Smartphone,
  User
} from 'lucide-react';

export default function Sidebar({
  vehicleCount = 12,
  maintenanceAlert = true,
  onOpenHelp,
  className = ''
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile } = useAuth();

  const userName = profile?.fullName || 'Suryansh Tyagi';
  const userRole = profile?.role || 'Administrator';
  const userInitials = userName.split(' ').filter(Boolean).map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'ST';

  const currentPath = location.pathname.replace('/', '') || 'overview';
  const isTripsActive = location.pathname.startsWith('/trips');
  const activeTripTab = new URLSearchParams(location.search).get('tab') || 'dashboard';

  const [isTripsExpanded, setIsTripsExpanded] = useState(isTripsActive || true);

  const workspaceLinks = [
    {
      id: 'overview',
      path: '/overview',
      label: 'Overview',
      icon: LayoutGrid,
      kbd: '⌘1',
    },
    {
      id: 'vehicles',
      path: '/vehicles',
      label: 'Vehicles',
      icon: Truck,
      count: vehicleCount,
    },
    {
      id: 'tracking',
      path: '/tracking',
      label: 'Live tracking',
      icon: Navigation,
    },
    {
      id: 'geofencing',
      path: '/geofencing',
      label: 'Geofencing',
      icon: ShieldAlert,
    },
    {
      id: 'analytics',
      path: '/analytics',
      label: 'Analytics',
      icon: TrendingUp,
    },
    {
      id: 'maintenance',
      path: '/maintenance',
      label: 'Maintenance',
      icon: Wrench,
      hasDot: maintenanceAlert,
    },
    {
      id: 'drivers',
      path: '/drivers',
      label: 'Drivers',
      icon: Users,
    },
    {
      id: 'reports',
      path: '/reports',
      label: 'Reports',
      icon: FileText,
    },
  ];

  const tripSubLinks = [
    { id: 'dashboard', label: 'Trip Dashboard', tab: 'dashboard' },
    { id: 'all', label: 'All Trips', tab: 'all' },
    { id: 'create', label: 'Create New Trip', tab: 'create' },
    { id: 'active', label: 'Active Trips', tab: 'active' },
    { id: 'history', label: 'Trip History', tab: 'history' },
    { id: 'reports', label: 'Trip Reports', tab: 'reports' }
  ];

  const managementLinks = [
    {
      id: 'driver',
      path: '/driver',
      label: 'Driver portal',
      icon: Smartphone,
    },
    {
      id: 'fuel',
      path: '/fuel',
      label: 'Fuel & energy',
      icon: Zap,
    },
    {
      id: 'routes',
      path: '/routes',
      label: 'Routes',
      icon: Compass,
    },
    {
      id: 'profile',
      path: '/profile',
      label: 'My Profile',
      icon: User,
    },
    {
      id: 'settings',
      path: '/settings',
      label: 'Settings',
      icon: Settings,
    },
  ];

  const handleNavClick = (path) => {
    navigate(path);
  };

  return (
    <aside
      className={`w-[248px] max-md:w-[68px] flex-shrink-0 border-r border-[#E2E8F0]/80 p-5 max-md:p-2.5 pb-5 flex flex-col bg-white/95 backdrop-blur-xl min-h-screen select-none transition-all duration-200 shadow-[0_8px_30px_rgba(43,73,116,0.06)] relative z-20 ${className}`}
    >
      {/* Brand Header */}
      <div
        onClick={() => navigate('/overview')}
        className="flex items-center gap-2.5 px-2 max-md:px-1 pb-6 cursor-pointer group"
      >
        <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#2879E8] to-[#1765CC] text-white flex items-center justify-center text-sm font-extrabold tracking-normal shrink-0 shadow-[0_4px_12px_rgba(40,121,232,0.35)] group-hover:scale-105 transition-transform">
          A
        </span>
        <div className="max-md:hidden flex flex-col">
          <span className="text-[#172033] text-[14px] font-black tracking-[1.5px] leading-tight">
            AUTRAIL
          </span>
          <span className="text-[9px] font-mono tracking-wider text-[#8A97AB] uppercase">
            Fleet OS
          </span>
        </div>
      </div>

      {/* Workspace Switcher */}
      <div
        onClick={() => navigate('/settings')}
        className="max-md:hidden flex items-center gap-2.5 bg-[#F8FAFD] border border-[#E2E8F0] p-2.5 rounded-xl text-[12px] text-[#172033] mb-6 hover:border-[#2879E8]/40 hover:bg-[#F0F5FC] transition-all cursor-pointer shadow-sm"
        title="Workspace settings"
      >
        <span className="w-2 h-2 rounded-full bg-[#2879E8] shadow-[0_0_8px_#2879E8] shrink-0" />
        <span className="truncate font-semibold text-[#172033]">Northstar Logistics</span>
        <ChevronDown className="w-3.5 h-3.5 ml-auto text-[#8A97AB] shrink-0" />
      </div>

      {/* Section: WORKSPACE */}
      <p className="max-md:hidden font-mono text-[10px] tracking-[1.2px] text-[#8A97AB] px-2 mb-2 uppercase font-medium">
        Workspace
      </p>
      <nav className="flex flex-col gap-1">
        {workspaceLinks.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleNavClick(item.path)}
              className={`h-[40px] flex items-center gap-3 px-3 max-md:px-0 max-md:justify-center rounded-xl text-[12px] transition-all cursor-pointer text-left w-full group relative ${
                isActive
                  ? 'bg-[#EAF3FF] text-[#2879E8] font-semibold shadow-sm'
                  : 'text-[#68758A] hover:bg-[#F1F5F9] hover:text-[#172033]'
              }`}
              title={item.label}
            >
              {isActive && (
                <span className="absolute left-0 top-2 bottom-2 w-1 bg-[#2879E8] rounded-r-full max-md:hidden" />
              )}
              <Icon
                className={`w-4 h-4 shrink-0 transition-colors ${
                  isActive ? 'text-[#2879E8]' : 'text-[#8A97AB] group-hover:text-[#172033]'
                }`}
              />
              <span className="max-md:hidden truncate">{item.label}</span>
              {item.kbd && (
                <kbd className="max-md:hidden ml-auto font-mono text-[9px] text-[#8A97AB] bg-white/80 border border-[#E2E8F0] px-1.5 py-0.5 rounded shadow-2xs">
                  {item.kbd}
                </kbd>
              )}
              {item.count !== undefined && (
                <span className="max-md:hidden ml-auto bg-[#EAF3FF] rounded-lg px-2 py-0.5 font-mono text-[10px] font-semibold text-[#2879E8]">
                  {item.count}
                </span>
              )}
              {item.hasDot && (
                <span className="max-md:hidden ml-auto w-1.5 h-1.5 rounded-full bg-[#E7A329] shadow-[0_0_6px_#E7A329]" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Section: TRIP MANAGEMENT */}
      <div className="mt-5 mb-2">
        <div className="flex items-center justify-between px-2 mb-1.5">
          <p className="max-md:hidden font-mono text-[10px] tracking-[1.2px] text-[#8A97AB] uppercase m-0 font-medium">
            Trip Management
          </p>
          <button
            type="button"
            onClick={() => setIsTripsExpanded(!isTripsExpanded)}
            className="max-md:hidden text-[#8A97AB] hover:text-[#172033] p-0.5 rounded transition-colors"
            title={isTripsExpanded ? 'Collapse Trip Management' : 'Expand Trip Management'}
          >
            {isTripsExpanded ? (
              <ChevronDown className="w-3 h-3" />
            ) : (
              <ChevronRight className="w-3 h-3" />
            )}
          </button>
        </div>

        {/* Main Trip Nav Button */}
        <button
          type="button"
          onClick={() => {
            navigate('/trips');
            setIsTripsExpanded(true);
          }}
          className={`h-[40px] flex items-center gap-3 px-3 max-md:px-0 max-md:justify-center rounded-xl text-[12px] transition-all cursor-pointer text-left w-full group relative ${
            isTripsActive
              ? 'bg-[#EAF3FF] text-[#2879E8] font-semibold shadow-sm'
              : 'text-[#68758A] hover:bg-[#F1F5F9] hover:text-[#172033]'
          }`}
          title="Trip & Dispatch Management"
        >
          {isTripsActive && (
            <span className="absolute left-0 top-2 bottom-2 w-1 bg-[#2879E8] rounded-r-full max-md:hidden" />
          )}
          <Route
            className={`w-4 h-4 shrink-0 transition-colors ${
              isTripsActive ? 'text-[#2879E8]' : 'text-[#8A97AB] group-hover:text-[#172033]'
            }`}
          />
          <span className="max-md:hidden truncate">Trip & Dispatch</span>
          <span className="max-md:hidden ml-auto w-1.5 h-1.5 rounded-full bg-[#16A36A] animate-pulse" />
        </button>

        {/* Sub-navigation Links */}
        {isTripsExpanded && (
          <div className="max-md:hidden pl-4 pr-1 mt-1 flex flex-col gap-0.5 border-l border-[#E2E8F0] ml-4">
            {tripSubLinks.map((sub) => {
              const isSubActive = isTripsActive && activeTripTab === sub.tab;
              return (
                <button
                  key={sub.id}
                  type="button"
                  onClick={() => navigate(`/trips?tab=${sub.tab}`)}
                  className={`h-[30px] flex items-center gap-2 px-2.5 rounded-lg text-[11px] transition-all cursor-pointer text-left w-full ${
                    isSubActive
                      ? 'bg-[#EAF3FF] text-[#2879E8] font-semibold'
                      : 'text-[#68758A] hover:bg-[#F1F5F9] hover:text-[#172033]'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isSubActive ? 'bg-[#2879E8]' : 'bg-[#CBD5E1]'
                    }`}
                  />
                  <span className="truncate">{sub.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Section: MANAGEMENT */}
      <p className="max-md:hidden font-mono text-[10px] tracking-[1.2px] text-[#8A97AB] px-2 mt-4 mb-2 uppercase font-medium">
        Management
      </p>
      <nav className="flex flex-col gap-1 max-md:mt-4">
        {managementLinks.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleNavClick(item.path)}
              className={`h-[40px] flex items-center gap-3 px-3 max-md:px-0 max-md:justify-center rounded-xl text-[12px] transition-all cursor-pointer text-left w-full group relative ${
                isActive
                  ? 'bg-[#EAF3FF] text-[#2879E8] font-semibold shadow-sm'
                  : 'text-[#68758A] hover:bg-[#F1F5F9] hover:text-[#172033]'
              }`}
              title={item.label}
            >
              {isActive && (
                <span className="absolute left-0 top-2 bottom-2 w-1 bg-[#2879E8] rounded-r-full max-md:hidden" />
              )}
              <Icon
                className={`w-4 h-4 shrink-0 transition-colors ${
                  isActive ? 'text-[#2879E8]' : 'text-[#8A97AB] group-hover:text-[#172033]'
                }`}
              />
              <span className="max-md:hidden truncate">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Sidebar Bottom: Help Card & User Profile */}
      <div className="mt-auto pt-5 flex flex-col gap-3">
        <div
          onClick={onOpenHelp}
          className="max-md:hidden flex items-center gap-2.5 p-3 border border-[#E2E8F0] bg-gradient-to-br from-white to-[#F8FAFD] hover:border-[#2879E8]/40 hover:shadow-liquid-subtle rounded-xl text-[#172033] transition-all cursor-pointer group"
        >
          <div className="w-7 h-7 bg-[#EAF3FF] border border-[#D5E6FB] rounded-full flex items-center justify-center text-[#2879E8] shrink-0 font-mono text-xs font-bold shadow-2xs">
            ?
          </div>
          <div className="flex flex-col gap-0.5 truncate">
            <b className="text-[11px] text-[#172033] font-semibold leading-none group-hover:text-[#2879E8] transition-colors">
              Need assistance?
            </b>
            <small className="text-[10px] text-[#68758A] leading-tight">
              Fleet documentation & support
            </small>
          </div>
          <ArrowUpRight className="w-3.5 h-3.5 ml-auto text-[#8A97AB] group-hover:text-[#2879E8] transition-colors shrink-0" />
        </div>

        <div
          onClick={() => navigate('/profile')}
          className="border-t border-[#E2E8F0] pt-3 flex items-center gap-2.5 px-0.5 cursor-pointer hover:opacity-95 transition-opacity"
        >
          {profile?.avatarUrl ? (
            <img
              src={profile.avatarUrl}
              alt={userName}
              className="w-8 h-8 rounded-full object-cover border border-[#2879E8]/30 shadow-2xs shrink-0"
            />
          ) : (
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[#EAF3FF] text-[#2879E8] border border-[#D5E6FB] text-[11px] font-bold shrink-0 shadow-2xs">
              {userInitials}
            </div>
          )}
          <div className="max-md:hidden flex flex-col gap-0.5 truncate flex-1">
            <b className="text-[12px] text-[#172033] font-semibold leading-none truncate">
              {userName}
            </b>
            <small className="text-[10px] text-[#68758A] leading-tight truncate">
              {userRole}
            </small>
          </div>
          <button
            type="button"
            className="max-md:hidden text-[#8A97AB] hover:text-[#172033] p-1 rounded transition-colors"
            aria-label="Profile menu"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
