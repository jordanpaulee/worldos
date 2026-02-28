import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "../../packages/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        bg: "#07111f",
        panel: "#0f1b2d",
        panelAlt: "#13233b",
        ink: "#edf2ff",
        accent: "#69d2b1",
        warning: "#f2a65a"
      },
      boxShadow: {
        soft: "0 20px 50px rgba(0, 0, 0, 0.25)"
      }
    }
  },
  plugins: []
};

export default config;
