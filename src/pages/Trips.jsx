import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  LayoutGrid,
  Route,
  Plus,
  Navigation,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileText,
  Clock,
  Truck,
  TrendingUp,
  DollarSign,
  Download,
  Filter,
  RefreshCw,
  Bell
} from 'lucide-react';
import Button from '../components/common/Button';
import TripCard from '../components/trips/TripCard';
import TripTable from '../components/trips/TripTable';
import TripStatusBadge from '../components/trips/TripStatusBadge';
import TripForm from '../components/trips/TripForm';
import CreateTripModal from '../components/trips/CreateTripModal';
import TripReportModal from '../components/trips/TripReportModal';
import {
  getTrips,
  getTripMetrics,
  generateTripAlerts,
  deleteTrip,
  updateTripStatus,
  calculateTripExpenses,
  resetTripsToMock
} from '../services/tripService';

export default function Trips({
  vehicles = [],
  drivers = [],
  onShowToast,
  onOpenCreateTrip,
  onOpenTripDetails
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Active Tab from query param or fallback to 'dashboard'
  const activeTab = searchParams.get('tab') || 'dashboard';

  const setTab = (tabName) => {
    setSearchParams({ tab: tabName });
  };

  // Operational State
  const [trips, setTrips] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingTrip, setEditingTrip] = useState(null);
  const [selectedReportTrip, setSelectedReportTrip] = useState(null);

  // Load Trips
  useEffect(() => {
    const loaded = getTrips();
    setTrips(loaded);
  }, [refreshKey]);

  const handleOpenCreate = () => {
    setEditingTrip(null);
    setIsCreateModalOpen(true);
  };

  const handleEditTrip = (trip) => {
    setEditingTrip(trip);
    setIsCreateModalOpen(true);
  };

  const handleTripSaved = (savedTrip) => {
    setRefreshKey((prev) => prev + 1);
    if (onShowToast) {
      onShowToast(`Trip ${savedTrip.id} (${savedTrip.tripName}) saved successfully.`, 'success');
    }
  };

  // Derived Metrics & Alerts (Calculated 100% from actual data!)
  const metrics = useMemo(() => {
    return getTripMetrics(trips);
  }, [trips]);

  const alerts = useMemo(() => {
    return generateTripAlerts(trips);
  }, [trips]);

  // Tab subsets
  const activeTrips = useMemo(() => {
    return trips.filter((t) => t.status === 'In Progress' || t.status === 'Delayed');
  }, [trips]);

  const upcomingTrips = useMemo(() => {
    return trips.filter((t) => t.status === 'Scheduled' || t.status === 'Assigned');
  }, [trips]);

  const historyTrips = useMemo(() => {
    return trips.filter((t) => t.status === 'Completed' || t.status === 'Cancelled');
  }, [trips]);

  // Handlers
  const handleStatusTransition = (tripId, targetStatus) => {
    try {
      const updated = updateTripStatus(tripId, targetStatus, `Operator status trigger to ${targetStatus}`);
      setRefreshKey((prev) => prev + 1);
      if (onShowToast) {
        onShowToast(`Trip ${tripId} status updated to ${targetStatus}.`, 'success');
      }
    } catch (err) {
      if (onShowToast) {
        onShowToast(err.message, 'error');
      }
    }
  };

  const handleDeleteTrip = (tripId) => {
    try {
      deleteTrip(tripId);
      setRefreshKey((prev) => prev + 1);
      if (onShowToast) {
        onShowToast(`Trip ${tripId} deleted successfully.`, 'warning');
      }
    } catch (err) {
      if (onShowToast) {
        onShowToast(err.message, 'error');
      }
    }
  };

  const handleResetData = () => {
    resetTripsToMock();
    setRefreshKey((prev) => prev + 1);
    if (onShowToast) {
      onShowToast('Trip database reset to initial demonstration dataset.', 'info');
    }
  };

  const handleViewDetails = (trip) => {
    if (onOpenTripDetails) {
      onOpenTripDetails(trip);
    } else {
      navigate(`/trips/${trip.id}`);
    }
  };

  const handleExportCSV = () => {
    const headers = [
      'Trip ID',
      'Trip Name',
      'Customer',
      'Pickup Location',
      'Destination',
      'Vehicle ID',
      'Driver ID',
      'Status',
      'Priority',
      'Departure',
      'Arrival',
      'Est Distance (km)',
      'Actual Distance (km)',
      'Total Expenses ($)'
    ];

    const rows = trips.map((t) => {
      const { totalExpense } = calculateTripExpenses(t);
      return [
        `"${t.id}"`,
        `"${t.tripName}"`,
        `"${t.customerName}"`,
        `"${t.pickupLocation}"`,
        `"${t.destinationLocation}"`,
        `"${t.assignedVehicleId || 'Unassigned'}"`,
        `"${t.assignedDriverId || 'Unassigned'}"`,
        `"${t.status}"`,
        `"${t.priority}"`,
        `"${t.actualDeparture || t.scheduledDeparture}"`,
        `"${t.actualArrival || t.scheduledArrival}"`,
        t.estimatedDistanceKm || 0,
        t.actualDistanceKm || 0,
        totalExpense.toFixed(2)
      ];
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `AUTRAIL_Trips_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    if (onShowToast) {
      onShowToast('Trip register exported to CSV.', 'success');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <section className="flex items-end justify-between py-6 max-md:flex-col max-md:items-start max-md:gap-4 max-md:py-4">
        <div>
          <p className="font-mono text-[10px] tracking-[1.2px] text-[#858894] uppercase mb-2">
            DISPATCH OPERATIONS <span className="text-[#ad91ff] px-1">•</span> JOURNEY TRACKING & SCHEDULING
          </p>
          <h1 className="text-[30px] tracking-[-1.2px] font-bold text-[#f0f0f4] m-0 leading-tight">
            Trip & Dispatch Management<span className="text-[#ad91ff]">.</span>
          </h1>
          <p className="text-[12px] text-[#898c98] mt-1.5 mb-0">
            Monitor active journeys, assign drivers & vehicles, manage intermediate waypoints, and control trip expenses.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 max-md:w-full flex-wrap">
          <Button
            variant="quiet"
            onClick={handleExportCSV}
            icon={Download}
            className="max-md:flex-1"
          >
            Export Trips
          </Button>
          <Button
            variant="primary"
            onClick={handleOpenCreate}
            icon={Plus}
            className="max-md:flex-1"
          >
            Create New Trip
          </Button>
        </div>
      </section>

      {/* Sub-navigation Tabs */}
      <div className="flex items-center gap-1.5 border-b border-[#252834] pb-3 overflow-x-auto select-none">
        <button
          type="button"
          onClick={() => setTab('dashboard')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-[7px] text-xs font-medium transition-all cursor-pointer shrink-0 ${
            activeTab === 'dashboard'
              ? 'bg-[#24212f] text-[#e9e2ff] border border-[#3b3353] shadow-[inset_0_0_12px_rgba(180,154,255,0.15)]'
              : 'text-[#8b8e9a] hover:bg-[#1a1b24] hover:text-[#d4d4dc]'
          }`}
        >
          <LayoutGrid className="w-3.5 h-3.5 text-[#ad91ff]" />
          <span>Trip Dashboard</span>
        </button>

        <button
          type="button"
          onClick={() => setTab('all')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-[7px] text-xs font-medium transition-all cursor-pointer shrink-0 ${
            activeTab === 'all'
              ? 'bg-[#24212f] text-[#e9e2ff] border border-[#3b3353]'
              : 'text-[#8b8e9a] hover:bg-[#1a1b24] hover:text-[#d4d4dc]'
          }`}
        >
          <Route className="w-3.5 h-3.5 text-[#ad91ff]" />
          <span>All Trips</span>
          <span className="font-mono text-[10px] bg-[#1a1b24] text-[#c4b3ff] px-1.5 py-0.2 rounded border border-[#2d2e3d]">
            {trips.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setTab('active')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-[7px] text-xs font-medium transition-all cursor-pointer shrink-0 ${
            activeTab === 'active'
              ? 'bg-[#24212f] text-[#e9e2ff] border border-[#3b3353]'
              : 'text-[#8b8e9a] hover:bg-[#1a1b24] hover:text-[#d4d4dc]'
          }`}
        >
          <Navigation className="w-3.5 h-3.5 text-[#6ee7b7]" />
          <span>Active Trips</span>
          {activeTrips.length > 0 && (
            <span className="font-mono text-[10px] bg-[#122822] text-[#6ee7b7] px-1.5 py-0.2 rounded border border-[#1d4c3e] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
              {activeTrips.length}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setTab('history')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-[7px] text-xs font-medium transition-all cursor-pointer shrink-0 ${
            activeTab === 'history'
              ? 'bg-[#24212f] text-[#e9e2ff] border border-[#3b3353]'
              : 'text-[#8b8e9a] hover:bg-[#1a1b24] hover:text-[#d4d4dc]'
          }`}
        >
          <Clock className="w-3.5 h-3.5 text-[#a0a3b1]" />
          <span>Trip History</span>
          <span className="font-mono text-[10px] bg-[#1a1b24] text-[#8e919f] px-1.5 py-0.2 rounded border border-[#2d2e3d]">
            {historyTrips.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setTab('reports')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-[7px] text-xs font-medium transition-all cursor-pointer shrink-0 ${
            activeTab === 'reports'
              ? 'bg-[#24212f] text-[#e9e2ff] border border-[#3b3353]'
              : 'text-[#8b8e9a] hover:bg-[#1a1b24] hover:text-[#d4d4dc]'
          }`}
        >
          <FileText className="w-3.5 h-3.5 text-[#ad91ff]" />
          <span>Trip Reports</span>
        </button>

        <button
          type="button"
          onClick={handleResetData}
          title="Reset database to demo seed data"
          className="ml-auto text-[#737684] hover:text-[#d4d4dc] p-1.5 rounded hover:bg-[#1f212c] transition-colors flex items-center gap-1 text-[11px]"
        >
          <RefreshCw className="w-3 h-3" />
          <span className="max-md:hidden">Reset Demo</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: TRIP DASHBOARD */}
      {/* ========================================================================= */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* 6 KPI Cards (Calculated from real stored trip data) */}
          <div className="grid grid-cols-6 gap-3 max-xl:grid-cols-3 max-md:grid-cols-2">
            {/* Total Trips */}
            <article className="bg-[#17191f] border border-[#292c35] hover:border-[#383c4a] rounded-[10px] p-4 flex flex-col justify-between transition-colors">
              <div className="flex items-center justify-between text-[#8b8e9a] font-mono text-[9px] tracking-[1px] uppercase">
                <span>Total Trips</span>
                <Route className="w-3.5 h-3.5 text-[#ad91ff]" />
              </div>
              <div className="text-[26px] font-bold text-[#f0f0f4] my-2 font-mono leading-none">
                {metrics.totalTrips}
              </div>
              <p className="text-[11px] text-[#747683] m-0">All registered journeys</p>
            </article>

            {/* Scheduled Trips */}
            <article className="bg-[#17191f] border border-[#292c35] hover:border-[#383c4a] rounded-[10px] p-4 flex flex-col justify-between transition-colors">
              <div className="flex items-center justify-between text-[#8b8e9a] font-mono text-[9px] tracking-[1px] uppercase">
                <span>Scheduled</span>
                <Calendar className="w-3.5 h-3.5 text-[#8cb4ff]" />
              </div>
              <div className="text-[26px] font-bold text-[#8cb4ff] my-2 font-mono leading-none">
                {metrics.scheduledTrips + metrics.assignedTrips}
              </div>
              <p className="text-[11px] text-[#747683] m-0">Awaiting departure</p>
            </article>

            {/* Active Trips */}
            <article className="bg-[#17191f] border border-[#292c35] hover:border-[#383c4a] rounded-[10px] p-4 flex flex-col justify-between transition-colors">
              <div className="flex items-center justify-between text-[#8b8e9a] font-mono text-[9px] tracking-[1px] uppercase">
                <span>Active Journeys</span>
                <Navigation className="w-3.5 h-3.5 text-[#6ee7b7]" />
              </div>
              <div className="text-[26px] font-bold text-[#6ee7b7] my-2 font-mono leading-none flex items-center gap-2">
                <span>{metrics.activeTrips}</span>
                {metrics.activeTrips > 0 && (
                  <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
                )}
              </div>
              <p className="text-[11px] text-[#747683] m-0">Currently in transit</p>
            </article>

            {/* Completed Trips */}
            <article className="bg-[#17191f] border border-[#292c35] hover:border-[#383c4a] rounded-[10px] p-4 flex flex-col justify-between transition-colors">
              <div className="flex items-center justify-between text-[#8b8e9a] font-mono text-[9px] tracking-[1px] uppercase">
                <span>Completed</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-[#70cbb7]" />
              </div>
              <div className="text-[26px] font-bold text-[#70cbb7] my-2 font-mono leading-none">
                {metrics.completedTrips}
              </div>
              <p className="text-[11px] text-[#747683] m-0">Successfully delivered</p>
            </article>

            {/* Delayed Trips */}
            <article className="bg-[#17191f] border border-[#292c35] hover:border-[#383c4a] rounded-[10px] p-4 flex flex-col justify-between transition-colors">
              <div className="flex items-center justify-between text-[#8b8e9a] font-mono text-[9px] tracking-[1px] uppercase">
                <span>Delayed</span>
                <AlertTriangle className="w-3.5 h-3.5 text-[#fcd34d]" />
              </div>
              <div className="text-[26px] font-bold text-[#fcd34d] my-2 font-mono leading-none">
                {metrics.delayedTrips}
              </div>
              <p className="text-[11px] text-[#747683] m-0">Require dispatch focus</p>
            </article>

            {/* Cancelled Trips */}
            <article className="bg-[#17191f] border border-[#292c35] hover:border-[#383c4a] rounded-[10px] p-4 flex flex-col justify-between transition-colors">
              <div className="flex items-center justify-between text-[#8b8e9a] font-mono text-[9px] tracking-[1px] uppercase">
                <span>Cancelled</span>
                <XCircle className="w-3.5 h-3.5 text-[#fca5a5]" />
              </div>
              <div className="text-[26px] font-bold text-[#fca5a5] my-2 font-mono leading-none">
                {metrics.cancelledTrips}
              </div>
              <p className="text-[11px] text-[#747683] m-0">Aborted / flagged</p>
            </article>
          </div>

          {/* Real-time Alerts Banner if present */}
          {alerts.length > 0 && (
            <div className="bg-[#241a1c] border border-[#48282d] rounded-[10px] p-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#f87171] uppercase tracking-[1px] font-mono mb-2">
                <Bell className="w-3.5 h-3.5" />
                <span>Recent Trip Alerts ({alerts.length})</span>
              </div>
              <div className="grid grid-cols-2 gap-2.5 max-md:grid-cols-1">
                {alerts.map((alt) => (
                  <div
                    key={alt.id}
                    className="bg-[#191419] border border-[#3b232a] p-2.5 rounded-[7px] flex items-start gap-2.5 text-xs"
                  >
                    <span className="w-2 h-2 rounded-full bg-[#f87171] shrink-0 mt-1.5" />
                    <div className="flex-1 min-w-0">
                      <b className="text-[#f0f0f4] block leading-snug">{alt.title}</b>
                      <p className="text-[#9ea0ad] text-[11px] m-0">{alt.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section: Active Journeys */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-[#f0f0f4] m-0">Active Journeys & Live Dispatch</h2>
                <p className="text-xs text-[#858894] m-0">Trips currently in transit or flagged with route delays.</p>
              </div>
              <button
                type="button"
                onClick={() => setTab('active')}
                className="text-xs text-[#ad91ff] hover:text-[#c4b3ff] transition-colors"
              >
                View all active ({activeTrips.length}) →
              </button>
            </div>

            {activeTrips.length === 0 ? (
              <div className="bg-[#17191f] border border-[#292c35] rounded-[10px] p-8 text-center text-[#747683]">
                <p className="text-sm font-medium text-[#9a9ca8]">No trips currently in progress</p>
                <p className="text-xs text-[#676a77] mt-1">Start a scheduled trip from the All Trips view.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 max-lg:grid-cols-1">
                {activeTrips.map((trip) => (
                  <TripCard
                    key={trip.id}
                    trip={trip}
                    onViewDetails={handleViewDetails}
                    onEdit={handleEditTrip}
                    onStatusTransition={handleStatusTransition}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Section: Upcoming Trips & Utilization Grid */}
          <div className="grid grid-cols-3 gap-6 max-xl:grid-cols-1">
            {/* Upcoming Trips */}
            <div className="col-span-2 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-semibold text-[#f0f0f4] m-0">Upcoming Scheduled Departures</h2>
                  <p className="text-xs text-[#858894] m-0">Trips queued for departure within the dispatch schedule.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setTab('all')}
                  className="text-xs text-[#ad91ff] hover:text-[#c4b3ff] transition-colors"
                >
                  View schedule →
                </button>
              </div>

              <div className="bg-[#17191f] border border-[#292c35] rounded-[10px] divide-y divide-[#242631]">
                {upcomingTrips.length === 0 ? (
                  <div className="p-6 text-center text-[#747683] text-xs">No upcoming departures queued.</div>
                ) : (
                  upcomingTrips.slice(0, 4).map((trip) => (
                    <div
                      key={trip.id}
                      className="p-3.5 flex items-center justify-between gap-3 hover:bg-[#1c1e26] transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="font-mono text-xs text-[#ad91ff] bg-[#24212f] px-2 py-0.5 rounded border border-[#3b3252] shrink-0">
                          {trip.id}
                        </span>
                        <div className="truncate">
                          <b className="text-xs text-[#f0f0f4] block truncate">{trip.tripName}</b>
                          <span className="text-[11px] text-[#747683]">
                            {trip.pickupLocation} → {trip.destinationLocation}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <div className="text-right font-mono text-[11px] text-[#9a9ca8]">
                          <div>{trip.assignedVehicleId || 'Vehicle TBD'}</div>
                          <div className="text-[#676a77] text-[10px]">
                            {new Date(trip.scheduledDeparture).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                        <TripStatusBadge status={trip.status} size="sm" />
                        <button
                          type="button"
                          onClick={() => handleViewDetails(trip)}
                          className="text-xs text-[#ad91ff] hover:text-[#c4b3ff] p-1"
                        >
                          Details
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Sidebar: Status Breakdown & Fleet Utilization */}
            <div className="space-y-4">
              {/* Trip Status Distribution */}
              <div className="bg-[#17191f] border border-[#292c35] rounded-[10px] p-4">
                <h3 className="text-xs font-mono uppercase tracking-[1px] text-[#858894] mb-3">
                  Status Distribution
                </h3>
                <div className="space-y-2.5">
                  {Object.entries(metrics.statusDistribution).map(([status, count]) => {
                    const pct = metrics.totalTrips > 0 ? Math.round((count / metrics.totalTrips) * 100) : 0;
                    return (
                      <div key={status} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-[#c4c6d0]">{status}</span>
                          <span className="font-mono text-[#858894]">{count} ({pct}%)</span>
                        </div>
                        <div className="w-full h-1 bg-[#252834] rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              status === 'Completed'
                                ? 'bg-[#70cbb7]'
                                : status === 'In Progress'
                                ? 'bg-[#10b981]'
                                : status === 'Delayed'
                                ? 'bg-[#f59e0b]'
                                : status === 'Cancelled'
                                ? 'bg-[#ef4444]'
                                : 'bg-[#ad91ff]'
                            }`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Financial Snapshot */}
              <div className="bg-[#17191f] border border-[#292c35] rounded-[10px] p-4">
                <h3 className="text-xs font-mono uppercase tracking-[1px] text-[#858894] mb-3">
                  Dispatch Financials
                </h3>
                <div className="space-y-3 font-mono">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[#858894]">Total Trip Expenses</span>
                    <span className="text-base font-bold text-[#f0f0f4]">${metrics.totalExpenses.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[#858894]">Recorded Distance</span>
                    <span className="text-[#d4d4dc]">{metrics.totalDistanceKm} km</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[#858894]">Avg Cost Per KM</span>
                    <span className="text-[#6ee7b7]">${metrics.averageCostPerKm} / km</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: ALL TRIPS (TABLE VIEW) */}
      {/* ========================================================================= */}
      {activeTab === 'all' && (
        <TripTable
          trips={trips}
          onViewDetails={handleViewDetails}
          onEditTrip={handleEditTrip}
          onDeleteTrip={handleDeleteTrip}
          onStatusTransition={handleStatusTransition}
        />
      )}

      {/* ========================================================================= */}
      {/* TAB: CREATE NEW TRIP (IN-PAGE WORKFLOW) */}
      {/* ========================================================================= */}
      {activeTab === 'create' && (
        <div className="bg-[#17191f] border border-[#292c35] p-6 rounded-[10px] space-y-4">
          <div className="border-b border-[#252834] pb-4">
            <h2 className="text-lg font-semibold text-[#f0f0f4] m-0">Create New Fleet Trip Manifest</h2>
            <p className="text-xs text-[#858894] mt-1">
              Configure route waypoints, departure windows, vehicle assignment & conflict verification.
            </p>
          </div>
          <TripForm
            vehicles={vehicles}
            drivers={drivers}
            onSave={(saved) => {
              handleTripSaved(saved);
              setTab('all');
            }}
            onCancel={() => setTab('dashboard')}
          />
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: ACTIVE TRIPS */}
      {/* ========================================================================= */}
      {activeTab === 'active' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-[#17191f] border border-[#292c35] p-4 rounded-[10px]">
            <div>
              <h2 className="text-base font-semibold text-[#f0f0f4] m-0">Live Active Journeys</h2>
              <p className="text-xs text-[#858894] m-0">Tracking active vehicles and road transit progression.</p>
            </div>
            <div className="flex items-center gap-2 font-mono text-xs text-[#6ee7b7] bg-[#122822] px-3 py-1 rounded border border-[#1d4c3e]">
              <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
              <span>{activeTrips.length} Trips in Transit</span>
            </div>
          </div>

          {activeTrips.length === 0 ? (
            <div className="bg-[#17191f] border border-[#292c35] rounded-[10px] p-12 text-center text-[#747683]">
              <p className="text-base font-medium text-[#9a9ca8]">No journeys currently active</p>
              <p className="text-xs text-[#676a77] mt-1">Start a scheduled trip from the All Trips table.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 max-lg:grid-cols-1">
              {activeTrips.map((trip) => (
                <TripCard
                  key={trip.id}
                  trip={trip}
                  onViewDetails={handleViewDetails}
                  onEdit={handleEditTrip}
                  onStatusTransition={handleStatusTransition}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: TRIP HISTORY */}
      {/* ========================================================================= */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-[#17191f] border border-[#292c35] p-4 rounded-[10px]">
            <div>
              <h2 className="text-base font-semibold text-[#f0f0f4] m-0">Completed & Past Trip Archive</h2>
              <p className="text-xs text-[#858894] m-0">Historical records of completed and cancelled dispatches.</p>
            </div>
            <div className="text-xs font-mono text-[#858894]">
              {historyTrips.length} Archive Records
            </div>
          </div>

          <TripTable
            trips={historyTrips}
            onViewDetails={handleViewDetails}
            onEditTrip={handleEditTrip}
            onDeleteTrip={handleDeleteTrip}
            onStatusTransition={handleStatusTransition}
          />
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: TRIP REPORTS */}
      {/* ========================================================================= */}
      {activeTab === 'reports' && (
        <div className="space-y-4">
          <div className="bg-[#17191f] border border-[#292c35] p-6 rounded-[10px]">
            <div className="flex justify-between items-start max-md:flex-col max-md:gap-4">
              <div>
                <h2 className="text-lg font-semibold text-[#f0f0f4] m-0">Trip Completion & Performance Reports</h2>
                <p className="text-xs text-[#858894] mt-1">
                  Export structured manifests, review cost per kilometer, fuel expenses, and audit logs.
                </p>
              </div>
              <Button
                variant="primary"
                onClick={handleExportCSV}
                icon={Download}
              >
                Export Complete Manifest (CSV)
              </Button>
            </div>

            <div className="grid grid-cols-4 gap-4 mt-6 max-lg:grid-cols-2">
              <div className="bg-[#121319] p-3 rounded-[8px] border border-[#242631]">
                <p className="font-mono text-[9px] uppercase text-[#747683]">Total Completed</p>
                <p className="text-xl font-bold font-mono text-[#70cbb7] my-1">{metrics.completedTrips}</p>
                <span className="text-[10px] text-[#858894]">With verified manifest</span>
              </div>
              <div className="bg-[#121319] p-3 rounded-[8px] border border-[#242631]">
                <p className="font-mono text-[9px] uppercase text-[#747683]">Total Expenses</p>
                <p className="text-xl font-bold font-mono text-[#f0f0f4] my-1">${metrics.totalExpenses.toFixed(2)}</p>
                <span className="text-[10px] text-[#858894]">Fuel, tolls & allowances</span>
              </div>
              <div className="bg-[#121319] p-3 rounded-[8px] border border-[#242631]">
                <p className="font-mono text-[9px] uppercase text-[#747683]">Total Distance</p>
                <p className="text-xl font-bold font-mono text-[#c4b3ff] my-1">{metrics.totalDistanceKm} km</p>
                <span className="text-[10px] text-[#858894]">Road travel verified</span>
              </div>
              <div className="bg-[#121319] p-3 rounded-[8px] border border-[#242631]">
                <p className="font-mono text-[9px] uppercase text-[#747683]">Average Cost / KM</p>
                <p className="text-xl font-bold font-mono text-[#6ee7b7] my-1">${metrics.averageCostPerKm}</p>
                <span className="text-[10px] text-[#858894]">Standard fleet benchmark</span>
              </div>
            </div>
          </div>

          <TripTable
            trips={trips.filter((t) => t.status === 'Completed')}
            onViewDetails={(trip) => setSelectedReportTrip(trip)}
            onEditTrip={handleEditTrip}
            onDeleteTrip={handleDeleteTrip}
            onStatusTransition={handleStatusTransition}
          />
        </div>
      )}

      {/* Global Interactive Create / Edit Modal */}
      <CreateTripModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setEditingTrip(null);
        }}
        initialTrip={editingTrip}
        vehicles={vehicles}
        drivers={drivers}
        onTripSaved={handleTripSaved}
      />

      {/* Trip Completion Report Manifest Modal */}
      <TripReportModal
        isOpen={Boolean(selectedReportTrip)}
        onClose={() => setSelectedReportTrip(null)}
        trip={selectedReportTrip}
        vehicle={vehicles.find((v) => v.id === selectedReportTrip?.assignedVehicleId || v.plate === selectedReportTrip?.assignedVehicleId)}
        driver={drivers.find((d) => d.id === selectedReportTrip?.assignedDriverId || d.name === selectedReportTrip?.assignedDriverId)}
      />
    </div>
  );
}
