/**
 * Upload KALA data files to Cloudflare R2
 *
 * Setup:
 * 1. Create R2 bucket at dash.cloudflare.com → R2 → Create bucket (name: "kala-data")
 * 2. Enable "Public R2.dev URL" on the bucket (Settings → Public Access)
 * 3. Create R2 API token: dash.cloudflare.com → R2 → Manage R2 API Tokens
 *    Permissions: Object Read & Write
 * 4. Create .env file with values below (or set env vars)
 * 5. npm install @aws-sdk/client-s3 dotenv
 * 6. node upload-r2.mjs
 */

import { S3Client, PutObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3"
import { createReadStream, readdirSync, statSync } from "fs"
import { join, extname, dirname } from "path"
import { fileURLToPath } from "url"

// Load .env if present
try { (await import("dotenv")).config() } catch {}

const ACCOUNT_ID  = process.env.CF_ACCOUNT_ID        // from Cloudflare dashboard
const ACCESS_KEY  = process.env.CF_R2_ACCESS_KEY_ID   // R2 API token ID
const SECRET_KEY  = process.env.CF_R2_SECRET_KEY      // R2 API token secret
const BUCKET      = process.env.CF_R2_BUCKET || "kala-data"

if (!ACCOUNT_ID || !ACCESS_KEY || !SECRET_KEY) {
  console.error(`
Missing env vars. Create a .env file:
  CF_ACCOUNT_ID=your_account_id
  CF_R2_ACCESS_KEY_ID=your_access_key_id
  CF_R2_SECRET_KEY=your_secret_key
  CF_R2_BUCKET=kala-data
`)
  process.exit(1)
}

const __dirname = dirname(fileURLToPath(import.meta.url))
const DATA_DIR = join(__dirname, "data", "Release_1", "Release_1")

const MIME = {
  ".pdf":  "application/pdf",
  ".png":  "image/png",
  ".jpg":  "image/jpeg",
  ".jpeg": "image/jpeg",
}

const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId: ACCESS_KEY, secretAccessKey: SECRET_KEY },
})

async function fileExists(key) {
  try {
    await s3.send(new HeadObjectCommand({ Bucket: BUCKET, Key: key }))
    return true
  } catch { return false }
}

async function upload() {
  const files = readdirSync(DATA_DIR)
  console.log(`Found ${files.length} files in ${DATA_DIR}\n`)

  let uploaded = 0, skipped = 0, failed = 0

  for (const filename of files) {
    const filepath = join(DATA_DIR, filename)
    if (!statSync(filepath).isFile()) continue

    const exists = await fileExists(filename)
    if (exists) {
      console.log(`  SKIP (exists): ${filename}`)
      skipped++
      continue
    }

    const mime = MIME[extname(filename).toLowerCase()] || "application/octet-stream"
    try {
      await s3.send(new PutObjectCommand({
        Bucket: BUCKET,
        Key: filename,
        Body: createReadStream(filepath),
        ContentType: mime,
        ContentDisposition: "inline",
        CacheControl: "public, max-age=86400",
      }))
      console.log(`  OK: ${filename}`)
      uploaded++
    } catch (e) {
      console.error(`  FAIL: ${filename} — ${e.message}`)
      failed++
    }
  }

  console.log(`\nDone: ${uploaded} uploaded, ${skipped} skipped, ${failed} failed`)
  console.log(`\nSet in Vercel env vars:`)
  console.log(`  VITE_DATA_ROOT=https://pub-XXXX.r2.dev/`)
  console.log(`(Replace pub-XXXX with your R2 public bucket URL from Cloudflare dashboard)`)
}

upload()
