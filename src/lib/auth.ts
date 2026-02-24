"use server";

import { cookies } from "next/headers";

const VALID_PIN = process.env.AUTH_PIN || "220202";
const COOKIE_NAME = "uw_auth";
const COOKIE_VALUE = "neil_authenticated";

export async function verifyPin(pin: string): Promise<{ success: boolean }> {
  if (pin === VALID_PIN) {
    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, COOKIE_VALUE, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
    return { success: true };
  }
  return { success: false };
}

export async function logout(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAME)?.value === COOKIE_VALUE;
}
