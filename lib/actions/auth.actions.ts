"use server";

import { redirect } from "next/navigation";
import { setAuthTokens, clearAuthTokens, setCookie } from "@/lib/Cookies";
import axiosInstance from "../axiosInstance";
import { AxiosError } from "axios";

export async function loginAction(formData: {
  email: string;
  password: string;
  userType: "viewer" | "student" | "enterprise";
}) {
  try {
    // Call your backend login endpoint
    const response = await axiosInstance.post(`/auth/login`, formData);

    const { accessToken, refreshToken, user } = response.data;

    // Set tokens in cookies
    await setAuthTokens(accessToken, refreshToken);

    // Optionally store user data (non-httpOnly for client access)
    await setCookie("user", JSON.stringify(user), {
      httpOnly: false,
      maxAge: 60 * 60 * 24 * 7,
    });

  } catch (error: unknown) {
    console.error("Login error:", error);
    return {
      success: false,
      error: error instanceof AxiosError && error.response?.data?.message || "Login failed",
    };
  }
  }


export async function logoutAction() {
  await clearAuthTokens();
  redirect("/login");
}

export async function registerAction(formData: {
  name: string;
  email: string;
  password: string;
  userType: "viewer" | "student" | "enterprise";
}) {
  try {
    const response = await axiosInstance.post(`/auth/register`, formData);

    const { accessToken, refreshToken, user } = response.data;

    await setAuthTokens(accessToken, refreshToken);
    await setCookie("user", JSON.stringify(user), {
      httpOnly: false,
      maxAge:  60 * 60 * 24 * 7,
    });

  } catch (error: unknown) {
    console.error("Register error:", error);
    return {
      success: false,
      error: error instanceof AxiosError && error.response?.data?.message || "Registration failed",
    };
  }
  }

