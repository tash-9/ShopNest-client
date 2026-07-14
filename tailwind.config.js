/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: "#6366f1", 50: "#eef2ff", 100: "#e0e7ff", 600: "#4f46e5", 700: "#4338ca" },
      },
      borderRadius: { "2xl": "1rem", "3xl": "1.5rem" },
      fontFamily: { sans: ["Inter", "system-ui", "sans-serif"] },
    },
  },
  plugins: [],
};
