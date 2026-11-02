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
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#252730]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#8be0b3] animate-pulse" />
            <span className="text-[11px] font-mono tracking-widest text-[#8be0b3] uppercase font-bold">
              PERIMETER SURVEILLANCE & RESTRICTED-ZONE MATRIX
            </span>
          </div>
          <h1 className="text-2xl font-black text-[#f4f3f8] tracking-tight">
            Geofencing & Security Zones
          </h1>
          <p className="text-xs text-[#8b8d98] font-mono mt-0.5">
            Real-time Jordan Curve Ray-Casting & Haversine distance breach detection
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => {
              setEditingGeofence(null);
              setIsModalOpen(true);
            }}
            className="px-4 py-2 rounded-lg bg-[#b49aff] hover:bg-[#a384fa] text-[#17131f] text-xs font-bold font-mono transition-all shadow-[0_0_16px_rgba(180,154,255,0.35)] flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>CREATE GEOFENCE</span>
          </button>
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
      <div className="flex items-center gap-2 border-b border-[#252730] pb-2 text-xs font-mono">
        <button
          type="button"
          onClick={() => setActiveTab('radar')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
            activeTab === 'radar'
              ? 'bg-[#b49aff]/15 text-[#b49aff] border border-[#b49aff]/30 font-bold'
              : 'text-[#8b8d98] hover:text-[#f4f3f8] hover:bg-[#1a1c24]'
          }`}
        >
          <Radio className="w-3.5 h-3.5" />
          <span>RADAR & LIVE MAP</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('zones')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
            activeTab === 'zones'
              ? 'bg-[#b49aff]/15 text-[#b49aff] border border-[#b49aff]/30 font-bold'
              : 'text-[#8b8d98] hover:text-[#f4f3f8] hover:bg-[#1a1c24]'
          }`}
        >
          <List className="w-3.5 h-3.5" />
          <span>ZONE PERIMETERS ({geofences.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('alerts')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
            activeTab === 'alerts'
              ? 'bg-[#ef4444]/15 text-[#ef4444] border border-[#ef4444]/30 font-bold'
              : 'text-[#8b8d98] hover:text-[#f4f3f8] hover:bg-[#1a1c24]'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>
            BREACH INCIDENTS ({alerts.filter((a) => a.status === 'new').length} NEW)
          </span>
        </button>
      </div>

      {/* Tab 1: Radar & Live Map View */}
      {activeTab === 'radar' && (
        <div className="space-y-6">
          <GeofenceMap
            geofences={geofences}
            vehicles={telemetryList}
            selectedGeofenceId={selectedGeofenceId}
            onSelectGeofence={(zone) => setSelectedGeofenceId(zone.id)}
            focusCoordinate={focusCoordinate}
            height="560px"
          />

          {/* Quick Real-Time Incident Ticker */}
          <div className="bg-[#17191f] border border-[#252730] rounded-xl p-4">
            <div className="flex items-center justify-between mb-3 border-b border-[#252730] pb-2">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-[#ef4444]" />
                <span className="text-xs font-mono font-bold text-[#f4f3f8]">
                  RECENT PERIMETER BREACHES & TRANSITIONS
                </span>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('alerts')}
                className="text-xs font-mono text-[#b49aff] hover:underline flex items-center gap-1"
              >
                <span>View Full Alert Ledger</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {alerts.slice(0, 4).map((alt) => (
                <div
                  key={alt.id}
                  onClick={() => handleFocusAlert(alt)}
                  className="bg-[#121319] border border-[#252730] hover:border-[#b49aff]/50 p-3 rounded-lg cursor-pointer transition-all"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-xs font-bold text-[#f4f3f8]">
                      {alt.plate || alt.vehicleId}
                    </span>
                    <span
                      className={`text-[9px] font-mono px-1.5 py-0.5 rounded uppercase font-bold ${
                        alt.severity === 'critical'
                          ? 'bg-[#ef4444]/20 text-[#ef4444]'
                          : 'bg-[#f59e0b]/20 text-[#f59e0b]'
                      }`}
                    >
                      {alt.severity}
                    </span>
                  </div>
                  <div className="text-[11px] font-bold text-[#8b8d98] truncate">
                    {alt.geofenceName}
                  </div>
                  <p className="text-[10px] text-[#71737e] mt-1 line-clamp-1">
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
      )}

      {/* Tab 3: Breach Alerts Ledger */}
      {activeTab === 'alerts' && (
        <GeofenceAlertsTable
          alerts={alerts}
          onAcknowledgeAlert={handleAcknowledgeAlert}
          onResolveAlert={handleResolveAlert}
          onFocusAlert={handleFocusAlert}
        />
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

