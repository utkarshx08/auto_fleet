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
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-end justify-between py-2 max-md:flex-col max-md:items-start max-md:gap-4">
        <div>
          <p className="font-mono text-[10px] tracking-[1.2px] text-[#475569] uppercase mb-1 font-bold">
            Dispatch & Logistics
          </p>
          <h1 className="text-[28px] tracking-tight font-black text-[#0B132B] m-0">
            Routes<span className="text-[#2879E8]">.</span>
          </h1>
          <p className="text-[13px] text-[#334155] mt-1 font-semibold">
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

        <div className="flex items-center bg-[#F8FAFD] border border-[#D5E2F1] rounded-xl p-1 text-xs font-mono shadow-2xs">
          {['ALL', 'In Progress', 'Pending', 'Completed'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-lg transition-colors font-medium cursor-pointer ${
                statusFilter === st
                  ? 'bg-[#EAF3FF] text-[#2879E8] font-bold shadow-2xs'
                  : 'text-[#68758A] hover:text-[#172033]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Route Cards Grid */}
      {filteredRoutes.length === 0 ? (
        <div className="glass-card p-12 rounded-2xl text-center text-[#8A97AB] shadow-liquid-subtle">
          <RouteIcon className="w-10 h-10 text-[#CBD5E1] mx-auto mb-2" />
          <p className="text-sm font-bold text-[#172033]">No corridors found</p>
          <p className="text-xs text-[#68758A]">Try adjusting your search query or status filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 max-lg:grid-cols-1 gap-5">
          {filteredRoutes.map((rt) => (
            <div
              key={rt.id}
              className="glass-card rounded-2xl p-5 flex flex-col justify-between shadow-liquid-subtle hover:border-[#2879E8]/40 transition-all group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-[10px] text-[#2879E8] bg-[#EAF3FF] px-2.5 py-0.5 rounded-lg border border-[#D5E6FB] font-bold">
                    {rt.id}
                  </span>
                  <div className="flex items-center gap-2">
                    {rt.status === 'Completed' ? (
                      <span className="font-mono text-[10px] px-2.5 py-0.5 rounded-full bg-[#E8F7F0] text-[#16A36A] border border-[#C2E8D7] flex items-center gap-1 font-semibold">
                        <CheckCircle2 className="w-3 h-3 text-[#16A36A]" />
                        <span>Completed</span>
                      </span>
                    ) : rt.status === 'In Progress' ? (
                      <span className="font-mono text-[10px] px-2.5 py-0.5 rounded-full bg-[#EAF3FF] text-[#2879E8] border border-[#D5E6FB] flex items-center gap-1 font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#2879E8] animate-pulse" />
                        <span>In Progress</span>
                      </span>
                    ) : (
                      <span className="font-mono text-[10px] px-2.5 py-0.5 rounded-full bg-[#FEF7EA] text-[#E7A329] border border-[#F8DFB4] flex items-center gap-1 font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#E7A329]" />
                        <span>{rt.status || 'Pending'}</span>
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() => handleDeleteRoute(rt.id)}
                      className="p-1.5 rounded-lg text-[#8A97AB] hover:text-[#E05252] hover:bg-[#FDF2F2] transition-colors cursor-pointer"
                      title="Delete route"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h3 className="text-base font-black text-[#0B132B] tracking-tight">{rt.name}</h3>

                {rt.completedAt && (
                  <div className="mt-1 flex items-center gap-1 text-[11px] font-mono text-[#16A36A] font-medium">
                    <Clock className="w-3 h-3 text-[#16A36A]" />
                    <span>
                      Completed:{' '}
                      {new Date(rt.completedAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                )}

                <div className="mt-3.5 space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-[#68758A]">
                    <MapPin className="w-3.5 h-3.5 text-[#8A97AB] shrink-0" />
                    <span className="truncate font-medium text-[#172033]">{rt.origin}</span>
                  </div>
                  <div className="flex items-center gap-2 pl-4 text-[#8A97AB]">
                    <ArrowRight className="w-3 h-3" />
                    <span className="text-[10px] font-mono">{rt.stops} Scheduled Waypoints ({rt.eta})</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#68758A]">
                    <MapPin className="w-3.5 h-3.5 text-[#2879E8] shrink-0" />
                    <span className="truncate font-medium text-[#172033]">{rt.destination}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#E2E8F0] flex items-center justify-between text-xs">
                <div>
                  <span className="font-mono text-[9px] text-[#8A97AB] uppercase block font-semibold">Assigned Unit</span>
                  <span className="font-mono text-[#172033] font-medium">{rt.assignedVehicle} · {rt.assignedDriver}</span>
                </div>
                <div className="flex items-center gap-2">
                  {rt.status === 'Completed' ? (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="default"
                        size="sm"
                        disabled
                        className="opacity-70 cursor-not-allowed bg-[#E8F7F0] text-[#16A36A] border border-[#C2E8D7]"
                      >
                        <Check className="w-3 h-3 mr-1 text-[#16A36A]" /> Completed
                      </Button>
                      <button
                        type="button"
                        onClick={() => handleResetTrack(rt.id)}
                        className="text-[10px] font-mono text-[#68758A] hover:text-[#2879E8] underline transition-colors cursor-pointer"
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
                    <div className="flex items-center gap-1.5">
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
                        Complete
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
