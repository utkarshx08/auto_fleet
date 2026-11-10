-- ============================================================================
-- MIGRATION: 01_add_tracks_completion.sql
-- Implements Permanent Completion-Status System for Fleet Tracks & Operations
-- ============================================================================

-- 1. Create tracks table if not exists
CREATE TABLE IF NOT EXISTS public.tracks (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    origin VARCHAR(200) NOT NULL,
    destination VARCHAR(200) NOT NULL,
    stops INT NOT NULL DEFAULT 1 CHECK (stops >= 1),
    distance VARCHAR(50),
    eta VARCHAR(50),
    assigned_vehicle_id VARCHAR(50) REFERENCES public.vehicles(id) ON DELETE SET NULL,
    assigned_driver_name VARCHAR(100),
    status VARCHAR(30) NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'In Progress', 'Completed')),
    completed_at TIMESTAMPTZ,
    completed_by VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Indexes for efficient lookup
CREATE INDEX IF NOT EXISTS idx_tracks_vehicle ON public.tracks(assigned_vehicle_id);
CREATE INDEX IF NOT EXISTS idx_tracks_status ON public.tracks(status);

-- 3. Row Level Security policies
ALTER TABLE public.tracks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow authenticated read tracks" ON public.tracks;
CREATE POLICY "Allow authenticated read tracks" ON public.tracks 
    FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow authenticated modify tracks" ON public.tracks;
CREATE POLICY "Allow authenticated modify tracks" ON public.tracks 
    FOR ALL USING (auth.role() IN ('authenticated', 'service_role'));

-- 4. Initial Seed Data
INSERT INTO public.tracks (id, name, origin, destination, stops, distance, eta, assigned_vehicle_id, assigned_driver_name, status, completed_at, completed_by)
VALUES
    ('RT-401', 'Midtown Express Loop', 'Queens Terminal Hub', 'Manhattan Financial District', 8, '34.2 km', '45 mins', 'RST-291', 'Alex Morgan', 'In Progress', NULL, NULL),
    ('RT-402', 'Brooklyn River Corridor', 'Greenpoint Distribution Depot', 'Coney Island Fulfillment', 12, '48.6 km', '1 hr 15 mins', 'RST-284', 'Sarah Chen', 'In Progress', NULL, NULL),
    ('RT-403', 'Bronx Cross-County Freight', 'Hunts Point Logistics Center', 'White Plains Hub', 5, '29.1 km', '35 mins', 'RST-263', 'David Kim', 'Pending', NULL, NULL)
ON CONFLICT (id) DO UPDATE SET
    status = EXCLUDED.status,
    completed_at = EXCLUDED.completed_at,
    completed_by = EXCLUDED.completed_by,
    updated_at = NOW();

