import React, { useState, useEffect } from 'react';
import {
  X,
  Shield,
  Circle,
  Square,
  Plus,
  Trash2,
  Sparkles,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import {
  GEOFENCE_ZONE_TYPES,
  PRESET_POLYGON_TEMPLATES
} from '../../data/geofenceMockData';

const COLOR_PRESETS = [
  '#b49aff', // Purple
  '#8be0b3', // Emerald
  '#38bdf8', // Sky Blue
  '#e5a46e', // Amber
  '#f59e0b', // Yellow
  '#ef4444', // Red (Restricted)
  '#f43f5e'  // Rose (Prohibited)
];

export default function CreateGeofenceModal({
  isOpen,
  onClose,
  onSaveGeofence,
  initialData = null
}) {
  if (!isOpen) return null;

  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [zoneType, setZoneType] = useState(initialData?.zoneType || 'client');
  const [geometryType, setGeometryType] = useState(initialData?.geometryType || 'circle');
  const [color, setColor] = useState(
    initialData?.color || (initialData?.zoneType === 'restricted' ? '#ef4444' : '#b49aff')
  );

  // Circle Parameters
  const [centerLat, setCenterLat] = useState(initialData?.center?.lat ?? 40.7306);
  const [centerLng, setCenterLng] = useState(initialData?.center?.lng ?? -73.9352);
  const [radius, setRadius] = useState(initialData?.radius ?? 1200);

  // Polygon Parameters
  const [coordinates, setCoordinates] = useState(
    initialData?.coordinates || [
      { lat: 40.735, lng: -73.985 },
      { lat: 40.73, lng: -73.97 },
      { lat: 40.725, lng: -73.98 },
      { lat: 40.735, lng: -73.985 }
    ]
  );

  // Behavioral Controls
  const [speedLimit, setSpeedLimit] = useState(initialData?.speedLimit ?? 30);
  const [maxDwellMinutes, setMaxDwellMinutes] = useState(initialData?.maxDwellMinutes ?? 60);
  const [entryAlert, setEntryAlert] = useState(initialData?.entryAlert ?? true);
  const [exitAlert, setExitAlert] = useState(initialData?.exitAlert ?? true);
  const [isActive, setIsActive] = useState(initialData?.isActive ?? true);
  const [validationError, setValidationError] = useState('');

  // Synchronize form fields whenever modal opens or editing target changes
  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setDescription(initialData.description || '');
      setZoneType(initialData.zoneType || 'client');
      setGeometryType(initialData.geometryType || 'circle');
      setColor(
        initialData.color || (initialData.zoneType === 'restricted' ? '#ef4444' : '#b49aff')
      );
      setCenterLat(initialData.center?.lat ?? 40.7306);
      setCenterLng(initialData.center?.lng ?? -73.9352);
      setRadius(initialData.radius ?? 1200);
      setCoordinates(
        initialData.coordinates && initialData.coordinates.length >= 3
          ? initialData.coordinates
          : [
              { lat: 40.735, lng: -73.985 },
              { lat: 40.73, lng: -73.97 },
              { lat: 40.725, lng: -73.98 },
              { lat: 40.735, lng: -73.985 }
            ]
      );
      setSpeedLimit(initialData.speedLimit ?? 30);
      setMaxDwellMinutes(initialData.maxDwellMinutes ?? 60);
      setEntryAlert(initialData.entryAlert ?? true);
      setExitAlert(initialData.exitAlert ?? true);
      setIsActive(initialData.isActive ?? true);
    } else {
      setName('');
      setDescription('');
      setZoneType('client');
      setGeometryType('circle');
      setColor('#b49aff');
      setCenterLat(40.7306);
      setCenterLng(-73.9352);
      setRadius(1200);
      setCoordinates([
        { lat: 40.735, lng: -73.985 },
        { lat: 40.73, lng: -73.97 },
        { lat: 40.725, lng: -73.98 },
        { lat: 40.735, lng: -73.985 }
      ]);
      setSpeedLimit(30);
      setMaxDwellMinutes(60);
      setEntryAlert(true);
      setExitAlert(true);
      setIsActive(true);
    }
    setValidationError('');
  }, [isOpen, initialData]);

  const handleApplyPreset = (template) => {
    setCoordinates([...template.coordinates]);
  };

  const handleAddVertex = () => {
    const last = coordinates[coordinates.length - 1] || { lat: 40.735, lng: -73.985 };
    setCoordinates([...coordinates, { lat: last.lat + 0.005, lng: last.lng + 0.005 }]);
  };

  const handleUpdateVertex = (index, field, value) => {
    const next = [...coordinates];
    next[index] = { ...next[index], [field]: Number(value) };
    setCoordinates(next);
  };

  const handleDeleteVertex = (index) => {
    if (coordinates.length <= 3) {
      setValidationError('Polygons must contain at least 3 vertices to define a boundary.');
      return;
    }
    setCoordinates(coordinates.filter((_, i) => i !== index));
    setValidationError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setValidationError('Please specify a Geofence zone name.');
      return;
    }

    if (geometryType === 'circle') {
      if (isNaN(centerLat) || centerLat < -90 || centerLat > 90) {
        setValidationError('Invalid center latitude (must be between -90 and 90).');
        return;
      }
      if (isNaN(centerLng) || centerLng < -180 || centerLng > 180) {
        setValidationError('Invalid center longitude (must be between -180 and 180).');
        return;
      }
      if (radius < 100 || radius > 15000) {
        setValidationError('Radius must be between 100m and 15,000m.');
        return;
      }
    } else {
      if (coordinates.length < 3) {
        setValidationError('Polygon requires at least 3 valid coordinate vertices.');
        return;
      }
    }

    const payload = {
      ...(initialData?.id ? { id: initialData.id } : {}),
      name: name.trim(),
      description: description.trim(),
      zoneType,
      geometryType,
      color,
      center: geometryType === 'circle' ? { lat: Number(centerLat), lng: Number(centerLng) } : null,
      radius: geometryType === 'circle' ? Number(radius) : null,
      coordinates: geometryType === 'polygon' ? coordinates : null,
      speedLimit: Number(speedLimit),
      maxDwellMinutes: Number(maxDwellMinutes),
      entryAlert,
      exitAlert,
      isActive
    };

    onSaveGeofence(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#17191f] border border-[#2b2e38] rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#252730] sticky top-0 bg-[#17191f] z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#b49aff]/10 flex items-center justify-center text-[#b49aff]">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#f4f3f8]">
                {initialData ? 'Edit Geofence Boundary' : 'Create New Geofence Zone'}
              </h2>
              <p className="text-xs text-[#8b8d98]">
                Define circular radius or polygon coordinates with automated breach triggers
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#8b8d98] hover:text-[#f4f3f8] rounded-lg hover:bg-[#22242d] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {validationError && (
            <div className="p-3 bg-[#ef4444]/10 border border-[#ef4444]/30 rounded-lg text-xs text-[#fca5a5] flex items-center gap-2 font-mono">
              <AlertTriangle className="w-4 h-4 shrink-0 text-[#ef4444]" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-[#8b8d98] mb-1.5">
                ZONE NAME *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Brooklyn Navy Yard Fulfillment"
                className="w-full bg-[#101116] border border-[#2b2e38] rounded-lg px-3 py-2 text-xs text-[#f4f3f8] placeholder-[#555] focus:outline-none focus:border-[#b49aff]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-[#8b8d98] mb-1.5">
                ZONE CATEGORY *
              </label>
              <select
                value={zoneType}
                onChange={(e) => {
                  const val = e.target.value;
                  setZoneType(val);
                  if (val === 'restricted' || val === 'prohibited') {
                    setColor('#ef4444');
                  }
                }}
                className="w-full bg-[#101116] border border-[#2b2e38] rounded-lg px-3 py-2 text-xs text-[#f4f3f8] focus:outline-none focus:border-[#b49aff]"
              >
                {GEOFENCE_ZONE_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-[#8b8d98] mb-1.5">
              DESCRIPTION / OPERATIONAL DIRECTIVE
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Primary commercial freight offloading dock; hazmat prohibited"
              className="w-full bg-[#101116] border border-[#2b2e38] rounded-lg px-3 py-2 text-xs text-[#f4f3f8] placeholder-[#555] focus:outline-none focus:border-[#b49aff]"
            />
          </div>

          {/* Geometry Mode Toggle */}
          <div>
            <label className="block text-xs font-mono text-[#8b8d98] mb-2">
              BOUNDARY GEOMETRY TYPE
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setGeometryType('circle')}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-lg border text-xs font-mono transition-all ${
                  geometryType === 'circle'
                    ? 'bg-[#b49aff]/10 border-[#b49aff] text-[#b49aff] font-bold shadow-[0_0_12px_rgba(180,154,255,0.2)]'
                    : 'bg-[#101116] border-[#252730] text-[#71737e] hover:border-[#353945]'
                }`}
              >
                <Circle className="w-4 h-4" />
                <span>CIRCULAR PERIMETER</span>
              </button>

              <button
                type="button"
                onClick={() => setGeometryType('polygon')}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-lg border text-xs font-mono transition-all ${
                  geometryType === 'polygon'
                    ? 'bg-[#b49aff]/10 border-[#b49aff] text-[#b49aff] font-bold shadow-[0_0_12px_rgba(180,154,255,0.2)]'
                    : 'bg-[#101116] border-[#252730] text-[#71737e] hover:border-[#353945]'
                }`}
              >
                <Square className="w-4 h-4" />
                <span>POLYGON BOUNDARY</span>
              </button>
            </div>
          </div>

          {/* Conditional Geometry Inputs */}
          {geometryType === 'circle' ? (
            <div className="bg-[#101116] border border-[#252730] p-4 rounded-xl space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono text-[#8b8d98] mb-1">
                    CENTER LATITUDE
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    value={centerLat}
                    onChange={(e) => setCenterLat(Number(e.target.value))}
                    className="w-full bg-[#17191f] border border-[#2b2e38] rounded-lg px-2.5 py-1.5 text-xs font-mono text-[#f4f3f8] focus:outline-none focus:border-[#b49aff]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-[#8b8d98] mb-1">
                    CENTER LONGITUDE
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    value={centerLng}
                    onChange={(e) => setCenterLng(Number(e.target.value))}
                    className="w-full bg-[#17191f] border border-[#2b2e38] rounded-lg px-2.5 py-1.5 text-xs font-mono text-[#f4f3f8] focus:outline-none focus:border-[#b49aff]"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[11px] font-mono text-[#8b8d98]">
                    PERIMETER RADIUS: <span className="text-[#b49aff] font-bold">{radius} METERS</span> ({Math.round(radius / 100) / 10} km)
                  </label>
                  <div className="flex gap-1.5">
                    {[500, 1000, 1500, 2500].map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setRadius(r)}
                        className="px-2 py-0.5 text-[10px] font-mono bg-[#17191f] border border-[#2b2e38] rounded hover:border-[#b49aff] text-[#8b8d98] hover:text-white"
                      >
                        {r >= 1000 ? `${r / 1000}km` : `${r}m`}
                      </button>
                    ))}
                  </div>
                </div>
                <input
                  type="range"
                  min="200"
                  max="5000"
                  step="50"
                  value={radius}
                  onChange={(e) => setRadius(Number(e.target.value))}
                  className="w-full accent-[#b49aff] bg-[#17191f] cursor-pointer"
                />
              </div>
            </div>
          ) : (
            <div className="bg-[#101116] border border-[#252730] p-4 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-[#8b8d98]">
                  POLYGON VERTICES ({coordinates.length} POINTS)
                </span>
                <div className="flex items-center gap-2">
                  <select
                    onChange={(e) => {
                      const t = PRESET_POLYGON_TEMPLATES.find((p) => p.name === e.target.value);
                      if (t) handleApplyPreset(t);
                    }}
                    defaultValue=""
                    className="bg-[#17191f] border border-[#2b2e38] rounded px-2 py-1 text-[11px] text-[#8b8d98] font-mono focus:outline-none"
                  >
                    <option value="" disabled>Load NYC Preset Boundary...</option>
                    {PRESET_POLYGON_TEMPLATES.map((p) => (
                      <option key={p.name} value={p.name}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={handleAddVertex}
                    className="flex items-center gap-1 text-[11px] font-mono text-[#b49aff] bg-[#b49aff]/10 border border-[#b49aff]/20 px-2 py-1 rounded hover:bg-[#b49aff]/20"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Vertex</span>
                  </button>
                </div>
              </div>

              <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1">
                {coordinates.map((coord, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-[#17191f] p-2 rounded-lg border border-[#252730]">
                    <span className="text-[10px] font-mono text-[#555] w-5">#{idx + 1}</span>
                    <input
                      type="number"
                      step="0.0001"
                      value={coord.lat}
                      onChange={(e) => handleUpdateVertex(idx, 'lat', e.target.value)}
                      placeholder="Latitude"
                      className="w-1/2 bg-[#101116] border border-[#2b2e38] rounded px-2 py-1 text-xs font-mono text-[#f4f3f8] focus:outline-none focus:border-[#b49aff]"
                    />
                    <input
                      type="number"
                      step="0.0001"
                      value={coord.lng}
                      onChange={(e) => handleUpdateVertex(idx, 'lng', e.target.value)}
                      placeholder="Longitude"
                      className="w-1/2 bg-[#101116] border border-[#2b2e38] rounded px-2 py-1 text-xs font-mono text-[#f4f3f8] focus:outline-none focus:border-[#b49aff]"
                    />
                    <button
                      type="button"
                      onClick={() => handleDeleteVertex(idx)}
                      className="text-[#71737e] hover:text-[#ef4444] p-1 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Operating Rules & Breach Triggers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-[#8b8d98] mb-1.5">
                MAX SPEED LIMIT IN ZONE (KM/H)
              </label>
              <input
                type="number"
                min="5"
                max="120"
                value={speedLimit}
                onChange={(e) => setSpeedLimit(Number(e.target.value))}
                className="w-full bg-[#101116] border border-[#2b2e38] rounded-lg px-3 py-2 text-xs font-mono text-[#f4f3f8] focus:outline-none focus:border-[#b49aff]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-[#8b8d98] mb-1.5">
                MAX ALLOWED DWELL TIME (MINS)
              </label>
              <input
                type="number"
                min="0"
                max="600"
                value={maxDwellMinutes}
                onChange={(e) => setMaxDwellMinutes(Number(e.target.value))}
                className="w-full bg-[#101116] border border-[#2b2e38] rounded-lg px-3 py-2 text-xs font-mono text-[#f4f3f8] focus:outline-none focus:border-[#b49aff]"
              />
            </div>
          </div>

          {/* Color & Trigger Toggles */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-[#252730]">
            <div>
              <label className="block text-[11px] font-mono text-[#8b8d98] mb-1.5">
                PERIMETER ACCENT COLOR
              </label>
              <div className="flex items-center gap-2">
                {COLOR_PRESETS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={`w-6 h-6 rounded-full transition-transform ${
                      color === c ? 'scale-125 ring-2 ring-white ring-offset-2 ring-offset-[#17191f]' : ''
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono text-[#8b8d98]">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={entryAlert}
                  onChange={(e) => setEntryAlert(e.target.checked)}
                  className="rounded border-[#2b2e38] bg-[#101116] text-[#b49aff] focus:ring-0"
                />
                <span>ENTRY ALERT</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={exitAlert}
                  onChange={(e) => setExitAlert(e.target.checked)}
                  className="rounded border-[#2b2e38] bg-[#101116] text-[#b49aff] focus:ring-0"
                />
                <span>EXIT ALERT</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="rounded border-[#2b2e38] bg-[#101116] text-[#8be0b3] focus:ring-0"
                />
                <span className={isActive ? 'text-[#8be0b3]' : 'text-[#71737e]'}>ACTIVE</span>
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#252730]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-[#2b2e38] text-xs font-mono text-[#8b8d98] hover:text-white hover:bg-[#22242d] transition-colors"
            >
              CANCEL
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-[#b49aff] hover:bg-[#a384fa] text-[#17131f] text-xs font-bold font-mono transition-all shadow-[0_0_16px_rgba(180,154,255,0.35)] flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              <span>{initialData ? 'SAVE CHANGES' : 'CREATE GEOFENCE'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

