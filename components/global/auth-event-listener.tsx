"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * Global auth event listener component
 * Handles session expiration and login redirects without hard page refreshes
 */
export default function AuthEventListener() {
  const router = useRouter();

  useEffect(() => {
    const handleSessionExpired = () => {
      console.log("Session expired, redirecting to login...");
    };

    const handleRedirectLogin = () => {
      // Use Next.js router for smooth navigation without page refresh
      router.push("/viewer/login");
    };

    window.addEventListener("auth:session-expired", handleSessionExpired);
    window.addEventListener("auth:redirect-login", handleRedirectLogin);

    return () => {
      window.removeEventListener("auth:session-expired", handleSessionExpired);
      window.removeEventListener("auth:redirect-login", handleRedirectLogin);
    };
  }, [router]);

  return null; // This component doesn't render anything
}
