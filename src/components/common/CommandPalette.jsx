import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Truck,
  MapPin,
  Route,
  Wrench,
  Fuel,
  BarChart2,
  Settings,
  UserCheck,
  FileText,
  PlusCircle,
  Download,
  X,
  CornerDownLeft,
  Navigation
} from 'lucide-react';

export default function CommandPalette({
  isOpen,
  onClose,
  vehicles = [],
  onAddVehicle,
  onExportReport
}) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const defaultRoutes = [
    { id: 'p-overview', title: 'Fleet Overview Dashboard', category: 'Navigation', icon: BarChart2, path: '/overview' },
    { id: 'p-vehicles', title: 'Vehicles Directory', category: 'Navigation', icon: Truck, path: '/vehicles' },
    { id: 'p-tracking', title: 'Live GPS Fleet Tracking', category: 'Navigation', icon: MapPin, path: '/tracking' },
    { id: 'p-trips', title: 'Trip & Dispatch Operations', category: 'Navigation', icon: Route, path: '/trips' },
    { id: 'p-driver', title: 'Driver Mobile Portal', category: 'Navigation', icon: UserCheck, path: '/driver' },
    { id: 'p-maintenance', title: 'Maintenance & Service Logs', category: 'Navigation', icon: Wrench, path: '/maintenance' },
    { id: 'p-fuel', title: 'Fuel & Energy Management', category: 'Navigation', icon: Fuel, path: '/fuel' },
    { id: 'p-geofencing', title: 'Geofencing Zones & Alerts', category: 'Navigation', icon: Navigation, path: '/geofencing' },
    { id: 'p-analytics', title: 'Fleet Analytics & Telematics', category: 'Navigation', icon: BarChart2, path: '/analytics' },
    { id: 'p-reports', title: 'Audit & Compliance Reports', category: 'Navigation', icon: FileText, path: '/reports' },
    { id: 'p-settings', title: 'System Settings', category: 'Navigation', icon: Settings, path: '/settings' }
  ];

  const quickActions = [
    {
      id: 'a-add-veh',
      title: 'Register New Vehicle',
      category: 'Actions',
      icon: PlusCircle,
      action: () => {
        onClose();
        if (onAddVehicle) onAddVehicle();
      }
    },
    {
      id: 'a-export',
      title: 'Export Fleet CSV Report',
      category: 'Actions',
      icon: Download,
      action: () => {
        onClose();
        if (onExportReport) onExportReport();
      }
    }
  ];

  // Vehicle search items
  const vehicleItems = vehicles.map((v) => ({
    id: `v-${v.id}`,
    title: `${v.plate} - ${v.model || v.type} (${v.driver || 'Unassigned'})`,
    subtitle: `Status: ${v.status} • Fuel: ${v.fuel}% • Location: ${v.location || 'NYC'}`,
    category: 'Vehicles',
    icon: Truck,
    path: '/vehicles'
  }));

  const allItems = [...quickActions, ...defaultRoutes, ...vehicleItems];

  const filteredItems = query.trim() === ''
    ? allItems.slice(0, 8)
    : allItems.filter((item) => {
        const text = `${item.title} ${item.subtitle || ''} ${item.category}`.toLowerCase();
        return text.includes(query.toLowerCase());
      });

  const handleSelect = (item) => {
    if (item.action) {
      item.action();
    } else if (item.path) {
      navigate(item.path);
      onClose();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (filteredItems.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % (filteredItems.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        handleSelect(filteredItems[selectedIndex]);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-bg-surface border border-border-default/80 rounded-2xl shadow-2xl shadow-black/80 overflow-hidden text-text-primary"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-border-default/70 bg-bg-primary/50">
          <Search className="w-5 h-5 text-primary shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a command, page name, or vehicle plate..."
            className="w-full bg-transparent text-sm text-text-primary placeholder:text-text-muted outline-none font-sans"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-text-muted hover:text-text-primary rounded-md transition-colors mr-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono bg-bg-surface border border-border-default text-text-muted">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div ref={listRef} className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filteredItems.length === 0 ? (
            <div className="py-8 text-center text-text-muted text-xs font-mono">
              No telemetry routes or vehicles matching "{query}"
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-primary/15 text-primary border border-primary/30'
                      : 'hover:bg-bg-hover text-text-secondary border border-transparent'
                  }`}
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                        isSelected
                          ? 'bg-primary text-primary-content shadow-sm shadow-primary/30'
                          : 'bg-bg-primary text-text-muted'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <div className="text-xs font-medium text-text-primary truncate">
                        {item.title}
                      </div>
                      {item.subtitle && (
                        <div className="text-[11px] text-text-muted truncate">
                          {item.subtitle}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 shrink-0 ml-3">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-text-muted bg-bg-primary/80 px-2 py-0.5 rounded border border-border-default/40">
                      {item.category}
                    </span>
                    {isSelected && <CornerDownLeft className="w-3.5 h-3.5 text-primary" />}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Shortcut Hints */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-bg-primary/70 border-t border-border-default/50 text-[11px] text-text-muted font-mono">
          <div className="flex items-center space-x-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
          </div>
          <div className="flex items-center space-x-1">
            <span>Cockpit Quick Jump</span>
          </div>
        </div>
      </div>
    </div>
  );
}

