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
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-gradient-to-br from-[#F8FAFD] to-[#F1F5F9] border border-[#E2E8F0] rounded-2xl shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#EAF3FF] border border-[#D5E6FB] text-[#2879E8] flex items-center justify-center font-bold text-lg font-mono shadow-2xs">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-[#172033] font-mono">{plate}</h4>
                <StatusBadge status={vehicle.status} type="pill" />
              </div>
              <p className="text-[11px] text-[#68758A] mt-0.5 font-medium">
                {vehicle.make} {vehicle.model} ({vehicle.year || 2023}) · Operator: <span className="text-[#172033] font-bold">{vehicle.driver}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-right font-mono">
            <div>
              <span className="text-[9px] text-[#8A97AB] uppercase font-semibold block">TOTAL EXPENSE</span>
              <span className="text-sm font-black text-[#16A36A]">${totalOperatingCost.toLocaleString()}</span>
            </div>
            <div className="h-7 w-px bg-[#E2E8F0]" />
            <div>
              <span className="text-[9px] text-[#8A97AB] uppercase font-semibold block">COST / KM</span>
              <span className="text-sm font-black text-[#2879E8]">${costPerKm}</span>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 border-b border-[#E2E8F0] pb-2 overflow-x-auto text-[11px] font-mono">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-[#EAF3FF] text-[#2879E8] border border-[#2879E8]/30 font-bold shadow-2xs'
                : 'text-[#68758A] hover:text-[#172033] hover:bg-[#F0F5FC]'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>OVERVIEW</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('gps')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              activeTab === 'gps'
                ? 'bg-[#EAF3FF] text-[#2879E8] border border-[#2879E8]/30 font-bold shadow-2xs'
                : 'text-[#68758A] hover:text-[#172033] hover:bg-[#F0F5FC]'
            }`}
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>LIVE GPS</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('fuel')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              activeTab === 'fuel'
                ? 'bg-[#EAF3FF] text-[#2879E8] border border-[#2879E8]/30 font-bold shadow-2xs'
                : 'text-[#68758A] hover:text-[#172033] hover:bg-[#F0F5FC]'
            }`}
          >
            <Fuel className="w-3.5 h-3.5" />
            <span>FUEL LEDGER ({vehicleFuelRecords.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('maintenance')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              activeTab === 'maintenance'
                ? 'bg-[#EAF3FF] text-[#2879E8] border border-[#2879E8]/30 font-bold shadow-2xs'
                : 'text-[#68758A] hover:text-[#172033] hover:bg-[#F0F5FC]'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>SERVICE & REPAIR ({vehicleMaintenanceHistory.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('geofence')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              activeTab === 'geofence'
                ? 'bg-[#FEF7EA] text-[#E7A329] border border-[#F8DCB0] font-bold shadow-2xs'
                : 'text-[#68758A] hover:text-[#172033] hover:bg-[#F0F5FC]'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>GEOFENCE BREACHES ({vehicleGeofenceAlerts.length})</span>
          </button>
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-[#F8FAFD] border border-[#E2E8F0] p-3 rounded-xl shadow-2xs">
                <span className="font-mono text-[9px] text-[#8A97AB] uppercase flex items-center gap-1 font-semibold">
                  <User className="w-3 h-3 text-[#2879E8]" /> DRIVER
                </span>
                <b className="text-xs text-[#172033] block mt-1">{vehicle.driver}</b>
                <span className="text-[10px] text-[#68758A] font-mono">{vehicle.driverPhone || '+1 (555) 234-5678'}</span>
              </div>

              <div className="bg-[#F8FAFD] border border-[#E2E8F0] p-3 rounded-xl shadow-2xs">
                <span className="font-mono text-[9px] text-[#8A97AB] uppercase flex items-center gap-1 font-semibold">
                  <Gauge className="w-3 h-3 text-[#16A36A]" /> ODOMETER
                </span>
                <b className="text-xs font-mono text-[#172033] block mt-1 font-bold">
                  {(vehicle.odometer || 12840).toLocaleString()} km
                </b>
                <span className="text-[10px] text-[#16A36A] font-mono font-medium">Health: {vehicle.health || 'Optimal'}</span>
              </div>

              <div className="bg-[#F8FAFD] border border-[#E2E8F0] p-3 rounded-xl shadow-2xs">
                <span className="font-mono text-[9px] text-[#8A97AB] uppercase flex items-center gap-1 font-semibold">
                  <Fuel className="w-3 h-3 text-[#E7A329]" /> FUEL LEVEL
                </span>
                <div className="flex items-center justify-between mt-1">
                  <b className="text-xs font-mono text-[#172033] font-bold">{vehicle.fuel}%</b>
                  <span className="text-[10px] font-mono text-[#68758A]">~{Math.round(vehicle.fuel * 7.5)} km</span>
                </div>
                <div className="w-full h-1.5 bg-[#E2E8F0] rounded-full overflow-hidden mt-1.5 shadow-inner">
                  <div
                    style={{ width: `${vehicle.fuel}%` }}
                    className={`h-full rounded-full ${
                      vehicle.fuel > 50 ? 'bg-[#16A36A]' : vehicle.fuel > 20 ? 'bg-[#E7A329]' : 'bg-[#E05252]'
                    }`}
                  />
                </div>
              </div>

              <div className="bg-[#F8FAFD] border border-[#E2E8F0] p-3 rounded-xl shadow-2xs">
                <span className="font-mono text-[9px] text-[#8A97AB] uppercase flex items-center gap-1 font-semibold">
                  <MapPin className="w-3 h-3 text-[#2879E8]" /> REGION
                </span>
                <b className="text-xs text-[#172033] block mt-1 truncate font-bold">{vehicle.location}</b>
                <span className="text-[10px] text-[#68758A] font-mono truncate block">Route: {liveGps.assignedRoute || 'Downtown Delivery'}</span>
              </div>
            </div>

            {/* Preventative Maintenance Banner */}
            <div className="bg-white border border-[#E2E8F0] p-4 rounded-xl flex items-center justify-between shadow-2xs">
              <div>
                <span className="text-[9px] font-mono text-[#8A97AB] uppercase font-semibold">
                  SCHEDULED PREVENTATIVE SERVICE TARGET
                </span>
                <div className="text-xs font-bold text-[#172033] mt-0.5">
                  {vehicle.nextService || 'Routine inspection due in 1,240 km'}
                </div>
              </div>
              <span className="px-3 py-1 rounded-xl bg-[#EAF3FF] text-[#2879E8] border border-[#D5E6FB] font-mono text-[10px] font-bold shadow-2xs">
                MONITORED BY SENSOR
              </span>
            </div>
          </div>
        )}

        {/* Tab 2: Live GPS & Telemetry */}
        {activeTab === 'gps' && (
          <div className="space-y-3">
            <div className="bg-white border border-[#E2E8F0] p-4 rounded-xl space-y-3 shadow-2xs">
              <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0]">
                <div className="flex items-center gap-2">
                  <Compass className="w-4 h-4 text-[#2879E8]" />
                  <span className="font-mono text-xs font-bold text-[#172033]">
                    SATELLITE POSITIONING FIX
                  </span>
                </div>
                <span className="px-2.5 py-1 rounded-xl bg-[#E8F7F0] text-[#16A36A] border border-[#C2E8D7] font-mono text-[10px] font-bold">
                  TRANSPONDER ACTIVE
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
                <div>
                  <span className="text-[9px] text-[#8A97AB] uppercase font-semibold block">LATITUDE</span>
                  <span className="text-xs font-bold text-[#172033]">{Number(liveGps.latitude).toFixed(6)}</span>
                </div>
                <div>
                  <span className="text-[9px] text-[#8A97AB] uppercase font-semibold block">LONGITUDE</span>
                  <span className="text-xs font-bold text-[#172033]">{Number(liveGps.longitude).toFixed(6)}</span>
                </div>
                <div>
                  <span className="text-[9px] text-[#8A97AB] uppercase font-semibold block">LIVE SPEED</span>
                  <span className="text-xs font-bold text-[#16A36A]">{liveGps.speed} km/h</span>
                </div>
                <div>
                  <span className="text-[9px] text-[#8A97AB] uppercase font-semibold block">HEADING / BEARING</span>
                  <span className="text-xs font-bold text-[#2879E8]">{liveGps.headingText || `${liveGps.heading}°`}</span>
                </div>
              </div>

              <div className="p-3 bg-[#F8FAFD] rounded-xl border border-[#E2E8F0] flex items-center justify-between text-[11px] font-mono">
                <span className="text-[#68758A]">Physical location address:</span>
                <span className="text-[#172033] font-bold">{liveGps.locationName}</span>
              </div>
            </div>

            {/* Demo Mode Notice */}
            <div className="p-3 bg-[#EAF3FF] border border-[#D5E6FB] rounded-xl text-xs font-mono text-[#2879E8] flex items-center gap-2 font-medium">
              <span className="w-2 h-2 rounded-full bg-[#2879E8] animate-ping" />
              <span>Simulated GPS breadcrumb active. Real hardware stream replaces simulation automatically upon incoming telemetry packet.</span>
            </div>
          </div>
        )}

        {/* Tab 3: Fuel Ledger */}
        {activeTab === 'fuel' && (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-3 font-mono text-center">
              <div className="bg-[#F8FAFD] border border-[#E2E8F0] p-3 rounded-xl shadow-2xs">
                <span className="text-[9px] text-[#8A97AB] uppercase font-semibold block">TOTAL FUEL SPENT</span>
                <span className="text-sm font-black text-[#172033]">${totalFuelCost.toFixed(2)}</span>
              </div>
              <div className="bg-[#F8FAFD] border border-[#E2E8F0] p-3 rounded-xl shadow-2xs">
                <span className="text-[9px] text-[#8A97AB] uppercase font-semibold block">VOLUME CONSUMED</span>
                <span className="text-sm font-black text-[#E7A329]">{totalFuelLiters.toFixed(1)} L</span>
              </div>
              <div className="bg-[#F8FAFD] border border-[#E2E8F0] p-3 rounded-xl shadow-2xs">
                <span className="text-[9px] text-[#8A97AB] uppercase font-semibold block">EFFICIENCY</span>
                <span className="text-sm font-black text-[#16A36A]">
                  {vehicleFuelRecords.length > 0 ? vehicleFuelRecords[0].fuelEfficiency : '11.8'} L/100km
                </span>
              </div>
            </div>

            <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden max-h-48 overflow-y-auto shadow-2xs">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#E2E8F0] bg-[#F8FAFD] text-[#8A97AB] font-mono text-[9px] font-semibold uppercase">
                    <th className="p-3">DATE</th>
                    <th className="p-3">VENDOR / STATION</th>
                    <th className="p-3 text-right">VOLUME</th>
                    <th className="p-3 text-right">TOTAL</th>
                    <th className="p-3 text-center">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F5F9] font-mono text-[11px]">
                  {vehicleFuelRecords.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="p-4 text-center text-[#68758A]">
                        No fuel transactions registered for this vehicle.
                      </td>
                    </tr>
                  ) : (
                    vehicleFuelRecords.map((rec) => (
                      <tr key={rec.id} className="hover:bg-[#F8FAFD]">
                        <td className="p-3 text-[#68758A]">{rec.purchaseDate?.split('T')[0] || rec.purchaseDate}</td>
                        <td className="p-3 text-[#172033] font-bold">{rec.fuelStation}</td>
                        <td className="p-3 text-right text-[#E7A329] font-bold">{rec.quantity} L</td>
                        <td className="p-3 text-right text-[#16A36A] font-bold">${rec.totalAmount}</td>
                        <td className="p-3 text-center">
                          {rec.isAnomaly ? (
                            <span className="px-2 py-0.5 rounded-full bg-[#FDF2F2] text-[#E05252] border border-[#F8D7DA] text-[9px] font-bold">
                              FLAGGED
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full bg-[#E8F7F0] text-[#16A36A] border border-[#C2E8D7] text-[9px] font-semibold">
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
            <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden max-h-56 overflow-y-auto shadow-2xs">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#E2E8F0] bg-[#F8FAFD] text-[#8A97AB] font-mono text-[9px] font-semibold uppercase">
                    <th className="p-3">DATE</th>
                    <th className="p-3">CATEGORY</th>
                    <th className="p-3">SERVICE FACILITY</th>
                    <th className="p-3 text-right">COST</th>
                    <th className="p-3 text-center">INVOICE</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F5F9] font-mono text-[11px]">
                  {vehicleMaintenanceHistory.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="p-4 text-center text-[#68758A]">
                        No completed maintenance records for this vehicle.
                      </td>
                    </tr>
                  ) : (
                    vehicleMaintenanceHistory.map((rec) => (
                      <tr key={rec.id} className="hover:bg-[#F8FAFD]">
                        <td className="p-3 text-[#68758A]">{rec.serviceDate || rec.completedDate}</td>
                        <td className="p-3 text-[#172033] font-bold capitalize">{rec.serviceType || rec.category}</td>
                        <td className="p-3 text-[#68758A]">{rec.serviceProvider || rec.serviceCenter}</td>
                        <td className="p-3 text-right text-[#16A36A] font-bold">${rec.serviceCost}</td>
                        <td className="p-3 text-center">
                          <span className="text-[10px] text-[#2879E8] font-bold underline cursor-pointer">
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
              <div className="p-6 bg-white border border-[#E2E8F0] rounded-xl text-center text-[#68758A] font-mono shadow-2xs">
                No perimeter violations or restricted boundary breaches logged for {plate}.
              </div>
            ) : (
              <div className="space-y-2 max-h-56 overflow-y-auto">
                {vehicleGeofenceAlerts.map((alt) => (
                  <div
                    key={alt.id}
                    className="p-3 bg-white border border-[#E2E8F0] rounded-xl flex items-center justify-between shadow-2xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded-full font-mono text-[9px] font-bold uppercase border ${
                            alt.severity === 'critical'
                              ? 'bg-[#FDF2F2] text-[#E05252] border-[#F8D7DA]'
                              : 'bg-[#FEF7EA] text-[#E7A329] border-[#F8DCB0]'
                          }`}
                        >
                          {alt.severity}
                        </span>
                        <span className="font-bold text-xs text-[#172033]">{alt.geofenceName}</span>
                      </div>
                      <p className="text-[11px] text-[#68758A] mt-1">{alt.message}</p>
                    </div>

                    <div className="text-right font-mono text-[10px] text-[#8A97AB]">
                      <div>{alt.timestamp}</div>
                      <span className="text-[#16A36A] font-bold uppercase">{alt.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-[#E2E8F0]">
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

          <div className="flex items-center gap-2.5">
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
