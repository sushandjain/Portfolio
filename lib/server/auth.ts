import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { getAuth, saveAuth, StoredAuth } from "./db";
import crypto from "crypto";

const SESSION_COOKIE_NAME = "portfolio_session";
const DEFAULT_EMAIL = (process.env.ADMIN_EMAIL || "sushandjain@gmail.com").toLowerCase().trim();
const DEFAULT_PASSWORD = process.env.ADMIN_PASSWORD || "Sushandjain@123";
const JWT_SECRET_STRING = process.env.JWT_SECRET || "super_secret_portfolio_jwt_key_sushan_jain_2026_secure_key_32chars";
const JWT_SECRET = new TextEncoder().encode(JWT_SECRET_STRING);
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_MINUTES = 15;
const SESSION_MAX_AGE = parseInt(process.env.SESSION_MAX_AGE || "86400", 10); // 24 hours

/**
 * Initializes admin record if not yet created
 */
export async function ensureAdminRecord(): Promise<StoredAuth> {
  let auth = getAuth();
  if (!auth) {
    const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, 12);
    auth = {
      adminEmail: DEFAULT_EMAIL,
      passwordHash,
      failedAttempts: 0,
      lockUntil: null,
      lastLogin: null,
      resetToken: null,
      resetExpires: null,
    };
    saveAuth(auth);
  }
  return auth;
}

/**
 * Verifies email and password credentials with rate-limiting and account lockout
 */
export async function authenticateAdmin(
  emailInput: string,
  passwordInput: string
): Promise<{
  success: boolean;
  message?: string;
  isLocked?: boolean;
  lockUntilMinutes?: number;
}> {
  const auth = await ensureAdminRecord();
  const normalizedEmail = (emailInput || "").toLowerCase().trim();

  // Strict check: only designated admin email is allowed
  if (normalizedEmail !== auth.adminEmail.toLowerCase().trim()) {
    return {
      success: false,
      message: "Invalid email or credentials. Access denied.",
    };
  }

  // Check if account is currently locked
  const now = Date.now();
  if (auth.lockUntil && auth.lockUntil > now) {
    const remainingMinutes = Math.ceil((auth.lockUntil - now) / (60 * 1000));
    return {
      success: false,
      isLocked: true,
      lockUntilMinutes: remainingMinutes,
      message: `Account is temporarily locked due to repeated failed logins. Please try again in ${remainingMinutes} minute(s).`,
    };
  }

  // Compare password
  const isMatch = await bcrypt.compare(passwordInput, auth.passwordHash);

  if (!isMatch) {
    const newFailed = (auth.failedAttempts || 0) + 1;
    let lockUntil: number | null = null;
    let isLocked = false;
    let lockMinutes = 0;

    if (newFailed >= MAX_FAILED_ATTEMPTS) {
      lockUntil = now + LOCKOUT_MINUTES * 60 * 1000;
      isLocked = true;
      lockMinutes = LOCKOUT_MINUTES;
    }

    saveAuth({
      ...auth,
      failedAttempts: newFailed,
      lockUntil,
    });

    if (isLocked) {
      return {
        success: false,
        isLocked: true,
        lockUntilMinutes: lockMinutes,
        message: `Too many failed attempts. Account locked for ${LOCKOUT_MINUTES} minutes.`,
      };
    }

    const remainingAttempts = MAX_FAILED_ATTEMPTS - newFailed;
    return {
      success: false,
      message: `Invalid password. ${remainingAttempts} attempt(s) remaining before temporary lockout.`,
    };
  }

  // Login successful -> reset failed attempts and record login
  saveAuth({
    ...auth,
    failedAttempts: 0,
    lockUntil: null,
    lastLogin: new Date().toISOString(),
  });

  return { success: true };
}

/**
 * Creates signed JWT session token
 */
export async function createSessionToken(email: string): Promise<string> {
  return await new SignJWT({ email, role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(JWT_SECRET);
}

/**
 * Sets HTTP-only secure cookie in Next.js Server Action / Route Handler
 */
export async function setSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

/**
 * Clears session cookie (Logout)
 */
export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

/**
 * Verifies JWT session token from request or cookieStore
 */
export async function verifyCurrentSession(): Promise<{
  authenticated: boolean;
  email?: string;
}> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!token) return { authenticated: false };

    const { payload } = await jwtVerify(token, JWT_SECRET);
    if (!payload.email || payload.role !== "admin") {
      return { authenticated: false };
    }

    const auth = await ensureAdminRecord();
    if ((payload.email as string).toLowerCase().trim() !== auth.adminEmail.toLowerCase().trim()) {
      return { authenticated: false };
    }

    return { authenticated: true, email: payload.email as string };
  } catch {
    return { authenticated: false };
  }
}

/**
 * Generates a one-time password reset token valid for 1 hour
 */
export async function generatePasswordResetToken(emailInput: string): Promise<{
  success: boolean;
  token?: string;
  message: string;
}> {
  const auth = await ensureAdminRecord();
  const normalizedEmail = (emailInput || "").toLowerCase().trim();

  if (normalizedEmail !== auth.adminEmail.toLowerCase().trim()) {
    // Return friendly generic message for security
    return {
      success: true,
      message: "If that email matches the administrator account, reset instructions have been generated.",
    };
  }

  const token = crypto.randomBytes(32).toString("hex");
  const expires = Date.now() + 60 * 60 * 1000; // 1 hour

  saveAuth({
    ...auth,
    resetToken: token,
    resetExpires: expires,
  });

  return {
    success: true,
    token,
    message: "Password reset token generated successfully.",
  };
}

/**
 * Verifies reset token and updates password
 */
export async function resetPasswordWithToken(
  token: string,
  newPassword: string
): Promise<{ success: boolean; message: string }> {
  if (!token || !newPassword || newPassword.length < 8) {
    return {
      success: false,
      message: "Password must be at least 8 characters long.",
    };
  }

  const auth = await ensureAdminRecord();
  const now = Date.now();

  if (!auth.resetToken || auth.resetToken !== token || !auth.resetExpires || auth.resetExpires < now) {
    return {
      success: false,
      message: "Password reset link is invalid or has expired. Please request a new one.",
    };
  }

  const newHash = await bcrypt.hash(newPassword, 12);

  saveAuth({
    ...auth,
    passwordHash: newHash,
    failedAttempts: 0,
    lockUntil: null,
    resetToken: null,
    resetExpires: null,
  });

  return {
    success: true,
    message: "Password successfully updated! You may now log in with your new password.",
  };
}

/**
 * Allows authenticated admin to change password directly from admin settings
 */
export async function updateAdminPassword(
  currentPassword: string,
  newPassword: string
): Promise<{ success: boolean; message: string }> {
  const session = await verifyCurrentSession();
  if (!session.authenticated) {
    return { success: false, message: "Unauthorized. Please log in first." };
  }

  if (!newPassword || newPassword.length < 8) {
    return { success: false, message: "New password must be at least 8 characters long." };
  }

  const auth = await ensureAdminRecord();
  const isCurrentMatch = await bcrypt.compare(currentPassword, auth.passwordHash);

  if (!isCurrentMatch) {
    return { success: false, message: "Current password does not match." };
  }

  const newHash = await bcrypt.hash(newPassword, 12);
  saveAuth({
    ...auth,
    passwordHash: newHash,
  });

  return { success: true, message: "Password updated successfully." };
}
