import React, { useState } from 'react';
import Modal from '../common/Modal';
import StatusBadge from '../common/StatusBadge';
import Button from '../common/Button';
import {
  Truck,
  User,
  MapPin,
  Fuel,
  Gauge,
  Calendar,
  Wrench,
  ShieldCheck,
  ShieldAlert,
  Navigation,
  DollarSign,
  Activity,
  Edit2,
  Trash2,
  CheckCircle,
  AlertTriangle,
  FileText,
  Clock,
  Compass
} from 'lucide-react';
import { initialFuelRecords } from '../../data/fuelMockData';
import { initialMaintenanceSchedules, initialMaintenanceRecords } from '../../data/maintenanceMockData';
import { initialGeofenceAlerts, initialGeofenceZones } from '../../data/geofenceMockData';
import { initialLiveTelemetry } from '../../data/trackingMockData';

export default function VehicleDetailsModal({
  isOpen,
  onClose,
  vehicle,
  onEdit,
  onDelete
}) {
  if (!vehicle) return null;

  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'gps', 'fuel', 'maintenance', 'geofence'

  const plate = vehicle.plate || vehicle.id;

  // Filter cross-module data for this vehicle
  const vehicleFuelRecords = initialFuelRecords.filter((f) => f.vehicleId === plate);
  const totalFuelCost = vehicleFuelRecords.reduce((sum, f) => sum + Number(f.totalAmount || 0), 0);
  const totalFuelLiters = vehicleFuelRecords.reduce((sum, f) => sum + Number(f.quantity || 0), 0);

  const vehicleMaintenanceSchedules = initialMaintenanceSchedules.filter((s) => s.vehicleId === plate);
  const vehicleMaintenanceHistory = initialMaintenanceRecords.filter((m) => m.vehicleId === plate);
  const totalMaintenanceCost = vehicleMaintenanceHistory.reduce((sum, m) => sum + Number(m.serviceCost || 0), 0);

  const vehicleGeofenceAlerts = initialGeofenceAlerts.filter(
    (g) => g.vehicleId === plate || g.plate === plate
  );

  const liveGps = initialLiveTelemetry.find((t) => t.vehicleId === plate) || {
    latitude: vehicle.coordinates?.lat || 40.7580,
    longitude: vehicle.coordinates?.lng || -73.9855,
    speed: 48,
    heading: 42,
    headingText: 'NE 42°',
    status: vehicle.status || 'moving',
    lastUpdated: 'Just now',
    locationName: vehicle.location || 'New York Metropolitan Corridor',
    todayDistance: 134.5
  };

  const totalOperatingCost = totalFuelCost + totalMaintenanceCost;
  const costPerKm = vehicle.odometer > 0 ? (totalOperatingCost / vehicle.odometer).toFixed(2) : '0.45';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${plate} — Unified Vehicle Profile`}
      subtitle={`${vehicle.make || 'Fleet'} ${vehicle.model} · Class ${vehicle.type || 'Commercial'} · Vin #AUT-${plate}`}
      maxWidth="max-w-3xl"
    >
      <div className="space-y-4 text-xs font-sans">
        {/* Top Summary Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-[#121319] border border-[#252730] rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#b49aff]/10 border border-[#b49aff]/20 text-[#b49aff] flex items-center justify-center font-bold text-lg font-mono">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-[#f4f3f8] font-mono">{plate}</h4>
                <StatusBadge status={vehicle.status} type="pill" />
              </div>
              <p className="text-[11px] text-[#8b8d98] mt-0.5">
                {vehicle.make} {vehicle.model} ({vehicle.year || 2023}) · Operator: <span className="text-[#f4f3f8] font-semibold">{vehicle.driver}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-right font-mono">
            <div>
              <span className="text-[10px] text-[#71737e] block">TOTAL EXPENSE</span>
              <span className="text-sm font-bold text-[#8be0b3]">${totalOperatingCost.toLocaleString()}</span>
            </div>
            <div className="h-7 w-px bg-[#252730]" />
            <div>
              <span className="text-[10px] text-[#71737e] block">COST / KM</span>
              <span className="text-sm font-bold text-[#b49aff]">${costPerKm}</span>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 border-b border-[#252730] pb-2 overflow-x-auto text-[11px] font-mono">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'overview'
                ? 'bg-[#b49aff]/15 text-[#b49aff] border border-[#b49aff]/30 font-bold'
                : 'text-[#8b8d98] hover:text-white hover:bg-[#1a1c24]'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>OVERVIEW</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('gps')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'gps'
                ? 'bg-[#b49aff]/15 text-[#b49aff] border border-[#b49aff]/30 font-bold'
                : 'text-[#8b8d98] hover:text-white hover:bg-[#1a1c24]'
            }`}
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>LIVE GPS</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('fuel')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'fuel'
                ? 'bg-[#e5a46e]/15 text-[#e5a46e] border border-[#e5a46e]/30 font-bold'
                : 'text-[#8b8d98] hover:text-white hover:bg-[#1a1c24]'
            }`}
          >
            <Fuel className="w-3.5 h-3.5" />
            <span>FUEL LEDGER ({vehicleFuelRecords.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('maintenance')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'maintenance'
                ? 'bg-[#38bdf8]/15 text-[#38bdf8] border border-[#38bdf8]/30 font-bold'
                : 'text-[#8b8d98] hover:text-white hover:bg-[#1a1c24]'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>SERVICE & REPAIR ({vehicleMaintenanceHistory.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('geofence')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'geofence'
                ? 'bg-[#ef4444]/15 text-[#ef4444] border border-[#ef4444]/30 font-bold'
                : 'text-[#8b8d98] hover:text-white hover:bg-[#1a1c24]'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>GEOFENCE BREACHES ({vehicleGeofenceAlerts.length})</span>
          </button>
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="bg-[#121319] border border-[#252730] p-3 rounded-lg">
                <span className="font-mono text-[9px] text-[#71737e] uppercase flex items-center gap-1">
                  <User className="w-3 h-3 text-[#b49aff]" /> DRIVER
                </span>
                <b className="text-xs text-[#f4f3f8] block mt-1">{vehicle.driver}</b>
                <span className="text-[10px] text-[#8b8d98] font-mono">{vehicle.driverPhone || '+1 (555) 234-5678'}</span>
              </div>

              <div className="bg-[#121319] border border-[#252730] p-3 rounded-lg">
                <span className="font-mono text-[9px] text-[#71737e] uppercase flex items-center gap-1">
                  <Gauge className="w-3 h-3 text-[#8be0b3]" /> ODOMETER
                </span>
                <b className="text-xs font-mono text-[#f4f3f8] block mt-1">
                  {(vehicle.odometer || 12840).toLocaleString()} km
                </b>
                <span className="text-[10px] text-[#8be0b3] font-mono">Health: {vehicle.health || 'Optimal'}</span>
              </div>

              <div className="bg-[#121319] border border-[#252730] p-3 rounded-lg">
                <span className="font-mono text-[9px] text-[#71737e] uppercase flex items-center gap-1">
                  <Fuel className="w-3 h-3 text-[#e5a46e]" /> FUEL LEVEL
                </span>
                <div className="flex items-center justify-between mt-1">
                  <b className="text-xs font-mono text-[#f4f3f8]">{vehicle.fuel}%</b>
                  <span className="text-[10px] font-mono text-[#71737e]">~{Math.round(vehicle.fuel * 7.5)} km</span>
                </div>
                <div className="w-full h-1.5 bg-[#252730] rounded-full overflow-hidden mt-1.5">
                  <div
                    style={{ width: `${vehicle.fuel}%` }}
                    className={`h-full rounded-full ${
                      vehicle.fuel > 50 ? 'bg-[#8be0b3]' : vehicle.fuel > 20 ? 'bg-[#e5a46e]' : 'bg-[#ef4444]'
                    }`}
                  />
                </div>
              </div>

              <div className="bg-[#121319] border border-[#252730] p-3 rounded-lg">
                <span className="font-mono text-[9px] text-[#71737e] uppercase flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#38bdf8]" /> REGION
                </span>
                <b className="text-xs text-[#f4f3f8] block mt-1 truncate">{vehicle.location}</b>
                <span className="text-[10px] text-[#71737e] font-mono">Route: {liveGps.assignedRoute || 'Downtown Delivery'}</span>
              </div>
            </div>

            {/* Preventative Maintenance Banner */}
            <div className="bg-[#17191f] border border-[#252730] p-3.5 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-[#71737e] uppercase">
                  SCHEDULED PREVENTATIVE SERVICE TARGET
                </span>
                <div className="text-xs font-bold text-[#f4f3f8] mt-0.5">
                  {vehicle.nextService || 'Routine inspection due in 1,240 km'}
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-[#b49aff]/10 text-[#b49aff] border border-[#b49aff]/20 font-mono text-[10px] font-bold">
                MONITORED BY SENSOR
              </span>
            </div>
          </div>
        )}

        {/* Tab 2: Live GPS & Telemetry */}
        {activeTab === 'gps' && (
          <div className="space-y-3">
            <div className="bg-[#101116] border border-[#252730] p-4 rounded-xl space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#20222a]">
                <div className="flex items-center gap-2">
                  <Compass className="w-4 h-4 text-[#b49aff]" />
                  <span className="font-mono text-xs font-bold text-[#f4f3f8]">
                    SATELLITE POSITIONING FIX
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded bg-[#8be0b3]/10 text-[#8be0b3] font-mono text-[10px] font-bold">
                  TRANSPONDER ACTIVE
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
                <div>
                  <span className="text-[10px] text-[#71737e] block">LATITUDE</span>
                  <span className="text-xs font-bold text-[#f4f3f8]">{Number(liveGps.latitude).toFixed(6)}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#71737e] block">LONGITUDE</span>
                  <span className="text-xs font-bold text-[#f4f3f8]">{Number(liveGps.longitude).toFixed(6)}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#71737e] block">LIVE SPEED</span>
                  <span className="text-xs font-bold text-[#8be0b3]">{liveGps.speed} km/h</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#71737e] block">HEADING / BEARING</span>
                  <span className="text-xs font-bold text-[#b49aff]">{liveGps.headingText || `${liveGps.heading}°`}</span>
                </div>
              </div>

              <div className="p-3 bg-[#17191f] rounded-lg border border-[#252730] flex items-center justify-between text-[11px] font-mono">
                <span className="text-[#8b8d98]">Physical location address:</span>
                <span className="text-[#f4f3f8] font-bold">{liveGps.locationName}</span>
              </div>
            </div>

            {/* Demo Mode Notice */}
            <div className="p-3 bg-[#b49aff]/5 border border-[#b49aff]/20 rounded-lg text-xs font-mono text-[#c0aaff] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#b49aff] animate-ping" />
              <span>Simulated GPS breadcrumb active. Real hardware stream replaces simulation automatically upon incoming telemetry packet.</span>
            </div>
          </div>
        )}

        {/* Tab 3: Fuel Ledger */}
        {activeTab === 'fuel' && (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-3 font-mono text-center">
              <div className="bg-[#121319] border border-[#252730] p-2.5 rounded-lg">
                <span className="text-[10px] text-[#71737e] block">TOTAL FUEL SPENT</span>
                <span className="text-sm font-bold text-[#f4f3f8]">${totalFuelCost.toFixed(2)}</span>
              </div>
              <div className="bg-[#121319] border border-[#252730] p-2.5 rounded-lg">
                <span className="text-[10px] text-[#71737e] block">VOLUME CONSUMED</span>
                <span className="text-sm font-bold text-[#e5a46e]">{totalFuelLiters.toFixed(1)} L</span>
              </div>
              <div className="bg-[#121319] border border-[#252730] p-2.5 rounded-lg">
                <span className="text-[10px] text-[#71737e] block">EFFICIENCY</span>
                <span className="text-sm font-bold text-[#8be0b3]">
                  {vehicleFuelRecords.length > 0 ? vehicleFuelRecords[0].fuelEfficiency : '11.8'} L/100km
                </span>
              </div>
            </div>

            <div className="bg-[#121319] border border-[#252730] rounded-xl overflow-hidden max-h-48 overflow-y-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#252730] bg-[#17191f] text-[#71737e] font-mono text-[10px]">
                    <th className="p-2.5">DATE</th>
                    <th className="p-2.5">VENDOR / STATION</th>
                    <th className="p-2.5 text-right">VOLUME</th>
                    <th className="p-2.5 text-right">TOTAL</th>
                    <th className="p-2.5 text-center">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#20222a] font-mono text-[11px]">
                  {vehicleFuelRecords.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="p-4 text-center text-[#71737e]">
                        No fuel transactions registered for this vehicle.
                      </td>
                    </tr>
                  ) : (
                    vehicleFuelRecords.map((rec) => (
                      <tr key={rec.id} className="hover:bg-[#1a1c24]">
                        <td className="p-2.5 text-[#8b8d98]">{rec.purchaseDate?.split('T')[0] || rec.purchaseDate}</td>
                        <td className="p-2.5 text-[#f4f3f8] font-bold">{rec.fuelStation}</td>
                        <td className="p-2.5 text-right text-[#e5a46e]">{rec.quantity} L</td>
                        <td className="p-2.5 text-right text-[#8be0b3] font-bold">${rec.totalAmount}</td>
                        <td className="p-2.5 text-center">
                          {rec.isAnomaly ? (
                            <span className="px-1.5 py-0.5 rounded bg-[#ef4444]/15 text-[#ef4444] text-[9px] font-bold">
                              FLAGGED
                            </span>
                          ) : (
                            <span className="px-1.5 py-0.5 rounded bg-[#8be0b3]/15 text-[#8be0b3] text-[9px]">
                              VERIFIED
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 4: Maintenance History */}
        {activeTab === 'maintenance' && (
          <div className="space-y-3">
            <div className="bg-[#121319] border border-[#252730] rounded-xl overflow-hidden max-h-56 overflow-y-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#252730] bg-[#17191f] text-[#71737e] font-mono text-[10px]">
                    <th className="p-2.5">DATE</th>
                    <th className="p-2.5">CATEGORY</th>
                    <th className="p-2.5">SERVICE FACILITY</th>
                    <th className="p-2.5 text-right">COST</th>
                    <th className="p-2.5 text-center">INVOICE</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#20222a] font-mono text-[11px]">
                  {vehicleMaintenanceHistory.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="p-4 text-center text-[#71737e]">
                        No completed maintenance records for this vehicle.
                      </td>
                    </tr>
                  ) : (
                    vehicleMaintenanceHistory.map((rec) => (
                      <tr key={rec.id} className="hover:bg-[#1a1c24]">
                        <td className="p-2.5 text-[#8b8d98]">{rec.serviceDate || rec.completedDate}</td>
                        <td className="p-2.5 text-[#f4f3f8] font-bold capitalize">{rec.serviceType || rec.category}</td>
                        <td className="p-2.5 text-[#8b8d98]">{rec.serviceProvider || rec.serviceCenter}</td>
                        <td className="p-2.5 text-right text-[#8be0b3] font-bold">${rec.serviceCost}</td>
                        <td className="p-2.5 text-center">
                          <span className="text-[10px] text-[#b49aff] underline cursor-pointer">
                            {rec.invoiceUrl || rec.invoiceNumber || 'INV-PDF'}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 5: Geofencing & Security Events */}
        {activeTab === 'geofence' && (
          <div className="space-y-3">
            {vehicleGeofenceAlerts.length === 0 ? (
              <div className="p-6 bg-[#121319] border border-[#252730] rounded-xl text-center text-[#71737e] font-mono">
                No perimeter violations or restricted boundary breaches logged for {plate}.
              </div>
            ) : (
              <div className="space-y-2 max-h-56 overflow-y-auto">
                {vehicleGeofenceAlerts.map((alt) => (
                  <div
                    key={alt.id}
                    className="p-3 bg-[#121319] border border-[#252730] rounded-xl flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-1.5 py-0.5 rounded font-mono text-[9px] font-bold uppercase ${
                            alt.severity === 'critical'
                              ? 'bg-[#ef4444]/20 text-[#ef4444]'
                              : 'bg-[#f59e0b]/20 text-[#f59e0b]'
                          }`}
                        >
                          {alt.severity}
                        </span>
                        <span className="font-bold text-xs text-[#f4f3f8]">{alt.geofenceName}</span>
                      </div>
                      <p className="text-[11px] text-[#8b8d98] mt-1">{alt.message}</p>
                    </div>

                    <div className="text-right font-mono text-[10px] text-[#71737e]">
                      <div>{alt.timestamp}</div>
                      <span className="text-[#8be0b3] font-bold uppercase">{alt.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-[#252730]">
          <Button
            variant="danger"
            size="sm"
            onClick={() => {
              onClose();
              if (onDelete) onDelete(vehicle);
            }}
            icon={Trash2}
          >
            Decommission
          </Button>

          <div className="flex items-center gap-2">
            <Button
              variant="default"
              size="sm"
              onClick={() => {
                onClose();
                if (onEdit) onEdit(vehicle);
              }}
              icon={Edit2}
            >
              Edit parameters
            </Button>
            <Button variant="primary" size="sm" onClick={onClose}>
              Done
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
