/**
 * Design system tokens and helpers for Empress Glow Emporium.
 * Sampled directly from the official Empress Glow Emporium brand logo.
 * Matches docs/design/tokens.json and docs/design/system.md.
 */

export const DESIGN_TOKENS = {
  colors: {
    // Official Logo Deep Chocolate / Title & Crown
    chocolate: {
      DEFAULT: '#2c1609',
      umber: '#4a2816',
      dark: '#1c0d05',
    },
    // Official Logo Botanical Greens
    botanical: {
      DEFAULT: '#2d5508', // Deep Leaf Green
      hover: '#1e3b05',
      leaf: '#5a8210',    // Vibrant Leaf Highlight
      light: '#f0f5ea',   // Soft Leaf Tint
    },
    gold: {
      DEFAULT: '#2d5508',
      light: '#f0f5ea',
      dark: '#1e3b05',
    },
    canvas: {
      bg: '#f7f1e8',
      surface: '#ffffff',
      surfaceMuted: '#faf6f0',
      obsidian: '#131010',
      border: '#e5dcd0',
      borderDark: '#262220',
    },
    background: '#f7f1e8',
    border: '#e5dcd0',
    muted: '#7b7366',
    espresso: '#131010',
    obsidian: '#131010',
  },
  fonts: {
    heading: "'Playfair Display', Georgia, serif",
    script: "'Great Vibes', cursive",
    sans: "'Plus Jakarta Sans', Inter, system-ui, sans-serif",
    mono: "'JetBrains Mono', monospace",
  },
} as const;

export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}
