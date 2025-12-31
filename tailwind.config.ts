import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#6366f1",
        secondary: "#8b5cf6",
        "dark-bg": "#0f172a",
        "light-bg": "#1e293b",
        "accent-green": "#10b981",
        "accent-orange": "#f59e0b",
        "neon-cyan": "#00f3ff",
        "neon-magenta": "#ff00ff",
        "noir-bg": "#09090b",
        "noir-panel": "rgba(20, 20, 23, 0.7)",
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        outfit: ['Outfit', 'sans-serif'],
      },
      boxShadow: {
        'neon-cyan': '0 0 20px rgba(0, 243, 255, 0.5)',
        'neon-magenta': '0 0 20px rgba(255, 0, 255, 0.5)',
        'neon-glow': '0 0 30px rgba(0, 243, 255, 0.3), 0 0 60px rgba(255, 0, 255, 0.2)',
      },
    },
  },
  plugins: [],
};
export default config;
