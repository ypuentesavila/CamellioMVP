import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // ── Sabana palette ─────────────────────────────────────────────
        paper: {
          DEFAULT: "#F7F2E6",
          "2": "#ECE0C5",
        },
        card: "#FBF8EF",
        ink: "#1E2A3A",

        stone: {
          100: "#E5DFCD",
          200: "#D6CFBC",
          300: "#B5B0A0",
          400: "#928E80",
          500: "#6E6A5E",
          600: "#4A5160",
        },
        azulejo: {
          100: "#D6E2F2",
          200: "#B6CCE8",
          300: "#6E95D2",
          400: "#3C6EBF",
          500: "#234478",
          600: "#1B3358",
        },
        marigold: {
          100: "#FAE5B8",
          200: "#F6C56A",
          300: "#F3B033",
          400: "#B07816",
          500: "#7E5210",
        },
        forest: {
          100: "#D8E6D5",
          500: "#3D7A4B",
          600: "#2E5E3A",
        },
        amber: {
          100: "#F2D7A3",
          500: "#B26B1A",
        },

        // ── Legacy aliases → Sabana values ─────────────────────────────
        primary: "#1E2A3A",
        "primary-dark": "#1B3358",
        "primary-light": "#D6E2F2",
        "primary-mid": "#B6CCE8",
        accent: "#F3B033",
        "accent-light": "#FAE5B8",
        background: "#F7F2E6",
        surface: "#FBF8EF",
        "text-primary": "#1E2A3A",
        "text-secondary": "#6E6A5E",
        border: "#D6CFBC",
        success: "#3D7A4B",
        danger: "#EF4444",
      },

      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },

      boxShadow: {
        card: "0 1px 3px rgba(30,42,58,0.06), 0 1px 2px rgba(30,42,58,0.04)",
        "card-hover":
          "0 4px 12px rgba(30,42,58,0.10), 0 2px 4px rgba(30,42,58,0.06)",
        nav: "0 1px 0 rgba(30,42,58,0.08)",
        fab: "0 8px 24px rgba(35,68,120,0.35)",
        modal:
          "0 20px 60px rgba(30,42,58,0.18), 0 8px 24px rgba(30,42,58,0.10)",
      },

      borderRadius: {
        card: "16px",
        "card-lg": "18px",
      },
    },
  },
  plugins: [],
};

export default config;
