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
            Continuous satellite telemetry, directional heading monitoring, and journey replay across active fleet corridors.
          </p>
        </div>

        {/* Global Controls & Simulator Toggles */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Phone / Browser Real GPS Transponder */}
          <Button
            variant="default"
            size="sm"
            onClick={() => setIsMobileBroadcasterOpen(true)}
            icon={Smartphone}
            className="text-[#8be0b3] border-[#8be0b3]/30 hover:border-[#8be0b3]"
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

      {/* Explicit DEMO MODE Explanation & Transparency Banner */}
      <div className="p-3 bg-[#171922] border border-[#2b2d3d] rounded-lg flex items-center justify-between text-xs font-mono text-[#aeb0bb]">
        <div className="flex items-center gap-2.5">
          <Info className="w-4 h-4 text-[#b49aff] shrink-0" />
          <span className="text-[11px]">
            <b className="text-[#f0f0f4]">DEMO SIMULATION ACTIVE:</b> Coordinates are generated by the NYC Fleet Corridor Simulation Engine (source: <code className="text-[#c4b3ff]">simulator</code>). When physical GPS transponders send <code className="text-[#8be0b3]">POST /api/tracking/location</code>, stream switches to hardware ingestion.
          </span>
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

      {/* Sub-navigation Tabs: Live Tracking vs Journey History */}
      <div className="flex items-center gap-2 border-b border-[#252730] pb-1 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTrackingTab('live')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-mono rounded-t-lg transition-all whitespace-nowrap cursor-pointer ${
            activeTrackingTab === 'live'
              ? 'bg-[#17191f] text-[#f0f0f4] border-t-2 border-t-[#b49aff] border-x border-[#292c35] font-bold'
              : 'text-[#858894] hover:text-[#d1d1da] hover:bg-[#15161c]'
          }`}
        >
          <Navigation className="w-3.5 h-3.5 text-[#8be0b3]" />
          <span>Live Tracking Map</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTrackingTab('history')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-mono rounded-t-lg transition-all whitespace-nowrap cursor-pointer ${
            activeTrackingTab === 'history'
              ? 'bg-[#17191f] text-[#f0f0f4] border-t-2 border-t-[#b49aff] border-x border-[#292c35] font-bold'
              : 'text-[#858894] hover:text-[#d1d1da] hover:bg-[#15161c]'
          }`}
        >
          <History className="w-3.5 h-3.5 text-[#b49aff]" />
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

          {/* Historical Journey Playback Scrubber (visible when replaying inline) */}
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
