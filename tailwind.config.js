/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#F2EDE4',
        cream: '#E8E0D3',
        ink: '#0E0E0E',
        muted: '#5C5751',
        line: '#DDD6CB',
        ochre: '#6B4F2A',
        sand: '#C9BBA4',
      },
      fontFamily: {
        display: ['Syne', 'system-ui', 'sans-serif'],
        body: ['Inter Tight', 'system-ui', 'sans-serif'],
        serif: ['Fraunces', 'Georgia', 'serif'],
      },
      fontSize: {
        '10xl': ['10rem', { lineHeight: '0.9' }],
        '11xl': ['14rem', { lineHeight: '0.85' }],
      },
      letterSpacing: {
        'ultra-tight': '-0.04em',
        'wide-lg': '0.3em',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        'marquee-slow': 'marquee 40s linear infinite',
      },
    },
  },
  plugins: [],
}
