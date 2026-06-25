/**
 * Digital Waiter — Tailwind config
 *
 * NOTE: the stack is Tailwind v4, which is CSS-first. The source of truth
 * for tokens is `tokens/globals.css` (@theme inline + CSS vars, 3 levels).
 * This file is OPTIONAL — keep it only if you want JS-side config (plugins,
 * content globs, IDE hints). All design tokens are mirrored from the CSS
 * vars so nothing is duplicated as raw values: utilities resolve to var().
 */
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      // every value points at a CSS var → single core, no dupes
      colors: {
        surface:   "var(--surface)",
        "surface-2": "var(--surface-2)",
        ink:       "var(--ink)",
        "ink-2":   "var(--ink-2)",
        "ink-3":   "var(--ink-3)",
        brand:     "var(--brand)",
        "on-brand": "var(--on-brand)",
        core:      "var(--core)",
        line:      "var(--line)",
      },
      fontFamily: {
        display: ["Anton", "sans-serif"],
        sans:    ["Space Grotesk", "sans-serif"],
        mono:    ["Space Mono", "monospace"],
      },
      fontSize: {
        caption: ["var(--fs-caption)", { lineHeight: "1.4", letterSpacing: "0.04em" }],
        body:    ["var(--fs-body)",    { lineHeight: "1.6" }],
        lead:    ["var(--fs-lead)",    { lineHeight: "1.5" }],
        h4:      ["var(--fs-h4)",      { lineHeight: "1.25" }],
        h3:      ["var(--fs-h3)",      { lineHeight: "1.15" }],
        h2:      ["var(--fs-h2)",      { lineHeight: "1.08" }],
        h1:      ["var(--fs-h1)",      { lineHeight: "1.02" }],
        display: ["var(--fs-display)", { lineHeight: "0.98" }],
        mega:    ["var(--fs-mega)",    { lineHeight: "0.92" }],
      },
      spacing: {
        "3xs": "var(--sp-3xs)", "2xs": "var(--sp-2xs)",
        xs: "var(--sp-xs)", sm: "var(--sp-sm)", md: "var(--sp-md)",
        lg: "var(--sp-lg)", xl: "var(--sp-xl)", "2xl": "var(--sp-2xl)",
        "3xl": "var(--sp-3xl)", "4xl": "var(--sp-4xl)", "5xl": "var(--sp-5xl)",
      },
      borderRadius: {
        sm: "var(--r-sm)",
        md: "var(--r-md)",
        lg: "var(--r-lg)",
      },
      transitionTimingFunction: {
        brand: "cubic-bezier(0.2, 0, 0, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
