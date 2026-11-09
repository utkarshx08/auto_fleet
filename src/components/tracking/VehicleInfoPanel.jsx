import React, { useState, useEffect } from 'react';
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
  Globe
} from 'lucide-react';
import StatusBadge from '../common/StatusBadge';
import Button from '../common/Button';
import { reverseGeocode } from '../../services/geocodingService';

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
    <div className="bg-[#17191f] border border-[#292c35] rounded-[10px] p-4 flex flex-col justify-between text-xs font-sans h-full">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-[#252730]">
          <div>
            <span className="font-mono text-[9px] text-[#858894] uppercase tracking-wider block">
              Live Transponder Feed
            </span>
            <h3 className="text-base font-bold text-[#f0f0f4] m-0 font-mono">
              {vehicle.plate}
            </h3>
            <p className="text-[10px] text-[#888b97] m-0 font-medium">
              {vehicle.model}
            </p>
          </div>

          <div className="flex flex-col items-end gap-1">
            <span
              className={`font-mono text-[9px] px-2 py-0.5 rounded-full border ${
                vehicle.status === 'moving'
                  ? 'bg-[#1c302a] text-[#83d7a9] border-[#2c493d]'
                  : vehicle.status === 'idle'
                  ? 'bg-[#382c25] text-[#e5a46e] border-[#523d30]'
                  : vehicle.status === 'offline'
                  ? 'bg-[#20222a] text-[#747783] border-[#30333d]'
                  : 'bg-[#24212f] text-[#a5a7b0] border-[#353242]'
              }`}
            >
              ● {vehicle.status.toUpperCase()}
            </span>
            <span className="font-mono text-[8px] text-[#717480]">
              Updated {vehicle.lastUpdated}
            </span>
          </div>
        </div>

        {/* Overspeed Alert Banner if speed > 80 km/h */}
        {isOverspeed && (
          <div className="mt-3 p-2.5 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center gap-2 text-red-300">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
            <div className="text-[10px]">
              <b className="block">OVERSPEED THRESHOLD EXCEEDED</b>
              <span>Vehicle traveling at {vehicle.speed} km/h (Limit: 80 km/h).</span>
            </div>
          </div>
        )}

        {/* Telemetry Matrix Grid */}
        <div className="mt-3.5 space-y-2.5">
          {/* Driver Card */}
          <div className="bg-[#121319] border border-[#242630] p-2.5 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User className="w-3.5 h-3.5 text-[#b49aff]" />
              <div>
                <span className="font-mono text-[8px] text-[#747783] uppercase block">
                  Assigned Driver
                </span>
                <b className="text-[#d1d1da] text-xs font-semibold">{vehicle.driver}</b>
              </div>
            </div>
            <span className="text-[9px] text-[#858894] font-mono">{vehicle.driverPhone}</span>
          </div>

          {/* Speed & Heading 2-col */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-[#121319] border border-[#242630] p-2.5 rounded-lg">
              <span className="font-mono text-[8px] text-[#747783] uppercase block flex items-center gap-1">
                <Gauge className="w-3 h-3 text-[#8dc8ed]" /> Current Speed
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <b className={`text-xl font-bold font-mono ${isOverspeed ? 'text-red-400' : 'text-[#f0f0f4]'}`}>
                  {vehicle.speed}
                </b>
                <small className="text-[9px] text-[#747783] font-mono">km/h</small>
              </div>
            </div>

            <div className="bg-[#121319] border border-[#242630] p-2.5 rounded-lg">
              <span className="font-mono text-[8px] text-[#747783] uppercase block flex items-center gap-1">
                <Compass className="w-3 h-3 text-[#b49aff]" /> Bearing / Heading
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <b className="text-xs font-bold font-mono text-[#e0e0e7]">
                  {vehicle.headingText || `${vehicle.heading}°`}
                </b>
              </div>
            </div>
          </div>

          {/* GPS Coordinates & Reverse Geocoded Street Address */}
          <div className="bg-[#121319] border border-[#242630] p-2.5 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[8px] text-[#747783] uppercase flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#8be0b3]" /> Physical Street Address
              </span>
              {isOsmVerified && (
                <span className="text-[9px] font-mono text-[#8be0b3] bg-[#8be0b3]/10 px-1.5 py-0.5 rounded border border-[#8be0b3]/20 flex items-center gap-1">
                  <Globe className="w-2.5 h-2.5" />
                  <span>OSM Geocoded</span>
                </span>
              )}
            </div>
            <b className="text-xs text-[#d1d1da] block mt-1 leading-snug">
              {resolvedAddress || vehicle.locationName}
            </b>
            <div className="flex items-center gap-3 text-[9px] text-[#747783] font-mono mt-2 pt-1.5 border-t border-[#20222a]">
              <span>
                LAT: {!isNaN(Number(vehicle.latitude)) && Number(vehicle.latitude) !== 0
                  ? `${Math.abs(Number(vehicle.latitude)).toFixed(4)}° ${Number(vehicle.latitude) >= 0 ? 'N' : 'S'}`
                  : '—'}
              </span>
              <span>
                LNG: {!isNaN(Number(vehicle.longitude)) && Number(vehicle.longitude) !== 0
                  ? `${Math.abs(Number(vehicle.longitude)).toFixed(4)}° ${Number(vehicle.longitude) >= 0 ? 'E' : 'W'}`
                  : '—'}
              </span>
              <span className="ml-auto text-[#8be0b3] font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8be0b3] beacon-pulse" />
                {vehicle.gpsAccuracy || 'GPS: Optimal (0.8m)'}
              </span>
            </div>
          </div>

          {/* Route & Distance Today */}
          <div className="bg-[#121319] border border-[#242630] p-2.5 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-mono text-[8px] text-[#747783] uppercase block flex items-center gap-1">
                  <Route className="w-3 h-3 text-[#c4b3ff]" /> Assigned Route Corridor
                </span>
                <b className="text-[11px] text-[#d1d1da] block mt-0.5">{vehicle.assignedRoute}</b>
              </div>
              <div className="text-right">
                <span className="font-mono text-[8px] text-[#747783] uppercase block">
                  Today's Mileage
                </span>
                <span className="font-mono text-xs font-bold text-[#80d9a9]">
                  {vehicle.todayDistance} km
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-3 border-t border-[#252730] flex items-center gap-2 mt-4">
        <Button
          variant="default"
          size="sm"
          onClick={onFocusVehicle}
          icon={Crosshair}
          className="flex-1"
        >
          Center on Map
        </Button>
        <Button
          variant="primary"
          size="sm"
          onClick={onViewHistory}
          className="flex-1 font-semibold"
        >
          Replay Journey
        </Button>
      </div>
    </div>
  );
}

