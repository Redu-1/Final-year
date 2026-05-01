import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: '0.0.0.0',    // Allow network access
    port: 5174,          // Different port for admin
    open: true,
    proxy: {
      '/api': {
        target: 'http://192.168.137.27:5001',  // Same backend
        changeOrigin: true,
        secure: false
      }
    }
  }
})