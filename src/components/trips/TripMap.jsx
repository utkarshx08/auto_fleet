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
  Maximize2,
  MapPin,
  Clock,
  Radio,
  AlertCircle
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import {
  CARTO_VOYAGER_STYLE,
  CARTO_DARK_STYLE,
  getMapStyle,
  CARTO_API_KEY
} from '../../config/mapConfig';

export default function TripMap({
  trip,
  vehicle = null,
  height = '420px',
  className = ''
}) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const { theme } = useTheme();
  const [basemapMode, setBasemapMode] = useState(() => (theme === 'dark-liquid-glass' ? 'dark' : 'voyager'));
  const [mapLoaded, setMapLoaded] = useState(false);
  const [styleVersion, setStyleVersion] = useState(0);

  // Sync with theme
  useEffect(() => {
    setBasemapMode(theme === 'dark-liquid-glass' ? 'dark' : 'voyager');
  }, [theme]);

  // Extract Coordinates: Origin, Stops, Destination
  const pickup = trip?.pickupCoords || { lat: 40.6413, lng: -73.7781 };
  const destination = trip?.destinationCoords || { lat: 40.7736, lng: -73.9566 };
  const stops = Array.isArray(trip?.stops) ? trip.stops : [];

  // Vehicle Live or simulated coordinates
  const vehicleCoords = vehicle?.coordinates || (trip?.status === 'In Progress' || trip?.status === 'Delayed'
    ? { lat: (pickup.lat + destination.lat) / 2, lng: (pickup.lng + destination.lng) / 2 }
    : null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    let isMounted = true;

    const initialStyle = basemapMode === 'dark' ? CARTO_DARK_STYLE : CARTO_VOYAGER_STYLE;
    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: initialStyle,
      center: [pickup.lng, pickup.lat],
      zoom: 11,
      attributionControl: false
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

    // Auto-resize observer
    const ro = new ResizeObserver(() => {
      if (mapRef.current && isMounted) {
        try {
          mapRef.current.resize();
        } catch (e) {
          // Ignore resize errors during unmount
        }
      }
    });
    ro.observe(mapContainerRef.current);

    return () => {
      isMounted = false;
      ro.disconnect();
      markersRef.current.forEach((m) => {
        try { m.remove(); } catch (e) {}
      });
      markersRef.current = [];
      try {
        map.remove();
      } catch (e) {
        // Safe disposal
      }
      mapRef.current = null;
    };
  }, []);

  // Update style on basemapMode change
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;
    const map = mapRef.current;
    const targetStyle = basemapMode === 'dark' ? CARTO_DARK_STYLE : CARTO_VOYAGER_STYLE;
    try {
      map.setStyle(targetStyle);
    } catch (e) {
      console.warn('Error updating trip map style:', e);
    }
  }, [basemapMode]);

  // Plot Route Line and Waypoints
  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return;
    const map = mapRef.current;

    // Clear existing markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    // Collect all coordinates along the route
    const allPoints = [];

    // 1. Origin Marker
    allPoints.push([pickup.lng, pickup.lat]);
    const originEl = document.createElement('div');
    originEl.className = 'w-7 h-7 rounded-full bg-[#122822] border-2 border-[#10b981] text-[#6ee7b7] flex items-center justify-center font-mono text-xs font-bold shadow-lg';
    originEl.innerText = 'A';
    originEl.title = `Pickup: ${trip?.pickupLocation || 'Origin'}`;
    const originMarker = new maplibregl.Marker({ element: originEl })
      .setLngLat([pickup.lng, pickup.lat])
      .addTo(map);
    markersRef.current.push(originMarker);

    // 2. Intermediate Waypoint Markers
    stops.forEach((stop, i) => {
      const stopCoords = stop.coords || {
        lat: pickup.lat + ((destination.lat - pickup.lat) * (i + 1)) / (stops.length + 1) + 0.01,
        lng: pickup.lng + ((destination.lng - pickup.lng) * (i + 1)) / (stops.length + 1) - 0.01
      };
      allPoints.push([stopCoords.lng, stopCoords.lat]);

      const stopEl = document.createElement('div');
      stopEl.className = 'w-6 h-6 rounded-full bg-[#24212f] border-2 border-[#b49aff] text-[#c4b3ff] flex items-center justify-center font-mono text-[10px] font-bold shadow-lg';
      stopEl.innerText = String(stop.order || i + 1);
      stopEl.title = `Stop ${stop.order || i + 1}: ${stop.locationName || 'Waypoint'}`;
      const stopMarker = new maplibregl.Marker({ element: stopEl })
        .setLngLat([stopCoords.lng, stopCoords.lat])
        .addTo(map);
      markersRef.current.push(stopMarker);
    });

    // 3. Destination Marker
    allPoints.push([destination.lng, destination.lat]);
    const destEl = document.createElement('div');
    destEl.className = 'w-7 h-7 rounded-full bg-[#321719] border-2 border-[#ef4444] text-[#fca5a5] flex items-center justify-center font-mono text-xs font-bold shadow-lg';
    destEl.innerText = 'B';
    destEl.title = `Destination: ${trip?.destinationLocation || 'Destination'}`;
    const destMarker = new maplibregl.Marker({ element: destEl })
      .setLngLat([destination.lng, destination.lat])
      .addTo(map);
    markersRef.current.push(destMarker);

    // 4. Vehicle Position Marker (if active)
    if (vehicleCoords && (trip?.status === 'In Progress' || trip?.status === 'Delayed')) {
      const vehEl = document.createElement('div');
      vehEl.className = 'relative flex items-center justify-center';
      vehEl.innerHTML = `
        <div class="w-8 h-8 rounded-full bg-[#24212f] border-2 border-[#ad91ff] text-[#e9e2ff] flex items-center justify-center shadow-[0_0_12px_rgba(180,154,255,0.6)]">
          <svg class="w-4 h-4 text-[#b49aff] animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"></path>
          </svg>
        </div>
      `;
      const vehMarker = new maplibregl.Marker({ element: vehEl })
        .setLngLat([vehicleCoords.lng, vehicleCoords.lat])
        .addTo(map);
      markersRef.current.push(vehMarker);
    }

    // 5. Draw GeoJSON Route Line
    const routeGeoJson = {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: allPoints
      }
    };

    if (map.getSource('trip-route-line')) {
      map.getSource('trip-route-line').setData(routeGeoJson);
    } else {
      map.addSource('trip-route-line', {
        type: 'geojson',
        data: routeGeoJson
      });

      // Glow layer
      map.addLayer({
        id: 'trip-route-glow',
        type: 'line',
        source: 'trip-route-line',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#b49aff',
          'line-width': 8,
          'line-opacity': 0.25
        }
      });

      // Main route line
      map.addLayer({
        id: 'trip-route-core',
        type: 'line',
        source: 'trip-route-line',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#b49aff',
          'line-width': 3,
          'line-dasharray': [1, 0]
        }
      });
    }

    // Fit map bounds around all points
    try {
      const bounds = new maplibregl.LngLatBounds();
      allPoints.forEach((coord) => bounds.extend(coord));
      map.fitBounds(bounds, {
        padding: 50,
        maxZoom: 13,
        duration: 800
      });
    } catch {
      // Fallback
    }
  }, [mapLoaded, trip, pickup, destination, stops, vehicleCoords, styleVersion]);

  return (
    <div className={`relative w-full rounded-2xl overflow-hidden glass-card border border-white/90 shadow-liquid-subtle ${className}`} style={{ height }}>
      {/* MapLibre DOM Mount Node */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Top Left: DEMO TRACKING MODE Watermark & Status Pill */}
      <div className="absolute top-3 left-3 flex items-center gap-2 z-10 flex-wrap">
        <span className="font-mono text-[10px] font-bold px-2.5 py-1 rounded-xl bg-white/95 text-[#E05252] border border-[#F8DCB0] shadow-xs uppercase tracking-[1px] flex items-center gap-1.5 backdrop-blur-md">
          <span className="w-1.5 h-1.5 rounded-full bg-[#E05252] animate-ping" />
          ROUTE WAYPOINT RADAR
        </span>

        <span className="font-mono text-[10px] px-2.5 py-1 rounded-xl bg-white/95 backdrop-blur-md text-[#172033] border border-white/90 shadow-xs flex items-center gap-1.5 font-bold">
          <Radio className="w-3 h-3 text-[#16A36A]" />
          <span>Telemetry: {trip?.status === 'In Progress' ? 'Broadcasting' : 'Standby'}</span>
        </span>
      </div>

      {/* Top Right: Basemap toggle */}
      <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 bg-white/95 border border-white/90 p-1 rounded-xl backdrop-blur-md shadow-xs">
        <button
          type="button"
          onClick={() => setBasemapMode((prev) => (prev === 'voyager' ? 'dark' : 'voyager'))}
          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
            basemapMode === 'voyager'
              ? 'text-[#2879E8] bg-[#EAF3FF]'
              : 'text-[#68758A] hover:text-[#172033]'
          }`}
          title={basemapMode === 'voyager' ? 'Switch to CARTO Dark Matter' : 'Switch to CARTO Voyager'}
        >
          <Layers className="w-4 h-4" />
        </button>
      </div>

      {/* Bottom Right: Route Waypoint Chips */}
      <div className="absolute bottom-3 right-3 z-10 bg-white/95 backdrop-blur-md border border-white/90 p-2.5 rounded-xl text-[11px] font-mono text-[#475569] space-y-1 shadow-liquid-dropdown">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#16A36A]" />
          <span className="font-bold text-[#0B132B]">Pickup: {trip?.pickupLocation || 'Origin'}</span>
        </div>
        {stops.length > 0 && (
          <div className="flex items-center gap-2 text-[#2879E8]">
            <span className="w-2 h-2 rounded-full bg-[#2879E8]" />
            <span className="font-semibold">{stops.length} Intermediate Waypoint{stops.length > 1 ? 's' : ''}</span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#E05252]" />
          <span className="font-bold text-[#0B132B]">Destination: {trip?.destinationLocation || 'Destination'}</span>
        </div>
      </div>
    </div>
  );
}

