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
      },
    },
  },
  plugins: [],
};
export default config;
