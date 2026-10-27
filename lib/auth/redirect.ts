/**
 * Empress Glow Emporium - Safe Redirect Utility
 * Ensures all post-authentication redirects are strictly internal, safe,
 * and comply with two-phase prelaunch rules.
 */

export function getSafeRedirectUrl(
  requestedPath: string | null | undefined,
  defaultFallback: string = '/account'
): string {
  if (!requestedPath || typeof requestedPath !== 'string') {
    return defaultFallback;
  }

  const trimmed = requestedPath.trim();

  // Must begin with / and not // or /\ to prevent protocol-relative open redirect attacks
  if (!trimmed.startsWith('/') || trimmed.startsWith('//') || trimmed.startsWith('/\\')) {
    return defaultFallback;
  }

  // Reject newlines, tabs, and carriage returns (CRLF injection prevention)
  if (/[\r\n\t]/.test(trimmed)) {
    return defaultFallback;
  }

  // Two-Phase Prelaunch Check: Gated consumer routes redirect to / in prelaunch
  const phase = process.env.NEXT_PUBLIC_SITE_PHASE || 'prelaunch';
  if (phase === 'prelaunch') {
    if (
      trimmed.startsWith('/shop') ||
      trimmed.startsWith('/cart') ||
      trimmed.startsWith('/checkout') ||
      trimmed.startsWith('/login') ||
      trimmed.startsWith('/register') ||
      trimmed.startsWith('/account') ||
      trimmed.startsWith('/order')
    ) {
      return '/';
    }
  }

  return trimmed;
}
