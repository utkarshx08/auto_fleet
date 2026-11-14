import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Restore initial session on mount
  useEffect(() => {
    let isMounted = true;

    async function initSession() {
      try {
        setIsLoading(true);
        const { user: initUser, profile: initProfile } = await authService.getInitialSession();
        if (isMounted) {
          setUser(initUser);
          setProfile(initProfile);
        }
      } catch (err) {
        console.error('[AuthContext] Session init error:', err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    initSession();

    // Listen to Supabase Auth state changes if available
    let authListener = null;
    if (isSupabaseConfigured() && supabase) {
      const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (!isMounted) return;
        if (event === 'SIGNED_IN' && session?.user) {
          setUser(session.user);
          const p = await authService.fetchUserProfile(session.user.id, session.user.email);
          setProfile(p);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setProfile(null);
        }
      });
      authListener = data?.subscription;
    }

    return () => {
      isMounted = false;
      if (authListener?.unsubscribe) {
        authListener.unsubscribe();
      }
    };
  }, []);

  // Login handler
  const login = useCallback(async (email, password, rememberMe = true) => {
    setError(null);
    try {
      const res = await authService.login(email, password, rememberMe);
      setUser(res.user);
      setProfile(res.profile);
      return res;
    } catch (err) {
      setError(err.message || 'Authentication failed');
      throw err;
    }
  }, []);

  // Register handler
  const register = useCallback(async (registrationData) => {
    setError(null);
    try {
      const res = await authService.register(registrationData);
      setUser(res.user);
      setProfile(res.profile);
      return res;
    } catch (err) {
      setError(err.message || 'Registration failed');
      throw err;
    }
  }, []);

  // Logout handler
  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
      setProfile(null);
      setError(null);
    }
  }, []);

  // Profile update handler
  const updateProfile = useCallback(async (updates) => {
    if (!user?.id) throw new Error('Not authenticated');
    setError(null);
    try {
      const updated = await authService.updateProfile(user.id, updates);
      setProfile(updated);
      return updated;
    } catch (err) {
      setError(err.message || 'Failed to update profile');
      throw err;
    }
  }, [user]);

  // Password change handler
  const changePassword = useCallback(async (currentPassword, newPassword) => {
    if (!user?.id) throw new Error('Not authenticated');
    setError(null);
    try {
      return await authService.changePassword(user.id, currentPassword, newPassword);
    } catch (err) {
      setError(err.message || 'Failed to change password');
      throw err;
    }
  }, [user]);

  // Password reset request
  const resetPassword = useCallback(async (email) => {
    setError(null);
    return await authService.resetPassword(email);
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const value = {
    user,
    profile,
    isAuthenticated: Boolean(user && profile),
    isLoading,
    error,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    resetPassword,
    clearError
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

