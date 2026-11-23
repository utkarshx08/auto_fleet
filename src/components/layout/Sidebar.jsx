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
  Compass,
  Smartphone,
  User,
  HelpCircle,
  X
} from 'lucide-react';

export default function Sidebar({
  vehicleCount = 12,
  maintenanceAlert = true,
  onOpenHelp,
  className = '',
  mobileOpen = false,
  onCloseMobile
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile } = useAuth();

  const userName = profile?.fullName || 'Suryansh Tyagi';
  const userRole = profile?.role || 'Fleet Administrator';
  const userInitials = userName
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'ST';

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
    { id: 'reports', label: 'Trip Reports', tab: 'reports' },
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
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs z-40 md:hidden animate-in fade-in duration-200"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      {/* Main Sidebar Shell */}
      <aside
        className={`w-64 flex-shrink-0 border-r border-slate-200/90 p-4 pb-5 flex flex-col bg-white backdrop-blur-xl min-h-screen select-none transition-transform duration-200 shadow-2xs relative z-50 md:z-20 ${
          mobileOpen
            ? 'fixed inset-y-0 left-0 translate-x-0 shadow-2xl'
            : 'max-md:-translate-x-full max-md:fixed max-md:inset-y-0 max-md:left-0 md:translate-x-0'
        } ${className}`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between px-2 pb-5">
          <div
            onClick={() => handleNavClick('/overview')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#2879E8] to-[#1A6CDA] text-white flex items-center justify-center text-sm font-bold tracking-normal shrink-0 shadow-xs shadow-[inset_0_1px_0_rgba(255,255,255,0.25)] group-hover:scale-[1.02] transition-transform">
              A
            </span>
            <div className="flex flex-col leading-none">
              <span className="text-slate-900 text-[15px] font-bold tracking-tight">
                AUTRAIL
              </span>
              <span className="text-[11px] text-slate-500 font-medium mt-0.5">
                Fleet Intelligence
              </span>
            </div>
          </div>

          {onCloseMobile && (
            <button
              type="button"
              onClick={onCloseMobile}
              className="md:hidden text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors"
              aria-label="Close navigation"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Workspace Switcher */}
        <div
          onClick={() => handleNavClick('/settings')}
          className="flex items-center gap-2.5 bg-slate-50/80 border border-slate-200/90 px-3 py-2 rounded-lg text-xs text-slate-900 mb-5 hover:border-slate-300 hover:bg-slate-100/70 transition-all cursor-pointer shadow-2xs"
          title="Workspace settings"
        >
          <span className="w-2 h-2 rounded-full bg-[#2879E8] shrink-0" />
          <span className="truncate font-medium text-slate-800">Northstar Logistics</span>
          <ChevronDown className="w-3.5 h-3.5 ml-auto text-slate-400 shrink-0" />
        </div>

        {/* Navigation Scroll Area */}
        <div className="flex-1 overflow-y-auto -mr-2 pr-2 space-y-4">
          {/* Section: Workspace */}
          <div>
            <p className="text-[11px] font-semibold text-slate-400 px-2.5 mb-1.5 uppercase tracking-wider">
              Workspace
            </p>
            <nav className="flex flex-col gap-0.5">
              {workspaceLinks.map((item) => {
                const Icon = item.icon;
                const isActive = currentPath === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleNavClick(item.path)}
                    className={`h-9 flex items-center gap-2.5 px-2.5 rounded-lg text-xs transition-all cursor-pointer text-left w-full group relative ${
                      isActive
                        ? 'bg-[#EAF3FF] text-[#2879E8] font-semibold border border-[#D5E6FB]/70 shadow-2xs'
                        : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 border border-transparent font-medium'
                    }`}
                    title={item.label}
                  >
                    <Icon
                      className={`w-4 h-4 shrink-0 transition-colors ${
                        isActive ? 'text-[#2879E8]' : 'text-slate-400 group-hover:text-slate-700'
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                    {item.kbd && (
                      <kbd className="ml-auto font-mono text-[10px] text-slate-400 bg-white border border-slate-200 px-1.5 py-0.2 rounded shadow-2xs">
                        {item.kbd}
                      </kbd>
                    )}
                    {item.count !== undefined && (
                      <span className={`ml-auto rounded-md px-1.5 py-0.5 text-[11px] font-medium tabular-nums ${
                        isActive ? 'bg-blue-100/80 text-[#2879E8]' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {item.count}
                      </span>
                    )}
                    {item.hasDot && (
                      <span className="ml-auto w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Section: Trip Management */}
          <div>
            <div className="flex items-center justify-between px-2.5 mb-1.5">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider m-0">
                Trip Management
              </p>
              <button
                type="button"
                onClick={() => setIsTripsExpanded(!isTripsExpanded)}
                className="text-slate-400 hover:text-slate-700 p-0.5 rounded transition-colors"
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
                if (onCloseMobile) onCloseMobile();
              }}
              className={`h-9 flex items-center gap-2.5 px-2.5 rounded-lg text-xs transition-all cursor-pointer text-left w-full group relative ${
                isTripsActive
                  ? 'bg-[#EAF3FF] text-[#2879E8] font-semibold border border-[#D5E6FB]/70 shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 border border-transparent font-medium'
              }`}
              title="Trip & Dispatch Operations"
            >
              <Route
                className={`w-4 h-4 shrink-0 transition-colors ${
                  isTripsActive ? 'text-[#2879E8]' : 'text-slate-400 group-hover:text-slate-700'
                }`}
              />
              <span className="truncate">Trip & Dispatch</span>
              <span className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
            </button>

            {/* Sub-navigation Links */}
            {isTripsExpanded && (
              <div className="pl-3 pr-1 mt-1 flex flex-col gap-0.5 border-l border-slate-200 ml-4.5">
                {tripSubLinks.map((sub) => {
                  const isSubActive = isTripsActive && activeTripTab === sub.tab;
                  return (
                    <button
                      key={sub.id}
                      type="button"
                      onClick={() => handleNavClick(`/trips?tab=${sub.tab}`)}
                      className={`h-7 flex items-center gap-2 px-2 rounded-md text-[11px] transition-all cursor-pointer text-left w-full ${
                        isSubActive
                          ? 'bg-[#EAF3FF] text-[#2879E8] font-semibold'
                          : 'text-slate-600 hover:bg-slate-100/70 hover:text-slate-900 font-medium'
                      }`}
                    >
                      <span
                        className={`w-1 h-1 rounded-full shrink-0 ${
                          isSubActive ? 'bg-[#2879E8]' : 'bg-slate-300'
                        }`}
                      />
                      <span className="truncate">{sub.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Section: Management */}
          <div>
            <p className="text-[11px] font-semibold text-slate-400 px-2.5 mb-1.5 uppercase tracking-wider">
              Management
            </p>
            <nav className="flex flex-col gap-0.5">
              {managementLinks.map((item) => {
                const Icon = item.icon;
                const isActive = currentPath === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleNavClick(item.path)}
                    className={`h-9 flex items-center gap-2.5 px-2.5 rounded-lg text-xs transition-all cursor-pointer text-left w-full group relative ${
                      isActive
                        ? 'bg-[#EAF3FF] text-[#2879E8] font-semibold border border-[#D5E6FB]/70 shadow-2xs'
                        : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 border border-transparent font-medium'
                    }`}
                    title={item.label}
                  >
                    <Icon
                      className={`w-4 h-4 shrink-0 transition-colors ${
                        isActive ? 'text-[#2879E8]' : 'text-slate-400 group-hover:text-slate-700'
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Sidebar Bottom: Help Card & User Profile */}
        <div className="mt-auto pt-4 flex flex-col gap-2.5">
          <div
            onClick={() => {
              if (onOpenHelp) onOpenHelp();
              if (onCloseMobile) onCloseMobile();
            }}
            className="flex items-center gap-2.5 p-2.5 border border-slate-200/80 bg-slate-50/70 hover:bg-white hover:border-slate-300 rounded-lg text-slate-900 transition-all cursor-pointer group shadow-2xs"
          >
            <div className="w-6 h-6 bg-blue-50 border border-blue-100 rounded-md flex items-center justify-center text-[#2879E8] shrink-0">
              <HelpCircle className="w-3.5 h-3.5" />
            </div>
            <div className="flex flex-col min-w-0 truncate">
              <span className="text-xs text-slate-800 font-semibold leading-tight group-hover:text-[#2879E8] transition-colors truncate">
                Fleet Help Center
              </span>
              <span className="text-[10px] text-slate-500 leading-tight truncate">
                Guides & shortcuts
              </span>
            </div>
            <ArrowUpRight className="w-3.5 h-3.5 ml-auto text-slate-400 group-hover:text-[#2879E8] transition-colors shrink-0" />
          </div>

          <div
            onClick={() => handleNavClick('/profile')}
            className="border-t border-slate-200/90 pt-3 flex items-center gap-2.5 px-0.5 cursor-pointer hover:opacity-90 transition-opacity"
          >
            {profile?.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt={userName}
                className="w-8 h-8 rounded-lg object-cover border border-slate-200 shadow-2xs shrink-0"
                style={{ width: '32px', height: '32px', maxWidth: '32px', maxHeight: '32px' }}
              />
            ) : (
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center bg-blue-50 text-[#2879E8] border border-blue-200/70 text-xs font-semibold shrink-0 shadow-2xs"
                style={{ width: '32px', height: '32px' }}
              >
                {userInitials}
              </div>
            )}
            <div className="flex flex-col min-w-0 truncate flex-1">
              <span className="text-xs text-slate-900 font-semibold leading-none truncate">
                {userName}
              </span>
              <span className="text-[11px] text-slate-500 leading-tight truncate mt-0.5">
                {userRole}
              </span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
