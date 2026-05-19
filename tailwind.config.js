/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: "var(--bg-soft)",
        "cream-2": "var(--bg-elev)",
        paper: "var(--surface)",
        ink: "var(--text)",
        "ink-soft": "var(--text-soft)",
        "ink-muted": "var(--text-muted)",
        gold: "var(--accent)",
        "gold-deep": "var(--accent-hover)",
        "purple-brand": "var(--accent)",
        "green-brand": "var(--ok)",
        "amber-brand": "var(--warn)",
        rust: "var(--danger)",
        line: "var(--border)",
        "line-soft": "var(--border-soft)",
      },
      fontFamily: {
        sans: ["Montserrat", "system-ui", "sans-serif"],
        display: ["Montserrat", "sans-serif"],
        body: ["Montserrat", "sans-serif"],
        mono: ['"IBM Plex Mono"', '"JetBrains Mono"', "monospace"],
      },
    },
  },
  plugins: [],
};
