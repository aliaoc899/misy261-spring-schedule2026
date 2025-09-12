import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // Allow overriding the base path for GitHub Pages builds
  // When deploying to https://<user>.github.io/<repo>/, set BASE_PATH to '/<repo>/'
  // Locally and for custom domains, this safely defaults to '/'
  base: process.env.BASE_PATH || '/',
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/setupTests.js']
  }
})
