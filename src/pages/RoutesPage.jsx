import React, { useState, useEffect, useMemo } from 'react';
import Button from '../components/common/Button';
import SearchBar from '../components/common/SearchBar';
import CreateRouteModal from '../components/routes/CreateRouteModal';
import {
  Route as RouteIcon,
  MapPin,
  Clock,
  ArrowRight,
  Plus,
  CheckCircle2,
  Trash2,
  Play,
  Check,
  RotateCcw
} from 'lucide-react';
import {
  getTracks,
  markTrackCompleted,
  updateTrackStatus,
  createTrack,
  deleteTrack,
  syncWithRemoteDatabase
} from '../services/trackService';

export default function RoutesPage({ onShowToast }) {
  // Operational State — loaded directly from persistent database store
  const [routes, setRoutes] = useState(() => getTracks());
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Synchronize with remote database (Supabase) if connected and subscribe to cross-tab updates
  useEffect(() => {
    let isMounted = true;
    syncWithRemoteDatabase().then((latest) => {
      if (isMounted && latest) {
        setRoutes(latest);
      }
    });

    const handleTrackUpdate = (e) => {
      if (isMounted) {
        setRoutes(getTracks());
      }
    };

    window.addEventListener('autrail_track_updated', handleTrackUpdate);
    return () => {
      isMounted = false;
      window.removeEventListener('autrail_track_updated', handleTrackUpdate);
    };
  }, []);

  const handleCreateRoute = async (newRoute) => {
    try {
      const created = await createTrack(newRoute, 'Dispatch Coordinator');
      setRoutes(getTracks());
      if (onShowToast) {
        onShowToast(`Track "${created.name}" (${created.id}) created successfully.`, 'success');
      }
    } catch (err) {
      if (onShowToast) onShowToast(err.message, 'error');
    }
  };

  const handleMarkCompleted = async (routeId) => {
    try {
      const res = await markTrackCompleted(routeId, 'Fleet Dispatcher');
      // Immediate UI update
      setRoutes(getTracks());

      if (onShowToast) {
        onShowToast(res.message, 'success');
      }
    } catch (err) {
      if (onShowToast) {
        onShowToast(err.message, 'error');
      }
    }
  };

  const handleStartTrack = async (routeId) => {
    try {
      const res = await updateTrackStatus(routeId, 'In Progress', 'Fleet Dispatcher');
      setRoutes(getTracks());
      if (onShowToast) {
        onShowToast(res.message, 'info');
      }
    } catch (err) {
      if (onShowToast) onShowToast(err.message, 'error');
    }
  };

  const handleResetTrack = async (routeId) => {
    try {
      const res = await updateTrackStatus(routeId, 'In Progress', 'Fleet Dispatcher');
      setRoutes(getTracks());
      if (onShowToast) {
        onShowToast(`Track reset to "In Progress".`, 'info');
      }
    } catch (err) {
      if (onShowToast) onShowToast(err.message, 'error');
    }
  };

  const handleDeleteRoute = async (routeId) => {
    try {
      await deleteTrack(routeId);
      setRoutes(getTracks());
      if (onShowToast) {
        onShowToast(`Track ${routeId} removed from fleet schedule.`, 'warning');
      }
    } catch (err) {
      if (onShowToast) onShowToast(err.message, 'error');
    }
  };

  const filteredRoutes = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return routes.filter((rt) => {
      const matchSearch =
        (rt.name || '').toLowerCase().includes(term) ||
        (rt.origin || '').toLowerCase().includes(term) ||
        (rt.destination || '').toLowerCase().includes(term) ||
        (rt.assignedVehicle || '').toLowerCase().includes(term) ||
        (rt.assignedDriver || '').toLowerCase().includes(term);

      const matchStatus =
        statusFilter === 'ALL' || (rt.status || '').toLowerCase() === statusFilter.toLowerCase();
      return matchSearch && matchStatus;
    });
  }, [routes, searchTerm, statusFilter]);

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex items-end justify-between py-4 max-md:flex-col max-md:items-start max-md:gap-4">
        <div>
          <p className="font-mono text-[10px] tracking-[1.2px] text-[#858894] uppercase mb-1">
            Dispatch & Logistics
          </p>
          <h1 className="text-[28px] tracking-[-1px] font-bold text-[#f0f0f4] m-0">
            Routes<span className="text-[#ad91ff]">.</span>
          </h1>
          <p className="text-[12px] text-[#898c98] mt-1">
            Active delivery corridors, waypoint sequencing, and dispatch scheduling.
          </p>
        </div>
        <Button variant="primary" onClick={() => setIsCreateOpen(true)} icon={Plus}>
          Create route
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex items-center justify-between gap-3 max-md:flex-col max-md:items-stretch">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          onClear={() => setSearchTerm('')}
          placeholder="Search corridors, cities, plates, drivers..."
          width="w-[320px] max-md:w-full"
        />

        <div className="flex items-center bg-[#20222a] border border-[#30333d] rounded-[6px] p-0.5 text-[10px] font-mono">
          {['ALL', 'In Progress', 'Pending', 'Completed'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded transition-colors ${
                statusFilter === st
                  ? 'bg-[#40375b] text-[#c4b3ff] font-bold'
                  : 'text-[#858894] hover:text-[#d1d1da]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Route Cards Grid */}
      {filteredRoutes.length === 0 ? (
        <div className="bg-[#17191f] border border-[#292c35] p-10 rounded-[10px] text-center text-[#747783]">
          <RouteIcon className="w-8 h-8 text-[#4a475a] mx-auto mb-2" />
          <p className="text-sm font-bold text-[#d1d1da]">No corridors found</p>
          <p className="text-xs text-[#858894]">Try adjusting your search query or status filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 max-lg:grid-cols-1 gap-4">
          {filteredRoutes.map((rt) => (
            <div
              key={rt.id}
              className="bg-[#17191f] border border-[#292c35] hover:border-[#383c4a] p-4 rounded-[10px] flex flex-col justify-between transition-colors group"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[9px] text-[#b49aff] bg-[#24212f] px-2 py-0.5 rounded border border-[#40375b]">
                    {rt.id}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {rt.status === 'Completed' ? (
                      <span className="font-mono text-[9px] px-2.5 py-0.5 rounded-full bg-[#142921] text-[#70cbb7] border border-[#20493b] flex items-center gap-1 font-semibold">
                        <CheckCircle2 className="w-3 h-3 text-[#34d399]" />
                        <span>Completed</span>
                      </span>
                    ) : rt.status === 'In Progress' ? (
                      <span className="font-mono text-[9px] px-2 py-0.5 rounded-full bg-[#1c302a] text-[#83d7a9] border border-[#2c493d] flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
                        <span>In Progress</span>
                      </span>
                    ) : (
                      <span className="font-mono text-[9px] px-2 py-0.5 rounded-full bg-[#382c25] text-[#e5a46e] border border-[#523d30] flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#e5a46e]" />
                        <span>{rt.status || 'Pending'}</span>
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() => handleDeleteRoute(rt.id)}
                      className="p-1 rounded text-[#747783] hover:text-red-400 hover:bg-[#20222a] transition-colors"
                      title="Delete route"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-[#f0f0f4] mt-2">{rt.name}</h3>

                {rt.completedAt && (
                  <div className="mt-1 flex items-center gap-1 text-[10px] font-mono text-[#70cbb7]">
                    <Clock className="w-3 h-3 text-[#34d399]" />
                    <span>
                      Completed:{' '}
                      {new Date(rt.completedAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                )}

                <div className="mt-3 space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-[#aeb0ba]">
                    <MapPin className="w-3.5 h-3.5 text-[#858894] shrink-0" />
                    <span className="truncate">{rt.origin}</span>
                  </div>
                  <div className="flex items-center gap-2 pl-4 text-[#747783]">
                    <ArrowRight className="w-3 h-3" />
                    <span className="text-[10px] font-mono">{rt.stops} Scheduled Waypoints ({rt.eta})</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#aeb0ba]">
                    <MapPin className="w-3.5 h-3.5 text-[#b49aff] shrink-0" />
                    <span className="truncate">{rt.destination}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#252730] flex items-center justify-between text-[10px]">
                <div>
                  <span className="font-mono text-[8px] text-[#747783] uppercase block">Assigned Unit</span>
                  <span className="font-mono text-[#d1d1da]">{rt.assignedVehicle} · {rt.assignedDriver}</span>
                </div>
                <div className="flex items-center gap-2">
                  {rt.status === 'Completed' ? (
                    <div className="flex items-center gap-1.5">
                      <Button
                        variant="quiet"
                        size="sm"
                        disabled
                        className="opacity-60 cursor-not-allowed bg-[#142921] text-[#70cbb7] border border-[#20493b]"
                      >
                        <Check className="w-3 h-3 mr-1 text-[#34d399]" /> Completed
                      </Button>
                      <button
                        type="button"
                        onClick={() => handleResetTrack(rt.id)}
                        className="text-[9px] font-mono text-[#858894] hover:text-[#c4b3ff] underline transition-colors cursor-pointer"
                        title="Reset track to In Progress"
                      >
                        Reopen
                      </button>
                    </div>
                  ) : rt.status === 'In Progress' ? (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleMarkCompleted(rt.id)}
                      icon={CheckCircle2}
                    >
                      Mark as Completed
                    </Button>
                  ) : (
                    <div className="flex items-center gap-1">
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleStartTrack(rt.id)}
                        icon={Play}
                      >
                        Dispatch
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleMarkCompleted(rt.id)}
                        icon={CheckCircle2}
                      >
                        Mark as Completed
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Route Modal */}
      <CreateRouteModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreateRoute={handleCreateRoute}
      />
    </div>
  );
}
