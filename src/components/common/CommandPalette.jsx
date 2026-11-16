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
  Navigation,
  User,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { initialDrivers, initialVehicles } from '../../data/mockData';
import { initialTrips } from '../../data/tripMockData';
import { initialMaintenanceSchedules } from '../../data/maintenanceMockData';
import { initialFuelRecords } from '../../data/fuelMockData';

export default function CommandPalette({
  isOpen,
  onClose,
  vehicles = [],
  onSelectVehicle,
  onAddVehicle,
  onExportReport
}) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const itemRefs = useRef([]);

  // Auto-scroll selected item into view
  useEffect(() => {
    if (itemRefs.current[selectedIndex]) {
      itemRefs.current[selectedIndex].scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex]);

  // Global escape key listener
  useEffect(() => {
    if (!isOpen) return;
    const handleGlobalKey = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleGlobalKey);
    return () => window.removeEventListener('keydown', handleGlobalKey);
  }, [isOpen, onClose]);

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
      subtitle: 'Open vehicle registration dialog',
      category: 'Actions',
      icon: PlusCircle,
      action: () => {
        onClose();
        if (onAddVehicle) onAddVehicle();
      }
    },
    {
      id: 'a-export',
      title: 'Export Fleet Telemetry CSV',
      subtitle: 'Download complete fleet snapshot',
      category: 'Actions',
      icon: Download,
      action: () => {
        onClose();
        if (onExportReport) onExportReport();
      }
    }
  ];

  // Vehicles
  const activeVehicles = vehicles && vehicles.length > 0 ? vehicles : initialVehicles;
  const vehicleItems = activeVehicles.map((v) => ({
    id: `v-${v.id}`,
    title: `${v.plate} — ${v.model || v.type}`,
    subtitle: `Driver: ${v.driver || 'Unassigned'} • Status: ${v.status} • Fuel: ${v.fuel}%`,
    category: 'Vehicles',
    icon: Truck,
    action: () => {
      onClose();
      if (onSelectVehicle) {
        onSelectVehicle(v);
      } else {
        navigate('/vehicles');
      }
    }
  }));

  // Drivers
  const driverItems = initialDrivers.map((d) => ({
    id: `d-${d.id}`,
    title: `${d.name} (${d.status || 'Active'})`,
    subtitle: `Vehicle: ${d.vehicle || 'RST-291'} • Safety Score: ${d.rating || 98}% • Phone: ${d.phone || '+1-555-0192'}`,
    category: 'Drivers',
    icon: User,
    action: () => {
      onClose();
      navigate('/drivers');
    }
  }));

  // Trips
  const tripItems = (initialTrips || []).slice(0, 5).map((t) => ({
    id: `t-${t.id}`,
    title: `${t.id}: ${t.origin || 'Depot'} → ${t.destination || 'Downtown Hub'}`,
    subtitle: `Vehicle: ${t.vehicle || 'RST-291'} • Driver: ${t.driver || 'Suryansh Tyagi'} • Status: ${t.status || 'In Transit'}`,
    category: 'Trips',
    icon: Route,
    action: () => {
      onClose();
      navigate('/trips');
    }
  }));

  // Maintenance
  const maintenanceItems = (initialMaintenanceSchedules || []).slice(0, 5).map((m) => ({
    id: `m-${m.id}`,
    title: `${m.service || 'Service Inspection'} (${m.vehicle || 'RST-291'})`,
    subtitle: `Due: ${m.dueDate || '2026-11-20'} • Priority: ${m.priority || 'Medium'} • Status: ${m.status || 'Scheduled'}`,
    category: 'Maintenance',
    icon: Wrench,
    action: () => {
      onClose();
      navigate('/maintenance');
    }
  }));

  // Fuel Records
  const fuelItems = (initialFuelRecords || []).slice(0, 5).map((f) => ({
    id: `f-${f.id}`,
    title: `Fuel Record: ${f.vehicle || 'RST-291'} (${f.litres || 45}L ${f.fuelType || 'Diesel'})`,
    subtitle: `Station: ${f.station || 'Shell Metro'} • Cost: $${f.totalCost || 140} • Date: ${f.date || 'Today'}`,
    category: 'Fuel',
    icon: Fuel,
    action: () => {
      onClose();
      navigate('/fuel');
    }
  }));

  const allItems = [
    ...quickActions,
    ...defaultRoutes,
    ...vehicleItems,
    ...driverItems,
    ...tripItems,
    ...maintenanceItems,
    ...fuelItems
  ];

  const filteredItems = query.trim() === ''
    ? allItems.slice(0, 8)
    : allItems.filter((item) => {
        const text = `${item.title} ${item.subtitle || ''} ${item.category}`.toLowerCase();
        return text.includes(query.toLowerCase());
      }).slice(0, 15);

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
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-[#0F172A]/40 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl glass-card border border-white/95 rounded-2xl shadow-2xl overflow-hidden text-[#172033]"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Spotlight Search Header */}
        <div className="flex items-center px-4 py-3.5 border-b border-[#E2E8F0] bg-white/90 backdrop-blur-sm">
          <Search className="w-5 h-5 text-[#2879E8] shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search vehicles, drivers, trips, maintenance, fuel, or commands..."
            className="w-full bg-transparent text-sm text-[#172033] placeholder:text-[#94A3B8] outline-none font-sans font-medium"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-[#94A3B8] hover:text-[#172033] rounded-lg transition-colors mr-2"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-mono bg-[#F0F5FC] border border-[#D5E2F1] text-[#68758A] shadow-2xs font-semibold">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div ref={listRef} className="max-h-[380px] overflow-y-auto p-2 space-y-1">
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center text-[#68758A] text-xs font-mono">
              <AlertCircle className="w-6 h-6 mx-auto mb-2 text-[#94A3B8]" />
              No authorised fleet records matching "{query}"
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id}
                  ref={(el) => (itemRefs.current[idx] = el)}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl cursor-pointer transition-all duration-150 ${
                    isSelected
                      ? 'bg-[#EAF3FF] text-[#2879E8] border border-[#2879E8]/30 shadow-xs'
                      : 'hover:bg-[#F8FAFD] text-[#68758A] border border-transparent'
                  }`}
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                        isSelected
                          ? 'bg-[#2879E8] text-white shadow-sm shadow-[#2879E8]/30'
                          : 'bg-[#F0F5FC] text-[#68758A]'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <div className="text-xs font-bold text-[#172033] truncate">
                        {item.title}
                      </div>
                      {item.subtitle && (
                        <div className="text-[11px] text-[#68758A] truncate mt-0.5 font-sans">
                          {item.subtitle}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 shrink-0 ml-3">
                    <span
                      className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-md border font-medium ${
                        isSelected
                          ? 'bg-white text-[#2879E8] border-[#2879E8]/30'
                          : 'bg-white text-[#68758A] border-[#E2E8F0]'
                      }`}
                    >
                      {item.category}
                    </span>
                    {isSelected && <CornerDownLeft className="w-3.5 h-3.5 text-[#2879E8]" />}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Shortcuts */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-white/95 border-t border-[#E2E8F0] text-[11px] text-[#68758A] font-mono">
          <div className="flex items-center space-x-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-[#F0F5FC] border border-[#D5E2F1] rounded text-[10px]">↑↓</kbd>
              Navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-[#F0F5FC] border border-[#D5E2F1] rounded text-[10px]">↵</kbd>
              Select
            </span>
          </div>
          <div className="flex items-center space-x-1 font-semibold text-[#2879E8]">
            <span>AUTRAIL Global Search</span>
          </div>
        </div>
      </div>
    </div>
  );
}
