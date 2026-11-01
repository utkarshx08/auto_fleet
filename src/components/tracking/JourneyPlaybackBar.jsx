import React from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  FastForward,
  Milestone,
  Gauge,
  Clock,
  MapPin,
  Calendar,
  X
} from 'lucide-react';
import Button from '../common/Button';

export default function JourneyPlaybackBar({
  isPlaying,
  playbackSpeed,
  currentWaypointIndex,
  totalWaypoints,
  journeyData,
  playbackDate,
  onDateChange,
  onPlay,
  onPause,
  onResume,
  onReset,
  onSpeedChange,
  onSliderChange,
  onClose,
  vehicles = [],
  onSelectVehicleForPlayback
}) {
  if (!journeyData) return null;

  const currentWaypoint = journeyData.waypoints[currentWaypointIndex] || journeyData.waypoints[0];
  const progressPercent = totalWaypoints > 1 ? (currentWaypointIndex / (totalWaypoints - 1)) * 100 : 0;

  return (
    <div className="bg-[#17191f] border border-[#292c35] rounded-[10px] p-4 text-xs font-sans space-y-3 shadow-2xl animate-in fade-in slide-in-from-top-2">
      {/* Playback Header with Selectors */}
      <div className="flex items-center justify-between pb-3 border-b border-[#252730] flex-wrap gap-2">
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="font-mono text-[9px] px-2 py-0.5 rounded bg-[#24212f] text-[#c4b3ff] border border-[#40375b]">
            HISTORICAL PLAYBACK
          </span>

          {/* Vehicle Selector */}
          <select
            value={journeyData.vehicleId}
            onChange={(e) => onSelectVehicleForPlayback && onSelectVehicleForPlayback(e.target.value)}
            className="bg-[#20222a] border border-[#30333d] focus:border-[#b49aff] rounded-[6px] px-2 py-1 text-xs text-[#eee] outline-none font-mono cursor-pointer"
          >
            {vehicles.map((v) => (
              <option key={v.vehicleId || v.id} value={v.vehicleId || v.id}>
                {v.plate} ({v.model})
              </option>
            ))}
          </select>

          {/* Date Selector */}
          <div className="flex items-center gap-1 bg-[#20222a] border border-[#30333d] rounded-[6px] px-2 py-1 text-xs text-[#d1d1da]">
            <Calendar className="w-3 h-3 text-[#858894]" />
            <input
              type="date"
              value={playbackDate}
              onChange={(e) => onDateChange && onDateChange(e.target.value)}
              className="bg-transparent border-0 outline-none font-mono text-[11px] text-[#eee] cursor-pointer"
            />
          </div>
        </div>

        {/* Journey Aggregated Metrics */}
        <div className="flex items-center gap-3 text-[10px] font-mono text-[#858894]">
          <span>Route: <b className="text-[#d1d1da]">{journeyData.routeName}</b></span>
          <span>Distance: <b className="text-[#f0f0f4]">{journeyData.totalDistance} km</b></span>
          <span>Avg: <b className="text-[#8be0b3]">{journeyData.averageSpeed} km/h</b></span>
          <span>Max: <b className="text-[#e5a46e]">{journeyData.maximumSpeed} km/h</b></span>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded text-[#747783] hover:text-white hover:bg-[#20222a] transition-colors ml-2"
            title="Exit playback mode"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Start / End Points Label */}
      <div className="flex items-center justify-between text-[10px] text-[#717480] font-mono">
        <span className="flex items-center gap-1">
          <MapPin className="w-3 h-3 text-[#8be0b3]" /> Start: {journeyData.startPoint?.location} ({journeyData.startTime})
        </span>
        <span className="flex items-center gap-1">
          <MapPin className="w-3 h-3 text-[#b49aff]" /> Destination: {journeyData.endPoint?.location} ({journeyData.endTime})
        </span>
      </div>

      {/* Timeline Scrubber */}
      <div className="space-y-1">
        <div className="flex items-center justify-between font-mono text-[9px] text-[#717480]">
          <span>Waypoint {currentWaypointIndex + 1} of {totalWaypoints}</span>
          <span className="text-[#b49aff] font-bold">{currentWaypoint.time}</span>
          <span>{currentWaypoint.location}</span>
        </div>

        <div className="relative flex items-center">
          <input
            type="range"
            min={0}
            max={totalWaypoints - 1}
            value={currentWaypointIndex}
            onChange={(e) => onSliderChange(Number(e.target.value))}
            className="w-full h-1.5 bg-[#252733] rounded-lg appearance-none cursor-pointer accent-[#b49aff]"
          />
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center justify-between pt-1">
        {/* Play / Pause / Resume / Restart */}
        <div className="flex items-center gap-2">
          {isPlaying ? (
            <Button variant="primary" size="sm" onClick={onPause} icon={Pause}>
              Pause
            </Button>
          ) : (
            <Button variant="primary" size="sm" onClick={onResume || onPlay} icon={Play}>
              Resume Journey
            </Button>
          )}

          <Button variant="quiet" size="sm" onClick={onReset} icon={RotateCcw}>
            Restart
          </Button>
        </div>

        {/* Speed Controls: 1x, 2x, 5x */}
        <div className="flex items-center gap-1 bg-[#121319] border border-[#252730] p-0.5 rounded-lg text-[10px] font-mono">
          <span className="text-[#717480] px-2">Speed:</span>
          {[1, 2, 5].map((spd) => (
            <button
              key={spd}
              type="button"
              onClick={() => onSpeedChange(spd)}
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

        {/* Live Waypoint Telemetry Tag */}
        <div className="flex items-center gap-3 text-[10px] font-mono text-[#aeb0ba]">
          <span>SPEED: <b className="text-[#f0f0f4]">{currentWaypoint.speed} km/h</b></span>
          <span>HEADING: <b className="text-[#b49aff]">{currentWaypoint.heading}°</b></span>
        </div>
      </div>
    </div>
  );
}
