import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)", "system-ui"],
        body: ["var(--font-body)", "system-ui"]
      },
      colors: {
        ink: "#0b0f16",
        fog: "#f8fafc",
        copper: "#f97316",
        lime: "#84cc16",
        cobalt: "#2563eb"
      },
      backgroundImage: {
        "admin-gradient":
          "radial-gradient(900px 400px at 10% 0%, rgba(37,99,235,0.25), transparent), radial-gradient(800px 300px at 90% 10%, rgba(249,115,22,0.18), transparent), linear-gradient(180deg, #0b0f16 0%, #101a2a 100%)"
      }
    }
  },
  plugins: []
} satisfies Config;
