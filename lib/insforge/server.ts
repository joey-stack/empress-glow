/**
 * Server-side InsForge client with request context / cookie authentication.
 * Used exclusively in Server Components, Route Handlers, and Server Actions.
 */
import { createClient } from '@insforge/sdk';

const INSFORGE_URL = process.env.NEXT_PUBLIC_INSFORGE_URL || 'https://z5yf2n3p.eu-central.insforge.app';
const INSFORGE_ANON_KEY = process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY || '';

export const insforgeServer = createClient({
  baseUrl: INSFORGE_URL,
  anonKey: INSFORGE_ANON_KEY,
});

export function createServerClient() {
  return insforgeServer;
}
