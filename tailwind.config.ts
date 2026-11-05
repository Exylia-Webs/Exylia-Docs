import type { Config } from "tailwindcss";

const config: Config = {
  // The admin panel is styled by the design system (Tailwind 4, src/app/admin/admin.css), not here.
  content: ["./src/**/*.{ts,tsx}", "!./src/app/admin/**"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#060608",
          900: "#0a0a0d",
          850: "#0e0e13",
          800: "#13131a",
          750: "#191921",
          700: "#20202a",
          600: "#2a2a37",
        },
        exy: {
          violet: "#7c5cff",
          indigo: "#5b4bff",
          glow: "#a78bfa",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      letterSpacing: {
        tightish: "-0.02em",
        tight2: "-0.03em",
      },
      maxWidth: {
        content: "72rem",
        docs: "88rem",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "spin-slow": { to: { transform: "rotate(360deg)" } },
        drift: {
          "0%, 100%": { transform: "translate3d(0,0,0)" },
          "50%": { transform: "translate3d(2%, -2%, 0)" },
        },
        shimmer: {
          "0%": { transform: "translateX(-120%)" },
          "100%": { transform: "translateX(220%)" },
        },
      },
      animation: {
        float: "float 7s ease-in-out infinite",
        "spin-slow": "spin-slow 40s linear infinite",
        drift: "drift 22s ease-in-out infinite",
        shimmer: "shimmer 2.6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
