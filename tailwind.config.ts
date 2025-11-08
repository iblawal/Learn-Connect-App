import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}", 
  ],
  theme: {
    extend: {
      colors: {
        brandSky: "#0EA5E9",     
        brandBlue: "#1E3A8A",      
        brandNavy: "#1E293B",      
        brandEmerald: "#10B981",   
        brandSlate: "#334155",     
      },

      boxShadow: {
        "soft-lg": "0 8px 25px rgba(0, 0, 0, 0.1)",
        "soft-md": "0 4px 15px rgba(0, 0, 0, 0.08)",
      },

      fontFamily: {
        sans: ["var(--font-geist-sans)", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
