import { createServer } from "http"
import { createReadStream, existsSync, statSync } from "fs"
import { join, extname, dirname } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const DATA_DIR = join(__dirname, "data", "Release_1", "Release_1")
const PORT = process.env.DATA_PORT || 3002

const MIME = {
  ".pdf":  "application/pdf",
  ".png":  "image/png",
  ".jpg":  "image/jpeg",
  ".jpeg": "image/jpeg",
}

createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Methods", "GET")

  if (req.method !== "GET") {
    res.writeHead(405); res.end(); return
  }

  try {
    const filename = decodeURIComponent((req.url || "/").replace(/^\//, ""))
    if (!filename) { res.writeHead(400); res.end(); return }

    const filepath = join(DATA_DIR, filename)

    // prevent path traversal
    if (!filepath.startsWith(DATA_DIR)) {
      res.writeHead(403); res.end(); return
    }

    if (!existsSync(filepath)) {
      res.writeHead(404); res.end(`Not found: ${filename}`); return
    }

    const stat = statSync(filepath)
    if (!stat.isFile()) { res.writeHead(404); res.end(); return }

    const mime = MIME[extname(filepath).toLowerCase()] || "application/octet-stream"
    res.writeHead(200, {
      "Content-Type": mime,
      "Content-Length": stat.size,
      "Content-Disposition": "inline",
      "Cache-Control": "public, max-age=86400",
    })
    createReadStream(filepath).pipe(res)
  } catch (e) {
    res.writeHead(500); res.end(e.message)
  }
}).listen(PORT, () => {
  console.log(`Data server running on http://localhost:${PORT}`)
  console.log(`Files served from: ${DATA_DIR}`)
})
