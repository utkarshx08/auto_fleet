/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Liquid Glass Palette
        glass: {
          bg: '#F4F7FB',
          surface: '#FFFFFF',
          'surface-subtle': '#F8FAFD',
          'surface-hover': '#F0F5FC',
          blue: '#2879E8',
          'blue-hover': '#1765CC',
          'blue-soft': '#EAF3FF',
          'blue-tint': 'rgba(40, 121, 232, 0.08)',
          text: '#0B132B',
          muted: '#334155',
          dim: '#64748B',
          border: 'rgba(226, 232, 240, 0.8)',
          'border-highlight': 'rgba(255, 255, 255, 0.95)',
          success: '#16A36A',
          'success-soft': '#E8F7F0',
          warning: '#E7A329',
          'warning-soft': '#FEF7EA',
          danger: '#E05252',
          'danger-soft': '#FDF2F2',
        },
        bg: {
          DEFAULT: '#F4F7FB',
          sidebar: '#FFFFFF',
          card: '#FFFFFF',
          elevated: '#F8FAFD',
          input: '#FFFFFF',
          hover: '#F0F5FC',
        },
        panel: {
          DEFAULT: '#FFFFFF',
          secondary: '#F8FAFD',
          tertiary: '#F1F5F9',
        },
        line: {
          DEFAULT: '#E2E8F0',
          subtle: '#EDF2F7',
          border: '#E2E8F0',
          hover: '#CBD5E1',
        },
        purple: {
          DEFAULT: '#2879E8',
          accent: '#1765CC',
          light: '#60A5FA',
          muted: '#93C5FD',
          dark: '#1E3A8A',
          tag: '#EAF3FF',
        },
        green: {
          status: '#16A36A',
          active: '#16A36A',
          beacon: '#10B981',
          pill: '#E8F7F0',
          pillBorder: '#B7E4CF',
        },
        amber: {
          warning: '#E7A329',
          text: '#D97706',
          pill: '#FEF7EA',
          badge: '#FDE68A',
        },
        blue: {
          info: '#2879E8',
          pill: '#EAF3FF',
        },
        autrail: {
          muted: '#475569',
          dim: '#64748B',
          text: '#0B132B',
          subtext: '#1E293B',
        }
      },
      boxShadow: {
        'liquid-card': '0 12px 35px rgba(43, 73, 116, 0.08), 0 3px 10px rgba(43, 73, 116, 0.04), inset 0 1px 0 rgba(255,255,255,1), inset 0 -1px 0 rgba(218,230,247,0.65)',
        'liquid-card-hover': '0 18px 45px rgba(43, 73, 116, 0.12), 0 6px 14px rgba(43, 73, 116, 0.05), inset 0 1px 0 rgba(255,255,255,1), inset 0 -1px 0 rgba(218,230,247,0.85)',
        'liquid-float': '0 20px 48px rgba(43, 73, 116, 0.12), 0 8px 18px rgba(43, 73, 116, 0.06), inset 0 1px 0 rgba(255,255,255,0.9)',
        'liquid-dropdown': '0 16px 36px rgba(43, 73, 116, 0.14), 0 4px 12px rgba(43, 73, 116, 0.06), inset 0 1px 0 rgba(255,255,255,1)',
        'liquid-btn': '0 6px 18px rgba(40, 121, 232, 0.28), inset 0 1px 0 rgba(255,255,255,0.4)',
        'liquid-subtle': '0 4px 14px rgba(43, 73, 116, 0.05), inset 0 1px 0 rgba(255,255,255,0.8)',
      },
      fontFamily: {
        sans: ['Manrope', '-apple-system', 'BlinkMacSystemFont', '"SF Pro Display"', 'sans-serif'],
        mono: ['DM Mono', 'monospace'],
      },
      borderRadius: {
        '2xl': '20px',
        '3xl': '24px',
      }
    },
  },
  plugins: [],
}

