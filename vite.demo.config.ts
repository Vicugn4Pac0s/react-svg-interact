import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  root: 'demo',
  plugins: [react()],
  server: { fs: { allow: ['.'] } },
  build: {
    outDir: '../dist-demo',
    emptyOutDir: true,
  },
});
