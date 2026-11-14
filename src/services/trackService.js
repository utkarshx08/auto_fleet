// ============================================================================
// AUTRAIL PERSISTENT TRACK & TASK COMPLETION SERVICE
// Single Source of Truth for Track Statuses across Browser, Storage & Supabase
// ============================================================================

import storageService from './storageService.js';
import { supabase, isSupabaseConfigured } from './supabaseClient.js';

export const TRACK_STORAGE_KEY = 'autrail_tracks_store';

// Allowed Track LifeCycle Statuses
export const TRACK_STATUSES = ['Pending', 'In Progress', 'Completed'];

// Initial Baseline Tracks (Corridors & Delivery Tracks)
export const initialTracks = [
  {
    id: 'RT-401',
    name: 'Midtown Express Loop',
    origin: 'Queens Terminal Hub',
    destination: 'Manhattan Financial District',
    stops: 8,
    distance: '34.2 km',
    eta: '45 mins',
    assignedVehicle: 'RST-291',
    assignedDriver: 'Aarav Sharma',
    status: 'In Progress',
    completedAt: null,
    completedBy: null,
    createdAt: '2025-10-24T08:00:00Z',
    updatedAt: '2025-10-24T08:00:00Z'
  },
  {
    id: 'RT-402',
    name: 'Brooklyn River Corridor',
    origin: 'Greenpoint Distribution Depot',
    destination: 'Coney Island Fulfillment',
    stops: 12,
    distance: '48.6 km',
    eta: '1 hr 15 mins',
    assignedVehicle: 'RST-284',
    assignedDriver: 'Priya Patel',
    status: 'In Progress',
    completedAt: null,
    completedBy: null,
    createdAt: '2025-10-24T09:00:00Z',
    updatedAt: '2025-10-24T09:00:00Z'
  },
  {
    id: 'RT-403',
    name: 'Bronx Cross-County Freight',
    origin: 'Hunts Point Logistics Center',
    destination: 'White Plains Hub',
    stops: 5,
    distance: '29.1 km',
    eta: '35 mins',
    assignedVehicle: 'RST-263',
    assignedDriver: 'Rajesh Kumar',
    status: 'Pending',
    completedAt: null,
    completedBy: null,
    createdAt: '2025-10-24T07:30:00Z',
    updatedAt: '2025-10-24T07:30:00Z'
  }
];

/**
 * Merge saved tracks with baseline to ensure no saved status is ever overwritten
 */
function mergeWithBaseline(savedTracks) {
  if (!Array.isArray(savedTracks) || savedTracks.length === 0) {
    return initialTracks;
  }

  const savedMap = new Map();
  savedTracks.forEach((t) => {
    if (t && t.id) savedMap.set(t.id, t);
  });

  // Ensure all baseline tracks exist while preserving their saved status
  const merged = initialTracks.map((base) => {
    const saved = savedMap.get(base.id);
    if (saved) {
      savedMap.delete(base.id);
      return {
        ...base,
        ...saved,
        // Crucial: never downgrade a Completed status back to Pending
        status: saved.status || base.status,
        completedAt: saved.completedAt || base.completedAt,
        completedBy: saved.completedBy || base.completedBy
      };
    }
    return base;
  });

  // Add any custom tracks created by the user
  savedMap.forEach((userTrack) => {
    merged.push(userTrack);
  });

  return merged;
}

/**
 * Loads all tracks synchronously from storageService with memory and localStorage persistence
 */
export const getTracks = () => {
  const raw = storageService.getItem(TRACK_STORAGE_KEY, null);
  const tracks = mergeWithBaseline(raw);
  storageService.setItem(TRACK_STORAGE_KEY, tracks);
  return tracks;
};

/**
 * Saves current tracks array to storageService
 */
export const persistTracks = (tracks) => {
  return storageService.setItem(TRACK_STORAGE_KEY, tracks);
};

/**
 * Retrieves a single track by its unique ID
 */
export const getTrackById = (trackId) => {
  const tracks = getTracks();
  return tracks.find((t) => t.id === trackId) || null;
};

/**
 * Retrieves a track assigned to a specific vehicle
 */
export const getTrackByVehicle = (vehiclePlateOrId) => {
  if (!vehiclePlateOrId) return null;
  const tracks = getTracks();
  return tracks.find(
    (t) => t.assignedVehicle === vehiclePlateOrId || t.assignedVehicleId === vehiclePlateOrId
  ) || null;
};

/**
 * Retrieves a track by corridor name
 */
export const getTrackByName = (name) => {
  if (!name) return null;
  const cleanName = name.toLowerCase().trim();
  const tracks = getTracks();
  return tracks.find(
    (t) => t.name.toLowerCase().trim() === cleanName || cleanName.includes(t.name.toLowerCase().trim())
  ) || null;
};

/**
 * Dispatches cross-component event so all active components react instantly
 */
function notifyTrackChange(track) {
  if (typeof window !== 'undefined') {
    try {
      window.dispatchEvent(
        new CustomEvent('autrail_track_updated', {
          detail: { track }
        })
      );
    } catch (e) {
      // benign fallback
    }
  }
}

/**
 * Synchronizes track completion to backend Supabase table if configured
 */
async function syncTrackToSupabase(track) {
  if (!isSupabaseConfigured() || !supabase) {
    return { synced: false, reason: 'offline_mode' };
  }

  try {
    const payload = {
      id: track.id,
      name: track.name,
      origin: track.origin,
      destination: track.destination,
      stops: Number(track.stops) || 1,
      distance: String(track.distance || ''),
      eta: String(track.eta || ''),
      assigned_vehicle_id: track.assignedVehicle || null,
      assigned_driver_name: track.assignedDriver || null,
      status: track.status,
      completed_at: track.completedAt || null,
      completed_by: track.completedBy || null,
      updated_at: track.updatedAt || new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('tracks')
      .upsert(payload, { onConflict: 'id' });

    if (error) {
      console.warn('[trackService] Supabase sync returned error, local persistence preserved:', error.message);
      return { synced: false, error: error.message };
    }

    return { synced: true, data };
  } catch (err) {
    console.warn('[trackService] Network or DB error during track sync, local storage intact:', err);
    return { synced: false, error: err.message };
  }
}

/**
 * Marks a track as Completed permanently.
 * - Updates UI state and storageService immediately
 * - Records ISO completion timestamp
 * - Sets status: 'Completed'
 * - Prevents duplicate completion
 * - Syncs with backend Supabase database
 */
export const markTrackCompleted = async (trackId, actor = 'Authorized Fleet Operator') => {
  const tracks = getTracks();
  const index = tracks.findIndex((t) => t.id === trackId);

  if (index === -1) {
    throw new Error(`Track with ID "${trackId}" not found in database.`);
  }

  const existing = tracks[index];

  // Prevent duplicate completion records
  if (existing.status === 'Completed') {
    return {
      success: true,
      alreadyCompleted: true,
      track: existing,
      message: `Track "${existing.name}" (${trackId}) was already marked as Completed on ${existing.completedAt}.`
    };
  }

  const now = new Date().toISOString();
  const updatedTrack = {
    ...existing,
    status: 'Completed',
    completedAt: now,
    completedBy: actor,
    updatedAt: now
  };

  tracks[index] = updatedTrack;
  persistTracks(tracks);
  notifyTrackChange(updatedTrack);

  // Background sync to Supabase database
  syncTrackToSupabase(updatedTrack);

  return {
    success: true,
    alreadyCompleted: false,
    track: updatedTrack,
    message: `Track "${updatedTrack.name}" successfully marked as Completed.`
  };
};

/**
 * Updates track status with strict validation (Pending, In Progress, Completed)
 */
export const updateTrackStatus = async (trackId, targetStatus, actor = 'Fleet Operator') => {
  if (!TRACK_STATUSES.includes(targetStatus)) {
    throw new Error(`Invalid status "${targetStatus}". Allowed statuses: ${TRACK_STATUSES.join(', ')}`);
  }

  if (targetStatus === 'Completed') {
    return markTrackCompleted(trackId, actor);
  }

  const tracks = getTracks();
  const index = tracks.findIndex((t) => t.id === trackId);
  if (index === -1) {
    throw new Error(`Track with ID "${trackId}" not found.`);
  }

  const existing = tracks[index];
  const now = new Date().toISOString();

  const updatedTrack = {
    ...existing,
    status: targetStatus,
    completedAt: targetStatus === 'Completed' ? existing.completedAt || now : null,
    completedBy: targetStatus === 'Completed' ? existing.completedBy || actor : null,
    updatedAt: now
  };

  tracks[index] = updatedTrack;
  persistTracks(tracks);
  notifyTrackChange(updatedTrack);

  syncTrackToSupabase(updatedTrack);

  return {
    success: true,
    track: updatedTrack,
    message: `Track "${updatedTrack.name}" status updated to "${targetStatus}".`
  };
};

/**
 * Adds a new track/corridor to the persistent store
 */
export const createTrack = async (trackData, actor = 'Fleet Dispatcher') => {
  const tracks = getTracks();
  const generatedId = trackData.id || `RT-${tracks.length + 401}`;
  const now = new Date().toISOString();

  const newTrack = {
    id: generatedId,
    name: trackData.name.trim(),
    origin: trackData.origin.trim(),
    destination: trackData.destination.trim(),
    stops: Number(trackData.stops) || 1,
    distance: trackData.distance || '0 km',
    eta: trackData.eta || 'N/A',
    assignedVehicle: trackData.assignedVehicle || null,
    assignedDriver: trackData.assignedDriver || null,
    status: trackData.status || 'Pending',
    completedAt: trackData.status === 'Completed' ? now : null,
    completedBy: trackData.status === 'Completed' ? actor : null,
    createdAt: now,
    updatedAt: now
  };

  const updated = [newTrack, ...tracks];
  persistTracks(updated);
  notifyTrackChange(newTrack);

  syncTrackToSupabase(newTrack);

  return newTrack;
};

/**
 * Deletes a track from the database
 */
export const deleteTrack = async (trackId) => {
  const tracks = getTracks();
  const filtered = tracks.filter((t) => t.id !== trackId);
  if (filtered.length === tracks.length) {
    throw new Error(`Track with ID "${trackId}" not found.`);
  }
  persistTracks(filtered);

  if (isSupabaseConfigured() && supabase) {
    try {
      await supabase.from('tracks').delete().eq('id', trackId);
    } catch (e) {
      console.warn('[trackService] Supabase delete warning:', e);
    }
  }

  return true;
};

/**
 * Fetches latest tracks from Supabase backend if connected, merging with local storage
 */
export const syncWithRemoteDatabase = async () => {
  if (!isSupabaseConfigured() || !supabase) {
    return getTracks();
  }

  try {
    const { data, error } = await supabase.from('tracks').select('*');
    if (error) {
      console.warn('[trackService] Could not fetch remote tracks, using local cache:', error.message);
      return getTracks();
    }

    if (Array.isArray(data) && data.length > 0) {
      const local = getTracks();
      const localMap = new Map(local.map((l) => [l.id, l]));

      data.forEach((remote) => {
        const mapped = {
          id: remote.id,
          name: remote.name,
          origin: remote.origin,
          destination: remote.destination,
          stops: remote.stops,
          distance: remote.distance,
          eta: remote.eta,
          assignedVehicle: remote.assigned_vehicle_id,
          assignedDriver: remote.assigned_driver_name,
          status: remote.status,
          completedAt: remote.completed_at,
          completedBy: remote.completed_by,
          createdAt: remote.created_at,
          updatedAt: remote.updated_at
        };

        const existing = localMap.get(remote.id);
        // Single source of truth: preserve Completed status if either remote or local has it
        if (existing && existing.status === 'Completed') {
          localMap.set(remote.id, existing);
        } else {
          localMap.set(remote.id, mapped);
        }
      });

      const merged = Array.from(localMap.values());
      persistTracks(merged);
      return merged;
    }

    return getTracks();
  } catch (err) {
    console.warn('[trackService] Remote fetch error, falling back to local database:', err);
    return getTracks();
  }
};

