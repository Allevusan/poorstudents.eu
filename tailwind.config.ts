import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Pastel highlighter, not traffic light
        wash: "#FFF8E6", // soft warm yellow page wash
        washdeep: "#FFEFC2",
        ink: "#1C1917", // near-black text
        accent: {
          DEFAULT: "#16A34A", // fresh green CTA
          dark: "#15803D",
          soft: "#DCFCE7",
        },
        badge: "#FDE047", // discount badge yellow
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        card: "1.25rem",
        chunky: "1rem",
      },
      boxShadow: {
        card: "0 2px 0 0 rgba(28,25,23,0.08), 0 6px 20px -6px rgba(28,25,23,0.10)",
        chunky: "0 3px 0 0 rgba(21,128,61,0.9)",
      },
    },
  },
  plugins: [],
};
export default config;
