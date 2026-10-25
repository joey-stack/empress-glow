/**
 * Two-phase rollout controller for Empress Glow Emporium.
 * Pre-launch mode: strictly no prices, no cart, no checkout, no account UI.
 * Live mode: all Phase 2 e-commerce features active.
 */

export const SITE_PHASE = process.env.NEXT_PUBLIC_SITE_PHASE ?? 'live';
export const isPrelaunch = SITE_PHASE === 'prelaunch';
export const isLive = SITE_PHASE === 'live';

/**
 * Checks if a brand/vendor belongs to Empress Glow Emporium.
 * Any product with vendor 'Empress Glow', 'Empress Glow Emporium', or undefined is considered Empress Glow.
 */
export function isEmpressGlowBrand(vendor?: string | null): boolean {
  if (!vendor) return true;
  const clean = vendor.trim().toLowerCase();
  return (
    clean === 'empress glow' ||
    clean === 'empress glow emporium' ||
    clean.startsWith('empress glow')
  );
}

/**
 * Checks if a specific product should have live e-commerce (prices, add to basket).
 * Only true if the site is in 'live' phase AND the product is an external/partner brand.
 */
export function isProductLiveCommerce(
  product?: { vendor?: string } | null,
  currentSitePhase: string = SITE_PHASE
): boolean {
  if (currentSitePhase !== 'live') return false;
  return !isEmpressGlowBrand(product?.vendor);
}
