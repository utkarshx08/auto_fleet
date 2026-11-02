import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
  MoreHorizontal
} from 'lucide-react';

export default function Sidebar({
  vehicleCount = 12,
  maintenanceAlert = true,
  onOpenHelp,
  className = ''
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const currentPath = location.pathname.replace('/', '') || 'overview';

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

  const managementLinks = [
    {
      id: 'routes',
      path: '/routes',
      label: 'Routes',
      icon: Route,
    },
    {
      id: 'fuel',
      path: '/fuel',
      label: 'Fuel & energy',
      icon: Zap,
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
      className={`w-[238px] max-md:w-[60px] flex-shrink-0 border-r border-[#252730] p-6 max-md:p-2.5 pb-4 flex flex-col bg-[#121319] min-h-screen select-none transition-all duration-200 ${className}`}
    >
      {/* Brand Header */}
      <div
        onClick={() => navigate('/overview')}
        className="flex items-center gap-2.5 text-[#f4f3f8] text-[13px] font-extrabold tracking-[2px] px-2 max-md:px-1 pb-7 cursor-pointer group"
      >
        <span className="w-[27px] h-[27px] rounded-[8px] bg-[#b49aff] text-[#17131f] flex items-center justify-center text-base font-extrabold tracking-normal shrink-0 shadow-[0_0_12px_rgba(180,154,255,0.3)] group-hover:scale-105 transition-transform">
          A
        </span>
        <span className="max-md:hidden">AUTRAIL</span>
      </div>

      {/* Workspace Switcher */}
      <div
        onClick={() => navigate('/settings')}
        className="max-md:hidden flex items-center gap-2.5 bg-[#1c1e25] border border-[#2b2e38] p-2.5 rounded-[9px] text-[11px] text-[#d4d4dc] mb-7 hover:border-[#383c4a] transition-colors cursor-pointer"
        title="Workspace settings"
      >
        <span className="w-[7px] h-[7px] rounded-full bg-[#9b83ed] shadow-[0_0_10px_#9b83ed] shrink-0" />
        <span className="truncate font-medium">Northstar Logistics</span>
        <ChevronDown className="w-3.5 h-3.5 ml-auto text-[#888] shrink-0" />
      </div>

      {/* Section: WORKSPACE */}
      <p className="max-md:hidden font-mono text-[10px] tracking-[1.2px] text-[#858894] px-2 mb-2 uppercase">
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
              className={`h-[41px] flex items-center gap-3 px-2.5 max-md:px-0 max-md:justify-center rounded-[7px] text-[12px] transition-all cursor-pointer text-left w-full ${
                isActive
                  ? 'bg-[#24212f] text-[#e9e2ff] shadow-[inset_2px_0_#b69cff] font-medium'
                  : 'text-[#9b9da8] hover:bg-[#1a1b24] hover:text-[#e9e2ff]'
              }`}
              title={item.label}
            >
              <Icon className="w-4 h-4 shrink-0 text-[#a7a9b5]" />
              <span className="max-md:hidden truncate">{item.label}</span>
              {item.kbd && (
                <kbd className="max-md:hidden ml-auto font-mono text-[10px] text-[#747683] bg-transparent">
                  {item.kbd}
                </kbd>
              )}
              {item.count !== undefined && (
                <span className="max-md:hidden ml-auto bg-[#2b2d37] rounded-[5px] px-1.5 py-0.5 font-mono text-[10px] text-[#c4b3ff]">
                  {item.count}
                </span>
              )}
              {item.hasDot && (
                <span className="max-md:hidden ml-auto w-[5px] h-[5px] rounded-full bg-[#edaa69] shadow-[0_0_6px_#edaa69]" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Section: MANAGEMENT */}
      <p className="max-md:hidden font-mono text-[10px] tracking-[1.2px] text-[#858894] px-2 mt-7 mb-2 uppercase">
        Management
      </p>
      <nav className="flex flex-col gap-0.5 max-md:mt-4">
        {managementLinks.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleNavClick(item.path)}
              className={`h-[41px] flex items-center gap-3 px-2.5 max-md:px-0 max-md:justify-center rounded-[7px] text-[12px] transition-all cursor-pointer text-left w-full ${
                isActive
                  ? 'bg-[#24212f] text-[#e9e2ff] shadow-[inset_2px_0_#b69cff] font-medium'
                  : 'text-[#9b9da8] hover:bg-[#1a1b24] hover:text-[#e9e2ff]'
              }`}
              title={item.label}
            >
              <Icon className="w-4 h-4 shrink-0 text-[#a7a9b5]" />
              <span className="max-md:hidden truncate">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Sidebar Bottom: Help Card & User Profile */}
      <div className="mt-auto pt-6 flex flex-col gap-4">
        <div
          onClick={onOpenHelp}
          className="max-md:hidden flex items-center gap-2.5 p-3 border border-[#292c35] bg-[#17191f]/50 hover:bg-[#1c1e25] rounded-[9px] text-[#aeb0bb] transition-colors cursor-pointer group"
        >
          <div className="w-6 h-6 border border-[#46404f] rounded-full flex items-center justify-center text-[#c4b3ff] shrink-0 font-mono text-xs">
            ?
          </div>
          <div className="flex flex-col gap-0.5 truncate">
            <b className="text-[11px] text-[#e0e0e7] font-semibold leading-none group-hover:text-white transition-colors">
              Need a hand?
            </b>
            <small className="text-[10px] text-[#858894] leading-tight">
              Visit our help centre
            </small>
          </div>
          <ArrowUpRight className="w-3.5 h-3.5 ml-auto text-[#7e818d] group-hover:text-[#c4b3ff] transition-colors shrink-0" />
        </div>

        <div
          onClick={() => navigate('/settings')}
          className="border-t border-[#292b34] pt-4 flex items-center gap-2.5 px-0.5 cursor-pointer hover:opacity-90 transition-opacity"
        >
          <div className="w-[30px] h-[30px] rounded-full flex items-center justify-center bg-[#514365] text-[#e9dfff] text-[10px] font-bold shrink-0">
            JD
          </div>
          <div className="max-md:hidden flex flex-col gap-0.5 truncate flex-1">
            <b className="text-[11px] text-[#e0e0e7] font-semibold leading-none">
              Jordan Davis
            </b>
            <small className="text-[10px] text-[#858894] leading-tight">
              Fleet manager
            </small>
          </div>
          <button
            type="button"
            className="max-md:hidden text-[#858894] hover:text-[#e0e0e7] p-1"
            aria-label="Profile menu"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
