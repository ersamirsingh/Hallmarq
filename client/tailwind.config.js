export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans Variable"', 'system-ui', 'sans-serif']
      },
      colors: {
        dark: {
          bg: '#000000',
          surface: '#0F0F0F',
          surfaceSubtle: '#151515',
          text: '#FFFFFF',
          muted: '#9A9A9A',
          accent: '#6C86FF',
          accentText: '#111111',
          star: '#FF7A3D',
          border: '#262626',
          categoryBg: 'rgba(108, 134, 255, 0.18)',
          categoryText: '#6C86FF'
        },
        stock: {
          50: '#F8FAFC',
          100: '#F0F3F6',
          200: '#E2E7EC',
          300: '#CDD6DF',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          850: '#17202B',
          900: '#111822',
          950: '#0B1017'
        },
        ink: {
          50: '#F2F6FA',
          100: '#E4EDF5',
          200: '#C7DCEB',
          300: '#9EC2DE',
          400: '#689FCA',
          500: '#3D7FB4',
          600: '#236195',
          700: '#1A4D77',
          800: '#153A5A',
          850: '#112C45',
          900: '#0D2033',
          950: '#07121E'
        },
        rating: {
          light: '#FFF1F2',
          border: '#FECDD3',
          DEFAULT: '#E11D48',
          hover: '#BE123C',
          darkBg: 'rgba(255, 122, 61, 0.18)',
          darkBorder: 'rgba(255, 122, 61, 0.3)'
        }
      },
      boxShadow: {
        'stock-card': '0 1px 3px 0 rgba(15, 23, 42, 0.05), 0 1px 2px -1px rgba(15, 23, 42, 0.05)',
        'stock-hover': '0 4px 12px 0 rgba(15, 23, 42, 0.08), 0 2px 4px -2px rgba(15, 23, 42, 0.06)',
        'letterpress-inset': 'inset 0 1px 2px 0 rgba(13, 32, 51, 0.06)'
      }
    }
  },
  plugins: []
};
