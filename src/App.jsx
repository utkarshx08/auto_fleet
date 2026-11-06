import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import PageLoader from './components/common/PageLoader';

// Lazy-loaded route views for optimal bundle splitting and performance
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Vehicles = lazy(() => import('./pages/Vehicles'));
const Tracking = lazy(() => import('./pages/Tracking'));
const Geofencing = lazy(() => import('./pages/Geofencing'));
const Analytics = lazy(() => import('./pages/Analytics'));
const Drivers = lazy(() => import('./pages/Drivers'));
const Maintenance = lazy(() => import('./pages/Maintenance'));
const Reports = lazy(() => import('./pages/Reports'));
const RoutesPage = lazy(() => import('./pages/RoutesPage'));
const Fuel = lazy(() => import('./pages/Fuel'));
const Trips = lazy(() => import('./pages/Trips'));
const TripDetails = lazy(() => import('./pages/TripDetails'));
const DriverPortal = lazy(() => import('./pages/DriverPortal'));
const Settings = lazy(() => import('./pages/Settings'));
const Login = lazy(() => import('./pages/Login'));

import Toast from './components/common/Toast';
import ErrorBoundary from './components/common/ErrorBoundary';
import AddVehicleModal from './components/vehicles/AddVehicleModal';
import EditVehicleModal from './components/vehicles/EditVehicleModal';
import VehicleDetailsModal from './components/vehicles/VehicleDetailsModal';
import NotificationsModal from './components/common/NotificationsModal';
import HelpCenterModal from './components/common/HelpCenterModal';
import CommandPalette from './components/common/CommandPalette';
import { initialVehicles, initialAlerts, initialDrivers } from './data/mockData';

function AppContent() {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState(initialVehicles);
  const [alerts, setAlerts] = useState(initialAlerts);
  const [toasts, setToasts] = useState([]);

  // Modals state
  const [isAddVehicleOpen, setIsAddVehicleOpen] = useState(false);
  const [isEditVehicleOpen, setIsEditVehicleOpen] = useState(false);
  const [isVehicleDetailsOpen, setIsVehicleDetailsOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isHelpCenterOpen, setIsHelpCenterOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [activeVehicle, setActiveVehicle] = useState(null);

  const showToast = (message, type = 'info') => {
    const id = Date.now() + Math.random().toString(36).substring(2, 6);
    const newToast = { id, message, type };
    setToasts((prev) => [...prev.slice(-4), newToast]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  };

  const handleDismissToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Keyboard shortcut listener for ⌘1 / Ctrl+1 -> Overview and ⌘K / Ctrl+K -> Command Palette
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === '1') {
        e.preventDefault();
        navigate('/overview');
        showToast('Shortcut triggered: Navigated to Overview (⌘1).', 'info');
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  // CRUD Operations on Vehicles
  const handleAddVehicle = (newVeh) => {
    setVehicles((prev) => [newVeh, ...prev]);
    showToast(`Vehicle ${newVeh.plate} successfully registered to fleet.`, 'success');
  };

  const handleUpdateVehicle = (updatedVeh) => {
    setVehicles((prev) =>
      prev.map((v) => (v.id === updatedVeh.id ? updatedVeh : v))
    );
    showToast(`Telemetry updated for vehicle ${updatedVeh.plate}.`, 'success');
  };

  const handleDeleteVehicle = (vehicle) => {
    setVehicles((prev) => prev.filter((v) => v.id !== vehicle.id));
    showToast(`Vehicle ${vehicle.plate} decommissioned from active fleet.`, 'warning');
  };

  const handleSelectVehicleOrAlert = (item) => {
    if (!item) return;
    const plateToFind = item.plate || item.vehicle || item.id;
    const found = vehicles.find((v) => v.plate === plateToFind || v.id === plateToFind);
    setActiveVehicle(found || item);
    setIsVehicleDetailsOpen(true);
  };
  const handleMarkAllRead = () => {
    setAlerts((prev) => prev.map((a) => ({ ...a, read: true })));
    showToast('All notifications marked as read.', 'success');
  };

  const handleClearAlerts = () => {
    setAlerts([]);
    showToast('All alerts cleared.', 'info');
  };

  const handleResolveAlert = (alert) => {
    setAlerts((prev) => prev.filter((a) => a.id !== alert.id));
    showToast(`Work order resolved for ${alert.title}.`, 'success');
  };

  const handleExportReport = () => {
    const headers = ['Vehicle', 'Driver', 'Status', 'Location', 'Fuel', 'Odometer'];
    const rows = vehicles.map((v) => [
      v.plate,
      v.driver,
      v.status,
      v.location,
      `${v.fuel}%`,
      `${v.odometer || 0} km`
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'autrail-fleet-report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('Fleet report exported as CSV.', 'success');
  };

  const handlePeriodChange = (period) => {
    const periodNames = { week: 'This week', month: 'This month', year: 'This year' };
    showToast(`Distance chart updated: ${periodNames[period] || period}.`, 'info');
  };

  return (
    <>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route
            path="/login"
            element={
              <Login
                onLoginSuccess={() => {
                  showToast('Authentication confirmed. Welcome, Jordan.', 'success');
                  navigate('/overview');
                }}
              />
            }
          />

          <Route
            path="/*"
            element={
              <MainLayout
                unreadAlertsCount={alerts.filter((a) => !a.read).length}
                vehicleCount={vehicles.length}
                maintenanceAlert={alerts.length > 0}
                onOpenNotifications={() => setIsNotificationsOpen(true)}
                onOpenHelp={() => setIsHelpCenterOpen(true)}
              >
                <Routes>
                  <Route path="/" element={<Navigate to="/overview" replace />} />
                  <Route
                    path="/overview"
                    element={
                      <Dashboard
                        vehicles={vehicles}
                        alerts={alerts}
                        onAddVehicle={() => setIsAddVehicleOpen(true)}
                        onExportReport={handleExportReport}
                        onViewVehicleDetails={(veh) => {
                          setActiveVehicle(veh || vehicles[0]);
                          setIsVehicleDetailsOpen(true);
                        }}
                        onViewAllVehicles={() => navigate('/vehicles')}
                        onViewAllAlerts={() => navigate('/maintenance')}
                        onSelectVehicle={handleSelectVehicleOrAlert}
                        onPeriodChange={handlePeriodChange}
                      />
                    }
                  />
                  <Route
                    path="/vehicles"
                    element={
                      <Vehicles
                        vehicles={vehicles}
                        onAddVehicle={() => setIsAddVehicleOpen(true)}
                        onEditVehicle={(v) => {
                          setActiveVehicle(v);
                          setIsEditVehicleOpen(true);
                        }}
                        onDeleteVehicle={handleDeleteVehicle}
                        onViewDetails={(v) => {
                          setActiveVehicle(v);
                          setIsVehicleDetailsOpen(true);
                        }}
                      />
                    }
                  />
                  <Route
                    path="/tracking"
                    element={
                      <Tracking
                        vehicles={vehicles}
                        onSelectVehicle={(v) => {
                          setActiveVehicle(v);
                          showToast(`Tracking transponder locked: ${v.plate}`, 'info');
                        }}
                      />
                    }
                  />
                  <Route
                    path="/geofencing"
                    element={
                      <Geofencing
                        onShowToast={showToast}
                      />
                    }
                  />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route
                    path="/maintenance"
                    element={
                      <Maintenance
                        vehicles={vehicles}
                        alerts={alerts}
                        onScheduleService={(record) => {
                          showToast(`Service order closed for ${record.vehicleId} ($${record.serviceCost}).`, 'success');
                        }}
                        onResolveAlert={handleResolveAlert}
                      />
                    }
                  />
                  <Route
                    path="/drivers"
                    element={
                      <Drivers
                        onAddDriver={() => showToast('Driver onboarding modal ready.', 'info')}
                        onViewDriver={(d) => showToast(`Managing operator file for ${d.name}.`, 'info')}
                        onAssignVehicle={(d) => showToast(`Reassigned vehicle for ${d.name}.`, 'info')}
                      />
                    }
                  />
                  <Route
                    path="/reports"
                    element={
                      <Reports
                        vehicles={vehicles}
                        onExportCSV={handleExportReport}
                      />
                    }
                  />
                  <Route path="/routes" element={<RoutesPage />} />
                  <Route
                    path="/trips"
                    element={
                      <Trips
                        vehicles={vehicles}
                        drivers={initialDrivers}
                        onShowToast={showToast}
                      />
                    }
                  />
                  <Route
                    path="/trips/:tripId"
                    element={
                      <TripDetails
                        vehicles={vehicles}
                        drivers={initialDrivers}
                        onShowToast={showToast}
                      />
                    }
                  />
                  <Route
                    path="/driver"
                    element={
                      <DriverPortal
                        onShowToast={showToast}
                      />
                    }
                  />
                  <Route
                    path="/fuel"
                    element={
                      <Fuel
                        vehicles={vehicles}
                        drivers={initialDrivers}
                        onAddFuelExpense={(rec) => {
                          showToast(`Fuel purchase logged for ${rec.vehicleId} ($${rec.totalAmount}).`, 'success');
                        }}
                      />
                    }
                  />
                  <Route
                    path="/settings"
                    element={
                      <Settings
                        onSaveSettings={() => showToast('System preferences updated.', 'success')}
                      />
                    }
                  />
                  <Route path="*" element={<Navigate to="/overview" replace />} />
                </Routes>
              </MainLayout>
            }
          />
        </Routes>
      </Suspense>

      {/* Global Interactive Modals */}
      <AddVehicleModal
        isOpen={isAddVehicleOpen}
        onClose={() => setIsAddVehicleOpen(false)}
        onAddVehicle={handleAddVehicle}
      />

      <EditVehicleModal
        isOpen={isEditVehicleOpen}
        onClose={() => setIsEditVehicleOpen(false)}
        vehicle={activeVehicle}
        onUpdateVehicle={handleUpdateVehicle}
      />

      <VehicleDetailsModal
        isOpen={isVehicleDetailsOpen}
        onClose={() => setIsVehicleDetailsOpen(false)}
        vehicle={activeVehicle}
        onEdit={(veh) => {
          setActiveVehicle(veh);
          setIsEditVehicleOpen(true);
        }}
        onDelete={handleDeleteVehicle}
      />

      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        alerts={alerts}
        onMarkAllAsRead={handleMarkAllRead}
        onClearAlerts={handleClearAlerts}
        onSelectAlert={(alert) => {
          const veh = vehicles.find((v) => v.plate === alert.vehicle);
          if (veh) {
            setActiveVehicle(veh);
            setIsVehicleDetailsOpen(true);
          }
        }}
      />

      <HelpCenterModal
        isOpen={isHelpCenterOpen}
        onClose={() => setIsHelpCenterOpen(false)}
      />

      {/* Global Quick Command Palette (⌘K / Ctrl+K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        vehicles={vehicles}
        onAddVehicle={() => setIsAddVehicleOpen(true)}
        onExportReport={handleExportReport}
      />

      {/* Real-time Toast Feedback Stack */}
      <Toast
        toasts={toasts}
        onDismiss={handleDismissToast}
      />
    </>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </ErrorBoundary>
  );
}
