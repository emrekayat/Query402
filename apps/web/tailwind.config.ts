import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#06070a",
          900: "#0c1018",
          800: "#131a26"
        },
        neon: {
          cyan: "#35d8ff",
          violet: "#9a7dff",
          mint: "#31f0b5"
        }
      },
      boxShadow: {
        panel: "0 24px 60px rgba(2, 6, 23, 0.45)",
        glow: "0 0 0 1px rgba(53, 216, 255, 0.25), 0 12px 40px rgba(53, 216, 255, 0.15)"
      },
      backgroundImage: {
        mesh:
          "radial-gradient(circle at 10% 20%, rgba(53,216,255,0.16), transparent 42%), radial-gradient(circle at 90% 0%, rgba(154,125,255,0.17), transparent 38%), radial-gradient(circle at 40% 92%, rgba(49,240,181,0.12), transparent 44%)"
      }
    }
  },
  plugins: []
} satisfies Config;
