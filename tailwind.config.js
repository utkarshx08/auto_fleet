/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: '#101116',
          sidebar: '#121319',
          card: '#17191f',
          elevated: '#1c1e25',
          input: '#20222a',
          hover: '#22242d',
        },
        panel: {
          DEFAULT: '#17191f',
          secondary: '#1c1e25',
          tertiary: '#20222a',
        },
        line: {
          DEFAULT: '#292c35',
          subtle: '#252730',
          border: '#2b2e38',
          hover: '#343641',
        },
        purple: {
          DEFAULT: '#b49aff',
          accent: '#ad91ff',
          light: '#c4b3ff',
          muted: '#9b83ed',
          dark: '#24212f',
          tag: '#40375b',
        },
        green: {
          status: '#8be0b3',
          active: '#80d9a9',
          beacon: '#75d5a2',
          pill: '#1c302a',
          pillBorder: '#2c493d',
        },
        amber: {
          warning: '#edaa69',
          text: '#e5a46e',
          pill: '#382c25',
          badge: '#46352c',
        },
        blue: {
          info: '#8dc8ed',
          pill: '#263543',
        },
        autrail: {
          muted: '#858997',
          dim: '#70737f',
          text: '#f0f0f4',
          subtext: '#aeb0ba',
        }
      },
      fontFamily: {
        sans: ['Manrope', 'sans-serif'],
        mono: ['DM Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}

