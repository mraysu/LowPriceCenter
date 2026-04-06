/** @type {import('tailwindcss').Config} */

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        xl: "1100px",
        xxl: "1300px",
      },
      colors: {
        "ucsd-blue": "#00629B",
        "ucsd-darkblue": "#182B49",
        "ucsd-gold": "#FFCD00",
        // Figma palette
        "figma-sand": "#F9D488",
        "figma-orange": "#F4A71D",
        "figma-mint": "#53DCCE",
        "figma-teal": "#0E6F8F",
        "figma-charcoal": "#222222",
      },
      fontFamily: {
        jetbrains: ["JetBrains Mono", "monospace"],
        inter: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
