// ============================================================================
// AUTRAIL AUTOMATED MAINTENANCE SCHEDULING SERVICE
// Core Mathematical Calculations, Status Deduction & Notification Engine
// ============================================================================

/**
 * Calculates next service odometer threshold
 */
export const calculateNextOdometer = (lastOdometer, intervalKm) => {
  const last = Number(lastOdometer) || 0;
  const interval = Number(intervalKm) || 10000;
  return last + interval;
};

/**
 * Calculates next service date milestone from interval days
 */
export const calculateNextDate = (lastDateStr, intervalDays) => {
  const base = lastDateStr ? new Date(lastDateStr) : new Date();
  const days = Number(intervalDays) || 180;
  const target = new Date(base.getTime() + days * 24 * 60 * 60 * 1000);
  return target.toISOString().split('T')[0];
};

/**
 * Evaluates live schedule status against vehicle's current odometer & current date
 */
export const evaluateScheduleStatus = (schedule, currentOdometer, referenceDate = new Date()) => {
  const nextOdo = Number(schedule.nextServiceOdometer) || 0;
  const currentOdo = Number(currentOdometer) || 0;
  const reminderKm = Number(schedule.reminderKm) || 1000;

  const nextDate = new Date(schedule.nextServiceDate);
  const today = new Date(referenceDate);
  const reminderDays = Number(schedule.reminderDays) || 14;

  const diffTime = nextDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const kmRemaining = nextOdo - currentOdo;

  // 1. Overdue Condition
  if (kmRemaining <= 0 || diffDays < 0) {
    return {
      status: 'Overdue',
      kmRemaining,
      daysRemaining: diffDays,
      severity: 'critical',
      label: kmRemaining <= 0 ? `${Math.abs(kmRemaining)} km overdue` : `${Math.abs(diffDays)} days overdue`
    };
  }

  // 2. Due Condition (Approaching Service Threshold)
  if (kmRemaining <= reminderKm || diffDays <= reminderDays) {
    return {
      status: 'Due',
      kmRemaining,
      daysRemaining: diffDays,
      severity: 'warning',
      label: `Due in ${Math.max(0, kmRemaining)} km (${diffDays} days)`
    };
  }

  // 3. Active / Healthy Condition
  return {
    status: 'Active',
    kmRemaining,
    daysRemaining: diffDays,
    severity: 'normal',
    label: `In ${kmRemaining.toLocaleString()} km (${diffDays} days)`
  };
};

/**
 * Generates automated notifications without duplicate spam
 */
export const generateMaintenanceAlerts = (schedules = [], vehicles = []) => {
  const alerts = [];
  const seenKeys = new Set();

  schedules.forEach((sch) => {
    const vehicle = vehicles.find((v) => v.plate === sch.vehicleId || v.id === sch.vehicleId);
    const currentOdo = vehicle ? vehicle.odometer : sch.lastServiceOdometer;
    const evaluation = evaluateScheduleStatus(sch, currentOdo);

    if (evaluation.status === 'Overdue' || evaluation.status === 'Due') {
      const alertKey = `${sch.id}-${evaluation.status}`;
      if (!seenKeys.has(alertKey)) {
        seenKeys.add(alertKey);
        alerts.push({
          id: `alt-sch-${sch.id}`,
          scheduleId: sch.id,
          vehicleId: sch.vehicleId,
          type: 'maintenance',
          severity: evaluation.severity,
          status: evaluation.status,
          title: `${evaluation.status.toUpperCase()}: ${sch.maintenanceType}`,
          desc: `${sch.vehicleId} · ${evaluation.label} · Service Bay: ${sch.serviceCenter || 'Fleet Care Depot'}`,
          timestamp: 'Live Monitor',
          priority: sch.priority || 'High',
          isResolved: false
        });
      }
    }
  });

  return alerts;
};

/**
 * Aggregates operational KPIs for the Maintenance Dashboard
 */
export const calculateMaintenanceKPIs = (vehicles = [], schedules = [], records = []) => {
  const totalVehicles = vehicles.length;
  let dueCount = 0;
  let overdueCount = 0;
  let upcomingCount = 0;

  schedules.forEach((sch) => {
    const vehicle = vehicles.find((v) => v.plate === sch.vehicleId || v.id === sch.vehicleId);
    const currentOdo = vehicle ? vehicle.odometer : sch.lastServiceOdometer;
    const { status } = evaluateScheduleStatus(sch, currentOdo);

    if (status === 'Overdue') overdueCount += 1;
    else if (status === 'Due') dueCount += 1;
    else upcomingCount += 1;
  });

  // Calculate completed this month (current calendar month)
  const now = new Date();
  const currentMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  
  const completedThisMonth = records.filter((r) => {
    return r.serviceDate && r.serviceDate.startsWith(currentMonthStr);
  }).length;

  // Calculate total maintenance expenses across records
  const totalExpenses = records.reduce((sum, r) => sum + (Number(r.serviceCost) || 0), 0);

  return {
    totalVehicles,
    dueCount,
    upcomingCount,
    overdueCount,
    completedThisMonth,
    totalExpenses
  };
};

