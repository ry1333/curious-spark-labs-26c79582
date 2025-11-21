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
        // Base colors - HIGH CONTRAST
        ink: 'hsl(var(--bg))',
        surface: 'hsl(var(--surface))',
        elevated: 'hsl(var(--surface-2))',
        line: 'hsl(var(--border))',

        // Text colors - HIGH CONTRAST
        text: 'hsl(var(--text))',              // Bright white
        'text-secondary': 'hsl(var(--text-secondary))', // Readable gray
        'text-muted': 'hsl(var(--text-muted))',         // Muted gray

        // Accent colors - Use sparingly!
        cyan: {
          DEFAULT: 'hsl(var(--accent-cyan))',
          50: '#E0F9FF',
          100: '#B3F0FF',
          500: '#00E5FF',
          600: '#00C2E0',
        },
        magenta: {
          DEFAULT: 'hsl(var(--accent-magenta))',
          50: '#FFF0F7',
          500: '#E11D84',
          600: '#C0156F',
        },
        purple: {
          DEFAULT: 'hsl(var(--accent-purple))',
          500: '#9D5CFF',
        },

        // Semantic colors
        success: 'hsl(var(--success))',
        warning: 'hsl(var(--warning))',
        error: 'hsl(var(--error))',
        info: 'hsl(var(--info))',

        // Legacy compatibility
        muted: 'hsl(var(--text-muted))',
        rmxrtext: 'hsl(var(--text))',
        rmxrborder: 'hsl(var(--border))',
        accent: {
          DEFAULT: "var(--accent)",
        },

        // Shadcn compatibility
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
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      fontFamily: {
        sans: ["'Space Grotesk'", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, hsl(var(--gradient-cyan)), hsl(var(--gradient-magenta)))',
        'gradient-secondary': 'linear-gradient(135deg, hsl(var(--gradient-blue)), hsl(var(--gradient-purple)))',
        'gradient-radial': 'radial-gradient(circle, hsl(var(--gradient-cyan) / 0.2), transparent 70%)',
      },
      boxShadow: {
        // Subtle elevation (cards, panels)
        'elevation-1': '0 2px 8px rgba(0, 0, 0, 0.4)',
        'elevation-2': '0 4px 16px rgba(0, 0, 0, 0.5)',
        'elevation-3': '0 8px 32px rgba(0, 0, 0, 0.6)',

        // REDUCED glow effects (40-60% less intense)
        'glow-cyan': '0 0 12px rgba(0, 229, 255, 0.25)',        // Was 0.4
        'glow-magenta': '0 0 12px rgba(225, 29, 132, 0.25)',   // Was 0.4
        'glow-cyan-strong': '0 0 20px rgba(0, 229, 255, 0.4)', // Was 0.6
        'glow-magenta-strong': '0 0 20px rgba(225, 29, 132, 0.4)', // Was 0.6

        // Subtle neon effects - only for active states
        'neon-cyan': '0 0 8px rgba(0, 229, 255, 0.3), inset 0 0 8px rgba(0, 229, 255, 0.1)',
        'neon-magenta': '0 0 8px rgba(225, 29, 132, 0.3), inset 0 0 8px rgba(225, 29, 132, 0.1)',
        'inner-glow': 'inset 0 0 20px rgba(255, 255, 255, 0.1)',
        'inner-dark': 'inset 0 2px 8px rgba(0, 0, 0, 0.4)',
      },
      animation: {
        // Glow & pulse
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'pulse-ring': 'pulse-ring 2s ease-in-out infinite',

        // Movement
        'float': 'float 3s ease-in-out infinite',
        'bounce-slow': 'bounce 2s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
        'vinyl-spin': 'vinyl-spin 3s linear infinite',

        // Slide & scale
        'slide-in-left': 'slide-in-left 0.3s ease-out',
        'slide-in-right': 'slide-in-right 0.3s ease-out',
        'slide-in-up': 'slide-in-up 0.3s ease-out',
        'slide-in-down': 'slide-in-down 0.3s ease-out',
        'scale-up': 'scale-up 0.3s ease-out',
        'scale-down': 'scale-down 0.3s ease-in',
        'fade-in': 'fade-in 0.3s ease-out',
        'fade-out': 'fade-out 0.3s ease-in',

        // Special effects
        'shimmer': 'shimmer 1.6s infinite',
        'morph': 'morph 8s ease-in-out infinite',
        'heartbeat': 'heartbeat 1s ease-in-out',
        'burst': 'burst 0.6s ease-out',
        'wave': 'wave 1s ease-in-out infinite',

        // Accordion (existing)
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      keyframes: {
        // Glow & pulse
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0, 229, 255, 0.3)' },
          '50%': { boxShadow: '0 0 30px rgba(0, 229, 255, 0.6), 0 0 50px rgba(225, 29, 132, 0.3)' },
        },
        'pulse-ring': {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.5' },
          '50%': { transform: 'scale(1.1)', opacity: '0.8' },
        },

        // Movement
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'vinyl-spin': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },

        // Slide animations
        'slide-in-left': {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'slide-in-right': {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'slide-in-up': {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-in-down': {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },

        // Scale & fade
        'scale-up': {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'scale-down': {
          '0%': { transform: 'scale(1.2)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-out': {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },

        // Special effects
        'shimmer': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        'morph': {
          '0%, 100%': { borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' },
          '50%': { borderRadius: '30% 60% 70% 40% / 50% 60% 30% 60%' },
        },
        'heartbeat': {
          '0%, 100%': { transform: 'scale(1)' },
          '25%': { transform: 'scale(1.2)' },
          '50%': { transform: 'scale(1)' },
        },
        'burst': {
          '0%': { transform: 'scale(0)', opacity: '1' },
          '50%': { transform: 'scale(1.2)', opacity: '0.8' },
          '100%': { transform: 'scale(1.5)', opacity: '0' },
        },
        'wave': {
          '0%, 100%': { height: '20%' },
          '50%': { height: '100%' },
        },
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
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
