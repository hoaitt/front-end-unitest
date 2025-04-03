import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom', // Giúp mô phỏng window
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@models': path.resolve(__dirname, 'src/models'),
      '@services': path.resolve(__dirname, 'src/services'),
    },
  },
});
