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

    const csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `AUTRAIL_Trips_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    if (onShowToast) {
      onShowToast('Trip register exported to CSV.', 'success');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <section className="flex items-end justify-between py-6 max-md:flex-col max-md:items-start max-md:gap-4 max-md:py-4">
        <div>
          <p className="font-mono text-[10px] tracking-[1.2px] text-[#475569] uppercase mb-2 font-bold">
            DISPATCH OPERATIONS <span className="text-[#2879E8] px-1 font-bold">•</span> JOURNEY TRACKING & SCHEDULING
          </p>
          <h1 className="text-[30px] tracking-tight font-black text-[#0B132B] m-0 leading-tight">
            Trip & Dispatch Management<span className="text-[#2879E8]">.</span>
          </h1>
          <p className="text-[13px] text-[#334155] mt-1.5 mb-0 font-medium">
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
      <div className="flex items-center gap-2 border-b border-[#E2E8F0] pb-3 overflow-x-auto select-none">
        <button
          type="button"
          onClick={() => setTab('dashboard')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer shrink-0 ${
            activeTab === 'dashboard'
              ? 'bg-[#EAF3FF] text-[#2879E8] border border-[#2879E8]/30 font-bold shadow-xs'
              : 'text-[#68758A] hover:bg-[#F8FAFD] hover:text-[#172033]'
          }`}
        >
          <LayoutGrid className="w-3.5 h-3.5 text-[#2879E8]" />
          <span>Trip Dashboard</span>
        </button>

        <button
          type="button"
          onClick={() => setTab('all')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer shrink-0 ${
            activeTab === 'all'
              ? 'bg-[#EAF3FF] text-[#2879E8] border border-[#2879E8]/30 font-bold shadow-xs'
              : 'text-[#68758A] hover:bg-[#F8FAFD] hover:text-[#172033]'
          }`}
        >
          <Route className="w-3.5 h-3.5 text-[#2879E8]" />
          <span>All Trips</span>
          <span className="font-mono text-[10px] bg-white text-[#2879E8] px-2 py-0.5 rounded-md border border-[#D5E2F1] font-bold">
            {trips.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setTab('active')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer shrink-0 ${
            activeTab === 'active'
              ? 'bg-[#EAF3FF] text-[#2879E8] border border-[#2879E8]/30 font-bold shadow-xs'
              : 'text-[#68758A] hover:bg-[#F8FAFD] hover:text-[#172033]'
          }`}
        >
          <Navigation className="w-3.5 h-3.5 text-[#16A36A]" />
          <span>Active Trips</span>
          {activeTrips.length > 0 && (
            <span className="font-mono text-[10px] bg-[#DCFCE7] text-[#16A36A] px-2 py-0.5 rounded-md border border-[#BBF7D0] flex items-center gap-1.5 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#16A36A] animate-pulse" />
              {activeTrips.length}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setTab('history')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer shrink-0 ${
            activeTab === 'history'
              ? 'bg-[#EAF3FF] text-[#2879E8] border border-[#2879E8]/30 font-bold shadow-xs'
              : 'text-[#68758A] hover:bg-[#F8FAFD] hover:text-[#172033]'
          }`}
        >
          <Clock className="w-3.5 h-3.5 text-[#68758A]" />
          <span>Trip History</span>
          <span className="font-mono text-[10px] bg-white text-[#68758A] px-2 py-0.5 rounded-md border border-[#D5E2F1] font-bold">
            {historyTrips.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setTab('reports')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer shrink-0 ${
            activeTab === 'reports'
              ? 'bg-[#EAF3FF] text-[#2879E8] border border-[#2879E8]/30 font-bold shadow-xs'
              : 'text-[#68758A] hover:bg-[#F8FAFD] hover:text-[#172033]'
          }`}
        >
          <FileText className="w-3.5 h-3.5 text-[#2879E8]" />
          <span>Trip Reports</span>
        </button>

        <button
          type="button"
          onClick={handleResetData}
          title="Reset database to demo seed data"
          className="ml-auto text-[#68758A] hover:text-[#172033] p-2 rounded-xl hover:bg-[#F0F5FC] transition-colors flex items-center gap-1.5 text-xs font-medium"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span className="max-md:hidden">Reset Demo</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: TRIP DASHBOARD */}
      {/* ========================================================================= */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* 6 KPI Cards (Calculated from real stored trip data) */}
          <div className="grid grid-cols-6 gap-4 max-xl:grid-cols-3 max-md:grid-cols-2">
            {/* Total Trips */}
            <article className="glass-card border border-white/95 rounded-2xl p-4 flex flex-col justify-between shadow-xl transition-all duration-200 hover:-translate-y-0.5">
              <div className="flex items-center justify-between text-[#68758A] font-mono text-[9px] tracking-[1px] uppercase font-semibold">
                <span>Total Trips</span>
                <Route className="w-3.5 h-3.5 text-[#2879E8]" />
              </div>
              <div className="text-[26px] font-black text-[#172033] my-2 font-mono leading-none tracking-tight">
                {metrics.totalTrips}
              </div>
              <p className="text-[11px] text-[#68758A] m-0">All registered journeys</p>
            </article>

            {/* Scheduled Trips */}
            <article className="glass-card border border-white/95 rounded-2xl p-4 flex flex-col justify-between shadow-xl transition-all duration-200 hover:-translate-y-0.5">
              <div className="flex items-center justify-between text-[#68758A] font-mono text-[9px] tracking-[1px] uppercase font-semibold">
                <span>Scheduled</span>
                <Calendar className="w-3.5 h-3.5 text-[#2879E8]" />
              </div>
              <div className="text-[26px] font-black text-[#2879E8] my-2 font-mono leading-none tracking-tight">
                {metrics.scheduledTrips + metrics.assignedTrips}
              </div>
              <p className="text-[11px] text-[#68758A] m-0">Awaiting departure</p>
            </article>

            {/* Active Trips */}
            <article className="glass-card border border-white/95 rounded-2xl p-4 flex flex-col justify-between shadow-xl transition-all duration-200 hover:-translate-y-0.5">
              <div className="flex items-center justify-between text-[#68758A] font-mono text-[9px] tracking-[1px] uppercase font-semibold">
                <span>Active Journeys</span>
                <Navigation className="w-3.5 h-3.5 text-[#16A36A]" />
              </div>
              <div className="text-[26px] font-black text-[#16A36A] my-2 font-mono leading-none flex items-center gap-2 tracking-tight">
                <span>{metrics.activeTrips}</span>
                {metrics.activeTrips > 0 && (
                  <span className="w-2 h-2 rounded-full bg-[#16A36A] animate-pulse" />
                )}
              </div>
              <p className="text-[11px] text-[#68758A] m-0">Currently in transit</p>
            </article>

            {/* Completed Trips */}
            <article className="glass-card border border-white/95 rounded-2xl p-4 flex flex-col justify-between shadow-xl transition-all duration-200 hover:-translate-y-0.5">
              <div className="flex items-center justify-between text-[#68758A] font-mono text-[9px] tracking-[1px] uppercase font-semibold">
                <span>Completed</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-[#16A36A]" />
              </div>
              <div className="text-[26px] font-black text-[#16A36A] my-2 font-mono leading-none tracking-tight">
                {metrics.completedTrips}
              </div>
              <p className="text-[11px] text-[#68758A] m-0">Successfully delivered</p>
            </article>

            {/* Delayed Trips */}
            <article className="glass-card border border-white/95 rounded-2xl p-4 flex flex-col justify-between shadow-xl transition-all duration-200 hover:-translate-y-0.5">
              <div className="flex items-center justify-between text-[#68758A] font-mono text-[9px] tracking-[1px] uppercase font-semibold">
                <span>Delayed</span>
                <AlertTriangle className="w-3.5 h-3.5 text-[#D97706]" />
              </div>
              <div className="text-[26px] font-black text-[#D97706] my-2 font-mono leading-none tracking-tight">
                {metrics.delayedTrips}
              </div>
              <p className="text-[11px] text-[#68758A] m-0">Require dispatch focus</p>
            </article>

            {/* Cancelled Trips */}
            <article className="glass-card border border-white/95 rounded-2xl p-4 flex flex-col justify-between shadow-xl transition-all duration-200 hover:-translate-y-0.5">
              <div className="flex items-center justify-between text-[#68758A] font-mono text-[9px] tracking-[1px] uppercase font-semibold">
                <span>Cancelled</span>
                <XCircle className="w-3.5 h-3.5 text-[#E05252]" />
              </div>
              <div className="text-[26px] font-black text-[#E05252] my-2 font-mono leading-none tracking-tight">
                {metrics.cancelledTrips}
              </div>
              <p className="text-[11px] text-[#68758A] m-0">Aborted / flagged</p>
            </article>
          </div>

          {/* Real-time Alerts Banner if present */}
          {alerts.length > 0 && (
            <div className="p-4 bg-[#FEF2F2] border border-[#FECACA] rounded-2xl shadow-sm text-[#B91C1C]">
              <div className="flex items-center gap-2 text-xs font-bold text-[#E05252] uppercase tracking-[1px] font-mono mb-2.5">
                <Bell className="w-4 h-4" />
                <span>Recent Trip Alerts ({alerts.length})</span>
              </div>
              <div className="grid grid-cols-2 gap-3 max-md:grid-cols-1">
                {alerts.map((alt) => (
                  <div
                    key={alt.id}
                    className="bg-white border border-[#FECACA] p-3 rounded-xl flex items-start gap-2.5 text-xs shadow-2xs"
                  >
                    <span className="w-2 h-2 rounded-full bg-[#E05252] shrink-0 mt-1.5" />
                    <div className="flex-1 min-w-0">
                      <b className="text-[#172033] block leading-snug">{alt.title}</b>
                      <p className="text-[#68758A] text-[11px] m-0 mt-0.5">{alt.message}</p>
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
                <h2 className="text-base font-bold text-[#0B132B] m-0">Active Journeys & Live Dispatch</h2>
                <p className="text-xs text-[#475569] m-0 font-medium">Trips currently in transit or flagged with route delays.</p>
              </div>
              <button
                type="button"
                onClick={() => setTab('active')}
                className="text-xs font-bold text-[#2879E8] hover:text-[#1765CC] transition-colors"
              >
                View all active ({activeTrips.length}) →
              </button>
            </div>

            {activeTrips.length === 0 ? (
              <div className="glass-card p-8 text-center text-[#64748B]">
                <p className="text-sm font-bold text-[#0F172A]">No trips currently in progress</p>
                <p className="text-xs text-[#475569] mt-1 font-medium">Start a scheduled trip from the All Trips view.</p>
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
                  <h2 className="text-base font-bold text-[#0B132B] m-0">Upcoming Scheduled Departures</h2>
                  <p className="text-xs text-[#475569] m-0 font-medium">Trips queued for departure within the dispatch schedule.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setTab('all')}
                  className="text-xs font-bold text-[#2879E8] hover:text-[#1765CC] transition-colors"
                >
                  View schedule →
                </button>
              </div>

              <div className="glass-card divide-y divide-[#E2E8F0]">
                {upcomingTrips.length === 0 ? (
                  <div className="p-6 text-center text-[#64748B] text-xs font-medium">No upcoming departures queued.</div>
                ) : (
                  upcomingTrips.slice(0, 4).map((trip) => (
                    <div
                      key={trip.id}
                      className="p-3.5 flex items-center justify-between gap-3 hover:bg-[#F8FAFD] transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="font-mono text-xs font-bold text-[#2879E8] bg-[#EAF3FF] px-2 py-0.5 rounded-lg border border-[#C8E0FF] shrink-0">
                          {trip.id}
                        </span>
                        <div className="truncate">
                          <b className="text-xs font-bold text-[#0F172A] block truncate">{trip.tripName}</b>
                          <span className="text-[11px] text-[#475569] font-medium">
                            {trip.pickupLocation} → {trip.destinationLocation}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <div className="text-right font-mono text-[11px] text-[#334155] font-semibold">
                          <div>{trip.assignedVehicleId || 'Vehicle TBD'}</div>
                          <div className="text-[#64748B] text-[10px] font-medium">
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
              <div className="glass-card p-4">
                <h3 className="text-xs font-mono uppercase tracking-[1px] text-[#475569] mb-3 font-bold">
                  Dispatch Financials
                </h3>
                <div className="space-y-3 font-mono">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[#64748B] font-medium">Total Trip Expenses</span>
                    <span className="text-base font-bold text-[#0B132B]">${metrics.totalExpenses.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[#64748B] font-medium">Recorded Distance</span>
                    <span className="text-[#0F172A] font-semibold">{metrics.totalDistanceKm} km</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[#64748B] font-medium">Avg Cost Per KM</span>
                    <span className="text-[#16A36A] font-bold">${metrics.averageCostPerKm} / km</span>
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
        <div className="glass-card p-6 space-y-4">
          <div className="border-b border-[#E2E8F0] pb-4">
            <h2 className="text-lg font-bold text-[#0B132B] m-0">Create New Fleet Trip Manifest</h2>
            <p className="text-xs text-[#475569] mt-1 font-medium">
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
          <div className="flex justify-between items-center glass-card p-4">
            <div>
              <h2 className="text-base font-bold text-[#0B132B] m-0">Live Active Journeys</h2>
              <p className="text-xs text-[#475569] m-0 font-medium">Tracking active vehicles and road transit progression.</p>
            </div>
            <div className="flex items-center gap-2 font-mono text-xs text-[#16A36A] bg-[#E8F7F0] px-3 py-1 rounded-xl border border-[#B7E4CF] font-bold">
              <span className="w-2 h-2 rounded-full bg-[#16A36A] animate-pulse" />
              <span>{activeTrips.length} Trips in Transit</span>
            </div>
          </div>

          {activeTrips.length === 0 ? (
            <div className="glass-card p-12 text-center text-[#64748B]">
              <p className="text-base font-bold text-[#0F172A]">No journeys currently active</p>
              <p className="text-xs text-[#475569] mt-1 font-medium">Start a scheduled trip from the All Trips table.</p>
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
          <div className="flex justify-between items-center glass-card p-4">
            <div>
              <h2 className="text-base font-bold text-[#0B132B] m-0">Completed & Past Trip Archive</h2>
              <p className="text-xs text-[#475569] m-0 font-medium">Historical records of completed and cancelled dispatches.</p>
            </div>
            <div className="text-xs font-mono text-[#475569] font-bold">
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
          <div className="glass-card p-6">
            <div className="flex justify-between items-start max-md:flex-col max-md:gap-4">
              <div>
                <h2 className="text-lg font-bold text-[#0B132B] m-0">Trip Completion & Performance Reports</h2>
                <p className="text-xs text-[#475569] mt-1 font-medium">
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
              <div className="bg-[#F8FAFD] p-3 rounded-xl border border-[#E2E8F0]">
                <p className="font-mono text-[9px] uppercase text-[#64748B] font-bold">Total Completed</p>
                <p className="text-xl font-black font-mono text-[#16A36A] my-1">{metrics.completedTrips}</p>
                <span className="text-[10px] text-[#475569] font-medium">With verified manifest</span>
              </div>
              <div className="bg-[#F8FAFD] p-3 rounded-xl border border-[#E2E8F0]">
                <p className="font-mono text-[9px] uppercase text-[#64748B] font-bold">Total Expenses</p>
                <p className="text-xl font-black font-mono text-[#0B132B] my-1">${metrics.totalExpenses.toFixed(2)}</p>
                <span className="text-[10px] text-[#475569] font-medium">Fuel, tolls & allowances</span>
              </div>
              <div className="bg-[#F8FAFD] p-3 rounded-xl border border-[#E2E8F0]">
                <p className="font-mono text-[9px] uppercase text-[#64748B] font-bold">Total Distance</p>
                <p className="text-xl font-black font-mono text-[#2879E8] my-1">{metrics.totalDistanceKm} km</p>
                <span className="text-[10px] text-[#475569] font-medium">Road travel verified</span>
              </div>
              <div className="bg-[#F8FAFD] p-3 rounded-xl border border-[#E2E8F0]">
                <p className="font-mono text-[9px] uppercase text-[#64748B] font-bold">Average Cost / KM</p>
                <p className="text-xl font-black font-mono text-[#16A36A] my-1">${metrics.averageCostPerKm}</p>
                <span className="text-[10px] text-[#475569] font-medium">Standard fleet benchmark</span>
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
