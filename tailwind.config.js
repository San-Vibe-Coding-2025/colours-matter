/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/**/*.html",
    "./**/*.html"
  ],
  theme: {
    extend: {
      colors: {
        // Viridis theme colors using CSS variables
        'theme-primary': 'var(--theme-primary)',
        'theme-secondary': 'var(--theme-secondary)', 
        'theme-accent': 'var(--theme-accent)',
        'theme-success': 'var(--theme-success)',
        'theme-warning': 'var(--theme-warning)',
        'theme-info': 'var(--theme-info)',
        'theme-background': 'var(--theme-background)',
        'theme-surface': 'var(--theme-surface)',
        'theme-text': 'var(--theme-text)',
        'theme-text-muted': 'var(--theme-text-muted)',
        'theme-border': 'var(--theme-border)',
        
        // Shortened versions for easier use
        'primary': 'var(--theme-primary)',
        'secondary': 'var(--theme-secondary)',
        'accent': 'var(--theme-accent)',
        'success': 'var(--theme-success)',
        'warning': 'var(--theme-warning)',
        'info': 'var(--theme-info)',
      },
      backgroundImage: {
        'gradient-primary': 'var(--theme-gradient-primary)',
        'gradient-accent': 'var(--theme-gradient-accent)', 
        'gradient-warm': 'var(--theme-gradient-warm)',
        'gradient-cool': 'var(--theme-gradient-cool)',
        'gradient-viridis': 'linear-gradient(135deg, var(--theme-primary), var(--theme-secondary), var(--theme-accent), var(--theme-success), var(--theme-warning), var(--theme-info))',
      },
      borderColor: {
        'theme': 'var(--theme-border)',
      },
      boxShadow: {
        'theme': '0 2px 8px var(--theme-shadow)',
        'theme-lg': '0 4px 16px var(--theme-shadow)',
      },
      borderRadius: {
        'theme': 'var(--theme-border-radius)',
        'theme-lg': 'var(--theme-border-radius-lg)',
      },
      transitionProperty: {
        'theme': 'var(--theme-transition)',
      }
    },
  },
  plugins: [
    // Custom plugin to add theme-aware utilities
    function({ addUtilities, theme }) {
      const themeUtilities = {
        '.bg-theme-surface': {
          'background-color': 'var(--theme-surface)',
        },
        '.text-theme': {
          'color': 'var(--theme-text)',
        },
        '.text-theme-muted': {
          'color': 'var(--theme-text-muted)',
        },
        '.border-theme': {
          'border-color': 'var(--theme-border)',
        },
        '.shadow-theme': {
          'box-shadow': '0 2px 8px var(--theme-shadow)',
        },
        '.transition-theme': {
          'transition': 'var(--theme-transition)',
        },
        // Interactive states
        '.hover\\:opacity-theme:hover': {
          'opacity': 'var(--theme-hover-opacity)',
        },
        '.active\\:opacity-theme:active': {
          'opacity': 'var(--theme-active-opacity)',
        },
        '.disabled\\:opacity-theme:disabled': {
          'opacity': 'var(--theme-disabled-opacity)',
        },
        // Gradient text utilities
        '.text-gradient-primary': {
          'background': 'var(--theme-gradient-primary)',
          '-webkit-background-clip': 'text',
          'background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
        },
        '.text-gradient-accent': {
          'background': 'var(--theme-gradient-accent)',
          '-webkit-background-clip': 'text', 
          'background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
        },
        '.text-gradient-warm': {
          'background': 'var(--theme-gradient-warm)',
          '-webkit-background-clip': 'text',
          'background-clip': 'text', 
          '-webkit-text-fill-color': 'transparent',
        },
      };
      
      addUtilities(themeUtilities);
    }
  ],
}