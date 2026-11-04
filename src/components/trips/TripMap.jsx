import React, { useEffect, useRef, useState } from 'react';
import * as maplibregl from 'maplibre-gl';
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

export default function TripMap({
  trip,
  vehicle = null,
  height = '420px',
  className = ''
}) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const [mapLoaded, setMapLoaded] = useState(false);

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

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: DARK_MAP_STYLE,
      center: [pickup.lng, pickup.lat],
      zoom: 11,
      attributionControl: false
    });

    map.on('load', () => {
      mapRef.current = map;
      setMapLoaded(true);
      map.resize();
    });

    return () => {
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      map.remove();
      mapRef.current = null;
    };
  }, []);

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
    originEl.title = `Pickup: ${trip.pickupLocation}`;
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
      stopEl.title = `Stop ${stop.order || i + 1}: ${stop.locationName}`;
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
    destEl.title = `Destination: ${trip.destinationLocation}`;
    const destMarker = new maplibregl.Marker({ element: destEl })
      .setLngLat([destination.lng, destination.lat])
      .addTo(map);
    markersRef.current.push(destMarker);

    // 4. Vehicle Position Marker (if active)
    if (vehicleCoords && (trip.status === 'In Progress' || trip.status === 'Delayed')) {
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
  }, [mapLoaded, trip, pickup, destination, stops, vehicleCoords]);

  return (
    <div className={`relative w-full rounded-[10px] overflow-hidden border border-[#292c35] ${className}`} style={{ height }}>
      {/* MapLibre DOM Mount Node */}
      <div ref={mapContainerRef} className="w-full h-full bg-[#101116]" />

      {/* Top Left: DEMO TRACKING MODE Watermark & Status Pill */}
      <div className="absolute top-3 left-3 flex items-center gap-2 z-10 flex-wrap">
        <span className="font-mono text-[10px] font-bold px-2 py-1 rounded bg-[#241a1c] text-[#f87171] border border-[#522931] shadow-lg uppercase tracking-[1px] flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#ef4444] animate-ping" />
          DEMO TRACKING MODE
        </span>

        <span className="font-mono text-[10px] px-2 py-1 rounded bg-[#17191f]/90 backdrop-blur-md text-[#d4d4dc] border border-[#2b2e38] shadow-lg flex items-center gap-1.5">
          <Radio className="w-3 h-3 text-[#10b981]" />
          <span>Telemetry: {trip.status === 'In Progress' ? 'Broadcasting' : 'Standby'}</span>
        </span>
      </div>

      {/* Bottom Right: Route Waypoint Chips */}
      <div className="absolute bottom-3 right-3 z-10 bg-[#121319]/90 backdrop-blur-md border border-[#272935] p-2.5 rounded-[8px] text-[11px] font-mono text-[#a0a3b1] space-y-1 shadow-xl">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#10b981]" />
          <span>Pickup: {trip.pickupLocation}</span>
        </div>
        {stops.length > 0 && (
          <div className="flex items-center gap-2 text-[#c4b3ff]">
            <span className="w-2 h-2 rounded-full bg-[#b49aff]" />
            <span>{stops.length} Intermediate Waypoint{stops.length > 1 ? 's' : ''}</span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#ef4444]" />
          <span>Destination: {trip.destinationLocation}</span>
        </div>
      </div>
    </div>
  );
}
