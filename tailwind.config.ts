import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      height: {
        13: "3.25rem",
      },
      width: {
        13: "3.25rem",
        39: "9.75rem",
      },
      maxWidth: {
        90: "22.5rem",
        145: "36.25rem",
        "12xl": "120rem",
      },
      padding: {
        13: "3.25rem",
        18: "4.5rem",
        34: "8.5rem",
        42: "10.5rem",
      },
      margin: {
        13: "3.25rem",
        34: "8.5rem",
      },
      fontSize: {
        "3xl": "2rem",
      },
      gap: {
        13: "3.25rem",
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          100: "rgba(var(--primary-100) / <alpha-value>) ",
          500: "rgba(var(--primary-500) / <alpha-value>)",
          600: "rgba(var(--primary-600) / <alpha-value>)",
          800: "rgba(var(--primary-800) / <alpha-value>)",
          900: "rgba(var(--primary-900) / <alpha-value>)",
        },
        grey: {
          100: "rgba(var(--grey-100) / <alpha-value>)",
          200: "rgba(var(--grey-200) / <alpha-value>)",
          300: "rgba(var(--grey-300) / <alpha-value>)",
          400: "rgba(var(--grey-400) / <alpha-value>)",
          600: "rgba(var(--grey-600) / <alpha-value>)",
          700: "rgba(var(--grey-700) / <alpha-value>)",
          800: "rgba(var(--grey-800) / <alpha-value>)",
        },
        error: {
          500: "rgba(var(--error-500) / <alpha-value>)",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        "6xl": "calc(var(--radius) * 6)", // 48px
        "5xl": "calc(var(--radius) * 5)", // 40px
        "4xl": "calc(var(--radius) * 4)", // 32px
        "3xl": "calc(var(--radius) * 3)", // 24px
        "2xl": "calc(var(--radius) * 2)", // 16px
        xl: "calc(var(--radius) * 1.5)", // 12px
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      boxShadow: {
        soft: "0 8px 24px rgba(42, 50, 52, 0.08)",
      },
    },
  },
  // eslint-disable-next-line  @typescript-eslint/no-require-imports
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
