import { createClient } from '@supabase/supabase-js';

// Retrieve environment variables safely without leaking secrets
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = () => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl !== 'https://your-project-id.supabase.co' &&
    supabaseAnonKey !== 'your-anon-key'
  );
};

// Retrieve client connection diagnostic status
export const getSupabaseStatus = () => {
  const configured = isSupabaseConfigured();
  return {
    configured,
    url: configured ? supabaseUrl.replace(/(https?:\/\/)(.*)/, '$1***') : 'None (Demo Mode)',
    status: configured ? 'connected' : 'offline_fallback',
    realtimeSupported: true
  };
};

// Initialize Supabase Client with graceful fallback
export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey, {
      realtime: {
        params: {
          eventsPerSecond: 10
        }
      }
    })
  : null;


