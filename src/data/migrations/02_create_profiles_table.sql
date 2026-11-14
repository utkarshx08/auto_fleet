-- ============================================================================
-- MIGRATION: 02_create_profiles_table.sql
-- Complete Authentication & User Profile Management Schema
-- ============================================================================

-- 1. Create public.profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    phone VARCHAR(50),
    role VARCHAR(50) NOT NULL DEFAULT 'Fleet Operator' CHECK (role IN ('Administrator', 'Fleet Manager', 'Fleet Operator', 'Driver', 'Maintenance Manager')),
    company_name VARCHAR(150) DEFAULT 'Northstar Logistics',
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Indexes for fast profile lookup
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- 3. Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policy A: Users can view their own profile; Administrators can view all profiles
DROP POLICY IF EXISTS "Allow users to read profiles" ON public.profiles;
CREATE POLICY "Allow users to read profiles" ON public.profiles
    FOR SELECT USING (
        auth.uid() = id OR 
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'Administrator'
        )
    );

-- Policy B: Users can update their own profile; Regular users cannot elevate themselves to Administrator
DROP POLICY IF EXISTS "Allow users to update own profile" ON public.profiles;
CREATE POLICY "Allow users to update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id)
    WITH CHECK (
        auth.uid() = id AND (
            -- If role is being changed to Administrator, the acting user must already be an Administrator
            role <> 'Administrator' OR 
            EXISTS (
                SELECT 1 FROM public.profiles 
                WHERE id = auth.uid() AND role = 'Administrator'
            )
        )
    );

-- Policy C: Allow insert of profile for authenticated users and system service role
DROP POLICY IF EXISTS "Allow insert profile" ON public.profiles;
CREATE POLICY "Allow insert profile" ON public.profiles
    FOR INSERT WITH CHECK (
        auth.uid() = id OR 
        auth.role() = 'service_role'
    );

-- 4. Trigger to automatically create a profile record when a new user signs up in auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, email, phone, role, company_name, avatar_url)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        NEW.email,
        NEW.raw_user_meta_data->>'phone',
        -- Safe default: Never allow self-assigned Administrator during registration
        CASE 
            WHEN NEW.raw_user_meta_data->>'role' = 'Administrator' THEN 'Fleet Operator'
            ELSE COALESCE(NEW.raw_user_meta_data->>'role', 'Fleet Operator')
        END,
        COALESCE(NEW.raw_user_meta_data->>'company_name', 'Northstar Logistics'),
        NEW.raw_user_meta_data->>'avatar_url'
    )
    ON CONFLICT (id) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        email = EXCLUDED.email,
        phone = COALESCE(EXCLUDED.phone, public.profiles.phone),
        company_name = COALESCE(EXCLUDED.company_name, public.profiles.company_name),
        avatar_url = COALESCE(EXCLUDED.avatar_url, public.profiles.avatar_url),
        updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

