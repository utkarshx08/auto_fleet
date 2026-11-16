import React, { useEffect, useRef, useState } from 'react';
import * as maplibregl from 'maplibre-gl';

if (typeof maplibregl.setWorkerUrl === 'function') {
  maplibregl.setWorkerUrl('/maplibre-gl-worker.mjs');
}
import {
  Compass,
  Layers,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Crosshair,
  ShieldAlert,
  MapPin
} from 'lucide-react';
import { haversineDistanceMeters, createGeoJsonFeature } from '../../services/geofenceService.js';
import { useTheme } from '../../context/ThemeContext';
import {
  CARTO_VOYAGER_STYLE,
  CARTO_DARK_STYLE,
  getMapStyle,
  CARTO_API_KEY
} from '../../config/mapConfig';

export default function GeofenceMap({
  geofences = [],
  vehicles = [],
  selectedGeofenceId = null,
  onSelectGeofence = null,
  focusCoordinate = null,
  height = '500px'
}) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef({});
  const popupRef = useRef(null);
  const { theme } = useTheme();
  const [basemapMode, setBasemapMode] = useState(() => (theme === 'dark-liquid-glass' ? 'dark' : 'voyager'));
  const [mapLoaded, setMapLoaded] = useState(false);
  const [showVehicles, setShowVehicles] = useState(true);
  const [styleVersion, setStyleVersion] = useState(0);

  // Sync with theme
  useEffect(() => {
    setBasemapMode(theme === 'dark-liquid-glass' ? 'dark' : 'voyager');
  }, [theme]);

  // Initialize MapLibre
  useEffect(() => {
    if (!mapContainerRef.current) return;
    let isMounted = true;

    try {
      const initialStyle = basemapMode === 'dark' ? CARTO_DARK_STYLE : CARTO_VOYAGER_STYLE;
      const map = new maplibregl.Map({
        container: mapContainerRef.current,
        style: initialStyle,
        center: [-73.975, 40.735], // [lng, lat] NYC Center
        zoom: 11.2,
        attributionControl: false,
        pitchWithRotate: true
      });

      mapRef.current = map;

      map.on('load', () => {
        if (!isMounted) return;
        setMapLoaded(true);
        map.resize();
      });

      map.on('style.load', () => {
        if (!isMounted) return;
        setStyleVersion((v) => v + 1);
      });

      const ro = new ResizeObserver(() => {
        if (mapRef.current && isMounted) {
          try {
            mapRef.current.resize();
          } catch (e) {}
        }
      });
      ro.observe(mapContainerRef.current);

      return () => {
        isMounted = false;
        ro.disconnect();
        if (popupRef.current) {
          try { popupRef.current.remove(); } catch (e) {}
          popupRef.current = null;
        }
        Object.keys(markersRef.current).forEach((k) => {
          try { markersRef.current[k]?.remove(); } catch (e) {}
        });
        markersRef.current = {};
        try { map.remove(); } catch (e) {}
        mapRef.current = null;
      };
    } catch (err) {
      console.error('Failed to initialize Geofence MapLibre instance:', err);
    }
  }, []);

  // Update style on basemapMode change
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;
    const map = mapRef.current;
    const targetStyle = basemapMode === 'dark' ? CARTO_DARK_STYLE : CARTO_VOYAGER_STYLE;
    try {
      map.setStyle(targetStyle);
    } catch (e) {
      console.warn('Error updating geofence map style:', e);
    }
  }, [basemapMode]);

  // Render Geofence Polygons and Circles
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;
    const map = mapRef.current;

    // Remove any previously added geofence layers and sources
    const style = map.getStyle();
    if (style && style.layers) {
      style.layers.forEach((layer) => {
        if (layer.id.startsWith('fill-') || layer.id.startsWith('outline-')) {
          try { map.removeLayer(layer.id); } catch (e) {}
        }
      });
    }
    if (style && style.sources) {
      Object.keys(style.sources).forEach((sourceId) => {
        if (sourceId.startsWith('source-')) {
          try { map.removeSource(sourceId); } catch (e) {}
        }
      });
    }

    // Add each geofence as GeoJSON feature
    geofences.forEach((zone) => {
      if (!zone.isActive) return;

      const sourceId = `source-${zone.id}`;
      const fillLayerId = `fill-${zone.id}`;
      const outlineLayerId = `outline-${zone.id}`;

      const feature = createGeoJsonFeature(zone);
      if (!feature) return;

      const isSelected = zone.id === selectedGeofenceId;
      const zoneColor = zone.color || (zone.zoneType === 'restricted' ? '#ef4444' : '#b49aff');

      map.addSource(sourceId, {
        type: 'geojson',
        data: feature
      });

      // Fill Layer
      map.addLayer({
        id: fillLayerId,
        type: 'fill',
        source: sourceId,
        paint: {
          'fill-color': zoneColor,
          'fill-opacity': isSelected ? 0.35 : 0.18
        }
      });

      // Perimeter Line Layer
      map.addLayer({
        id: outlineLayerId,
        type: 'line',
        source: sourceId,
        paint: {
          'line-color': zoneColor,
          'line-width': isSelected ? 3 : 2,
          'line-dasharray': zone.zoneType === 'restricted' ? [2, 2] : [4, 2],
          'line-opacity': 0.9
        }
      });

      // Click handler for geofence selection & popup
      map.on('click', fillLayerId, (e) => {
        if (onSelectGeofence) {
          onSelectGeofence(zone);
        }

        if (popupRef.current) popupRef.current.remove();

        const popupContent = `
          <div style="background:#17191f; color:#f4f3f8; padding:10px 12px; border-radius:8px; border:1px solid #2b2e38; font-family:sans-serif; min-width:200px;">
            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:6px;">
              <span style="font-weight:700; font-size:13px; color:${zoneColor};">${zone.name}</span>
              <span style="font-size:10px; background:${zoneColor}22; color:${zoneColor}; padding:2px 6px; border-radius:4px; font-weight:600; text-transform:uppercase;">${zone.zoneType}</span>
            </div>
            <p style="font-size:11px; color:#8b8d98; margin:0 0 8px 0; line-height:1.3;">${zone.description || 'Monitored perimeter zone'}</p>
            <div style="display:flex; flex-direction:column; gap:4px; font-size:11px; font-family:monospace; border-top:1px solid #252730; padding-top:6px;">
              <div>⚡ Speed Limit: <span style="color:#f4f3f8; font-weight:600;">${zone.speedLimit} km/h</span></div>
              <div>⏱ Max Dwell: <span style="color:#f4f3f8; font-weight:600;">${zone.maxDwellMinutes} mins</span></div>
              <div>📐 Geometry: <span style="color:#f4f3f8; font-weight:600;">${zone.geometryType.toUpperCase()}${zone.radius ? ` (${zone.radius}m)` : ''}</span></div>
            </div>
          </div>
        `;

        popupRef.current = new maplibregl.Popup({ closeButton: true, closeOnClick: true, offset: 10 })
          .setLngLat(e.lngLat)
          .setHTML(popupContent)
          .addTo(map);
      });

      // Mouse cursor hover feedback
      map.on('mouseenter', fillLayerId, () => {
        map.getCanvas().style.cursor = 'pointer';
      });
      map.on('mouseleave', fillLayerId, () => {
        map.getCanvas().style.cursor = '';
      });
    });
  }, [geofences, selectedGeofenceId, mapLoaded, onSelectGeofence, styleVersion]);

  // Sync Live Vehicle Markers
  useEffect(() => {
    if (!mapRef.current || !mapLoaded || !showVehicles) {
      Object.keys(markersRef.current).forEach((k) => markersRef.current[k].remove());
      markersRef.current = {};
      return;
    }
    const map = mapRef.current;

    vehicles.forEach((veh) => {
      const key = veh.vehicleId || veh.plate;
      if (!veh.latitude || !veh.longitude) return;

      if (!markersRef.current[key]) {
        const el = document.createElement('div');
        el.className = 'geofence-vehicle-marker';
        el.style.display = 'flex';
        el.style.alignItems = 'center';
        el.style.gap = '4px';
        el.style.padding = '3px 6px';
        el.style.borderRadius = '6px';
        el.style.backgroundColor = 'rgba(23, 25, 31, 0.92)';
        el.style.border = '1px solid #2b2e38';
        el.style.cursor = 'pointer';
        el.style.boxShadow = '0 2px 8px rgba(0,0,0,0.5)';

        el.innerHTML = `
          <div style="width:8px; height:8px; border-radius:50%; background-color:#8be0b3;"></div>
          <span style="font-family:monospace; font-size:10px; font-weight:700; color:#f4f3f8;">${veh.plate}</span>
        `;

        const marker = new maplibregl.Marker({ element: el })
          .setLngLat([veh.longitude, veh.latitude])
          .addTo(map);

        markersRef.current[key] = marker;
      } else {
        markersRef.current[key].setLngLat([veh.longitude, veh.latitude]);
      }
    });

    // Cleanup markers that are no longer in vehicles
    Object.keys(markersRef.current).forEach((k) => {
      if (!vehicles.find((v) => (v.vehicleId || v.plate) === k)) {
        markersRef.current[k].remove();
        delete markersRef.current[k];
      }
    });
  }, [vehicles, showVehicles, mapLoaded]);

  // Focus Coordinate Handler (e.g. from alert or geofence selection)
  useEffect(() => {
    if (!mapRef.current || !mapLoaded || !focusCoordinate) return;
    mapRef.current.flyTo({
      center: [focusCoordinate.lng, focusCoordinate.lat],
      zoom: 14,
      speed: 1.4,
      curve: 1.2
    });
  }, [focusCoordinate, mapLoaded]);

  const handleZoomIn = () => mapRef.current?.zoomIn();
  const handleZoomOut = () => mapRef.current?.zoomOut();
  const handleRecenter = () => {
    mapRef.current?.flyTo({ center: [-73.975, 40.735], zoom: 11.2, speed: 1.2 });
  };

  return (
    <div
      className="glass-card rounded-2xl relative overflow-hidden flex flex-col shadow-liquid-subtle"
      style={{ height }}
    >
      <div ref={mapContainerRef} className="w-full h-full flex-1" />

      {/* Top HUD */}
      <div className="absolute top-3.5 left-3.5 z-10 flex items-center gap-2 pointer-events-none">
        <div className="bg-white/95 border border-white/90 px-3.5 py-2 rounded-xl text-xs font-mono backdrop-blur-xl flex items-center gap-2 pointer-events-auto shadow-liquid-subtle">
          <ShieldAlert className="w-4 h-4 text-[#2879E8]" />
          <span className="text-[#172033] font-bold">GEOFENCE RADAR MATRIX</span>
          <span className="text-[#CBD5E1]">|</span>
          <span className="text-[#16A36A] font-bold">{geofences.filter((g) => g.isActive).length} ZONES ACTIVE</span>
        </div>
      </div>

      {/* Controls Overlay */}
      <div className="absolute top-3.5 right-3.5 z-10 flex flex-col gap-1.5 bg-white/95 border border-white/90 p-1.5 rounded-xl backdrop-blur-xl shadow-liquid-subtle text-[#172033]">
        <button
          type="button"
          onClick={handleZoomIn}
          className="p-1.5 text-[#68758A] hover:text-[#172033] rounded-lg hover:bg-[#F0F5FC] transition-colors cursor-pointer"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={handleZoomOut}
          className="p-1.5 text-[#68758A] hover:text-[#172033] rounded-lg hover:bg-[#F0F5FC] transition-colors cursor-pointer"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => setBasemapMode((prev) => (prev === 'voyager' ? 'dark' : 'voyager'))}
          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
            basemapMode === 'voyager'
              ? 'text-[#2879E8] bg-[#EAF3FF] hover:bg-[#D5E6FB]'
              : 'text-[#68758A] hover:text-[#172033] hover:bg-[#F0F5FC]'
          }`}
          title={basemapMode === 'voyager' ? 'Switch to CARTO Dark Matter' : 'Switch to CARTO Voyager'}
          aria-label="Toggle map basemap style"
        >
          <Layers className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={handleRecenter}
          className="p-1.5 text-[#68758A] hover:text-[#2879E8] rounded-lg hover:bg-[#F0F5FC] transition-colors cursor-pointer"
          title="Recenter Metro NYC"
        >
          <Crosshair className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => setShowVehicles((prev) => !prev)}
          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
            showVehicles ? 'text-[#16A36A] bg-[#E8F7F0]' : 'text-[#8A97AB] hover:text-[#172033]'
          }`}
          title="Toggle Vehicle Transponders"
        >
          <MapPin className="w-4 h-4" />
        </button>
      </div>

      {/* Legend Footer */}
      <div className="absolute bottom-3.5 left-3.5 z-10 flex items-center gap-3 bg-white/95 border border-white/90 px-3.5 py-2 rounded-xl text-[10px] font-mono backdrop-blur-xl shadow-liquid-subtle text-[#68758A] font-medium">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#2879E8]" />
          <span>Depot</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#16A36A]" />
          <span>Warehouse</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#0284C7]" />
          <span>Client Site</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#E05252]" />
          <span>Restricted / Hazmat</span>
        </div>
      </div>
    </div>
  );
}

