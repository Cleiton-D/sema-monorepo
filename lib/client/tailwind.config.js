const { fontFamily } = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: ['app/**/*.{ts,tsx}', 'src/components/**/*.{ts,tsx}'],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    spacing: {
      0.5: '0.2rem',
      1: '0.4rem',
      1.5: '0.6rem',
      2: '0.8rem',
      2.5: '1rem',
      3: '1.2rem',
      3.5: '1.4rem',
      4: '1.6rem',
      5: '2rem',
      6: '2.4rem',
      7: '2.8rem',
      8: '3.2rem',
      9: '3.6rem',
      10: '4rem',
      11: '4.4rem',
      12: '4.8rem',
      14: '5.6rem',
      16: '6.4rem',
      20: '8rem',
      24: '9.6rem',
      28: '11.2rem',
      32: '12.8rem',
      36: '14.4rem',
      40: '16rem',
      44: '17.6rem',
      48: '19.2rem',
      52: '20.8rem',
      56: '22.4rem',
      60: '24rem',
      64: '25.6rem',
      72: '28.8rem',
      80: '32rem',
      96: '38.4rem'
    },
    fontSize: {
      xs: ['1.2rem', '1.6rem'],
      sm: ['1.4rem', '2rem'],
      base: ['1.6rem', '2.4rem'],
      lg: ['1.8rem', '2.8rem'],
      xl: ['2rem', '2.8rem'],
      '2xl': ['2.4rem', '3.2rem'],
      '3xl': ['3rem', '3.6rem'],
      '4xl': ['3.6rem', '4rem'],
      '5xl': ['4.8rem', '1.6rem'],
      '6xl': ['6rem', '1.6rem'],
      '7xl': ['7.2rem', '1.6rem'],
      '8xl': ['9.6rem', '1.6rem'],
      '9xl': ['12.8rem', '1.6rem']
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        }
      },
      borderRadius: {
        lg: `var(--radius)`,
        md: `calc(var(--radius) - 2px)`,
        sm: 'calc(var(--radius) - 4px)'
      },
      fontFamily: {
        sans: ['var(--font-sans)', ...fontFamily.sans]
      },
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out'
      }
    }
  },
  plugins: [require('tailwindcss-animate')]
};
