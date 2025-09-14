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
        // CPU Simulator Colors
        cpu: {
          register: "hsl(var(--cpu-register))",
          bus: "hsl(var(--cpu-bus))",
          control: "hsl(var(--cpu-control))",
          memory: "hsl(var(--cpu-memory))",
          alu: "hsl(var(--cpu-alu))",
        },
        signal: {
          active: "hsl(var(--signal-active))",
          inactive: "hsl(var(--signal-inactive))",
        },
        phase: {
          fetch: "hsl(var(--phase-fetch))",
          decode: "hsl(var(--phase-decode))",
          execute: "hsl(var(--phase-execute))",
          writeback: "hsl(var(--phase-writeback))",
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Consolas', 'Monaco', 'Courier New', 'monospace'],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        // CPU Simulator Animations
        "signal-flow": {
          "0%": { opacity: "0.3", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.1)" },
          "100%": { opacity: "0.3", transform: "scale(1)" },
        },
        "data-transfer": {
          "0%": { transform: "translateX(-100%)", opacity: "0" },
          "50%": { opacity: "1" },
          "100%": { transform: "translateX(100%)", opacity: "0" },
        },
        "data-packet": {
          "0%": { transform: "translateX(-20px)", opacity: "0", scale: "0.8" },
          "10%": { opacity: "1", scale: "1" },
          "90%": { opacity: "1", scale: "1" },
          "100%": { transform: "translateX(calc(100vw + 20px))", opacity: "0", scale: "0.8" },
        },
        "data-bits": {
          "0%": { transform: "translateX(-10px)", opacity: "0" },
          "20%": { opacity: "1" },
          "80%": { opacity: "1" },
          "100%": { transform: "translateX(calc(100% + 10px))", opacity: "0" },
        },
        "bit-stream-1": {
          "0%": { transform: "translateX(-100%)", opacity: "0" },
          "10%": { opacity: "0.8" },
          "90%": { opacity: "0.8" },
          "100%": { transform: "translateX(100%)", opacity: "0" },
        },
        "bit-stream-2": {
          "0%": { transform: "translateX(-100%)", opacity: "0" },
          "15%": { opacity: "0.6" },
          "85%": { opacity: "0.6" },
          "100%": { transform: "translateX(100%)", opacity: "0" },
        },
        "bit-stream-3": {
          "0%": { transform: "translateX(-100%)", opacity: "0" },
          "20%": { opacity: "0.4" },
          "80%": { opacity: "0.4" },
          "100%": { transform: "translateX(100%)", opacity: "0" },
        },
        "register-update": {
          "0%": { backgroundColor: "hsl(var(--cpu-register))" },
          "50%": { backgroundColor: "hsl(var(--secondary))" },
          "100%": { backgroundColor: "hsl(var(--cpu-register))" },
        },
        "control-pulse": {
          "0%": { boxShadow: "0 0 0 0 hsl(var(--cpu-control) / 0.7)" },
          "70%": { boxShadow: "0 0 0 10px hsl(var(--cpu-control) / 0)" },
          "100%": { boxShadow: "0 0 0 0 hsl(var(--cpu-control) / 0)" },
        },
        "phase-progress": {
          "0%": { transform: "scaleX(0)" },
          "100%": { transform: "scaleX(1)" },
        },
        "terminal-blink": {
          "0%, 50%": { opacity: "1" },
          "51%, 100%": { opacity: "0.3" },
        },
        "bus-glow": {
          "0%": { boxShadow: "0 0 5px hsl(var(--cpu-bus) / 0.3)" },
          "50%": { boxShadow: "0 0 20px hsl(var(--cpu-bus) / 0.8), 0 0 30px hsl(var(--cpu-bus) / 0.4)" },
          "100%": { boxShadow: "0 0 5px hsl(var(--cpu-bus) / 0.3)" },
        },
        "data-pulse": {
          "0%": { opacity: "0", transform: "scale(0.8)" },
          "50%": { opacity: "1", transform: "scale(1.1)" },
          "100%": { opacity: "0", transform: "scale(0.8)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        // CPU Simulator Animations
        "signal-flow": "signal-flow 1s ease-in-out infinite",
        "data-transfer": "data-transfer 2s ease-in-out infinite",
        "data-packet": "data-packet 3s linear infinite",
        "data-bits": "data-bits 2s linear infinite",
        "bit-stream-1": "bit-stream-1 1.5s linear infinite",
        "bit-stream-2": "bit-stream-2 2s linear infinite 0.3s",
        "bit-stream-3": "bit-stream-3 2.5s linear infinite 0.6s",
        "register-update": "register-update 0.5s ease-in-out",
        "control-pulse": "control-pulse 1s ease-out infinite",
        "phase-progress": "phase-progress 1s ease-out forwards",
        "terminal-blink": "terminal-blink 1s ease-in-out infinite",
        "bus-glow": "bus-glow 2s ease-in-out infinite",
        "data-pulse": "data-pulse 1s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
