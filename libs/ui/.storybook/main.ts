import type { StorybookConfig } from '@storybook/angular';
import type { Configuration } from 'webpack';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.ts'],
  addons: ['@storybook/addon-essentials'],
  framework: {
    name: '@storybook/angular',
    options: {},
  },
  webpackFinal: async (config: Configuration) => {
    // Add PostCSS loader for CSS files to support Tailwind v4
    config.module?.rules?.push({
      test: /\.css$/,
      use: [
        'style-loader',
        'css-loader',
        {
          loader: 'postcss-loader',
          options: {
            postcssOptions: {
              plugins: [
                '@tailwindcss/postcss',
              ],
            },
          },
        },
      ],
      // Only apply to .storybook directory to not interfere with Angular's CSS handling
      include: /\.storybook/,
    });

    return config;
  },
};

export default config;
