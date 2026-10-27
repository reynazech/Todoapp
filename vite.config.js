import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  // Relative paths, so the built site works at a domain root (example.com)
  // or in any subfolder (example.com/reyna) on regular web hosting.
  base: './',
  plugins: [react(), tailwindcss()],
  test: {
    environment: 'node',
  },
});
