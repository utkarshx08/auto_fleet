import React, { useEffect, useRef, useState } from 'react';
import * as maplibregl from 'maplibre-gl';
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

// Carto Dark Matter Style Specification (Free, open-source, no API key required)
const DARK_MAP_STYLE = {
  version: 8,
  sources: {
    'carto-dark': {
      type: 'raster',
      tiles: [
        'https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
        'https://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
        'https://c.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png'
      ],
      tileSize: 256,
      attribution: '© OpenStreetMap contributors, © CARTO'
    }
  },
  layers: [
    {
      id: 'carto-dark-layer',
      type: 'raster',
      source: 'carto-dark',
      minzoom: 0,
      maxzoom: 19
    }
  ]
};

export default function InteractiveTrackingMap({
  vehicles = [],
  selectedVehicleId,
  onSelectVehicle,
  historicalPath = [],
  showGeofences = true,
  showRouteLine = true
}) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef({});
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);

  // Initialize MapLibre GL Map Instance
  useEffect(() => {
    if (!mapContainerRef.current) return;

    try {
      const map = new maplibregl.Map({
        container: mapContainerRef.current,
        style: DARK_MAP_STYLE,
        center: [TRACKING_CONFIG.MAP_DEFAULT_CENTER[1], TRACKING_CONFIG.MAP_DEFAULT_CENTER[0]], // [lng, lat]
        zoom: TRACKING_CONFIG.MAP_DEFAULT_ZOOM,
        attributionControl: false,
        pitchWithRotate: true
      });

      map.on('load', () => {
        mapRef.current = map;
        setMapLoaded(true);

        // Resize observer support for clean responsive layout
        map.resize();
      });

      map.on('error', (e) => {
        console.warn('MapLibre GL tile fallback triggered:', e);
      });

      return () => {
        map.remove();
      };
    } catch (err) {
      console.error('Failed to initialize WebGL map:', err);
      setMapError(true);
    }
  }, []);

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
  }, [historicalPath, showRouteLine, mapLoaded]);

  // Controls Handlers
  const handleZoomIn = () => {
    if (mapRef.current) mapRef.current.zoomIn();
  };

  const handleZoomOut = () => {
    if (mapRef.current) mapRef.current.zoomOut();
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
    <div className="relative w-full h-[540px] bg-[#0d0e13] rounded-lg overflow-hidden border border-[#252730] flex flex-col">
      {/* MapLibre GL Canvas Container */}
      <div ref={mapContainerRef} className="w-full h-full flex-1" />

      {/* Top Map HUD Overlay */}
      <div className="absolute top-3 left-3 z-10 flex items-center gap-2 pointer-events-none">
        <div className="bg-[#17191f]/90 border border-[#2b2e38] px-3 py-1.5 rounded-lg text-xs font-mono backdrop-blur-md flex items-center gap-2 pointer-events-auto shadow-xl">
          <Compass className="w-3.5 h-3.5 text-[#b49aff]" />
          <span className="text-[#e0e0e7] font-bold">METRO NY COMMAND QUADRANT</span>
          <span className="text-[#555]">|</span>
          <span className="text-[#8be0b3] font-bold">{vehicles.length} ACTIVE TRANSPONDERS</span>
        </div>
      </div>

      {/* Floating Tactical Zoom & View Controls */}
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-1.5 bg-[#17191f]/90 border border-[#2b2e38] p-1 rounded-lg backdrop-blur-md shadow-xl">
        <button
          type="button"
          onClick={handleZoomIn}
          className="p-1.5 text-[#a7a9b5] hover:text-white rounded hover:bg-[#22242d] transition-colors"
          title="Zoom in"
          aria-label="Zoom in"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={handleZoomOut}
          className="p-1.5 text-[#a7a9b5] hover:text-white rounded hover:bg-[#22242d] transition-colors"
          title="Zoom out"
          aria-label="Zoom out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <div className="h-px bg-[#2b2e38] mx-1 my-0.5" />
        <button
          type="button"
          onClick={handleRecenter}
          className="p-1.5 text-[#a7a9b5] hover:text-white rounded hover:bg-[#22242d] transition-colors"
          title="Recenter Metro Area"
          aria-label="Recenter Metro Area"
        >
          <Crosshair className="w-4 h-4" />
        </button>
      </div>

      {/* Bottom Map Status Bar */}
      <div className="absolute bottom-3 left-3 right-3 z-10 flex items-center justify-between text-[9px] font-mono pointer-events-none">
        <div className="bg-[#17191f]/90 border border-[#2b2e38] px-2.5 py-1 rounded backdrop-blur-md text-[#858894] pointer-events-auto flex items-center gap-3">
          <span>TILE SOURCE: CARTO DARK MATTER (VECTOR GL)</span>
          <span className="text-[#555]">•</span>
          <span className="text-[#8be0b3]">HDOP: 0.8m ACCURACY</span>
        </div>

        <div className="bg-[#17191f]/90 border border-[#2b2e38] px-2.5 py-1 rounded backdrop-blur-md text-[#858894] pointer-events-auto flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#8be0b3] shadow-[0_0_6px_#8be0b3] beacon-pulse" />
          <span className="text-[#e0e0e7]">SIMULATED REALTIME TELEMETRY ENGINE</span>
        </div>
      </div>
    </div>
  );
}
