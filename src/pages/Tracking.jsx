import React, { useState } from 'react';
import useRealtimeTracking from '../hooks/useRealtimeTracking';
import TrackingKPIGrid from '../components/tracking/TrackingKPIGrid';
import InteractiveTrackingMap from '../components/tracking/InteractiveTrackingMap';
import VehicleInfoPanel from '../components/tracking/VehicleInfoPanel';
import JourneyPlaybackBar from '../components/tracking/JourneyPlaybackBar';
import TrackingTable from '../components/tracking/TrackingTable';
import OverspeedAlertsModal from '../components/tracking/OverspeedAlertsModal';
import Button from '../components/common/Button';
import {
  Radio,
  Play,
  RotateCw,
  SlidersHorizontal,
  ShieldAlert,
  History,
  AlertTriangle,
  Info,
  CheckCircle2
} from 'lucide-react';

export default function Tracking() {
  const {
    telemetryList,
    selectedVehicle,
    selectedVehicleId,
    setSelectedVehicleId,
    alerts,
    isDemoMode,
    liveSimulationActive,
    setLiveSimulationActive,
    speedLimit,
    setSpeedLimit,

    // Playback state
    isPlaybackMode,
    isPlaying,
    playbackSpeed,
    setPlaybackSpeed,
    waypointIndex,
    setWaypointIndex,
    totalWaypoints,
    historicalJourney,
    activeHistoricalPath,
    playbackDate,
    setPlaybackDate,

    // Actions
    startPlayback,
    startPlaybackForVehicle,
    resumePlayback,
    pausePlayback,
    resetPlayback,
    exitPlayback,
    resolveAlert
  } = useRealtimeTracking();

  const [showConfig, setShowConfig] = useState(false);
  const [isOverspeedModalOpen, setIsOverspeedModalOpen] = useState(false);

  return (
    <div className="space-y-4">
      {/* Page Header with Real-Time / Demo Status */}
      <div className="flex items-end justify-between py-2 max-md:flex-col max-md:items-start max-md:gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-[9px] tracking-[1.2px] text-[#858894] uppercase">
              GPS Command Center
            </span>
            <span className="bg-[#40375b] text-[#c7b6ff] text-[9px] font-mono px-2 py-0.5 rounded border border-[#5d4f82]">
              DEMO SIMULATION ACTIVE
            </span>
          </div>

          <h1 className="text-[28px] tracking-[-1px] font-bold text-[#f0f0f4] m-0">
            Live tracking<span className="text-[#ad91ff]">.</span>
          </h1>
          <p className="text-[12px] text-[#898c98] mt-0.5">
            Continuous satellite telemetry, heading monitoring, and journey replay across active fleet corridors.
          </p>
        </div>

        {/* Global Controls & Simulator Toggles */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Historical Replay Mode Toggle */}
          <button
            type="button"
            onClick={() => {
              if (isPlaybackMode) {
                exitPlayback();
              } else {
                startPlayback();
              }
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[7px] text-[11px] font-mono border transition-all cursor-pointer ${
              isPlaybackMode
                ? 'bg-[#40375b] text-[#c4b3ff] border-[#6b5b95] hover:bg-[#4d3f6d]'
                : 'bg-[#20222a] text-[#858894] border-[#30333d] hover:text-white'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>{isPlaybackMode ? 'EXIT REPLAY' : 'JOURNEY REPLAY'}</span>
          </button>

          {/* Pause / Resume Live Simulation Button */}
          <button
            type="button"
            onClick={() => setLiveSimulationActive(!liveSimulationActive)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-[7px] text-[11px] font-mono border transition-all cursor-pointer ${
              liveSimulationActive
                ? 'bg-[#1c302a] text-[#83d7a9] border-[#2c493d] hover:bg-[#233f36]'
                : 'bg-[#20222a] text-[#858894] border-[#30333d] hover:bg-[#272a35]'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                liveSimulationActive ? 'bg-[#75d5a2] beacon-pulse' : 'bg-[#666]'
              }`}
            />
            {liveSimulationActive ? 'TELEMETRY STREAMING (3s)' : 'STREAM PAUSED'}
          </button>

          {/* Speed Limit Config Button */}
          <button
            type="button"
            onClick={() => setShowConfig(!showConfig)}
            className="p-1.5 text-[#858894] hover:text-[#f0f0f4] bg-[#20222a] border border-[#30333d] rounded-[7px] transition-colors"
            title="Configure speed thresholds"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Speed Limit Threshold Banner if Open */}
      {showConfig && (
        <div className="bg-[#17191f] border border-[#2b2e38] p-3 rounded-lg flex items-center justify-between text-xs font-mono animate-in fade-in">
          <div className="flex items-center gap-2 text-[#d1d1da]">
            <ShieldAlert className="w-4 h-4 text-[#e5a46e]" />
            <span>Configured Fleet Speed Limit: <b>{speedLimit} km/h</b></span>
          </div>
          <div className="flex items-center gap-2">
            {[60, 70, 80, 90, 100].map((lim) => (
              <button
                key={lim}
                type="button"
                onClick={() => setSpeedLimit(lim)}
                className={`px-2 py-0.5 rounded text-[10px] ${
                  speedLimit === lim
                    ? 'bg-[#b49aff] text-[#17131f] font-bold'
                    : 'bg-[#20222a] text-[#858894] hover:text-white'
                }`}
              >
                {lim} km/h
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Summary KPI Cards Grid (Total, Moving, Stopped, Offline, Distance Today, Alerts) */}
      <TrackingKPIGrid
        telemetryList={telemetryList}
        alerts={alerts}
        onOverspeedClick={() => setIsOverspeedModalOpen(true)}
      />

      {/* Historical Journey Playback Scrubber (visible when replaying) */}
      {isPlaybackMode && (
        <JourneyPlaybackBar
          isPlaying={isPlaying}
          playbackSpeed={playbackSpeed}
          currentWaypointIndex={waypointIndex}
          totalWaypoints={totalWaypoints}
          journeyData={historicalJourney}
          playbackDate={playbackDate}
          onDateChange={setPlaybackDate}
          vehicles={telemetryList}
          onSelectVehicleForPlayback={(vehId) => startPlaybackForVehicle(vehId, playbackDate)}
          onPlay={resumePlayback}
          onResume={resumePlayback}
          onPause={pausePlayback}
          onReset={resetPlayback}
          onSpeedChange={setPlaybackSpeed}
          onSliderChange={setWaypointIndex}
          onClose={exitPlayback}
        />
      )}

      {/* Main Interactive Map & Vehicle Information Panel */}
      <div className="grid grid-cols-[1fr_340px] max-lg:grid-cols-1 gap-4">
        {/* Interactive MapLibre GL Dark Map */}
        <InteractiveTrackingMap
          vehicles={telemetryList}
          selectedVehicleId={selectedVehicleId}
          onSelectVehicle={(veh) => setSelectedVehicleId(veh.vehicleId)}
          historicalPath={activeHistoricalPath}
          showRouteLine={isPlaybackMode}
        />

        {/* Selected Vehicle Information Panel */}
        <VehicleInfoPanel
          vehicle={selectedVehicle}
          onFocusVehicle={() => setSelectedVehicleId(selectedVehicle.vehicleId)}
          onViewHistory={() => startPlaybackForVehicle(selectedVehicle.vehicleId, playbackDate)}
        />
      </div>

      {/* Active Vehicle Transponders Matrix Table */}
      <TrackingTable
        telemetryList={telemetryList}
        selectedVehicleId={selectedVehicleId}
        onSelectVehicle={(veh) => setSelectedVehicleId(veh.vehicleId)}
        onFocusVehicle={(veh) => setSelectedVehicleId(veh.vehicleId)}
      />

      {/* Overspeed Safety Violations Modal */}
      <OverspeedAlertsModal
        isOpen={isOverspeedModalOpen}
        onClose={() => setIsOverspeedModalOpen(false)}
        alerts={alerts}
        speedLimit={speedLimit}
        onFocusVehicle={(vehId) => {
          setSelectedVehicleId(vehId);
        }}
        onResolveAlert={resolveAlert}
      />
    </div>
  );
}
