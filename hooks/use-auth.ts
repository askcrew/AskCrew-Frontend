"use client";

import { useEffect, useState, useCallback } from "react";
import {
  AuthCookieAPI,
  AuthEvents,
  clearCachedToken,
} from "@/lib/axiosInstance";

interface UseAuthReturn {
  isAuthenticated: boolean;
  userType: string | null;
  isLoading: boolean;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export function useAuth(): UseAuthReturn {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    try {
      const status = await AuthCookieAPI.getStatus();
      setIsAuthenticated(status.isAuthenticated);
      setUserType(status.userType);
    } catch (error) {
      console.error("Error checking authentication:", error);
      setIsAuthenticated(false);
      setUserType(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    await AuthCookieAPI.clearTokens();
    clearCachedToken();
    setIsAuthenticated(false);
    setUserType(null);
    AuthEvents.dispatchRedirectLogin();
  }, []);

  useEffect(() => {
    checkAuth();

    // Listen for auth events
    const handleSessionExpired = () => {
      setIsAuthenticated(false);
      setUserType(null);
    };

    const handleTokenRefreshed = () => {
      checkAuth();
    };

    window.addEventListener("auth:session-expired", handleSessionExpired);
    window.addEventListener("auth:token-refreshed", handleTokenRefreshed);

    return () => {
      window.removeEventListener("auth:session-expired", handleSessionExpired);
      window.removeEventListener("auth:token-refreshed", handleTokenRefreshed);
    };
  }, [checkAuth]);

  return { isAuthenticated, userType, isLoading, logout, checkAuth };
}
