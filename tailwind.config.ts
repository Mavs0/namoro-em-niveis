import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#1B1F3B",
        "retro-blue": "#4D6AFF",
        "pixel-pink": "#FF7AA2",
        "xp-yellow": "#FFD166",
        white: "#F5F5F5",
      },
      fontFamily: {
        pixel: ["Press Start 2P", "monospace"],
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;

