import type { Config } from "tailwindcss";

const v = (name: string) => `rgb(var(--c-${name}) / <alpha-value>)`;

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: v("primary"),
        secondary: v("secondary"),
        accent: v("accent"),
        paper: v("bg"),
        ink: v("text"),
      },
      fontFamily: {
        heading: ["var(--font-heading)", "Georgia", "serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 10px 30px -12px rgb(var(--c-secondary) / 0.25)",
        lift: "0 18px 40px -14px rgb(var(--c-secondary) / 0.35)",
      },
    },
  },
  plugins: [],
};

export default config;
