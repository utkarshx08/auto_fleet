import React, { useState, useEffect, useRef } from 'react';
import InteractiveTrackingMap from './InteractiveTrackingMap';
import Button from '../common/Button';
import {
  Calendar,
  Clock,
  Play,
  Pause,
  RotateCcw,
  Gauge,
  Milestone,
  MapPin,
  TrendingUp,
  FastForward,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { getHistoricalJourney } from '../../services/trackingHistoryService';

export default function JourneyHistoryView({
  vehicles = [],
  selectedVehicleId,
  onSelectVehicle
}) {
  const [vehicleId, setVehicleId] = useState(selectedVehicleId || vehicles[0]?.plate || 'RST-291');
  const [selectedDate, setSelectedDate] = useState('2025-10-24');
  const [startTime, setStartTime] = useState('08:00');
  const [endTime, setEndTime] = useState('18:00');

  // Load journey data for current selection
  const [journeyData, setJourneyData] = useState(() =>
    getHistoricalJourney({ vehicleId: selectedVehicleId || 'RST-291', date: '2025-10-24' })
  );

  // Playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [waypointIndex, setWaypointIndex] = useState(0);

  const timerRef = useRef(null);

  // When vehicle or date changes, refresh journey data
  useEffect(() => {
    const data = getHistoricalJourney({ vehicleId, date: selectedDate });
    setJourneyData(data);
    setWaypointIndex(0);
    setIsPlaying(false);
  }, [vehicleId, selectedDate]);

  const totalWaypoints = journeyData.waypoints.length;
  const currentWaypoint = journeyData.waypoints[waypointIndex] || journeyData.waypoints[0];

  // Playback ticker
  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    const intervalMs = Math.max(200, 1500 / playbackSpeed);

    timerRef.current = setInterval(() => {
      setWaypointIndex((prev) => {
        if (prev >= totalWaypoints - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, intervalMs);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, playbackSpeed, totalWaypoints]);

  // Build simulated moving marker telemetry list for the map
  const activeTelemetryOnMap = [
    {
      vehicleId: journeyData.vehicleId,
      plate: journeyData.vehicleId,
      model: 'Commercial Transit',
      latitude: currentWaypoint.lat,
      longitude: currentWaypoint.lng,
      speed: currentWaypoint.speed,
      heading: currentWaypoint.heading,
      status: currentWaypoint.speed > 5 ? 'moving' : 'idle',
      lastUpdated: currentWaypoint.time,
      locationName: currentWaypoint.location
    }
  ];

  // Path coordinates up to the current scrubber index
  const visiblePath = journeyData.waypoints.slice(0, waypointIndex + 1);

  return (
    <div className="space-y-4">
      {/* Configuration & Filter Bar */}
      <div className="bg-[#17191f] border border-[#292c35] p-4 rounded-[10px] flex items-center justify-between gap-4 max-md:flex-col max-md:items-stretch">
        <div className="flex items-center gap-3 flex-wrap">
          {/* Vehicle Selection */}
          <div>
            <label className="font-mono text-[9px] text-[#858894] uppercase block mb-1">
              Select Fleet Vehicle
            </label>
            <select
              value={vehicleId}
              onChange={(e) => {
                setVehicleId(e.target.value);
                if (onSelectVehicle) onSelectVehicle(e.target.value);
              }}
              className="bg-[#20222a] border border-[#30333d] focus:border-[#b49aff] rounded-[6px] px-2.5 py-1.5 text-xs text-[#eee] outline-none font-mono cursor-pointer"
            >
              {vehicles.map((v) => (
                <option key={v.id || v.plate} value={v.plate || v.id}>
                  {v.plate} ({v.model})
                </option>
              ))}
            </select>
          </div>

          {/* Date Picker */}
          <div>
            <label className="font-mono text-[9px] text-[#858894] uppercase block mb-1">
              Journey Date
            </label>
            <div className="flex items-center gap-1.5 bg-[#20222a] border border-[#30333d] rounded-[6px] px-2.5 py-1 text-xs text-[#d1d1da]">
              <Calendar className="w-3.5 h-3.5 text-[#858894]" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-transparent border-0 outline-none font-mono text-xs text-[#eee] cursor-pointer"
              />
            </div>
          </div>

          {/* Time Range Selectors */}
          <div>
            <label className="font-mono text-[9px] text-[#858894] uppercase block mb-1">
              Time Window
            </label>
            <div className="flex items-center gap-1 text-xs font-mono text-[#aeb0ba]">
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="bg-[#20222a] border border-[#30333d] rounded-[6px] px-2 py-1 text-xs text-[#eee] outline-none cursor-pointer"
              />
              <span className="text-[#555]">—</span>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="bg-[#20222a] border border-[#30333d] rounded-[6px] px-2 py-1 text-xs text-[#eee] outline-none cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Quick route badge */}
        <div className="text-right max-md:text-left">
          <span className="font-mono text-[9px] text-[#858894] uppercase block">Assigned Corridor</span>
          <b className="font-mono text-xs text-[#b49aff]">{journeyData.routeName}</b>
        </div>
      </div>

      {/* Aggregate Journey Metrics Cards */}
      <div className="grid grid-cols-5 max-lg:grid-cols-3 max-sm:grid-cols-2 gap-3">
        <div className="bg-[#17191f] border border-[#292c35] p-3 rounded-[9px]">
          <span className="font-mono text-[9px] text-[#858894] uppercase block">Total Distance</span>
          <p className="text-lg font-bold font-mono text-[#f0f0f4] my-1">
            {journeyData.totalDistance} <small className="text-[10px] text-[#888b97]">km</small>
          </p>
          <span className="text-[9px] text-[#717480] font-mono">Verified GPS trajectory</span>
        </div>

        <div className="bg-[#17191f] border border-[#292c35] p-3 rounded-[9px]">
          <span className="font-mono text-[9px] text-[#858894] uppercase block">Average Velocity</span>
          <p className="text-lg font-bold font-mono text-[#8be0b3] my-1">
            {journeyData.averageSpeed} <small className="text-[10px] text-[#888b97]">km/h</small>
          </p>
          <span className="text-[9px] text-[#717480] font-mono">Moving speed average</span>
        </div>

        <div className="bg-[#17191f] border border-[#292c35] p-3 rounded-[9px]">
          <span className="font-mono text-[9px] text-[#858894] uppercase block">Peak Velocity</span>
          <p className="text-lg font-bold font-mono text-[#e5a46e] my-1">
            {journeyData.maximumSpeed} <small className="text-[10px] text-[#888b97]">km/h</small>
          </p>
          <span className="text-[9px] text-[#717480] font-mono">Max recorded telemetry</span>
        </div>

        <div className="bg-[#17191f] border border-[#292c35] p-3 rounded-[9px]">
          <span className="font-mono text-[9px] text-[#858894] uppercase block">Trip Start</span>
          <p className="text-xs font-bold text-[#f0f0f4] my-1 truncate">
            {journeyData.startPoint?.location}
          </p>
          <span className="text-[9px] text-[#858894] font-mono">Departed: {journeyData.startTime}</span>
        </div>

        <div className="bg-[#17191f] border border-[#292c35] p-3 rounded-[9px]">
          <span className="font-mono text-[9px] text-[#858894] uppercase block">Trip Destination</span>
          <p className="text-xs font-bold text-[#b49aff] my-1 truncate">
            {journeyData.endPoint?.location}
          </p>
          <span className="text-[9px] text-[#858894] font-mono">Arrived: {journeyData.endTime}</span>
        </div>
      </div>

      {/* Historical Interactive Map View */}
      <InteractiveTrackingMap
        vehicles={activeTelemetryOnMap}
        selectedVehicleId={journeyData.vehicleId}
        historicalPath={visiblePath}
        showRouteLine={true}
      />

      {/* Interactive Journey Playback Scrubber Bar */}
      <div className="bg-[#17191f] border border-[#292c35] rounded-[10px] p-4 text-xs font-sans space-y-3">
        {/* Scrubber Status & Timeline */}
        <div className="flex items-center justify-between font-mono text-[10px] text-[#858894]">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#b49aff] beacon-pulse" />
            Waypoint <b>{waypointIndex + 1}</b> of {totalWaypoints}
          </span>
          <span className="text-[#f0f0f4] font-bold">
            Timestamp: {currentWaypoint.time}
          </span>
          <span className="text-[#aeb0ba] truncate max-w-xs">
            {currentWaypoint.location}
          </span>
        </div>

        {/* Timeline Slider */}
        <div className="relative flex items-center">
          <input
            type="range"
            min={0}
            max={totalWaypoints - 1}
            value={waypointIndex}
            onChange={(e) => setWaypointIndex(Number(e.target.value))}
            className="w-full h-2 bg-[#252733] rounded-lg appearance-none cursor-pointer accent-[#b49aff]"
          />
        </div>

        {/* Playback Controls & Telemetry Readout */}
        <div className="flex items-center justify-between pt-1 flex-wrap gap-3">
          <div className="flex items-center gap-2">
            {isPlaying ? (
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsPlaying(false)}
                icon={Pause}
              >
                Pause
              </Button>
            ) : (
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  if (waypointIndex >= totalWaypoints - 1) {
                    setWaypointIndex(0);
                  }
                  setIsPlaying(true);
                }}
                icon={Play}
              >
                {waypointIndex >= totalWaypoints - 1 ? 'Replay From Start' : 'Play Journey'}
              </Button>
            )}

            <Button
              variant="quiet"
              size="sm"
              onClick={() => {
                setWaypointIndex(0);
                setIsPlaying(true);
              }}
              icon={RotateCcw}
            >
              Restart
            </Button>
          </div>

          {/* Speed Multipliers */}
          <div className="flex items-center gap-1 bg-[#121319] border border-[#252730] p-0.5 rounded-lg text-[10px] font-mono">
            <span className="text-[#717480] px-2">Speed:</span>
            {[1, 2, 5].map((spd) => (
              <button
                key={spd}
                type="button"
                onClick={() => setPlaybackSpeed(spd)}
                className={`px-2.5 py-0.5 rounded transition-colors ${
                  playbackSpeed === spd
                    ? 'bg-[#40375b] text-[#c4b3ff] font-bold'
                    : 'text-[#858894] hover:text-[#d1d1da]'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>

          {/* Live Waypoint Telemetry */}
          <div className="flex items-center gap-3 text-[10px] font-mono text-[#aeb0ba]">
            <span>SPEED: <b className="text-[#f0f0f4]">{currentWaypoint.speed} km/h</b></span>
            <span>BEARING: <b className="text-[#b49aff]">{currentWaypoint.heading}°</b></span>
            <span>COORDINATES: <b className="text-[#8be0b3]">{currentWaypoint.lat.toFixed(4)}, {currentWaypoint.lng.toFixed(4)}</b></span>
          </div>
        </div>
      </div>
    </div>
  );
}

