import crypto from 'crypto';
import { cookies } from 'next/headers';

const SESSION_COOKIE_NAME = 'empress_session';
const SESSION_SECRET = process.env.PAYSTACK_SECRET_KEY || 'empress-glow-session-secret-key-32chars';

export type AdminRole = 'super_admin' | 'inventory_manager' | 'support_staff' | 'read_only';

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role?: AdminRole | 'customer';
}

/**
 * Hash a plain password using SHA-256 with salt.
 */
export function hashPassword(password: string): string {
  const salt = 'empress_glow_salt_botanical';
  return crypto.createHmac('sha256', salt).update(password).digest('hex');
}

/**
 * Verify password against hashed representation.
 */
export function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}

/**
 * Create a signed session token.
 */
function signToken(payload: SessionUser): string {
  const data = Buffer.from(JSON.stringify(payload)).toString('base64');
  const signature = crypto.createHmac('sha256', SESSION_SECRET).update(data).digest('hex');
  return `${data}.${signature}`;
}

/**
 * Verify and parse a signed session token.
 */
function verifyToken(token: string): SessionUser | null {
  try {
    const [data, signature] = token.split('.');
    if (!data || !signature) return null;
    const expectedSig = crypto.createHmac('sha256', SESSION_SECRET).update(data).digest('hex');
    if (signature !== expectedSig) return null;
    const jsonStr = Buffer.from(data, 'base64').toString('utf-8');
    return JSON.parse(jsonStr) as SessionUser;
  } catch {
    return null;
  }
}

/**
 * Set session cookie in request/response context.
 */
export async function createSession(user: SessionUser): Promise<void> {
  const token = signToken(user);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
}

/**
 * Get the currently authenticated user from cookies, if any.
 */
export async function getSessionUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

/**
 * Clear the current session cookie (logout).
 */
export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}
