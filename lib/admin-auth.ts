import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "pz_admin_session";
const TTL_MS = 1000 * 60 * 60 * 24 * 14; // 14 days

function secret() {
  const value = process.env.ADMIN_SESSION_SECRET?.trim();
  if (!value || value.length < 16) {
    throw new Error("ADMIN_SESSION_SECRET must be set (at least 16 characters).");
  }
  return value;
}

function sign(payload: string) {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

export function createAdminSessionToken() {
  const exp = Date.now() + TTL_MS;
  const payload = `admin.${exp}`;
  return `${payload}.${sign(payload)}`;
}

export function verifyAdminSessionToken(token: string | undefined | null) {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [role, expRaw, signature] = parts;
  if (role !== "admin") return false;
  const exp = Number(expRaw);
  if (!Number.isFinite(exp) || Date.now() > exp) return false;
  const payload = `${role}.${expRaw}`;
  const expected = sign(payload);
  try {
    return timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  } catch {
    return false;
  }
}

export async function isAdminAuthenticated() {
  try {
    const jar = await cookies();
    return verifyAdminSessionToken(jar.get(ADMIN_COOKIE)?.value);
  } catch {
    return false;
  }
}

export function adminPasswordMatches(input: string) {
  const expected = process.env.ADMIN_PASSWORD?.trim();
  if (!expected) return false;
  try {
    return timingSafeEqual(Buffer.from(input), Buffer.from(expected));
  } catch {
    return input === expected;
  }
}
