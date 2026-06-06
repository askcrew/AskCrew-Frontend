import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { getCookie } from "./Cookies";

// ==========================================
// Configuration
// ==========================================
// In production browser, we use the local proxy /api-backend to solve CORS and CSRF issues.
// On the server, we hit the backend directly using the full URL.
const getBaseUrl = () => {
  if (typeof window !== "undefined") {
    return "/api-backend";
  }
  return process.env.NEXT_PUBLIC_BASE_URL || "https://admin.askcrews.com/api/v1";
};

const BASE_URL = getBaseUrl();

// Auth endpoints that should NOT trigger token refresh
const AUTH_ENDPOINTS = [
  "/auth/login",
  "/auth/register",
  "/auth/signup",
  "/auth/token/refresh",
  "/auth/logout",
  "/auth/password",
  "/api/auth/", // Our internal API routes
];

// ==========================================
// Auth Cookie API Client
// ==========================================
const AuthCookieAPI = {
  // Set auth cookies via secure API route
  setTokens: async (data: {
    accessToken?: string;
    refreshToken?: string;
    userType?: string;
  }): Promise<boolean> => {
    try {
      const response = await fetch("/api/auth/cookies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      return response.ok;
    } catch (error) {
      console.error("Failed to set auth cookies:", error);
      return false;
    }
  },

  // Clear all auth cookies via secure API route
  clearTokens: async (): Promise<boolean> => {
    try {
      const response = await fetch("/api/auth/cookies", {
        method: "DELETE",
        credentials: "include",
      });
      return response.ok;
    } catch (error) {
      console.error("Failed to clear auth cookies:", error);
      return false;
    }
  },

  // Get auth status (limited info for client)
  getStatus: async (): Promise<{
    accessToken: string | null;
    userType: string | null;
    isAuthenticated: boolean;
  }> => {
    try {
      const response = await fetch("/api/auth/status", {
        method: "GET",
        credentials: "include",
      });
      return await response.json();
    } catch (error) {
      console.error("Failed to get auth status:", error);
      return { accessToken: null, userType: null, isAuthenticated: false };
    }
  },

  // Refresh token via secure API route (tokens never exposed to JS)
  refreshToken: async (): Promise<{
    success: boolean;
    accessToken?: string;
  }> => {
    try {
      const response = await fetch("/api/auth/refresh", {
        method: "POST",
        credentials: "include",
      });
      return await response.json();
    } catch (error) {
      console.error("Failed to refresh token:", error);
      return { success: false };
    }
  },
};

// ==========================================
// Auth Event Dispatcher
// ==========================================
const AuthEvents = {
  dispatchSessionExpired: (): void => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("auth:session-expired"));
    }
  },

  dispatchRedirectLogin: (): void => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("auth:redirect-login"));
    }
  },

  dispatchTokenRefreshed: (): void => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("auth:token-refreshed"));
    }
  },
};

// ==========================================
// Token Refresh Queue Management
// ==========================================
interface QueuedRequest {
  resolve: (value: void) => void;
  reject: (error: Error) => void;
}

let isRefreshing = false;
let refreshSubscribers: QueuedRequest[] = [];

const subscribeToTokenRefresh = (callback: QueuedRequest): void => {
  refreshSubscribers.push(callback);
};

const onTokenRefreshed = (): void => {
  refreshSubscribers.forEach((callback) => callback.resolve());
  refreshSubscribers = [];
};

const onTokenRefreshFailed = (error: Error): void => {
  refreshSubscribers.forEach((callback) => callback.reject(error));
  refreshSubscribers = [];
};

// ==========================================
// Helper Functions
// ==========================================
const isAuthEndpoint = (url?: string): boolean => {
  if (!url) return false;
  return AUTH_ENDPOINTS.some((endpoint) => url.includes(endpoint));
};

const getClientCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
};

const handleAuthFailure = async (): Promise<void> => {
  await AuthCookieAPI.clearTokens();
  AuthEvents.dispatchSessionExpired();
  AuthEvents.dispatchRedirectLogin();
};

const ensureCsrfToken = async (): Promise<void> => {
  // CSRF token fetching disabled - backend uses JWT authentication
  // The backend at https://admin.askcrews.com doesn't provide CSRF tokens
  // and uses access/refresh token authentication instead
  return;
};

// Extended config type to include retry flag
interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// ==========================================
// Create Axios Instance
// ==========================================
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Cache for access token on client side
let cachedAccessToken: string | null = null;

// ==========================================
// Request Interceptor
// ==========================================
axiosInstance.interceptors.request.use(
  async (config) => {
    console.log("Base URL:", config.baseURL);
    console.log("Request URL:", config.url);
    console.log("Full URL:", `${config.baseURL}${config.url}`);
    let accessToken: string | null = null;

    if (typeof window === "undefined") {
      // Server-side: get token from cookies directly
      try {
        accessToken = (await getCookie("accessToken")) ?? null;
      } catch {
        // Cookies not available
      }
    } else {
      // Client-side: use cached token or fetch from API route
      if (cachedAccessToken) {
        accessToken = cachedAccessToken;
      } else {
        try {
          const status = await AuthCookieAPI.getStatus();
          accessToken = status.accessToken;
          cachedAccessToken = accessToken;
        } catch {
          // Failed to get token
        }
      }
    }

    // Attach token to request header
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ==========================================
// Response Interceptor
// ==========================================
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as ExtendedAxiosRequestConfig;

    // If no config or not a 401 error, reject immediately
    if (!originalRequest || error.response?.status !== 401) {
      return Promise.reject(error);
    }

    // Don't retry if already retried or is an auth endpoint
    if (originalRequest._retry || isAuthEndpoint(originalRequest.url)) {
      return Promise.reject(error);
    }

    // Mark request as retried to prevent infinite loops
    originalRequest._retry = true;

    // If already refreshing, queue this request
    if (isRefreshing) {
      return new Promise<void>((resolve, reject) => {
        subscribeToTokenRefresh({ resolve, reject });
      })
        .then(() => {
          // Get new token and retry
          if (cachedAccessToken) {
            originalRequest.headers.Authorization = `Bearer ${cachedAccessToken}`;
          }
          return axiosInstance(originalRequest);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    }

    // Start refreshing
    isRefreshing = true;

    try {
      // Use our secure API route for token refresh
      const result = await AuthCookieAPI.refreshToken();

      if (!result.success || !result.accessToken) {
        throw new Error("Token refresh failed");
      }

      // Update cached token
      cachedAccessToken = result.accessToken;

      // Notify all queued requests
      onTokenRefreshed();
      AuthEvents.dispatchTokenRefreshed();

      // Retry the original request with new token
      originalRequest.headers.Authorization = `Bearer ${result.accessToken}`;
      return axiosInstance(originalRequest);
    } catch (refreshError) {
      // Clear cached token
      cachedAccessToken = null;

      // Notify all queued requests of failure
      onTokenRefreshFailed(refreshError as Error);

      // Handle auth failure (clear cookies, dispatch events)
      await handleAuthFailure();

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

// Function to clear cached token (call on logout)
export const clearCachedToken = () => {
  cachedAccessToken = null;
};

// Function to set cached token (call after login)
export const setCachedToken = (token: string) => {
  cachedAccessToken = token;
};

export default axiosInstance;

// Export utilities for use elsewhere
export { AuthCookieAPI, AuthEvents };
