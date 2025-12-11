import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Store the client and config
let _supabase: SupabaseClient | null = null;
let _config: { supabaseUrl: string; supabaseAnonKey: string } | null = null;
let _configLoaded = false;
let _configPromise: Promise<void> | null = null;

// Fetch config - uses build-time env vars for native apps, server for web
async function loadConfig() {
  if (_configLoaded) return;
  
  // Check for build-time environment variables first (for native app builds)
  const buildTimeUrl = import.meta.env.VITE_SUPABASE_URL;
  const buildTimeKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  if (buildTimeUrl && buildTimeKey) {
    _config = {
      supabaseUrl: buildTimeUrl,
      supabaseAnonKey: buildTimeKey,
    };
    _configLoaded = true;
    return;
  }
  
  // Fall back to fetching from server (for web development)
  try {
    const response = await fetch('/api/config');
    if (response.ok) {
      _config = await response.json();
      _configLoaded = true;
    }
  } catch (err) {
    console.warn('Could not load Supabase config:', err);
    _configLoaded = true;
  }
}

// Initialize config loading
export function initSupabase(): Promise<void> {
  if (!_configPromise) {
    _configPromise = loadConfig();
  }
  return _configPromise;
}

export function getSupabase(): SupabaseClient | null {
  if (!_config?.supabaseUrl || !_config?.supabaseAnonKey) {
    return null;
  }
  
  if (!_supabase) {
    _supabase = createClient(_config.supabaseUrl, _config.supabaseAnonKey);
  }
  return _supabase;
}

export function isSupabaseConfigured(): boolean {
  return !!_config?.supabaseUrl && !!_config?.supabaseAnonKey;
}

export type AuthUser = {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
};

export async function signInWithGoogle() {
  const client = getSupabase();
  if (!client) throw new Error('Supabase not configured');
  
  // Check if running in Capacitor (native app)
  const isNative = window.location.protocol === 'capacitor:';
  
  const { data, error } = await client.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: isNative 
        ? 'com.noteflow.app://callback'  // Deep link for native app
        : window.location.origin,
      skipBrowserRedirect: isNative,  // Don't auto-redirect in native
    },
  });
  if (error) throw error;
  
  // For native apps, manually open browser
  if (isNative && data.url) {
    const { Browser } = await import('@capacitor/browser');
    await Browser.open({ url: data.url });
  }
  
  return data;
}

export async function signOut() {
  const client = getSupabase();
  if (!client) throw new Error('Supabase not configured');
  
  const { error } = await client.auth.signOut();
  if (error) throw error;
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const client = getSupabase();
  if (!client) return null;
  
  try {
    const { data: { user } } = await client.auth.getUser();
    if (!user) return null;
    
    return {
      id: user.id,
      email: user.email || '',
      name: user.user_metadata?.full_name || user.user_metadata?.name,
      avatar_url: user.user_metadata?.avatar_url,
    };
  } catch {
    return null;
  }
}
