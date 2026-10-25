/**
 * Service role InsForge client for privileged backend mutations and webhooks.
 * NEVER import in Client Components or expose to the browser.
 */
import { createAdminClient as createInsForgeAdminClient } from '@insforge/sdk';

const INSFORGE_URL = process.env.NEXT_PUBLIC_INSFORGE_URL || 'https://z5yf2n3p.eu-central.insforge.app';
const INSFORGE_SERVICE_KEY = process.env.INSFORGE_SERVICE_ROLE_KEY || '';

export const insforgeAdmin = createInsForgeAdminClient({
  baseUrl: INSFORGE_URL,
  apiKey: INSFORGE_SERVICE_KEY,
});

export function createAdminClient() {
  if (!INSFORGE_SERVICE_KEY && process.env.NODE_ENV === 'production') {
    console.warn('INSFORGE_SERVICE_ROLE_KEY is not defined in production.');
  }
  return insforgeAdmin;
}
