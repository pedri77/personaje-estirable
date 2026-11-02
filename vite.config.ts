import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import {defineConfig} from 'vite';

export default defineConfig({
  // GitHub Pages serves a project site from /<repo>/; the deploy workflow sets BASE_PATH to that.
  base: process.env.BASE_PATH ?? '/',
  plugins: [react(), tailwindcss()],
  build: {
    // Expression cutouts live in public/faces and are served as-is.
    target: 'es2020',
  },
});
