import { defineConfig, presetUno, presetIcons } from 'unocss';
import presetWebFonts from '@unocss/preset-web-fonts';
import transformerDirectives from '@unocss/transformer-directives';

export default defineConfig({
  presets: [
    presetUno(),
    presetIcons({
      scale: 1.2,
      cdn: 'https://esm.sh/',
    }),
    presetWebFonts({
      provider: 'google',
      fonts: {
        sans: 'Inter:400,500,600,700',
        mono: 'Roboto Mono:400,500',
      },
    }),
  ],
  transformers: [transformerDirectives()],
  theme: {
    colors: {
      primary: '#4F46E5',
      secondary: '#6366F1',
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
    },
  },
});
