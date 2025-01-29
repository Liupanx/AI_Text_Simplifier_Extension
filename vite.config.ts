import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path'; // Import Node.js path module

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        popup: path.resolve(__dirname, './index.html'), // Use an absolute path
        content: path.resolve(__dirname, './src/content/content.ts'), // Content script
      },
      output: {
        entryFileNames: '[name].js',
      },
    },
  },
});
