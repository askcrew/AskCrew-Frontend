"use server";
import { cookies } from "next/headers";

export const setCookie = async (
  key: string,
  value: string,
  options?:  {
    maxAge?: number;
    httpOnly?: boolean;
    secure?: boolean;
    sameSite?: "strict" | "lax" | "none";
  }
) => {
  const cookieStore = await cookies();
  cookieStore.set(key, value, {
    httpOnly: options?.httpOnly ?? true,
    secure:  options?.secure ?? process.env.NODE_ENV === "production",
    sameSite:  options?.sameSite ?? "strict",
    maxAge: options?. maxAge,
    path: "/",
  });
};

export const getCookie = async (key: string) => {
  const cookieStore = await cookies();
  return cookieStore.get(key)?.value;
};

export const deleteCookie = async (key: string) => {
  const cookieStore = await cookies();
  cookieStore.delete(key);
};

export const setAuthTokens = async (accessToken: string, refreshToken: string) => {
  await setCookie("accessToken", accessToken, {
    maxAge: 60 * 15, // 15 minutes
    httpOnly: true,
  });
  
  await setCookie("refreshToken", refreshToken, {
    maxAge: 60 * 60 * 24 * 7, // 7 days
    httpOnly: true,
  });
};

export const clearAuthTokens = async () => {
  await deleteCookie("accessToken");
  await deleteCookie("refreshToken");
  await deleteCookie("user");
};