import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // GitHub Pages serves project sites from /<repo>/; other hosts keep the root path.
  base: process.env.VITE_BASE || '/',
  server: { host: true, port: 3000 },
  preview: { host: true, port: 3000 },
});
