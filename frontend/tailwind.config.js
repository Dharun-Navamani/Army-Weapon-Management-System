/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        military: {
          50: '#f0f5f0',
          100: '#d4e6d4',
          200: '#a8cda8',
          300: '#7db47d',
          400: '#529b52',
          500: '#2d7d2d',
          600: '#1e5e1e',
          700: '#164516',
          800: '#0f2d0f',
          900: '#071607',
        },
        command: {
          50: '#f5f3f0',
          100: '#e6dfd4',
          200: '#cdbfa8',
          300: '#b49f7d',
          400: '#9b7f52',
          500: '#7d6332',
          600: '#5e4a24',
          700: '#45361a',
          800: '#2d2311',
          900: '#161108',
        },
        steel: {
          50: '#f2f4f6',
          100: '#dce1e8',
          200: '#b9c3d1',
          300: '#96a5ba',
          400: '#7387a3',
          500: '#506a8c',
          600: '#3d506a',
          700: '#2d3b4e',
          800: '#1e2733',
          900: '#0f1319',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-slow': 'pulse 3s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
