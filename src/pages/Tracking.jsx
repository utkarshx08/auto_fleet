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
  SlidersHorizontal,
  ShieldAlert,
  History,
  Navigation,
  Info,
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
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              GPS Telematics
            </span>
            <span className="bg-blue-50 text-[#2879E8] text-[10px] font-semibold px-2 py-0.5 rounded-md border border-blue-200/60">
              Live Feed Active
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 m-0">
            Live Tracking
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Continuous satellite telemetry, directional heading, and route replay across active fleet corridors.
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
            Ingestion API
          </Button>

          {/* Pause / Resume Live Simulation Button */}
          <button
            type="button"
            onClick={() => setLiveSimulationActive(!liveSimulationActive)}
            className={`flex items-center gap-2 h-8 px-3 rounded-lg text-xs border transition-all cursor-pointer font-medium shadow-2xs ${
              liveSimulationActive
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200/80 hover:bg-emerald-100/80'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                liveSimulationActive ? 'bg-emerald-500' : 'bg-slate-400'
              }`}
            />
            {liveSimulationActive ? 'Streaming (3s)' : 'Stream paused'}
          </button>

          {/* Speed Limit Config Button */}
          <button
            type="button"
            onClick={() => setShowConfig(!showConfig)}
            className="h-8 w-8 flex items-center justify-center text-slate-500 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-all cursor-pointer shadow-2xs"
            title="Configure speed thresholds"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Transparent Telemetry Source Banner */}
      <div className="glass-card p-3 rounded-xl flex items-center justify-between text-xs text-slate-600">
        <div className="flex items-center gap-2.5">
          <Info className="w-4 h-4 text-[#2879E8] shrink-0" />
          <span className="text-xs leading-relaxed">
            <span className="font-semibold text-slate-800">Telemetry Source:</span> Fleet corridor simulation engine is actively generating telemetry coordinates. Hardware transponders can stream directly via <code className="text-[#2879E8] font-semibold bg-blue-50 px-1 py-0.5 rounded text-[11px]">POST /api/tracking/location</code>.
          </span>
        </div>
      </div>

      {/* Speed Limit Threshold Banner if Open */}
      {showConfig && (
        <div className="glass-card p-3 rounded-xl flex items-center justify-between text-xs animate-in fade-in">
          <div className="flex items-center gap-2 text-slate-800">
            <ShieldAlert className="w-4 h-4 text-amber-600" />
            <span>Configured Fleet Speed Limit: <b className="font-semibold">{speedLimit} km/h</b></span>
          </div>
          <div className="flex items-center gap-1.5">
            {[60, 70, 80, 90, 100].map((lim) => (
              <button
                key={lim}
                type="button"
                onClick={() => setSpeedLimit(lim)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
                  speedLimit === lim
                    ? 'bg-[#2879E8] text-white'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                }`}
              >
                {lim} km/h
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Sub-navigation Tabs: Live Tracking vs Journey History */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-1 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTrackingTab('live')}
          className={`flex items-center gap-2 px-3.5 py-2 text-xs rounded-lg transition-all whitespace-nowrap cursor-pointer ${
            activeTrackingTab === 'live'
              ? 'bg-blue-50 text-[#2879E8] font-semibold border border-blue-200/60 shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 font-medium'
          }`}
        >
          <Navigation className="w-3.5 h-3.5 text-emerald-600" />
          <span>Live Tracking Map</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTrackingTab('history')}
          className={`flex items-center gap-2 px-3.5 py-2 text-xs rounded-lg transition-all whitespace-nowrap cursor-pointer ${
            activeTrackingTab === 'history'
              ? 'bg-blue-50 text-[#2879E8] font-semibold border border-blue-200/60 shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 font-medium'
          }`}
        >
          <History className="w-3.5 h-3.5 text-[#2879E8]" />
          <span>Journey History & Scrubber</span>
        </button>
      </div>

      {/* TAB 1: LIVE TRACKING */}
      {activeTrackingTab === 'live' && (
        <div className="space-y-4 animate-in fade-in">
          {/* Summary KPI Cards Grid */}
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
