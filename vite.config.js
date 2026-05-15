import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { createReadStream, existsSync, statSync } from 'fs'
import { join, extname, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DATA_DIR = join(__dirname, 'data', 'Release_1', 'Release_1')
const MIME_MAP = {
  '.pdf':  'application/pdf',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
}

function serveDataPlugin() {
  return {
    name: 'serve-data-files',
    configureServer(server) {
      server.middlewares.use('/data', (req, res, next) => {
        try {
          const filename = decodeURIComponent(req.url.replace(/^\//, ''))
          if (!filename) return next()
          const filepath = join(DATA_DIR, filename)
          if (!existsSync(filepath)) return next()
          const stat = statSync(filepath)
          if (!stat.isFile()) return next()
          const mime = MIME_MAP[extname(filepath).toLowerCase()] || 'application/octet-stream'
          res.setHeader('Content-Type', mime)
          res.setHeader('Content-Length', stat.size)
          res.setHeader('Content-Disposition', 'inline')
          res.setHeader('Cache-Control', 'public, max-age=3600')
          createReadStream(filepath).pipe(res)
        } catch { next() }
      })
    }
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), serveDataPlugin()],
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
