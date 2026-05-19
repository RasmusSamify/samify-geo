/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: "var(--cream)",
        "cream-2": "var(--cream-2)",
        paper: "var(--paper)",
        ink: "var(--ink)",
        "ink-soft": "var(--ink-soft)",
        "ink-muted": "var(--ink-muted)",
        gold: "var(--gold)",
        "gold-deep": "var(--gold-deep)",
        "purple-brand": "var(--purple)",
        "green-brand": "var(--green)",
        "amber-brand": "var(--amber)",
        rust: "var(--rust)",
        line: "var(--line)",
        "line-soft": "var(--line-soft)",
      },
      fontFamily: {
        display: ['"Fraunces"', "serif"],
        body: ['"IBM Plex Sans"', "sans-serif"],
        mono: ['"JetBrains Mono"', "monospace"],
      },
    },
  },
  plugins: [],
};
