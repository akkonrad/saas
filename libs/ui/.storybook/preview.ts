import type { Decorator, Preview } from '@storybook/angular';
// Import Storybook-specific styles (Tailwind v4 + DaisyUI)
import './styles.css';

// Decorator to apply DaisyUI theme
const withTheme: Decorator = (storyFn, context) => {
  const theme = context.globals['theme'] || 'dark';

  // Apply theme to the document
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-theme', theme);
  }

  return storyFn();
};

const preview: Preview = {
  decorators: [withTheme],
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
  globalTypes: {
    theme: {
      description: 'Global theme for components',
      defaultValue: 'dark',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: [
          { value: 'light', title: 'Light', icon: 'sun' },
          { value: 'dark', title: 'Dark', icon: 'moon' },
          { value: 'cupcake', title: 'Cupcake (light)' },
          { value: 'bumblebee', title: 'Bumblebee (light)' },
          { value: 'emerald', title: 'Emerald (light)' },
          { value: 'corporate', title: 'Corporate (light)' },
          { value: 'synthwave', title: 'Synthwave (dark)' },
          { value: 'retro', title: 'Retro (light)' },
          { value: 'cyberpunk', title: 'Cyberpunk (light)' },
          { value: 'valentine', title: 'Valentine (light)' },
          { value: 'halloween', title: 'Halloween (dark)' },
          { value: 'garden', title: 'Garden (light)' },
          { value: 'forest', title: 'Forest (dark)' },
          { value: 'aqua', title: 'Aqua (light)' },
          { value: 'lofi', title: 'Lofi (light)' },
          { value: 'pastel', title: 'Pastel (light)' },
          { value: 'fantasy', title: 'Fantasy (light)' },
          { value: 'wireframe', title: 'Wireframe (light)' },
          { value: 'black', title: 'Black (dark)' },
          { value: 'luxury', title: 'Luxury (dark)' },
          { value: 'dracula', title: 'Dracula (dark)' },
          { value: 'cmyk', title: 'CMYK (light)' },
          { value: 'autumn', title: 'Autumn (light)' },
          { value: 'business', title: 'Business (dark)' },
          { value: 'acid', title: 'Acid (light)' },
          { value: 'lemonade', title: 'Lemonade (light)' },
          { value: 'night', title: 'Night (dark)' },
          { value: 'coffee', title: 'Coffee (dark)' },
          { value: 'winter', title: 'Winter (light)' },
          { value: 'dim', title: 'Dim (dark)' },
          { value: 'nord', title: 'Nord (light)' },
          { value: 'sunset', title: 'Sunset (dark)' },
        ],
        dynamicTitle: true,
      },
    },
  },
};

export default preview;
