import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["'DM Sans'", "Inter", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      colors: {
        frost: {
          50: "#f8faff",
          100: "#f0f4ff",
          200: "#e4ecff",
          300: "#c8d8ff",
        },
        silver: {
          100: "#f5f5f7",
          200: "#e8e8ed",
          300: "#d0d0d8",
          400: "#b0b0bc",
          500: "#8e8e9a",
          600: "#6e6e7a",
        },
        ice: "#dce8ff",
        aether: "#7b9ef8",
        void: "#0d1117",
      },
      backdropBlur: {
        xs: "2px",
      },
      animation: {
        "float": "float 6s ease-in-out infinite",
        "float-slow": "float 9s ease-in-out infinite",
        "pulse-slow": "pulse 4s ease-in-out infinite",
        "shimmer": "shimmer 3s linear infinite",
        "glow": "glow 2s ease-in-out infinite alternate",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        glow: {
          "0%": { opacity: "0.5" },
          "100%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
