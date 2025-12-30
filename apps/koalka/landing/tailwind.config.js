/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './apps/koalka/landing/src/**/*.{html,ts}',
    './libs/ui/**/*.{html,ts}',
  ],
  theme: {
    extend: {},
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        'koalka-light': {
          'primary': 'oklch(70% 0.25 350)',           // Hot Pink
          'primary-content': 'oklch(100% 0 0)',       // White
          'secondary': 'oklch(75% 0.20 340)',         // Light Pink
          'secondary-content': 'oklch(100% 0 0)',     // White
          'accent': 'oklch(65% 0.28 345)',            // Electric Pink
          'accent-content': 'oklch(100% 0 0)',        // White
          'neutral': 'oklch(30% 0.02 280)',           // Dark Gray
          'neutral-content': 'oklch(95% 0 0)',        // Light Gray
          'base-100': 'oklch(100% 0 0)',              // Pure White
          'base-200': 'oklch(98% 0.01 350)',          // Subtle Pink Tint
          'base-300': 'oklch(95% 0.015 350)',         // Light Pink Tint
          'base-content': 'oklch(20% 0.02 280)',      // Almost Black
          'info': 'oklch(70% 0.15 240)',              // Blue
          'info-content': 'oklch(100% 0 0)',          // White
          'success': 'oklch(65% 0.15 160)',           // Green
          'success-content': 'oklch(100% 0 0)',       // White
          'warning': 'oklch(85% 0.17 85)',            // Yellow
          'warning-content': 'oklch(20% 0 0)',        // Dark
          'error': 'oklch(65% 0.22 30)',              // Red
          'error-content': 'oklch(100% 0 0)',         // White
          '--rounded-box': '1rem',
          '--rounded-btn': '0.5rem',
          '--rounded-badge': '1.9rem',
          '--animation-btn': '0.25s',
          '--animation-input': '0.2s',
          '--btn-focus-scale': '0.95',
          '--border-btn': '1px',
          '--tab-border': '1px',
          '--tab-radius': '0.5rem',
        },
        'koalka-dark': {
          'primary': 'oklch(75% 0.30 350)',           // Bright Hot Pink
          'primary-content': 'oklch(15% 0.03 280)',   // Dark Text
          'secondary': 'oklch(80% 0.25 340)',         // Vivid Light Pink
          'secondary-content': 'oklch(15% 0.03 280)', // Dark Text
          'accent': 'oklch(70% 0.32 345)',            // Neon Pink
          'accent-content': 'oklch(15% 0.03 280)',    // Dark Text
          'neutral': 'oklch(25% 0.02 280)',           // Dark Gray
          'neutral-content': 'oklch(90% 0.01 350)',   // Light Pink Gray
          'base-100': 'oklch(15% 0.03 280)',          // Very Dark
          'base-200': 'oklch(12% 0.025 280)',         // Darker
          'base-300': 'oklch(10% 0.02 280)',          // Darkest
          'base-content': 'oklch(95% 0.015 350)',     // Light Pink White
          'info': 'oklch(70% 0.17 240)',              // Bright Blue
          'info-content': 'oklch(15% 0 0)',           // Dark
          'success': 'oklch(65% 0.16 160)',           // Bright Green
          'success-content': 'oklch(15% 0 0)',        // Dark
          'warning': 'oklch(85% 0.17 85)',            // Bright Yellow
          'warning-content': 'oklch(15% 0 0)',        // Dark
          'error': 'oklch(70% 0.24 30)',              // Bright Red
          'error-content': 'oklch(15% 0 0)',          // Dark
          '--rounded-box': '1rem',
          '--rounded-btn': '0.5rem',
          '--rounded-badge': '1.9rem',
          '--animation-btn': '0.25s',
          '--animation-input': '0.2s',
          '--btn-focus-scale': '0.95',
          '--border-btn': '1px',
          '--tab-border': '1px',
          '--tab-radius': '0.5rem',
        },
      },
    ],
    darkTheme: 'koalka-dark',
    base: true,
    styled: true,
    utils: true,
    prefix: '',
    logs: true,
    themeRoot: ':root',
  },
};
