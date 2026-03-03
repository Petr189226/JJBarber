/**
 * Design tokens – luxury editorial, gold accent only.
 * Gold = primary CTA and key accent. Everything else = muted/neutral.
 */

export const TOKENS = {
  // ── Colors ──
  colors: {
    bg: {
      base: "#0A0A0A",
      surface: "#0E0E0E",
      card: "#111111",
      footer: "#080808",
    },
    border: {
      default: "#1F1F1F",
      muted: "#2A2A2A",
      hover: "rgba(255,255,255,0.08)",
      focus: "rgba(201,168,76,0.5)",
    },
    text: {
      primary: "#C4BEB4",
      secondary: "#B5AEA4",
      muted: "#8A8580",
      subtle: "#6B6660",
    },
    gold: {
      DEFAULT: "#C9A84C",
      hover: "#D4B85A",
      muted: "rgba(201,168,76,0.4)",
      accent: "rgba(201,168,76,0.15)",
    },
  },

  // ── Typography ──
  typography: {
    font: {
      display: "'Playfair Display', serif",
      sans: "'Inter', sans-serif",
      condensed: "'Barlow Condensed', sans-serif",
    },
    h1: { weight: 900, lineHeight: 1.0, letterSpacing: "-0.02em" },
    h2: { weight: 600, lineHeight: 1.2 },
    h3: { weight: 600, lineHeight: 1.3 },
    body: { weight: 300, lineHeight: 1.8 },
    bodySmall: { weight: 400, lineHeight: 1.7 },
    label: { weight: 600, letterSpacing: "0.2em" },
  },

  // ── Motion ──
  motion: {
    hover: { duration: 0.18, ease: [0.22, 1, 0.36, 1] },
    transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] },
    reveal: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },

  // ── Radii & Shadows ──
  radius: {
    sm: "2px",
    md: "4px",
  },
  shadow: {
    cardHover: "0 4px 20px rgba(0,0,0,0.2)",
    ctaHover: "0 4px 20px rgba(201,168,76,0.2)",
  },
} as const;
