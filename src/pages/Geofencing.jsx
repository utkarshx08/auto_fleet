import React, { useState } from 'react';
import {
  ShieldAlert,
  Plus,
  Radio,
  List,
  AlertTriangle,
  ExternalLink
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
  const { telemetryList } = useRealtimeTracking();

  const handleCreateOrUpdate = (zoneData) => {
    if (editingGeofence) {
      const updated = updateGeofenceZone(editingGeofence.id, zoneData);
      setGeofences(getGeofenceZones());
      if (onShowToast) onShowToast(`Geofence ${updated.name} updated successfully.`, 'success');
    } else {
      const created = createGeofenceZone(zoneData);
      setGeofences(getGeofenceZones());
      if (onShowToast) onShowToast(`Geofence ${created.name} registered successfully.`, 'success');
    }
    setEditingGeofence(null);
  };

  const handleDelete = (id) => {
    const target = geofences.find((g) => g.id === id);
    if (target) {
      deleteGeofenceZone(id);
      setGeofences(getGeofenceZones());
      if (onShowToast) onShowToast(`Geofence zone ${target.name} removed.`, 'warning');
    }
  };

  const handleToggleStatus = (id) => {
    const toggled = toggleGeofenceStatus(id);
    setGeofences(getGeofenceZones());
    if (onShowToast) {
      onShowToast(
        `Zone ${toggled.name} is now ${toggled.isActive ? 'Active' : 'Paused'}.`,
        'info'
      );
    }
  };

  const handleAcknowledgeAlert = (alertId) => {
    acknowledgeGeofenceAlert(alertId);
    setAlerts(getGeofenceAlerts());
    if (onShowToast) onShowToast('Breach alert acknowledged.', 'info');
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
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-0.5">
            Zone Boundaries & Perimeter Monitoring
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight m-0">
            Geofencing & Security Zones
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Define boundary zones, track vehicle entry and exit events, and manage perimeter alerts.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="primary"
            size="md"
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
      <div className="flex items-center gap-2 border-b border-slate-200 pb-1 text-xs">
        <button
          type="button"
          onClick={() => setActiveTab('radar')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-all cursor-pointer ${
            activeTab === 'radar'
              ? 'bg-blue-50 text-[#2879E8] font-semibold border border-blue-200/60 shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 font-medium'
          }`}
        >
          <Radio className="w-3.5 h-3.5 text-[#2879E8]" />
          <span>Live Radar & Map</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('zones')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-all cursor-pointer ${
            activeTab === 'zones'
              ? 'bg-blue-50 text-[#2879E8] font-semibold border border-blue-200/60 shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 font-medium'
          }`}
        >
          <List className="w-3.5 h-3.5 text-emerald-600" />
          <span>Zone Perimeters ({geofences.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('alerts')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-all cursor-pointer ${
            activeTab === 'alerts'
              ? 'bg-rose-50 text-rose-700 font-semibold border border-rose-200/60 shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 font-medium'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
          <span>
            Perimeter Alerts ({alerts.filter((a) => a.status === 'new').length} new)
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
            height="540px"
          />

          {/* Quick Real-Time Incident Ticker */}
          <div className="glass-card rounded-xl p-4.5">
            <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                <span className="text-xs font-semibold text-slate-800">
                  Recent Perimeter Breaches & Transitions
                </span>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('alerts')}
                className="text-xs text-[#2879E8] hover:underline flex items-center gap-1 font-medium cursor-pointer"
              >
                <span>View alert ledger</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {alerts.slice(0, 4).map((alt) => (
                <div
                  key={alt.id}
                  onClick={() => handleFocusAlert(alt)}
                  className="bg-slate-50 border border-slate-200/80 hover:border-slate-300 hover:bg-white p-3 rounded-lg cursor-pointer transition-all shadow-2xs"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-xs font-bold text-slate-900">
                      {alt.plate || alt.vehicleId}
                    </span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                        alt.severity === 'critical'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200/60'
                          : 'bg-amber-50 text-amber-800 border border-amber-200/60'
                      }`}
                    >
                      {alt.severity}
                    </span>
                  </div>
                  <div className="text-xs font-medium text-slate-700 truncate">
                    {alt.geofenceName}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
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
