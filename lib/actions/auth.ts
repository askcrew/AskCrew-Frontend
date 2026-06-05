"use server";

import { setCookie, deleteCookie } from "@/lib/Cookies";
import { redirect } from "next/navigation";
import axiosInstance from "@/lib/axiosInstance";
import { AxiosError } from "axios";

export async function setLoginCookies(accessToken: string, userType: string) {
  await setCookie("accessToken", accessToken, {
    maxAge: 60 * 60 * 24, // 24 hours
    httpOnly: true,
  });

  await setCookie("userType", userType, {
    maxAge: 60 * 60 * 24 * 7, // 7 days
    httpOnly: true,
  });
}

export async function logout() {
  // Delete all auth-related cookies
  await deleteCookie("accessToken");
  await deleteCookie("userType");

  // Redirect to login page
  redirect("/viewer/login");
}

export async function getCurrentUserProfile() {
  try {
    const response = await axiosInstance.get("/auth/profiles/my-profile/");
    console.log("res", response);
    return { success: true, data: response.data };
  } catch (e: unknown) {
    const error = e as AxiosError;
    console.error("Error fetching user profile:", error);
    if (error.response?.status === 401) {
      return { success: false, error: "Unauthorized" };
    }
    return { success: false, error: error.message || "An error occurred" };
  }
}
