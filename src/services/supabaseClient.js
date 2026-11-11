import { createClient } from '@supabase/supabase-js';

// Retrieve environment variables with fallback
const supabaseUrl =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) ||
  (typeof process !== 'undefined' && process.env?.VITE_SUPABASE_URL) ||
  'https://lwanxveuxcgnsedoragt.supabase.co';

const supabaseAnonKey =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY) ||
  (typeof process !== 'undefined' && process.env?.VITE_SUPABASE_ANON_KEY) ||
  'sb_publishable_Yz7oBCNE9DRZ1wvbTZyJFw_PQ45s9xs';

export const isSupabaseConfigured = () => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    !supabaseUrl.includes('your-project-id') &&
    !supabaseAnonKey.includes('your-anon-key')
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


