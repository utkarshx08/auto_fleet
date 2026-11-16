import React, { useState } from 'react';
import useRealtimeTracking from '../hooks/useRealtimeTracking';
import TrackingKPIGrid from '../components/tracking/TrackingKPIGrid';
import InteractiveTrackingMap from '../components/tracking/InteractiveTrackingMap';
import VehicleInfoPanel from '../components/tracking/VehicleInfoPanel';
import JourneyPlaybackBar from '../components/tracking/JourneyPlaybackBar';
import TrackingTable from '../components/tracking/TrackingTable';
import JourneyHistoryView from '../components/tracking/JourneyHistoryView';
import OverspeedAlertsModal from '../components/tracking/OverspeedAlertsModal';
import GpsIngestionTesterModal from '../components/tracking/GpsIngestionTesterModal';
import MobileGpsBroadcasterModal from '../components/tracking/MobileGpsBroadcasterModal';
import Button from '../components/common/Button';
import {
  Radio,
  Play,
  RotateCw,
  SlidersHorizontal,
  ShieldAlert,
  History,
  AlertTriangle,
  Navigation,
  Info,
  CheckCircle2,
  Smartphone
} from 'lucide-react';

export default function Tracking() {
  // Navigation Sub-tab: 'live' | 'history'
  const [activeTrackingTab, setActiveTrackingTab] = useState('live');

  const {
    telemetryList,
    selectedVehicle,
    selectedVehicleId,
    setSelectedVehicleId,
    alerts,
    geofences,
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
    resolveAlert,
    updateVehicleLocation
  } = useRealtimeTracking();

  const [showConfig, setShowConfig] = useState(false);
  const [isOverspeedModalOpen, setIsOverspeedModalOpen] = useState(false);
  const [isIngestionTesterOpen, setIsIngestionTesterOpen] = useState(false);
  const [isMobileBroadcasterOpen, setIsMobileBroadcasterOpen] = useState(false);

  const handleSwitchToHistoryForVehicle = (vehId) => {
    setSelectedVehicleId(vehId);
    setActiveTrackingTab('history');
  };

  return (
    <div className="space-y-5">
      {/* Page Header with Real-Time / Demo Status */}
      <div className="flex items-end justify-between py-2 max-md:flex-col max-md:items-start max-md:gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-[10px] tracking-[1.2px] text-[#475569] uppercase font-bold">
              GPS Command Center
            </span>
            <span className="bg-[#EAF3FF] text-[#2879E8] text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border border-[#D5E6FB]">
              SIMULATION ACTIVE
            </span>
          </div>

          <h1 className="text-[28px] tracking-tight font-black text-[#0B132B] m-0">
            Live Tracking<span className="text-[#2879E8]">.</span>
          </h1>
          <p className="text-[13px] text-[#334155] mt-1 font-semibold">
            Continuous satellite telemetry, directional heading monitoring, and journey replay across active fleet corridors.
          </p>
        </div>

        {/* Global Controls & Simulator Toggles */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Phone / Browser Real GPS Transponder */}
          <Button
            variant="default"
            size="sm"
            onClick={() => setIsMobileBroadcasterOpen(true)}
            icon={Smartphone}
            className="text-[#16A36A] border-[#C2E8D7] hover:border-[#16A36A] hover:bg-[#E8F7F0]"
          >
            Phone GPS Transponder
          </Button>

          {/* Ingestion API Gateway Tester */}
          <Button
            variant="quiet"
            size="sm"
            onClick={() => setIsIngestionTesterOpen(true)}
            icon={Radio}
          >
            Ingestion API (POST)
          </Button>

          {/* Pause / Resume Live Simulation Button */}
          <button
            type="button"
            onClick={() => setLiveSimulationActive(!liveSimulationActive)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-[11px] font-mono border transition-all cursor-pointer font-bold shadow-2xs ${
              liveSimulationActive
                ? 'bg-[#E8F7F0] text-[#16A36A] border-[#C2E8D7] hover:bg-[#D5EFE3]'
                : 'bg-[#F8FAFD] text-[#68758A] border-[#E2E8F0] hover:bg-[#F0F5FC]'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                liveSimulationActive ? 'bg-[#16A36A] beacon-pulse' : 'bg-[#94A3B8]'
              }`}
            />
            {liveSimulationActive ? 'STREAMING (3s)' : 'STREAM PAUSED'}
          </button>

          {/* Speed Limit Config Button */}
          <button
            type="button"
            onClick={() => setShowConfig(!showConfig)}
            className="p-2 text-[#68758A] hover:text-[#172033] bg-[#F8FAFD] border border-[#E2E8F0] hover:bg-[#F0F5FC] rounded-xl transition-all cursor-pointer shadow-2xs"
            title="Configure speed thresholds"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Explicit DEMO MODE Explanation & Transparency Banner */}
      <div className="glass-card p-3.5 rounded-2xl flex items-center justify-between text-xs font-mono text-[#68758A] shadow-liquid-subtle">
        <div className="flex items-center gap-2.5">
          <Info className="w-4 h-4 text-[#2879E8] shrink-0" />
          <span className="text-[11px] leading-relaxed">
            <b className="text-[#172033]">DEMO SIMULATION ACTIVE:</b> Coordinates are generated by the Fleet Corridor Simulation Engine (source: <code className="text-[#2879E8] font-bold">simulator</code>). When physical GPS transponders emit telemetry to <code className="text-[#16A36A] font-bold">POST /api/tracking/location</code>, stream automatically routes hardware ingestion.
          </span>
        </div>
      </div>

      {/* Speed Limit Threshold Banner if Open */}
      {showConfig && (
        <div className="glass-card p-3.5 rounded-2xl flex items-center justify-between text-xs font-mono animate-in fade-in shadow-liquid-subtle">
          <div className="flex items-center gap-2 text-[#172033]">
            <ShieldAlert className="w-4 h-4 text-[#E7A329]" />
            <span>Configured Fleet Speed Limit: <b>{speedLimit} km/h</b></span>
          </div>
          <div className="flex items-center gap-2">
            {[60, 70, 80, 90, 100].map((lim) => (
              <button
                key={lim}
                type="button"
                onClick={() => setSpeedLimit(lim)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                  speedLimit === lim
                    ? 'bg-[#2879E8] text-white shadow-2xs'
                    : 'bg-[#F8FAFD] text-[#68758A] hover:text-[#172033] border border-[#E2E8F0]'
                }`}
              >
                {lim} km/h
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Sub-navigation Tabs: Live Tracking vs Journey History */}
      <div className="flex items-center gap-2 border-b border-[#E2E8F0] pb-1 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTrackingTab('live')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-mono rounded-t-xl transition-all whitespace-nowrap cursor-pointer ${
            activeTrackingTab === 'live'
              ? 'bg-white text-[#2879E8] border-t-2 border-t-[#2879E8] border-x border-[#E2E8F0] font-bold shadow-2xs'
              : 'text-[#68758A] hover:text-[#172033] hover:bg-[#F0F5FC]'
          }`}
        >
          <Navigation className="w-3.5 h-3.5 text-[#16A36A]" />
          <span>Live Tracking Map</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTrackingTab('history')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-mono rounded-t-xl transition-all whitespace-nowrap cursor-pointer ${
            activeTrackingTab === 'history'
              ? 'bg-white text-[#2879E8] border-t-2 border-t-[#2879E8] border-x border-[#E2E8F0] font-bold shadow-2xs'
              : 'text-[#68758A] hover:text-[#172033] hover:bg-[#F0F5FC]'
          }`}
        >
          <History className="w-3.5 h-3.5 text-[#2879E8]" />
          <span>Journey History & Scrubber</span>
        </button>
      </div>

      {/* TAB 1: LIVE TRACKING */}
      {activeTrackingTab === 'live' && (
        <div className="space-y-4 animate-in fade-in">
          {/* Summary KPI Cards Grid (Total, Moving, Stopped, Offline, Distance Today, Alerts) */}
          <TrackingKPIGrid
            telemetryList={telemetryList}
            alerts={alerts}
            onOverspeedClick={() => setIsOverspeedModalOpen(true)}
          />

          {/* Historical Journey Playback Scrubber */}
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
          <div className="grid grid-cols-[1fr_360px] max-lg:grid-cols-1 gap-4">
            {/* Interactive MapLibre GL Map */}
            <InteractiveTrackingMap
              vehicles={telemetryList}
              selectedVehicleId={selectedVehicleId}
              onSelectVehicle={(veh) => setSelectedVehicleId(veh.vehicleId)}
              historicalPath={activeHistoricalPath}
              showRouteLine={isPlaybackMode}
              geofences={geofences}
            />

            {/* Selected Vehicle Information Panel */}
            <VehicleInfoPanel
              vehicle={selectedVehicle}
              onFocusVehicle={() => setSelectedVehicleId(selectedVehicle.vehicleId)}
              onViewHistory={() => handleSwitchToHistoryForVehicle(selectedVehicle.vehicleId)}
            />
          </div>

          {/* Active Vehicle Transponders Matrix Table */}
          <TrackingTable
            telemetryList={telemetryList}
            selectedVehicleId={selectedVehicleId}
            onSelectVehicle={(veh) => setSelectedVehicleId(veh.vehicleId)}
            onFocusVehicle={(veh) => setSelectedVehicleId(veh.vehicleId)}
          />
        </div>
      )}

      {/* TAB 2: JOURNEY HISTORY */}
      {activeTrackingTab === 'history' && (
        <div className="animate-in fade-in">
          <JourneyHistoryView
            vehicles={telemetryList}
            selectedVehicleId={selectedVehicleId}
            onSelectVehicle={(vehId) => setSelectedVehicleId(vehId)}
          />
        </div>
      )}

      {/* Overspeed Safety Violations Modal */}
      <OverspeedAlertsModal
        isOpen={isOverspeedModalOpen}
        onClose={() => setIsOverspeedModalOpen(false)}
        alerts={alerts}
        speedLimit={speedLimit}
        onFocusVehicle={(vehId) => {
          setSelectedVehicleId(vehId);
          setActiveTrackingTab('live');
        }}
        onResolveAlert={resolveAlert}
      />

      {/* Hardware Telemetry Gateway Ingestion Tester */}
      <GpsIngestionTesterModal
        isOpen={isIngestionTesterOpen}
        onClose={() => setIsIngestionTesterOpen(false)}
        vehicles={telemetryList}
        onTelemetryIngested={(sanitizedData) => {
          updateVehicleLocation(sanitizedData);
        }}
      />

      {/* Phone / Mobile Browser Live GPS Broadcaster */}
      <MobileGpsBroadcasterModal
        isOpen={isMobileBroadcasterOpen}
        onClose={() => setIsMobileBroadcasterOpen(false)}
        vehicles={telemetryList}
        onLocationBroadcasted={(livePayload) => {
          updateVehicleLocation(livePayload);
        }}
      />
    </div>
  );
}
