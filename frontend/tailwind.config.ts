import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#F2F5F9",
        ink: "#0F1B2D",
        line: "#C9D3E0",
        accent: "#2548D8",
        yes: "#0E7C4A",
        no: "#B42318",
        maybe: "#8A6100",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
