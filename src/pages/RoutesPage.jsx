import React, { useState, useMemo } from 'react';
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
  Check
} from 'lucide-react';

export default function RoutesPage() {
  const [routes, setRoutes] = useState([
    {
      id: 'RT-401',
      name: 'Midtown Express Loop',
      origin: 'Queens Terminal Hub',
      destination: 'Manhattan Financial District',
      stops: 8,
      distance: '34.2 km',
      eta: '45 mins',
      assignedVehicle: 'RST-291',
      assignedDriver: 'Alex Morgan',
      status: 'In Progress'
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
      assignedDriver: 'Sarah Chen',
      status: 'In Progress'
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
      assignedDriver: 'David Kim',
      status: 'Scheduled'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const handleCreateRoute = (newRoute) => {
    setRoutes((prev) => [newRoute, ...prev]);
  };

  const handleToggleStatus = (routeId) => {
    setRoutes((prev) =>
      prev.map((r) => {
        if (r.id === routeId) {
          const nextStatus =
            r.status === 'Scheduled'
              ? 'In Progress'
              : r.status === 'In Progress'
              ? 'Completed'
              : 'Scheduled';
          return { ...r, status: nextStatus };
        }
        return r;
      })
    );
  };

  const handleDeleteRoute = (routeId) => {
    setRoutes((prev) => prev.filter((r) => r.id !== routeId));
  };

  const filteredRoutes = useMemo(() => {
    return routes.filter((rt) => {
      const matchSearch =
        rt.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rt.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rt.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rt.assignedVehicle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rt.assignedDriver.toLowerCase().includes(searchTerm.toLowerCase());

      const matchStatus =
        statusFilter === 'ALL' || rt.status.toLowerCase() === statusFilter.toLowerCase();
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
          {['ALL', 'In Progress', 'Scheduled', 'Completed'].map((st) => (
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
                    <span
                      className={`font-mono text-[9px] px-2 py-0.5 rounded-full ${
                        rt.status === 'In Progress'
                          ? 'bg-[#1c302a] text-[#83d7a9] border border-[#2c493d]'
                          : rt.status === 'Completed'
                          ? 'bg-[#20222a] text-[#717480] border border-[#30333d]'
                          : 'bg-[#382c25] text-[#e5a46e] border border-[#523d30]'
                      }`}
                    >
                      ● {rt.status}
                    </span>
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
                  <Button
                    variant="quiet"
                    size="sm"
                    onClick={() => handleToggleStatus(rt.id)}
                  >
                    {rt.status === 'Scheduled' ? (
                      <>
                        <Play className="w-3 h-3 mr-1 text-[#83d7a9]" /> Dispatch
                      </>
                    ) : rt.status === 'In Progress' ? (
                      <>
                        <Check className="w-3 h-3 mr-1 text-[#b49aff]" /> Complete
                      </>
                    ) : (
                      'Restart'
                    )}
                  </Button>
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
