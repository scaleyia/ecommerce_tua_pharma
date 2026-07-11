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
        green: {
          950: "#0C1E16",
          900: "#12261C", // verde profundo (header/hero/footer)
          800: "#163B2C",
          700: "#1B4332", // verde principal
          600: "#245A42",
          500: "#2E6B4F", // verde médio
          400: "#3E8B68",
          300: "#5CA383",
          200: "#8FC3AB",
        },
        gold: {
          DEFAULT: "#C9A24B",
          light: "#E6C878",
          dark: "#A9832F",
          50: "#FBF6E9",
        },
        cream: "#F7F5EF",
        ink: "#1A2621",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-jost)", "var(--font-inter)", "sans-serif"],
      },
      boxShadow: {
        card: "0 4px 24px -8px rgba(18, 38, 28, 0.15)",
        gold: "0 8px 30px -10px rgba(201, 162, 75, 0.45)",
      },
      container: {
        center: true,
        padding: { DEFAULT: "1rem", lg: "2rem" },
        screens: { "2xl": "1280px" },
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s ease-out both",
        marquee: "marquee 30s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
