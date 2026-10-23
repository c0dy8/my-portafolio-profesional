import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  // GitHub Pages serves the site under /<repo>/: the deploy workflow sets BASE_PATH, local builds keep '/'
  base: process.env.BASE_PATH ?? '/',
  plugins: [react(), tailwindcss()],
  publicDir: 'assets',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/tests/setup.ts',
    css: false,
  },
})
