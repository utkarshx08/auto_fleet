import { useState, useEffect, useRef, useCallback } from 'react';
import {
  TRACKING_CONFIG,
  initialLiveTelemetry,
  initialTrackingAlerts,
  initialGeofences
} from '../data/trackingMockData';
import { advanceVehicleTelemetry } from '../services/gpsSimulatorService';
import { getHistoricalJourney } from '../services/trackingHistoryService';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';

export default function useRealtimeTracking() {
  const [telemetryList, setTelemetryList] = useState(initialLiveTelemetry);
  const [selectedVehicleId, setSelectedVehicleId] = useState('RST-291');
  const [alerts, setAlerts] = useState(initialTrackingAlerts);
  const [isDemoMode, setIsDemoMode] = useState(true);
  const [liveSimulationActive, setLiveSimulationActive] = useState(true);
  const [speedLimit, setSpeedLimit] = useState(TRACKING_CONFIG.SPEED_LIMIT_KMH);

  // Historical Journey Filter & Playback State
  const [isPlaybackMode, setIsPlaybackMode] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [waypointIndex, setWaypointIndex] = useState(0);
  const [playbackDate, setPlaybackDate] = useState('2025-10-24');
  const [playbackTimeRange, setPlaybackTimeRange] = useState({ start: '08:00', end: '18:00' });
  const [currentHistoricalJourney, setCurrentHistoricalJourney] = useState(() =>
    getHistoricalJourney({ vehicleId: 'RST-291', date: '2025-10-24' })
  );

  const playbackTimerRef = useRef(null);

  // Selected vehicle object
  const selectedVehicle = telemetryList.find((v) => v.vehicleId === selectedVehicleId) || telemetryList[0];

  // 1. Supabase Realtime Subscription (when configured)
  useEffect(() => {
    if (!isSupabaseConfigured() || !supabase) return;

    try {
      const channel = supabase
        .channel('realtime_gps_feed')
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'vehicle_locations' },
          (payload) => {
            const newLoc = payload.new;
            if (!newLoc || !newLoc.vehicle_id) return;

            setTelemetryList((prev) =>
              prev.map((v) =>
                v.vehicleId === newLoc.vehicle_id
                  ? {
                      ...v,
                      latitude: Number(newLoc.latitude),
                      longitude: Number(newLoc.longitude),
                      speed: Number(newLoc.speed),
                      heading: Number(newLoc.heading),
                      lastUpdated: 'Just now',
                      status: Number(newLoc.speed) > 5 ? 'moving' : 'idle'
                    }
                  : v
              )
            );
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } catch (err) {
      console.warn('Realtime subscription fallback to simulator:', err);
    }
  }, []);

  // 2. Demo Simulation Ticker (Advances moving vehicles every 3 seconds)
  useEffect(() => {
    if (!liveSimulationActive || isPlaybackMode) return;

    const interval = setInterval(() => {
      const { telemetryList: updatedList, newAlerts } = advanceVehicleTelemetry(telemetryList, speedLimit);
      setTelemetryList(updatedList);

      if (newAlerts.length > 0) {
        setAlerts((prev) => [...newAlerts, ...prev]);
      }
    }, TRACKING_CONFIG.UPDATE_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [liveSimulationActive, isPlaybackMode, telemetryList, speedLimit]);

  // 3. Historical Playback Runner
  useEffect(() => {
    if (!isPlaybackMode || !isPlaying) {
      if (playbackTimerRef.current) clearInterval(playbackTimerRef.current);
      return;
    }

    const intervalMs = Math.max(250, 1500 / playbackSpeed);

    playbackTimerRef.current = setInterval(() => {
      setWaypointIndex((prev) => {
        if (prev >= currentHistoricalJourney.waypoints.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, intervalMs);

    return () => {
      if (playbackTimerRef.current) clearInterval(playbackTimerRef.current);
    };
  }, [isPlaybackMode, isPlaying, playbackSpeed, currentHistoricalJourney]);

  // Sync selected vehicle coordinates during journey playback
  useEffect(() => {
    if (!isPlaybackMode) return;
    const currentWp = currentHistoricalJourney.waypoints[waypointIndex];
    if (currentWp) {
      setTelemetryList((prev) =>
        prev.map((v) =>
          v.vehicleId === currentHistoricalJourney.vehicleId
            ? {
                ...v,
                latitude: currentWp.lat,
                longitude: currentWp.lng,
                speed: currentWp.speed,
                heading: currentWp.heading,
                headingText: `${currentWp.heading}°`,
                locationName: currentWp.location,
                lastUpdated: currentWp.time
              }
            : v
        )
      );
    }
  }, [isPlaybackMode, waypointIndex, currentHistoricalJourney]);

  // Journey Playback Handlers
  const startPlaybackForVehicle = useCallback(
    (vehicleId = selectedVehicleId, date = playbackDate) => {
      const journey = getHistoricalJourney({ vehicleId, date });
      setCurrentHistoricalJourney(journey);
      setSelectedVehicleId(vehicleId);
      setWaypointIndex(0);
      setIsPlaybackMode(true);
      setIsPlaying(true);
    },
    [selectedVehicleId, playbackDate]
  );

  const pausePlayback = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const resumePlayback = useCallback(() => {
    setIsPlaying(true);
  }, []);

  const resetPlayback = useCallback(() => {
    setWaypointIndex(0);
    setIsPlaying(true);
  }, []);

  const exitPlayback = useCallback(() => {
    setIsPlaybackMode(false);
    setIsPlaying(false);
    setWaypointIndex(0);
    // Restore default positions
    setTelemetryList(initialLiveTelemetry);
  }, []);

  const resolveAlert = useCallback((alertId) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, isResolved: true } : a))
    );
  }, []);

  // Compute active path coordinates for polyline rendering
  const activeHistoricalPath = isPlaybackMode
    ? currentHistoricalJourney.waypoints.slice(0, waypointIndex + 1)
    : currentHistoricalJourney.waypoints;

  return {
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
    totalWaypoints: currentHistoricalJourney.waypoints.length,
    historicalJourney: currentHistoricalJourney,
    activeHistoricalPath,
    playbackDate,
    setPlaybackDate,
    playbackTimeRange,
    setPlaybackTimeRange,

    // Handlers
    startPlayback: () => startPlaybackForVehicle(selectedVehicleId),
    startPlaybackForVehicle,
    pausePlayback,
    resumePlayback,
    resetPlayback,
    exitPlayback,
    resolveAlert
  };
}
