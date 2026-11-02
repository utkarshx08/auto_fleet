-- ============================================================================
-- AUTRAIL FLEET MANAGEMENT PLATFORM - SUPABASE POSTGRESQL SCHEMA
-- Advanced Fleet Operations: Maintenance, Fuel, GPS Telemetry & Geofencing
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. VEHICLES TABLE
CREATE TABLE IF NOT EXISTS public.vehicles (
    id VARCHAR(50) PRIMARY KEY,
    plate VARCHAR(20) NOT NULL UNIQUE,
    model VARCHAR(100) NOT NULL,
    make VARCHAR(50) NOT NULL,
    type VARCHAR(50) NOT NULL DEFAULT 'Van',
    year INT NOT NULL CHECK (year >= 2000),
    driver_name VARCHAR(100),
    driver_phone VARCHAR(50),
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'service', 'idle')),
    location VARCHAR(100),
    latitude NUMERIC(10, 6),
    longitude NUMERIC(10, 6),
    fuel_level INT NOT NULL DEFAULT 100 CHECK (fuel_level >= 0 AND fuel_level <= 100),
    odometer NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (odometer >= 0),
    health_status VARCHAR(50) DEFAULT 'Optimal',
    next_service_text VARCHAR(100),
    color_thumb VARCHAR(20) DEFAULT 'purple',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. DRIVERS TABLE
CREATE TABLE IF NOT EXISTS public.drivers (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE,
    phone VARCHAR(50),
    license_number VARCHAR(50) NOT NULL UNIQUE,
    license_expiry DATE NOT NULL,
    status VARCHAR(30) DEFAULT 'On Duty' CHECK (status IN ('On Duty', 'Available', 'In Service', 'Off Duty')),
    assigned_vehicle_id VARCHAR(50) REFERENCES public.vehicles(id) ON DELETE SET NULL,
    rating NUMERIC(3, 2) DEFAULT 5.00 CHECK (rating >= 1.00 AND rating <= 5.00),
    trips_completed INT DEFAULT 0 CHECK (trips_completed >= 0),
    avatar_initials VARCHAR(5),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. MAINTENANCE SCHEDULES TABLE (Automated Maintenance Scheduling Engine)
CREATE TABLE IF NOT EXISTS public.maintenance_schedules (
    id VARCHAR(50) PRIMARY KEY,
    vehicle_id VARCHAR(50) NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
    maintenance_type VARCHAR(100) NOT NULL, -- e.g. Engine oil replacement, Brake inspection, Tyre replacement, Battery inspection, General servicing, Engine inspection
    interval_km INT NOT NULL CHECK (interval_km > 0),
    interval_days INT NOT NULL CHECK (interval_days > 0),
    last_service_date DATE NOT NULL,
    last_service_odometer NUMERIC(12, 2) NOT NULL CHECK (last_service_odometer >= 0),
    next_service_date DATE NOT NULL,
    next_service_odometer NUMERIC(12, 2) NOT NULL CHECK (next_service_odometer >= last_service_odometer),
    reminder_km INT DEFAULT 500,
    reminder_days INT DEFAULT 7,
    service_center VARCHAR(150),
    priority VARCHAR(20) DEFAULT 'Medium' CHECK (priority IN ('Low', 'Medium', 'High', 'Critical')),
    status VARCHAR(30) DEFAULT 'Active' CHECK (status IN ('Active', 'Due', 'Overdue', 'Completed', 'Paused')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. MAINTENANCE RECORDS TABLE (Historical & Completed Work Orders)
CREATE TABLE IF NOT EXISTS public.maintenance_records (
    id VARCHAR(50) PRIMARY KEY,
    vehicle_id VARCHAR(50) NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
    schedule_id VARCHAR(50) REFERENCES public.maintenance_schedules(id) ON DELETE SET NULL,
    service_type VARCHAR(150) NOT NULL,
    service_date DATE NOT NULL,
    odometer_reading NUMERIC(12, 2) DEFAULT 0 CHECK (odometer_reading >= 0),
    service_cost NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (service_cost >= 0),
    service_provider VARCHAR(150),
    technician VARCHAR(100),
    description TEXT,
    invoice_url TEXT,
    status VARCHAR(30) DEFAULT 'Completed' CHECK (status IN ('Scheduled', 'In Progress', 'Completed', 'Cancelled')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. FUEL RECORDS TABLE (Fuel Purchase Management & Anomaly Detection)
CREATE TABLE IF NOT EXISTS public.fuel_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_id VARCHAR(50) NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
    driver_id VARCHAR(50) REFERENCES public.drivers(id) ON DELETE SET NULL,
    fuel_type VARCHAR(30) NOT NULL DEFAULT 'Diesel' CHECK (fuel_type IN ('Diesel', 'Gasoline', 'Electric', 'Hybrid')),
    quantity NUMERIC(10, 2) NOT NULL CHECK (quantity > 0), -- Liters or kWh
    price_per_litre NUMERIC(10, 2) NOT NULL CHECK (price_per_litre > 0),
    total_amount NUMERIC(12, 2) GENERATED ALWAYS AS (quantity * price_per_litre) STORED,
    odometer_reading NUMERIC(12, 2) NOT NULL CHECK (odometer_reading >= 0),
    fuel_station VARCHAR(150) NOT NULL,
    payment_method VARCHAR(50) DEFAULT 'Company Card' CHECK (payment_method IN ('Company Card', 'Fuel Card', 'Cash', 'PetroCard', 'Credit Card')),
    receipt_url TEXT,
    purchase_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    is_anomaly BOOLEAN DEFAULT FALSE,
    anomaly_reason VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. MILEAGE RECORDS TABLE
CREATE TABLE IF NOT EXISTS public.mileage_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_id VARCHAR(50) NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
    starting_odometer NUMERIC(12, 2) NOT NULL CHECK (starting_odometer >= 0),
    ending_odometer NUMERIC(12, 2) NOT NULL CHECK (ending_odometer >= starting_odometer),
    distance_travelled NUMERIC(10, 2) GENERATED ALWAYS AS (ending_odometer - starting_odometer) STORED,
    route_name VARCHAR(150),
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. VEHICLE USAGE LOGS TABLE
CREATE TABLE IF NOT EXISTS public.vehicle_usage_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_id VARCHAR(50) NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
    active_duration NUMERIC(6, 2) NOT NULL DEFAULT 0 CHECK (active_duration >= 0), -- hours
    idle_duration NUMERIC(6, 2) NOT NULL DEFAULT 0 CHECK (idle_duration >= 0),     -- hours
    maintenance_duration NUMERIC(6, 2) NOT NULL DEFAULT 0 CHECK (maintenance_duration >= 0), -- hours
    total_operating_time NUMERIC(6, 2) GENERATED ALWAYS AS (active_duration + idle_duration + maintenance_duration) STORED,
    usage_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_vehicle_usage_date UNIQUE (vehicle_id, usage_date)
);

-- 8. OPERATIONAL EXPENSES TABLE
CREATE TABLE IF NOT EXISTS public.operational_expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_id VARCHAR(50) REFERENCES public.vehicles(id) ON DELETE SET NULL,
    expense_category VARCHAR(50) NOT NULL CHECK (expense_category IN ('Fuel', 'Maintenance', 'Repairs', 'Insurance', 'Driver Wages', 'Tolls & Permits', 'Other')),
    amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
    description TEXT,
    vendor VARCHAR(150),
    expense_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- GPS REAL-TIME TELEMETRY & TRACKING TABLES
-- ============================================================================

-- 9. VEHICLE LOCATIONS TABLE (High-frequency GPS telemetry breadcrumbs)
CREATE TABLE IF NOT EXISTS public.vehicle_locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_id VARCHAR(50) NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
    latitude NUMERIC(10, 6) NOT NULL CHECK (latitude >= -90 AND latitude <= 90),
    longitude NUMERIC(10, 6) NOT NULL CHECK (longitude >= -180 AND longitude <= 180),
    speed NUMERIC(6, 2) NOT NULL DEFAULT 0 CHECK (speed >= 0), -- km/h
    heading NUMERIC(5, 2) NOT NULL DEFAULT 0 CHECK (heading >= 0 AND heading <= 360), -- degrees from North
    accuracy NUMERIC(6, 2) DEFAULT 5.0, -- meters HDOP
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    source VARCHAR(50) NOT NULL DEFAULT 'hardware' CHECK (source IN ('hardware', 'simulator', 'mobile_app', 'api_push')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. TRACKING SESSIONS TABLE (Aggregated journey trips)
CREATE TABLE IF NOT EXISTS public.tracking_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_id VARCHAR(50) NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
    route_name VARCHAR(150),
    started_at TIMESTAMPTZ NOT NULL,
    ended_at TIMESTAMPTZ,
    total_distance NUMERIC(10, 2) DEFAULT 0 CHECK (total_distance >= 0), -- km
    average_speed NUMERIC(6, 2) DEFAULT 0 CHECK (average_speed >= 0),   -- km/h
    maximum_speed NUMERIC(6, 2) DEFAULT 0 CHECK (maximum_speed >= 0),   -- km/h
    status VARCHAR(30) DEFAULT 'completed' CHECK (status IN ('in_progress', 'completed', 'paused')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. TRACKING ALERTS TABLE (Overspeed, Geofence violation, GPS disconnection)
CREATE TABLE IF NOT EXISTS public.tracking_alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_id VARCHAR(50) NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
    alert_type VARCHAR(50) NOT NULL CHECK (alert_type IN ('overspeed', 'geofence_exit', 'geofence_entry', 'restricted_violation', 'offline', 'low_fuel', 'panic_button')),
    message TEXT NOT NULL,
    latitude NUMERIC(10, 6),
    longitude NUMERIC(10, 6),
    speed NUMERIC(6, 2),
    threshold_value NUMERIC(6, 2),
    is_resolved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    resolved_at TIMESTAMPTZ
);

-- ============================================================================
-- GEOFENCING & RESTRICTED-ZONE ALERTS TABLES
-- ============================================================================

-- 12. GEOFENCES TABLE (Circular & Polygon boundaries)
CREATE TABLE IF NOT EXISTS public.geofences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    zone_type VARCHAR(30) DEFAULT 'depot' CHECK (zone_type IN ('depot', 'client', 'warehouse', 'delivery', 'restricted')),
    boundary_type VARCHAR(20) DEFAULT 'circle' CHECK (boundary_type IN ('circle', 'polygon')),
    center_lat NUMERIC(10, 6),
    center_lng NUMERIC(10, 6),
    radius_meters NUMERIC(8, 2) CHECK (radius_meters > 0),
    polygon_coordinates JSONB, -- Array of [lat, lng] pairs for polygon vertices
    color VARCHAR(20) DEFAULT '#b49aff',
    is_active BOOLEAN DEFAULT TRUE,
    alert_settings JSONB DEFAULT '{"on_entry": true, "on_exit": true, "speed_limit": 60, "max_dwell_minutes": 120}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. GEOFENCE EVENTS TABLE (Breach, Entry, Exit & Dwell records)
CREATE TABLE IF NOT EXISTS public.geofence_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_id VARCHAR(50) NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
    geofence_id UUID NOT NULL REFERENCES public.geofences(id) ON DELETE CASCADE,
    event_type VARCHAR(50) NOT NULL CHECK (event_type IN ('entry', 'exit', 'restricted_violation', 'dwell_exceeded')),
    latitude NUMERIC(10, 6) NOT NULL,
    longitude NUMERIC(10, 6) NOT NULL,
    speed NUMERIC(6, 2) DEFAULT 0,
    severity VARCHAR(20) DEFAULT 'info' CHECK (severity IN ('info', 'warning', 'critical')),
    occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    is_resolved BOOLEAN DEFAULT FALSE,
    resolved_at TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES FOR HIGH-PERFORMANCE ANALYTICS & GPS TELEMETRY QUERIES
CREATE INDEX IF NOT EXISTS idx_schedules_vehicle ON public.maintenance_schedules(vehicle_id, status);
CREATE INDEX IF NOT EXISTS idx_maintenance_records_vehicle ON public.maintenance_records(vehicle_id, service_date DESC);
CREATE INDEX IF NOT EXISTS idx_fuel_records_vehicle_date ON public.fuel_records(vehicle_id, purchase_date DESC);
CREATE INDEX IF NOT EXISTS idx_fuel_records_anomaly ON public.fuel_records(is_anomaly);
CREATE INDEX IF NOT EXISTS idx_mileage_records_vehicle_date ON public.mileage_records(vehicle_id, recorded_at);
CREATE INDEX IF NOT EXISTS idx_usage_logs_vehicle_date ON public.vehicle_usage_logs(vehicle_id, usage_date);
CREATE INDEX IF NOT EXISTS idx_expenses_category_date ON public.operational_expenses(expense_category, expense_date);
CREATE INDEX IF NOT EXISTS idx_expenses_vehicle_date ON public.operational_expenses(vehicle_id, expense_date);
CREATE INDEX IF NOT EXISTS idx_vehicle_locations_vehicle_time ON public.vehicle_locations(vehicle_id, recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_tracking_sessions_vehicle ON public.tracking_sessions(vehicle_id, started_at DESC);
CREATE INDEX IF NOT EXISTS idx_tracking_alerts_unresolved ON public.tracking_alerts(is_resolved, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_geofences_active ON public.geofences(is_active, zone_type);
CREATE INDEX IF NOT EXISTS idx_geofence_events_vehicle ON public.geofence_events(vehicle_id, occurred_at DESC);
CREATE INDEX IF NOT EXISTS idx_geofence_events_unresolved ON public.geofence_events(is_resolved, severity);

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maintenance_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maintenance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fuel_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mileage_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicle_usage_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.operational_expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicle_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tracking_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tracking_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.geofences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.geofence_events ENABLE ROW LEVEL SECURITY;

-- Read policies for authenticated fleet operators
CREATE POLICY "Allow authenticated read vehicles" ON public.vehicles FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated read drivers" ON public.drivers FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated read maintenance_schedules" ON public.maintenance_schedules FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated read maintenance_records" ON public.maintenance_records FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated read fuel_records" ON public.fuel_records FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated read mileage_records" ON public.mileage_records FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated read vehicle_usage_logs" ON public.vehicle_usage_logs FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated read operational_expenses" ON public.operational_expenses FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated read vehicle_locations" ON public.vehicle_locations FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated read tracking_sessions" ON public.tracking_sessions FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated read tracking_alerts" ON public.tracking_alerts FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated read geofences" ON public.geofences FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated read geofence_events" ON public.geofence_events FOR SELECT USING (auth.role() = 'authenticated');

-- Secure insert/update policies for authenticated operators & service roles
CREATE POLICY "Allow service role insert vehicle_locations" ON public.vehicle_locations FOR INSERT WITH CHECK (auth.role() IN ('authenticated', 'service_role'));
CREATE POLICY "Allow service role insert tracking_alerts" ON public.tracking_alerts FOR INSERT WITH CHECK (auth.role() IN ('authenticated', 'service_role'));
CREATE POLICY "Allow service role insert geofence_events" ON public.geofence_events FOR INSERT WITH CHECK (auth.role() IN ('authenticated', 'service_role'));
