import React, { useState, useEffect, useMemo } from 'react';
import {
  Compass,
  Gauge,
  MapPin,
  User,
  Route,
  Fuel,
  Crosshair,
  AlertTriangle,
  Clock,
  Radio,
  Globe,
  CheckCircle2,
  Check,
  History
} from 'lucide-react';
import StatusBadge from '../common/StatusBadge';
import Button from '../common/Button';
import { reverseGeocode } from '../../services/geocodingService';
import {
  getTrackByName,
  getTrackByVehicle,
  markTrackCompleted
} from '../../services/trackService';

export default function VehicleInfoPanel({
  vehicle,
  onFocusVehicle,
  onViewHistory
}) {
  if (!vehicle) return null;

  const isOverspeed = (vehicle?.speed || 0) > 80;
  const [resolvedAddress, setResolvedAddress] = useState(vehicle?.locationName || '');
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [isOsmVerified, setIsOsmVerified] = useState(false);
  const [trackRefreshKey, setTrackRefreshKey] = useState(0);

  // Subscribe to track updates across app
  useEffect(() => {
    const handleUpdate = () => setTrackRefreshKey((p) => p + 1);
    window.addEventListener('autrail_track_updated', handleUpdate);
    return () => window.removeEventListener('autrail_track_updated', handleUpdate);
  }, []);

  const assignedTrack = useMemo(() => {
    return getTrackByName(vehicle?.assignedRoute) || getTrackByVehicle(vehicle?.plate);
  }, [vehicle?.assignedRoute, vehicle?.plate, trackRefreshKey]);

  const handleMarkTrackComplete = async () => {
    if (!assignedTrack) return;
    try {
      await markTrackCompleted(assignedTrack.id, `Transponder Operator (${vehicle.plate})`);
      setTrackRefreshKey((p) => p + 1);
    } catch (e) {
      console.warn(e);
    }
  };

  // Synchronize location name immediately when vehicle transponder selection changes
  useEffect(() => {
    setResolvedAddress(vehicle?.locationName || '');
    setIsOsmVerified(false);
  }, [vehicle?.plate, vehicle?.locationName]);

  useEffect(() => {
    let isMounted = true;
    if (vehicle?.latitude && vehicle?.longitude) {
      setIsGeocoding(true);
      reverseGeocode(vehicle.latitude, vehicle.longitude)
        .then((res) => {
          if (isMounted) {
            if (res.address) setResolvedAddress(res.address);
            setIsOsmVerified(res.source === 'openstreetmap_nominatim');
            setIsGeocoding(false);
          }
        })
        .catch(() => {
          if (isMounted) setIsGeocoding(false);
        });
    }
    return () => {
      isMounted = false;
    };
  }, [vehicle?.latitude, vehicle?.longitude, vehicle?.plate]);

  return (
    <div className="glass-card rounded-2xl p-5 flex flex-col justify-between text-xs font-sans h-full shadow-liquid-subtle">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between pb-3.5 border-b border-[#E2E8F0]/80">
          <div>
            <span className="font-mono text-[9px] text-[#8A97AB] uppercase tracking-wider block font-semibold">
              Live Transponder Feed
            </span>
            <h3 className="text-base font-bold text-[#172033] m-0 font-mono">
              {vehicle.plate}
            </h3>
            <p className="text-[11px] text-[#68758A] m-0 font-medium">
              {vehicle.model}
            </p>
          </div>

          <div className="flex flex-col items-end gap-1">
            <span
              className={`font-mono text-[10px] font-semibold px-2.5 py-0.5 rounded-full border ${
                vehicle.status === 'moving'
                  ? 'bg-[#E8F7F0] text-[#16A36A] border-[#C2E8D7]'
                  : vehicle.status === 'idle'
                  ? 'bg-[#FEF7EA] text-[#E7A329] border-[#F8DCB0]'
                  : vehicle.status === 'offline'
                  ? 'bg-[#F1F5F9] text-[#8A97AB] border-[#E2E8F0]'
                  : 'bg-[#EAF3FF] text-[#2879E8] border-[#D5E6FB]'
              }`}
            >
              ● {vehicle.status.toUpperCase()}
            </span>
            <span className="font-mono text-[9px] text-[#8A97AB]">
              Updated {vehicle.lastUpdated}
            </span>
          </div>
        </div>

        {/* Overspeed Alert Banner if speed > 80 km/h */}
        {isOverspeed && (
          <div className="mt-3 p-2.5 rounded-xl bg-[#FDF2F2] border border-[#F8D7DA] flex items-center gap-2 text-[#E05252]">
            <AlertTriangle className="w-4 h-4 text-[#E05252] shrink-0" />
            <div className="text-[10px]">
              <b className="block">OVERSPEED THRESHOLD EXCEEDED</b>
              <span>Vehicle traveling at {vehicle.speed} km/h (Limit: 80 km/h).</span>
            </div>
          </div>
        )}

        {/* Telemetry Matrix Grid */}
        <div className="mt-3.5 space-y-2.5">
          {/* Driver Card */}
          <div className="bg-[#F8FAFD] border border-[#E2E8F0] p-3 rounded-xl flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#EAF3FF] text-[#2879E8] flex items-center justify-center border border-[#D5E6FB]">
                <User className="w-4 h-4" />
              </div>
              <div>
                <span className="font-mono text-[8px] text-[#8A97AB] uppercase block font-semibold">
                  Assigned Driver
                </span>
                <b className="text-[#172033] text-xs font-bold">{vehicle.driver}</b>
              </div>
            </div>
            <span className="text-[10px] text-[#68758A] font-mono">{vehicle.driverPhone}</span>
          </div>

          {/* Speed & Heading Sensor Box */}
          <div className="grid grid-cols-2 gap-2.5 font-mono">
            <div className="bg-[#F8FAFD] border border-[#E2E8F0] p-3 rounded-xl shadow-2xs">
              <span className="text-[9px] text-[#8A97AB] uppercase font-semibold flex items-center gap-1">
                <Gauge className="w-3.5 h-3.5 text-[#16A36A]" /> LIVE SPEED
              </span>
              <div className="text-lg font-black text-[#172033] mt-1">
                {vehicle.speed} <small className="text-[10px] font-sans text-[#68758A]">km/h</small>
              </div>
            </div>

            <div className="bg-[#F8FAFD] border border-[#E2E8F0] p-3 rounded-xl shadow-2xs">
              <span className="text-[9px] text-[#8A97AB] uppercase font-semibold flex items-center gap-1">
                <Compass className="w-3.5 h-3.5 text-[#2879E8]" /> BEARING
              </span>
              <div className="text-lg font-black text-[#172033] mt-1">
                {vehicle.headingText || `${vehicle.heading}°`}
              </div>
            </div>
          </div>

          {/* Coordinates Box */}
          <div className="bg-[#F8FAFD] border border-[#E2E8F0] p-3 rounded-xl space-y-1.5 shadow-2xs">
            <div className="flex items-center justify-between font-mono text-[10px]">
              <span className="text-[#8A97AB]">LATITUDE</span>
              <b className="text-[#172033]">{Number(vehicle.latitude).toFixed(6)}°</b>
            </div>
            <div className="flex items-center justify-between font-mono text-[10px]">
              <span className="text-[#8A97AB]">LONGITUDE</span>
              <b className="text-[#172033]">{Number(vehicle.longitude).toFixed(6)}°</b>
            </div>
            <div className="flex items-center justify-between font-mono text-[10px]">
              <span className="text-[#8A97AB]">DAILY MILEAGE</span>
              <b className="text-[#16A36A]">{vehicle.todayDistance || 0} km</b>
            </div>
          </div>

          {/* Geocoded Address Box */}
          <div className="bg-[#F8FAFD] border border-[#E2E8F0] p-3 rounded-xl shadow-2xs">
            <span className="font-mono text-[8px] text-[#8A97AB] uppercase flex items-center justify-between font-semibold">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#2879E8]" /> RESOLVED VICINITY
              </span>
              {isOsmVerified && (
                <span className="text-[#16A36A] flex items-center gap-0.5 font-sans font-bold">
                  <CheckCircle2 className="w-2.5 h-2.5" /> OSM
                </span>
              )}
            </span>
            <p className="text-[11px] text-[#172033] font-medium mt-1 leading-snug">
              {isGeocoding ? 'Resolving address coordinates...' : resolvedAddress || 'Corridor waypoint in transit'}
            </p>
          </div>

          {/* Assigned Corridor / Active Dispatch Track */}
          {assignedTrack && (
            <div className="bg-[#EAF3FF] border border-[#D5E6FB] p-3 rounded-xl shadow-2xs">
              <div className="flex items-center justify-between pb-1">
                <span className="font-mono text-[8px] text-[#2879E8] uppercase flex items-center gap-1 font-bold">
                  <Route className="w-3 h-3 text-[#2879E8]" /> DISPATCH CORRIDOR
                </span>
                <span
                  className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-bold uppercase ${
                    assignedTrack.status === 'completed'
                      ? 'bg-[#E8F7F0] text-[#16A36A]'
                      : 'bg-[#FEF7EA] text-[#E7A329]'
                  }`}
                >
                  {assignedTrack.status}
                </span>
              </div>
              <b className="text-xs text-[#172033] block truncate">{assignedTrack.name}</b>
              <p className="text-[10px] text-[#68758A] mt-0.5 truncate">
                {assignedTrack.origin} ➔ {assignedTrack.destination}
              </p>
              {assignedTrack.status !== 'completed' && (
                <button
                  type="button"
                  onClick={handleMarkTrackComplete}
                  className="mt-2 w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-[#2879E8] hover:bg-[#1765CC] text-white text-[11px] font-bold shadow-2xs transition-colors cursor-pointer"
                >
                  <Check className="w-3 h-3" />
                  Mark Route Complete
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer Action Buttons */}
      <div className="pt-3.5 border-t border-[#E2E8F0]/80 flex items-center gap-2.5 mt-3">
        <Button
          variant="default"
          size="sm"
          className="flex-1"
          onClick={onFocusVehicle}
          icon={Crosshair}
        >
          Center View
        </Button>
        <Button
          variant="primary"
          size="sm"
          className="flex-1"
          onClick={onViewHistory}
          icon={History}
        >
          Playback
        </Button>
      </div>
    </div>
  );
}
