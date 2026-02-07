import type { Config } from "tailwindcss";

export default {
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
      fontFamily: {
        display: ['"Chewy"', 'cursive'],
        body: ['"Space Mono"', 'monospace'],
        bubble: ['"Chewy"', 'cursive'],
      },
      borderRadius: {
        organic: '2rem',
        'organic-lg': '3rem',
        'organic-xl': '4rem',
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
        // PHARMBOI Custom Colors - The Cosmic Garden
        cosmic: {
          blue: "hsl(var(--cosmic-blue))",
          deep: "hsl(var(--cosmic-deep))",
        },
        amethyst: {
          DEFAULT: "hsl(var(--amethyst))",
          dark: "hsl(var(--amethyst-dark))",
        },
        root: {
          brown: "hsl(var(--root-brown))",
          dark: "hsl(var(--root-dark))",
        },
        forest: {
          green: "hsl(var(--forest-green))",
          dark: "hsl(var(--forest-dark))",
        },
        cream: {
          DEFAULT: "hsl(var(--cream))",
          muted: "hsl(var(--cream-muted))",
        },
        gem: {
          ruby: "hsl(var(--gem-ruby))",
          sapphire: "hsl(var(--gem-sapphire))",
          emerald: "hsl(var(--gem-emerald))",
          topaz: "hsl(var(--gem-topaz))",
          amethyst: "hsl(var(--gem-amethyst))",
        },
        chakra: {
          root: "hsl(var(--chakra-root))",
          sacral: "hsl(var(--chakra-sacral))",
          solar: "hsl(var(--chakra-solar))",
          heart: "hsl(var(--chakra-heart))",
          throat: "hsl(var(--chakra-throat))",
          vision: "hsl(var(--chakra-vision))",
          source: "hsl(var(--chakra-source))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
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
        "shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "rotate-slow": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "shimmer": "shimmer 3s linear infinite",
        "rotate-slow": "rotate-slow 20s linear infinite",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
