// ============================================================================
// AUTRAIL LIVE DEVICE GPS TRANSPONDER BROADCASTER
// Uses browser navigator.geolocation.watchPosition to broadcast real physical coordinates
// from a smartphone or laptop directly into the AUTRAIL Ingestion Gateway
// ============================================================================

import React, { useState, useEffect, useRef } from 'react';
import {
  Smartphone,
  Radio,
  X,
  Play,
  Square,
  CheckCircle,
  AlertTriangle,
  Compass,
  Gauge,
  MapPin,
  Wifi,
  ExternalLink,
  Shield
} from 'lucide-react';
import { sendLocationTelemetry } from '../../services/gpsIngestionService';

export default function MobileGpsBroadcasterModal({
  isOpen,
  onClose,
  vehicles = [],
  onLocationBroadcasted
}) {
  if (!isOpen) return null;

  const [selectedVehicleId, setSelectedVehicleId] = useState(vehicles[0]?.plate || 'RST-291');
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [deviceCoords, setDeviceCoords] = useState(null);
  const [packetsSent, setPacketsSent] = useState(0);
  const [lastResponse, setLastResponse] = useState(null);
  const [geoError, setGeoError] = useState('');
  const [permissionState, setPermissionState] = useState('prompt'); // 'granted', 'denied', 'prompt'

  const watchIdRef = useRef(null);
  const throttleTimerRef = useRef(null);

  // Check Geolocation Support
  const isGeoSupported = typeof window !== 'undefined' && 'geolocation' in navigator;

  // Cleanup on unmount or close
  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
      if (throttleTimerRef.current) {
        clearInterval(throttleTimerRef.current);
      }
    };
  }, []);

  const handleStartBroadcasting = () => {
    if (!isGeoSupported) {
      setGeoError('HTML5 Geolocation API is not supported in this browser.');
      return;
    }

    setGeoError('');
    setIsBroadcasting(true);

    // Start watching position
    watchIdRef.current = navigator.geolocation.watchPosition(
      async (pos) => {
        const coords = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: pos.coords.accuracy, // meters
          speed: pos.coords.speed != null ? Math.round(pos.coords.speed * 3.6) : 0, // m/s to km/h
          heading: pos.coords.heading != null ? Math.round(pos.coords.heading) : 0,
          timestamp: new Date(pos.timestamp).toISOString()
        };

        setDeviceCoords(coords);
        setPermissionState('granted');

        // Transmit telemetry packet to backend API
        try {
          const payload = {
            vehicle_id: selectedVehicleId,
            latitude: coords.latitude,
            longitude: coords.longitude,
            speed: coords.speed,
            heading: coords.heading,
            recorded_at: coords.timestamp,
            source: 'hardware_mobile'
          };

          const res = await sendLocationTelemetry(payload);
          setLastResponse(res);
          setPacketsSent((prev) => prev + 1);

          if (onLocationBroadcasted) {
            onLocationBroadcasted(payload);
          }
        } catch (err) {
          console.error('Mobile telemetry transmission error:', err);
          setLastResponse({ success: false, message: err.message });
        }
      },
      (err) => {
        console.warn('Geolocation access error:', err.message);
        if (err.code === 1) {
          setGeoError('GPS Location permission denied. Please allow location permissions in your browser bar.');
          setPermissionState('denied');
        } else if (err.code === 2) {
          setGeoError('Position unavailable. Ensure your device GPS/Location sensor is enabled.');
        } else {
          setGeoError(err.message || 'GPS Signal Timeout.');
        }
        setIsBroadcasting(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const handleStopBroadcasting = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setIsBroadcasting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#17191f] border border-[#2b2e38] rounded-xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#252730] bg-[#13141a]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#8be0b3]/10 border border-[#8be0b3]/20 flex items-center justify-center text-[#8be0b3]">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#f4f3f8] flex items-center gap-2">
                <span>Phone / Browser GPS Transponder</span>
                {isBroadcasting && (
                  <span className="w-2 h-2 rounded-full bg-[#8be0b3] animate-ping" />
                )}
              </h2>
              <p className="text-[11px] text-[#8b8d98]">
                Broadcast your physical device coordinates live to the fleet map
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              handleStopBroadcasting();
              onClose();
            }}
            className="p-1.5 text-[#8b8d98] hover:text-[#f4f3f8] rounded-lg hover:bg-[#22242d] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs font-mono">
          {/* Instructions Banner */}
          <div className="p-3 bg-[#101116] border border-[#252730] rounded-lg text-[#8b8d98] text-[11px] leading-relaxed">
            <div className="flex items-center gap-2 text-[#f4f3f8] font-bold mb-1">
              <Radio className="w-3.5 h-3.5 text-[#b49aff]" />
              <span>How Mobile Live Tracking Works</span>
            </div>
            <span>
              This feature reads your phone or laptop's physical GPS chip via <code className="text-[#8be0b3]">HTML5 Geolocation</code> and streams live coordinates to <code className="text-[#b49aff]">POST /api/tracking/location</code>. As you walk or drive, the vehicle marker moves on the map in real time!
            </span>
          </div>

          {/* Target Vehicle Selector */}
          <div>
            <label className="block text-[11px] text-[#8b8d98] mb-1.5 uppercase">
              BIND BROADCAST TO VEHICLE TRANSPONDER:
            </label>
            <select
              value={selectedVehicleId}
              disabled={isBroadcasting}
              onChange={(e) => setSelectedVehicleId(e.target.value)}
              className="w-full bg-[#101116] border border-[#2b2e38] rounded-lg px-3 py-2 text-xs text-[#f4f3f8] focus:outline-none focus:border-[#b49aff] disabled:opacity-50"
            >
              {vehicles.map((v) => (
                <option key={v.vehicleId || v.plate} value={v.vehicleId || v.plate}>
                  {v.plate} — {v.model} ({v.driver})
                </option>
              ))}
            </select>
          </div>

          {/* Error Notice */}
          {geoError && (
            <div className="p-3 bg-[#ef4444]/10 border border-[#ef4444]/30 rounded-lg text-[#fca5a5] text-[11px] flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[#ef4444] shrink-0" />
              <span>{geoError}</span>
            </div>
          )}

          {/* Telemetry Telemetry HUD */}
          {deviceCoords ? (
            <div className="bg-[#101116] border border-[#252730] p-3.5 rounded-lg space-y-2.5">
              <div className="flex items-center justify-between pb-2 border-b border-[#20222a]">
                <span className="text-[#8be0b3] font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#8be0b3] animate-pulse" />
                  PHYSICAL SENSOR LOCKED
                </span>
                <span className="text-[#b49aff] font-bold">
                  {packetsSent} PACKETS TRANSMITTED
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="bg-[#17191f] p-2 rounded border border-[#20222a]">
                  <span className="text-[#71737e] block text-[9px]">DEVICE LATITUDE</span>
                  <span className="text-[#f4f3f8] font-bold">{deviceCoords.latitude.toFixed(6)}°</span>
                </div>
                <div className="bg-[#17191f] p-2 rounded border border-[#20222a]">
                  <span className="text-[#71737e] block text-[9px]">DEVICE LONGITUDE</span>
                  <span className="text-[#f4f3f8] font-bold">{deviceCoords.longitude.toFixed(6)}°</span>
                </div>
                <div className="bg-[#17191f] p-2 rounded border border-[#20222a]">
                  <span className="text-[#71737e] block text-[9px]">SPEED</span>
                  <span className="text-[#8be0b3] font-bold">{deviceCoords.speed} km/h</span>
                </div>
                <div className="bg-[#17191f] p-2 rounded border border-[#20222a]">
                  <span className="text-[#71737e] block text-[9px]">GPS ACCURACY</span>
                  <span className="text-[#e5a46e] font-bold">±{Math.round(deviceCoords.accuracy)} meters</span>
                </div>
              </div>

              {lastResponse && (
                <div className="p-2 bg-[#17191f] rounded border border-[#20222a] text-[10px] text-[#8b8d98] flex items-center justify-between">
                  <span>Server Ingestion Gateway:</span>
                  <span className={lastResponse.success ? 'text-[#8be0b3] font-bold' : 'text-[#ef4444]'}>
                    {lastResponse.success ? 'HTTP 200 OK (Ingested)' : 'Error Sending'}
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 bg-[#101116] border border-[#20222a] rounded-lg text-center text-[#71737e]">
              Transponder is idle. Click "Start Live Broadcast" below to activate your sensor.
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-[#252730] bg-[#13141a] flex items-center justify-between">
          <div className="text-[11px] font-mono text-[#71737e]">
            Gateway: <code className="text-[#b49aff]">/api/tracking/location</code>
          </div>

          <div className="flex items-center gap-2">
            {!isBroadcasting ? (
              <button
                type="button"
                onClick={handleStartBroadcasting}
                className="px-4 py-2 rounded-lg bg-[#8be0b3] hover:bg-[#7ad0a0] text-[#13141a] font-bold font-mono text-xs transition-all flex items-center gap-2 shadow-[0_0_12px_rgba(139,224,179,0.3)]"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>START LIVE BROADCAST</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleStopBroadcasting}
                className="px-4 py-2 rounded-lg bg-[#ef4444] hover:bg-[#dc2626] text-white font-bold font-mono text-xs transition-all flex items-center gap-2 shadow-[0_0_12px_rgba(239,68,68,0.3)]"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
                <span>STOP BROADCAST</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

