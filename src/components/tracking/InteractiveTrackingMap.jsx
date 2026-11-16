import React, { useEffect, useRef, useState } from 'react';
import * as maplibregl from 'maplibre-gl';

if (typeof maplibregl.setWorkerUrl === 'function') {
  maplibregl.setWorkerUrl('/maplibre-gl-worker.mjs');
}
import {
  Navigation,
  Compass,
  Layers,
  ZoomIn,
  ZoomOut,
  Crosshair,
  Maximize2
} from 'lucide-react';
import { TRACKING_CONFIG, initialGeofences } from '../../data/trackingMockData';
import { createGeoJsonFeature, getGeofenceZones } from '../../services/geofenceService.js';
import { useTheme } from '../../context/ThemeContext';
import {
  CARTO_VOYAGER_STYLE,
  CARTO_DARK_STYLE,
  getMapStyle,
  CARTO_API_KEY
} from '../../config/mapConfig';

export default function InteractiveTrackingMap({
  vehicles = [],
  selectedVehicleId,
  onSelectVehicle,
  historicalPath = [],
  showGeofences = true,
  showRouteLine = true,
  geofences = null
}) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef({});
  const { theme } = useTheme();
  const [basemapMode, setBasemapMode] = useState(() => (theme === 'dark-liquid-glass' ? 'dark' : 'voyager'));
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);
  const [styleVersion, setStyleVersion] = useState(0);

  const activeZones = geofences || getGeofenceZones();

  // Sync basemap mode with theme changes
  useEffect(() => {
    setBasemapMode(theme === 'dark-liquid-glass' ? 'dark' : 'voyager');
  }, [theme]);

  // Initialize MapLibre GL Map Instance
  useEffect(() => {
    if (!mapContainerRef.current) return;
    let isMounted = true;

    try {
      const initialStyle = basemapMode === 'dark' ? CARTO_DARK_STYLE : CARTO_VOYAGER_STYLE;
      const map = new maplibregl.Map({
        container: mapContainerRef.current,
        style: initialStyle,
        center: [TRACKING_CONFIG.MAP_DEFAULT_CENTER[1], TRACKING_CONFIG.MAP_DEFAULT_CENTER[0]], // [lng, lat]
        zoom: TRACKING_CONFIG.MAP_DEFAULT_ZOOM,
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

      map.on('error', (e) => {
        console.warn('MapLibre GL tile fallback triggered:', e);
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
        Object.keys(markersRef.current).forEach((k) => {
          try {
            markersRef.current[k]?.remove();
          } catch (e) {}
        });
        markersRef.current = {};
        try {
          map.remove();
        } catch (e) {}
        mapRef.current = null;
      };
    } catch (err) {
      console.error('Failed to initialize WebGL map:', err);
      setMapError(true);
    }
  }, []);

  // Handle dynamic basemap style change
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;
    const map = mapRef.current;
    const targetStyle = basemapMode === 'dark' ? CARTO_DARK_STYLE : CARTO_VOYAGER_STYLE;
    try {
      map.setStyle(targetStyle);
    } catch (e) {
      console.warn('Error setting map style:', e);
    }
  }, [basemapMode]);
2000000
  // Sync Vehicle Markers on Map
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;
    const map = mapRef.current;

    vehicles.forEach((veh) => {
      const isSelected = veh.vehicleId === selectedVehicleId;
      const markerKey = veh.vehicleId;

      // Status color definitions
      const getStatusColor = (status) => {
        switch (status) {
          case 'moving':
            return { ring: '#8be0b3', bg: '#1c302a', pulse: true };
          case 'idle':
            return { ring: '#e5a46e', bg: '#382c25', pulse: false };
          case 'offline':
            return { ring: '#747783', bg: '#1c1e25', pulse: false };
          case 'stopped':
          default:
            return { ring: '#a5a7b0', bg: '#20222a', pulse: false };
        }
      };

      const style = getStatusColor(veh.status);

      // Create Custom Automotive Marker Element
      if (!markersRef.current[markerKey]) {
        const el = document.createElement('div');
        el.className = 'autrail-map-marker cursor-pointer select-none transition-transform duration-300';
        el.setAttribute('data-id', veh.vehicleId);

        el.innerHTML = `
          <div class="relative flex flex-col items-center group">
            <!-- Plate Badge Above Pin -->
            <div class="px-2 py-0.5 rounded-[4px] text-[9px] font-mono whitespace-nowrap shadow-md mb-1 border transition-all ${
              isSelected
                ? 'bg-[#24212f] text-[#c4b3ff] border-[#b49aff] font-bold scale-105'
                : 'bg-[#17191f] text-[#d1d1da] border-[#292c35]'
            }">
              <span>${veh.plate}</span> · <span class="text-[8px] text-[#858894]">${veh.speed} km/h</span>
            </div>

            <!-- Directional Pin Head -->
            <div class="w-8 h-8 rounded-full flex items-center justify-center relative shadow-xl border ${
              isSelected ? 'ring-2 ring-[#b49aff]' : ''
            }" style="background-color: ${style.bg}; border-color: ${style.ring};">
              <!-- Direction Indicator Arrow -->
              <svg class="w-4 h-4 transition-transform duration-300" style="transform: rotate(${veh.heading || 0}deg);" viewBox="0 0 24 24" fill="none" stroke="${style.ring}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="12 2 19 21 12 17 5 21 12 2" />
              </svg>
              ${style.pulse ? '<span class="absolute inset-0 rounded-full animate-ping opacity-30" style="background-color: ' + style.ring + '"></span>' : ''}
            </div>
          </div>
        `;

        el.addEventListener('click', (e) => {
          e.stopPropagation();
          if (onSelectVehicle) onSelectVehicle(veh);
        });

        const marker = new maplibregl.Marker({ element: el })
          .setLngLat([veh.longitude, veh.latitude])
          .addTo(map);

        markersRef.current[markerKey] = marker;
      } else {
        // Update Marker Position smoothly
        const marker = markersRef.current[markerKey];
        marker.setLngLat([veh.longitude, veh.latitude]);

        // Update active selection classes
        const el = marker.getElement();
        if (el) {
          const badge = el.querySelector('div > div:first-child');
          const pin = el.querySelector('div > div:last-child');
          const arrow = el.querySelector('svg');

          if (badge) {
            badge.innerHTML = `<span>${veh.plate}</span> · <span class="text-[8px] text-[#858894]">${veh.speed} km/h</span>`;
            badge.className = `px-2 py-0.5 rounded-[4px] text-[9px] font-mono whitespace-nowrap shadow-md mb-1 border transition-all ${
              isSelected
                ? 'bg-[#24212f] text-[#c4b3ff] border-[#b49aff] font-bold scale-105'
                : 'bg-[#17191f] text-[#d1d1da] border-[#292c35]'
            }`;
          }

          if (pin) {
            pin.className = `w-8 h-8 rounded-full flex items-center justify-center relative shadow-xl border ${
              isSelected ? 'ring-2 ring-[#b49aff]' : ''
            }`;
            pin.style.backgroundColor = style.bg;
            pin.style.borderColor = style.ring;
          }

          if (arrow) {
            arrow.style.transform = `rotate(${veh.heading || 0}deg)`;
            arrow.setAttribute('stroke', style.ring);
          }
        }
      }
    });

    // Cleanup markers that no longer exist
    Object.keys(markersRef.current).forEach((key) => {
      if (!vehicles.find((v) => v.vehicleId === key)) {
        markersRef.current[key].remove();
        delete markersRef.current[key];
      }
    });
  }, [vehicles, selectedVehicleId, mapLoaded, onSelectVehicle]);

  // Center/FlyTo Selected Vehicle
  useEffect(() => {
    if (!mapRef.current || !mapLoaded || !selectedVehicleId) return;
    const selected = vehicles.find((v) => v.vehicleId === selectedVehicleId);
    if (selected) {
      mapRef.current.flyTo({
        center: [selected.longitude, selected.latitude],
        zoom: Math.max(mapRef.current.getZoom(), 13),
        speed: 1.2,
        curve: 1.4,
        essential: true
      });
    }
  }, [selectedVehicleId, mapLoaded]);

  // Render Historical Route Polyline Layer
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;
    const map = mapRef.current;

    const sourceId = 'historical-route-source';
    const layerId = 'historical-route-line';
    const glowLayerId = 'historical-route-glow';

    // Remove existing layers if present
    if (map.getLayer(glowLayerId)) map.removeLayer(glowLayerId);
    if (map.getLayer(layerId)) map.removeLayer(layerId);
    if (map.getSource(sourceId)) map.removeSource(sourceId);

    if (showRouteLine && historicalPath && historicalPath.length > 1) {
      const coordinates = historicalPath.map((p) => [p.lng, p.lat]);

      map.addSource(sourceId, {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates
          }
        }
      });

      // Subtle Purple Glow underneath
      map.addLayer({
        id: glowLayerId,
        type: 'line',
        source: sourceId,
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#b49aff',
          'line-width': 6,
          'line-opacity': 0.35,
          'line-blur': 3
        }
      });

      // Sharp Core Route Line
      map.addLayer({
        id: layerId,
        type: 'line',
        source: sourceId,
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#ad91ff',
          'line-width': 2.8,
          'line-opacity': 0.95
        }
      });
    }
  }, [historicalPath, showRouteLine, mapLoaded, styleVersion]);

  // Render Geofence Perimeters Layer
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;
    const map = mapRef.current;

    // Remove existing geofence layers and sources dynamically
    const style = map.getStyle();
    if (style && style.layers) {
      style.layers.forEach((layer) => {
        if (layer.id.startsWith('trk-geo-fill-') || layer.id.startsWith('trk-geo-line-')) {
          try { map.removeLayer(layer.id); } catch (e) {}
        }
      });
    }
    if (style && style.sources) {
      Object.keys(style.sources).forEach((sourceId) => {
        if (sourceId.startsWith('trk-geo-src-')) {
          try { map.removeSource(sourceId); } catch (e) {}
        }
      });
    }

    if (showGeofences) {
      activeZones.forEach((zone) => {
        if (!zone.isActive) return;
        const feature = createGeoJsonFeature(zone);
        if (!feature) return;

        const sourceId = `trk-geo-src-${zone.id}`;
        const fillId = `trk-geo-fill-${zone.id}`;
        const lineId = `trk-geo-line-${zone.id}`;
        const zoneColor = zone.color || (zone.zoneType === 'restricted' ? '#ef4444' : '#b49aff');

        map.addSource(sourceId, {
          type: 'geojson',
          data: feature
        });

        map.addLayer({
          id: fillId,
          type: 'fill',
          source: sourceId,
          paint: {
            'fill-color': zoneColor,
            'fill-opacity': 0.12
          }
        });

        map.addLayer({
          id: lineId,
          type: 'line',
          source: sourceId,
          paint: {
            'line-color': zoneColor,
            'line-width': 1.8,
            'line-dasharray': [3, 2],
            'line-opacity': 0.75
          }
        });
      });
    }
  }, [showGeofences, activeZones, mapLoaded, styleVersion]);

  // Controls Handlers
  const handleZoomIn = () => {
    if (mapRef.current) mapRef.current.zoomIn();
  };

  const handleZoomOut = () => {
    if (mapRef.current) mapRef.current.zoomOut();
  };

  const toggleBasemap = () => {
    setBasemapMode((prev) => (prev === 'voyager' ? 'dark' : 'voyager'));
  };

  const handleRecenter = () => {
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: [TRACKING_CONFIG.MAP_DEFAULT_CENTER[1], TRACKING_CONFIG.MAP_DEFAULT_CENTER[0]],
        zoom: TRACKING_CONFIG.MAP_DEFAULT_ZOOM,
        speed: 1.2
      });
    }
  };

  return (
    <div className="glass-card rounded-2xl relative overflow-hidden flex flex-col h-[540px] shadow-liquid-subtle">
      {/* MapLibre GL Canvas Container */}
      <div ref={mapContainerRef} className="w-full h-full flex-1" />

      {/* Top Map HUD Overlay */}
      <div className="absolute top-3.5 left-3.5 z-10 flex items-center gap-2 pointer-events-none">
        <div className="bg-white/95 border border-white/90 px-3.5 py-2 rounded-xl text-xs font-mono backdrop-blur-xl flex items-center gap-2 pointer-events-auto shadow-liquid-subtle">
          <Compass className="w-4 h-4 text-[#2879E8]" />
          <span className="text-[#172033] font-bold">METRO NY COMMAND QUADRANT</span>
          <span className="text-[#CBD5E1]">|</span>
          <span className="text-[#16A36A] font-bold">{vehicles.length} ACTIVE TRANSPONDERS</span>
        </div>
      </div>

      {/* Floating Tactical Zoom & View Controls */}
      <div className="absolute top-3.5 right-3.5 z-10 flex flex-col gap-1.5 bg-white/95 border border-white/90 p-1.5 rounded-xl backdrop-blur-xl shadow-liquid-subtle text-[#172033]">
        <button
          type="button"
          onClick={handleZoomIn}
          className="p-1.5 text-[#68758A] hover:text-[#172033] rounded-lg hover:bg-[#F0F5FC] transition-colors cursor-pointer"
          title="Zoom in"
          aria-label="Zoom in"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={handleZoomOut}
          className="p-1.5 text-[#68758A] hover:text-[#172033] rounded-lg hover:bg-[#F0F5FC] transition-colors cursor-pointer"
          title="Zoom out"
          aria-label="Zoom out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={toggleBasemap}
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
        <div className="h-px bg-[#E2E8F0] mx-1 my-0.5" />
        <button
          type="button"
          onClick={handleRecenter}
          className="p-1.5 text-[#68758A] hover:text-[#172033] rounded-lg hover:bg-[#F0F5FC] transition-colors cursor-pointer"
          title="Recenter Metro Area"
          aria-label="Recenter Metro Area"
        >
          <Crosshair className="w-4 h-4" />
        </button>
      </div>

      {/* Bottom Map Status Bar */}
      <div className="absolute bottom-3.5 left-3.5 right-3.5 z-10 flex items-center justify-between text-[10px] font-mono pointer-events-none">
        <div className="bg-white/95 border border-white/90 px-3 py-1.5 rounded-xl backdrop-blur-xl text-[#68758A] pointer-events-auto flex items-center gap-3 shadow-2xs font-semibold">
          <span>TILE SOURCE: CARTO ({basemapMode === 'voyager' ? 'VOYAGER NAVIGATION' : 'DARK MATTER TACTICAL'})</span>
          <span className="text-[#CBD5E1]">•</span>
          <span className="text-[#16A36A]">API KEY: ACTIVE (5M REQ/MO)</span>
          <span className="text-[#CBD5E1]">•</span>
          <span className="text-[#2879E8]">HDOP: 0.8m</span>
        </div>

        <div className="bg-white/95 border border-white/90 px-3 py-1.5 rounded-xl backdrop-blur-xl text-[#68758A] pointer-events-auto flex items-center gap-2 shadow-2xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-[#16A36A] shadow-[0_0_6px_#16A36A] beacon-pulse" />
          <span className="text-[#172033]">REALTIME TELEMETRY ENGINE</span>
        </div>
      </div>
    </div>
  );
}
