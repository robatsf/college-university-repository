// tailwind.config.js
module.exports = {
    theme: {
      extend: {
        colors: {
          primary: '#0066CC',
          'primary-dark': '#0052A3',
        },
        animation: {
          'fade-in': 'fadeIn 0.3s ease-in',
          'slide-in': 'slideIn 0.3s ease-out',
          'slideDown': 'slideDown 0.2s ease-out',
        },
        keyframes: {
          fadeIn: {
            '0%': { opacity: '0' },
            '100%': { opacity: '1' },
          },
          slideIn: {
            '0%': { transform: 'translateY(-10px)', opacity: '0' },
            '100%': { transform: 'translateY(0)', opacity: '1' },
          },
          slideDown: {
            '0%': { transform: 'translateY(-10px)', opacity: 0 },
            '100%': { transform: 'translateY(0)', opacity: 1 },
          },
        },
      },
    },
  };