import React, { useState } from 'react';
import {
  Shield,
  ShieldAlert,
  Plus,
  Radio,
  MapPin,
  List,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  Layers
} from 'lucide-react';
import GeofenceKPIGrid from '../components/geofencing/GeofenceKPIGrid';
import GeofenceMap from '../components/geofencing/GeofenceMap';
import GeofenceListTable from '../components/geofencing/GeofenceListTable';
import GeofenceAlertsTable from '../components/geofencing/GeofenceAlertsTable';
import CreateGeofenceModal from '../components/geofencing/CreateGeofenceModal';
import useRealtimeTracking from '../hooks/useRealtimeTracking';
import Button from '../components/common/Button';
import {
  getGeofenceZones,
  getGeofenceAlerts,
  createGeofenceZone,
  updateGeofenceZone,
  deleteGeofenceZone,
  toggleGeofenceStatus,
  acknowledgeGeofenceAlert,
  resolveGeofenceAlert
} from '../services/geofenceService';

export default function Geofencing({ onShowToast }) {
  const [activeTab, setActiveTab] = useState('radar'); // 'radar', 'zones', 'alerts'
  const [geofences, setGeofences] = useState(() => getGeofenceZones());
  const [alerts, setAlerts] = useState(() => getGeofenceAlerts());

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGeofence, setEditingGeofence] = useState(null);

  // Map Focus State
  const [selectedGeofenceId, setSelectedGeofenceId] = useState(null);
  const [focusCoordinate, setFocusCoordinate] = useState(null);

  // Live vehicles transponder feed
  const { telemetryList, liveSimulationActive, isDemoMode } = useRealtimeTracking();

  const handleCreateOrUpdate = (zoneData) => {
    if (editingGeofence) {
      const updated = updateGeofenceZone(editingGeofence.id, zoneData);
      setGeofences(getGeofenceZones());
      if (onShowToast) onShowToast(`Geofence ${updated.name} updated successfully.`, 'success');
    } else {
      const created = createGeofenceZone(zoneData);
      setGeofences(getGeofenceZones());
      if (onShowToast) onShowToast(`Geofence ${created.name} registered to radar system.`, 'success');
    }
    setEditingGeofence(null);
  };

  const handleDelete = (id) => {
    const target = geofences.find((g) => g.id === id);
    if (target) {
      deleteGeofenceZone(id);
      setGeofences(getGeofenceZones());
      if (onShowToast) onShowToast(`Geofence perimeter ${target.name} decommissioned.`, 'warning');
    }
  };

  const handleToggleStatus = (id) => {
    const toggled = toggleGeofenceStatus(id);
    setGeofences(getGeofenceZones());
    if (onShowToast) {
      onShowToast(
        `Zone ${toggled.name} is now ${toggled.isActive ? 'ACTIVE' : 'PAUSED'}.`,
        'info'
      );
    }
  };

  const handleAcknowledgeAlert = (alertId) => {
    acknowledgeGeofenceAlert(alertId);
    setAlerts(getGeofenceAlerts());
    if (onShowToast) onShowToast('Breach alert acknowledged by flight controller.', 'info');
  };

  const handleResolveAlert = (alertId) => {
    resolveGeofenceAlert(alertId);
    setAlerts(getGeofenceAlerts());
    if (onShowToast) onShowToast('Breach record marked as resolved.', 'success');
  };

  const handleFocusGeofence = (zone) => {
    setSelectedGeofenceId(zone.id);
    if (zone.geometryType === 'circle' && zone.center) {
      setFocusCoordinate({ lat: zone.center.lat, lng: zone.center.lng });
    } else if (zone.geometryType === 'polygon' && zone.coordinates?.length > 0) {
      setFocusCoordinate({ lat: zone.coordinates[0].lat, lng: zone.coordinates[0].lng });
    }
    setActiveTab('radar');
  };

  const handleFocusAlert = (alert) => {
    if (alert.latitude && alert.longitude) {
      setFocusCoordinate({ lat: alert.latitude, lng: alert.longitude });
    }
    setSelectedGeofenceId(alert.geofenceId);
    setActiveTab('radar');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#16A36A] animate-pulse shadow-[0_0_8px_#16A36A]" />
            <span className="text-[10px] font-mono tracking-widest text-[#16A36A] uppercase font-bold">
              PERIMETER SURVEILLANCE & RESTRICTED-ZONE MATRIX
            </span>
          </div>
          <h1 className="text-[28px] font-black text-[#0B132B] tracking-tight m-0">
            Geofencing & Security Zones<span className="text-[#2879E8]">.</span>
          </h1>
          <p className="text-[13px] text-[#334155] mt-1 font-semibold">
            Real-time Jordan Curve Ray-Casting & Haversine distance breach detection across logistics corridors.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="primary"
            onClick={() => {
              setEditingGeofence(null);
              setIsModalOpen(true);
            }}
            icon={Plus}
          >
            Create Geofence
          </Button>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <GeofenceKPIGrid
        geofences={geofences}
        alerts={alerts}
        onOpenCreateModal={() => {
          setEditingGeofence(null);
          setIsModalOpen(true);
        }}
      />

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E2E8F0] pb-1 text-xs font-mono">
        <button
          type="button"
          onClick={() => setActiveTab('radar')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl transition-all cursor-pointer ${
            activeTab === 'radar'
              ? 'bg-white text-[#2879E8] border-t-2 border-t-[#2879E8] border-x border-[#E2E8F0] font-bold shadow-2xs'
              : 'text-[#68758A] hover:text-[#172033] hover:bg-[#F0F5FC]'
          }`}
        >
          <Radio className="w-3.5 h-3.5 text-[#2879E8]" />
          <span>RADAR & LIVE MAP</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('zones')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl transition-all cursor-pointer ${
            activeTab === 'zones'
              ? 'bg-white text-[#2879E8] border-t-2 border-t-[#2879E8] border-x border-[#E2E8F0] font-bold shadow-2xs'
              : 'text-[#68758A] hover:text-[#172033] hover:bg-[#F0F5FC]'
          }`}
        >
          <List className="w-3.5 h-3.5 text-[#16A36A]" />
          <span>ZONE PERIMETERS ({geofences.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('alerts')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl transition-all cursor-pointer ${
            activeTab === 'alerts'
              ? 'bg-white text-[#E05252] border-t-2 border-t-[#E05252] border-x border-[#E2E8F0] font-bold shadow-2xs'
              : 'text-[#68758A] hover:text-[#172033] hover:bg-[#F0F5FC]'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5 text-[#E05252]" />
          <span>
            BREACH INCIDENTS ({alerts.filter((a) => a.status === 'new').length} NEW)
          </span>
        </button>
      </div>

      {/* Tab 1: Radar & Live Map View */}
      {activeTab === 'radar' && (
        <div className="space-y-6 animate-in fade-in">
          <GeofenceMap
            geofences={geofences}
            vehicles={telemetryList}
            selectedGeofenceId={selectedGeofenceId}
            onSelectGeofence={(zone) => setSelectedGeofenceId(zone.id)}
            focusCoordinate={focusCoordinate}
            height="560px"
          />

          {/* Quick Real-Time Incident Ticker */}
          <div className="glass-card rounded-2xl p-5 shadow-liquid-subtle">
            <div className="flex items-center justify-between mb-3.5 border-b border-[#E2E8F0]/80 pb-3">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-[#E05252]" />
                <span className="text-xs font-mono font-bold text-[#172033]">
                  RECENT PERIMETER BREACHES & TRANSITIONS
                </span>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('alerts')}
                className="text-xs font-mono text-[#2879E8] hover:underline flex items-center gap-1 font-semibold cursor-pointer"
              >
                <span>View Full Alert Ledger</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {alerts.slice(0, 4).map((alt) => (
                <div
                  key={alt.id}
                  onClick={() => handleFocusAlert(alt)}
                  className="bg-[#F8FAFD] border border-[#E2E8F0] hover:border-[#2879E8]/40 p-3.5 rounded-xl cursor-pointer transition-all shadow-2xs hover:shadow-sm"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-xs font-bold text-[#172033]">
                      {alt.plate || alt.vehicleId}
                    </span>
                    <span
                      className={`text-[9px] font-mono px-2 py-0.5 rounded-full uppercase font-bold border ${
                        alt.severity === 'critical'
                          ? 'bg-[#FDF2F2] text-[#E05252] border-[#F8D7DA]'
                          : 'bg-[#FEF7EA] text-[#E7A329] border-[#F8DCB0]'
                      }`}
                    >
                      {alt.severity}
                    </span>
                  </div>
                  <div className="text-[11px] font-bold text-[#68758A] truncate">
                    {alt.geofenceName}
                  </div>
                  <p className="text-[11px] text-[#8A97AB] mt-1 line-clamp-1 font-medium">
                    {alt.message}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Zone Perimeters Table */}
      {activeTab === 'zones' && (
        <div className="animate-in fade-in">
          <GeofenceListTable
            geofences={geofences}
            onEditGeofence={(zone) => {
              setEditingGeofence(zone);
              setIsModalOpen(true);
            }}
            onDeleteGeofence={handleDelete}
            onToggleStatus={handleToggleStatus}
            onFocusGeofence={handleFocusGeofence}
          />
        </div>
      )}

      {/* Tab 3: Breach Alerts Ledger */}
      {activeTab === 'alerts' && (
        <div className="animate-in fade-in">
          <GeofenceAlertsTable
            alerts={alerts}
            onAcknowledgeAlert={handleAcknowledgeAlert}
            onResolveAlert={handleResolveAlert}
            onFocusAlert={handleFocusAlert}
          />
        </div>
      )}

      {/* Create / Edit Geofence Modal */}
      <CreateGeofenceModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingGeofence(null);
        }}
        onSaveGeofence={handleCreateOrUpdate}
        initialData={editingGeofence}
      />
    </div>
  );
}
