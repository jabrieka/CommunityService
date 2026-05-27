import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: "#D4A52A",
          light: "#E8C36B",
          dark: "#A8801F",
        },
        ink: "#0A0A0A",
        cream: "#F5EFE0",
      },
      fontFamily: {
        display: ["var(--font-display)", "Anton", "Impact", "sans-serif"],
        script: ["var(--font-script)", "Dancing Script", "cursive"],
        brush: ["var(--font-brush)", "Permanent Marker", "cursive"],
        body: ["var(--font-body)", "Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
