import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/products': { target: 'http://localhost:3000', changeOrigin: true },
      '/members':  { target: 'http://localhost:3000', changeOrigin: true },
      '/carts':    { target: 'http://localhost:3000', changeOrigin: true },
      '/admin':    { target: 'http://localhost:3000', changeOrigin: true },
      '/img_pd':   { target: 'http://localhost:3000', changeOrigin: true },
      '/img_mem':  { target: 'http://localhost:3000', changeOrigin: true },
    }
  }
})
