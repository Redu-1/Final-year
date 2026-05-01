import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: '0.0.0.0',    // Allow network access
    port: 5173,          // Fixed port for client
    open: true,
    proxy: {
      '/api': {
        target: 'http://192.168.137.27:5001',  // Backend API
        changeOrigin: true,
        secure: false
      }
    }
  }
})