/**
 * Client-side InsForge instance using @insforge/sdk.
 * Safe for use in browser / Client Components with public anon key.
 */
import { createClient } from '@insforge/sdk';

const INSFORGE_URL = process.env.NEXT_PUBLIC_INSFORGE_URL || 'https://z5yf2n3p.eu-central.insforge.app';
const INSFORGE_ANON_KEY = process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY || '';

export const insforge = createClient({
  baseUrl: INSFORGE_URL,
  anonKey: INSFORGE_ANON_KEY,
});

export function getInsForgeClient() {
  return insforge;
}
