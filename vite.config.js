import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  optimizeDeps: {
    include: ['leaflet'],
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      }
    }
  },
  build: {
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks: {
          'three':    ['three', '@react-three/fiber', '@react-three/drei'],
          'd3':       ['d3'],
          'framer':   ['framer-motion'],
          'react':    ['react', 'react-dom'],
          'leaflet':  ['leaflet', 'react-leaflet'],
        }
      }
    }
  }
})
