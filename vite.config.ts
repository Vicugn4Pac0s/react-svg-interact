import { defineConfig } from 'vite'
export default defineConfig({
  esbuild: { jsx: 'automatic' },
  build: {
    lib: {
      entry: 'src/index.ts',
      formats: ['es'],
      fileName: 'react-svg-interact',
      cssFileName: 'style',
    },
    rollupOptions: {
      external: ['react', 'react/jsx-runtime', 'react/jsx-dev-runtime', 'zoomist'],
    },
  },
})
