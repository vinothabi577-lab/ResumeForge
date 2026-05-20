/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // support manual dark mode toggles, but default to dark
  theme: {
    extend: {
      colors: {
        // Elite Grayscale and Layered Dark Mode Palette (Linear-like)
        dark: {
          bg: "#0b0c0e",       // Subtle charcoal black, not pure dark
          card: "#12141a",     // Dark primary panels
          elevated: "#1a1d26", // Multi-layered popup panels
          border: "#202430",   // Soft gray borders
          borderLight: "#2d3345",
          text: "#e2e8f0",     // Premium slate text
          muted: "#94a3b8",    // Clean secondary text
        },
        primary: {
          DEFAULT: "#7c3aed",  // Elegant accent color (Violet)
          hover: "#6d28d9",
          light: "#a78bfa",
          dark: "#5b21b6",
        },
        accent: {
          DEFAULT: "#10b981",  // Emerald for highlight/success
          blue: "#3b82f6",    // Info
          yellow: "#f59e0b",  // ATS warning
        }
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        heading: ["Outfit", "sans-serif"],
        serif: ["Times New Roman", "serif"],
      },
      boxShadow: {
        "premium": "0 8px 30px rgb(0, 0, 0, 0.4)",
        "glass": "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
        "glow": "0 0 20px rgba(124, 58, 237, 0.2)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      }
    },
  },
  plugins: [],
}
