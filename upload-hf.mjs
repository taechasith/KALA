import { uploadFiles, fileExists } from "@huggingface/hub"
import { readFileSync, readdirSync, statSync } from "fs"
import { join, dirname, extname } from "path"
import { fileURLToPath } from "url"

try { (await import("dotenv")).config() } catch {}

const HF_TOKEN = process.env.HF_TOKEN
const HF_REPO  = process.env.HF_REPO

if (!HF_TOKEN || !HF_REPO) {
  console.error("Missing HF_TOKEN or HF_REPO in .env"); process.exit(1)
}

const __dirname = dirname(fileURLToPath(import.meta.url))

const DATA_DIRS = [
  join(__dirname, "data", "Release_1", "Release_1"),
  join(__dirname, "data", "khaokala movie"),
]

const repo = { type: "dataset", name: HF_REPO }
const credentials = { accessToken: HF_TOKEN }

const MIME = {
  ".pdf": "application/pdf", ".png": "image/png",
  ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
}

const BATCH_SIZE = 10  // files per commit — keeps under rate limit

async function main() {
  const allFiles = []
  for (const dir of DATA_DIRS) {
    const files = readdirSync(dir)
      .filter(f => statSync(join(dir, f)).isFile())
      .map(f => ({ filename: f, dir }))
    allFiles.push(...files)
  }
  console.log(`Found ${allFiles.length} files → ${HF_REPO}\n`)

  // Filter out already-uploaded files
  console.log("Checking which files already exist on HF...")
  const toUpload = []
  for (const { filename, dir } of allFiles) {
    try {
      const exists = await fileExists({ repo, credentials, path: filename })
      if (exists) { console.log(`  SKIP: ${filename}`); continue }
    } catch { /* treat as not exists */ }
    toUpload.push({ filename, dir })
  }

  console.log(`\n${toUpload.length} files to upload in batches of ${BATCH_SIZE}\n`)

  let uploaded = 0, failed = 0

  for (let i = 0; i < toUpload.length; i += BATCH_SIZE) {
    const batch = toUpload.slice(i, i + BATCH_SIZE)
    const batchNum = Math.floor(i / BATCH_SIZE) + 1
    const totalBatches = Math.ceil(toUpload.length / BATCH_SIZE)

    console.log(`Batch ${batchNum}/${totalBatches}: ${batch.map(b=>b.filename).join(", ")}`)

    try {
      const files = batch.map(({ filename, dir }) => {
        const filepath = join(dir, filename)
        const bytes = readFileSync(filepath)
        const mime = MIME[extname(filename).toLowerCase()] || "application/octet-stream"
        return { path: filename, content: new Blob([bytes], { type: mime }) }
      })

      await uploadFiles({
        repo,
        credentials,
        files,
        commitMessage: `batch ${batchNum}: upload ${batch.length} files`,
      })

      console.log(`  ✓ batch ${batchNum} done (${batch.length} files)`)
      uploaded += batch.length
    } catch (e) {
      console.error(`  ✗ batch ${batchNum} failed — ${e.message}`)
      failed += batch.length
    }
  }

  console.log(`\nDone: ${uploaded} uploaded · ${failed} failed`)
  console.log(`\nVercel env var:`)
  console.log(`VITE_DATA_ROOT=https://huggingface.co/datasets/${HF_REPO}/resolve/main/`)
}

main()
