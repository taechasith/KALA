import { useState, useCallback, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { DOCUMENTS, AGENCIES } from "../data/manifest"

const TEAL   = "#4F8993"
const SIGNAL = "#F4B51F"
const REC    = "#FF1E1E"

// ── File reading helpers ──────────────────────────────────────────────────────
function readFileAsText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = e => resolve(e.target.result)
    reader.onerror = reject
    reader.readAsText(file)
  })
}

function readFileAsBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = e => {
      const parts = e.target.result.split(",")
      const mediaType = parts[0].replace("data:","").replace(";base64","")
      resolve({ base64: parts[1], mediaType })
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

function extractVideoFrames(file, numFrames = 3) {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video")
    const url = URL.createObjectURL(file)
    video.src = url
    video.muted = true
    video.crossOrigin = "anonymous"
    video.preload = "metadata"

    video.addEventListener("error", () => { URL.revokeObjectURL(url); reject(new Error("Video load failed")) })
    video.addEventListener("loadedmetadata", () => {
      const dur = video.duration
      const W = Math.min(video.videoWidth || 640, 640)
      const H = Math.min(video.videoHeight || 360, 360)
      const times = dur <= 0
        ? [0]
        : Array.from({ length: numFrames }, (_, i) => dur * (0.1 + (i / numFrames) * 0.75))

      const frames = []

      function captureAt(idx) {
        if (idx >= times.length) {
          URL.revokeObjectURL(url)
          resolve({
            frames,
            duration: dur,
            resolution: `${video.videoWidth}×${video.videoHeight}`,
            mediaType: "image/jpeg",
          })
          return
        }
        video.currentTime = times[idx]
        video.addEventListener("seeked", function onSeeked() {
          video.removeEventListener("seeked", onSeeked)
          const canvas = document.createElement("canvas")
          canvas.width = W; canvas.height = H
          const ctx = canvas.getContext("2d")
          ctx.drawImage(video, 0, 0, W, H)
          frames.push(canvas.toDataURL("image/jpeg", 0.75).split(",")[1])
          captureAt(idx + 1)
        })
      }
      captureAt(0)
    })
  })
}

function getFileType(file) {
  const name = file.name.toLowerCase()
  if (/\.(png|jpg|jpeg|gif|webp|bmp)$/.test(name)) return "image"
  if (/\.(mp4|mov|avi|mkv|webm|m4v)$/.test(name)) return "video"
  if (/\.(txt|md)$/.test(name)) return "text"
  return "pdf"
}

// ── Result display ────────────────────────────────────────────────────────────
function AnalysisResult({ result, doc }) {
  const a = result.analysis
  if (!a) return <p className="font-mono text-xs" style={{ color: REC }}>Parse error: {result.error}</p>

  const sigColors = { CRITICAL: REC, HIGH:"#f97316", MEDIUM: SIGNAL, LOW:"#7fb89e" }
  const sigColor = sigColors[a.significance] || TEAL

  return (
    <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} className="space-y-3">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[0.5rem] tracking-widest mb-0.5" style={{ color: "rgba(79,137,147,0.6)" }}>KALA AI ANALYSIS</p>
          <p className="font-mono text-xs font-bold" style={{ color: "#E9F3F1" }}>{doc?.title || "Document"}</p>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <span className="classified-stamp text-[0.45rem]" style={{ color: sigColor, borderColor: sigColor+"60" }}>
            {a.significance || "—"} SIGNIFICANCE
          </span>
          <span className="font-mono text-[0.45rem]" style={{ color:"rgba(79,137,147,0.5)" }}>
            confidence: {((a.confidence_score || 0) * 100).toFixed(0)}%
          </span>
        </div>
      </div>

      {/* Summary */}
      {a.summary && (
        <div className="rounded-lg p-3" style={{ background:"rgba(24,51,59,0.3)", border:"1px solid rgba(79,137,147,0.12)" }}>
          <p className="font-mono text-[0.55rem] tracking-widest mb-1.5" style={{ color:"rgba(79,137,147,0.6)" }}>EXECUTIVE SUMMARY</p>
          <p className="font-mono text-xs leading-relaxed" style={{ color:"#E9F3F1" }}>{a.summary}</p>
        </div>
      )}

      {/* Visual description for images/video */}
      {a.visual_description && (
        <div className="rounded-lg p-3" style={{ background:"rgba(244,181,31,0.06)", border:"1px solid rgba(244,181,31,0.2)" }}>
          <p className="font-mono text-[0.55rem] tracking-widest mb-1.5" style={{ color: SIGNAL }}>VISUAL ANALYSIS</p>
          <p className="font-mono text-xs leading-relaxed" style={{ color:"#E9F3F1" }}>{a.visual_description}</p>
        </div>
      )}

      {/* Key fields */}
      <div className="grid grid-cols-2 gap-2">
        {[
          { k:"ERA",        v: a.classification_era },
          { k:"DOC TYPE",   v: a.document_type },
          { k:"REDACTION",  v: a.redaction_level },
          { k:"SIG REASON", v: a.significance_reason },
        ].filter(x => x.v).map(({ k, v }) => (
          <div key={k} className="rounded-lg p-2" style={{ background:"rgba(24,51,59,0.3)", border:"1px solid rgba(79,137,147,0.1)" }}>
            <p className="font-mono text-[0.45rem] tracking-widest mb-0.5" style={{ color:"rgba(79,137,147,0.45)" }}>{k}</p>
            <p className="font-mono text-[0.6rem] leading-snug" style={{ color:"#E9F3F1" }}>{v}</p>
          </div>
        ))}
      </div>

      {/* Entities */}
      {a.key_entities && (
        <div className="rounded-lg p-3 space-y-2" style={{ background:"rgba(24,51,59,0.3)", border:"1px solid rgba(79,137,147,0.1)" }}>
          <p className="font-mono text-[0.55rem] tracking-widest" style={{ color:"rgba(79,137,147,0.6)" }}>KEY ENTITIES</p>
          {Object.entries(a.key_entities).filter(([,v]) => v?.length).map(([k, vals]) => (
            <div key={k}>
              <p className="font-mono text-[0.45rem] uppercase tracking-widest mb-1" style={{ color:"rgba(79,137,147,0.4)" }}>{k}</p>
              <div className="flex flex-wrap gap-1">
                {(Array.isArray(vals) ? vals : [vals]).slice(0,8).map((v, i) => (
                  <span key={i} className="font-mono text-[0.55rem] px-1.5 py-0.5 rounded" style={{ background:"rgba(79,137,147,0.1)", color: TEAL }}>{v}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Incident details */}
      {a.incident_details && (
        <div className="rounded-lg p-3 space-y-2" style={{ background:"rgba(24,51,59,0.3)", border:"1px solid rgba(79,137,147,0.1)" }}>
          <p className="font-mono text-[0.55rem] tracking-widest" style={{ color:"rgba(79,137,147,0.6)" }}>INCIDENT DETAILS</p>
          {Object.entries(a.incident_details).filter(([,v]) => v && v !== "Pending document decode").map(([k,v]) => (
            <div key={k}>
              <p className="font-mono text-[0.45rem] uppercase tracking-widest mb-0.5" style={{ color:"rgba(79,137,147,0.4)" }}>{k.replace(/_/g," ")}</p>
              <p className="font-mono text-[0.6rem] leading-relaxed" style={{ color:"#E9F3F1" }}>{v}</p>
            </div>
          ))}
        </div>
      )}

      {/* Related topics */}
      {a.related_topics?.length > 0 && (
        <div>
          <p className="font-mono text-[0.5rem] tracking-widest mb-1.5" style={{ color:"rgba(79,137,147,0.45)" }}>RELATED TOPICS</p>
          <div className="flex flex-wrap gap-1.5">
            {a.related_topics.map((t, i) => (
              <span key={i} className="px-2 py-0.5 rounded-full font-mono text-[0.55rem]" style={{ border:"1px solid rgba(79,137,147,0.25)", color: TEAL }}>{t}</span>
            ))}
          </div>
        </div>
      )}

      {a.raw && (
        <div className="rounded-lg p-3" style={{ background:"rgba(24,51,59,0.3)", border:"1px solid rgba(79,137,147,0.1)" }}>
          <p className="font-mono text-[0.55rem] tracking-widest mb-1.5" style={{ color:"rgba(79,137,147,0.6)" }}>RAW ANALYSIS</p>
          <p className="font-mono text-xs leading-relaxed whitespace-pre-wrap" style={{ color:"#E9F3F1" }}>{a.raw}</p>
        </div>
      )}
    </motion.div>
  )
}

// ── File preview ──────────────────────────────────────────────────────────────
function FilePreview({ file, fileType, framePreview }) {
  const objUrl = useRef(null)
  const [imgSrc, setImgSrc] = useState(null)

  useEffect(() => {
    if (fileType === "image" && file) {
      const url = URL.createObjectURL(file)
      objUrl.current = url
      setImgSrc(url)
      return () => URL.revokeObjectURL(url)
    }
    if (fileType === "video" && framePreview) {
      setImgSrc("data:image/jpeg;base64," + framePreview)
    }
  }, [file, fileType, framePreview])

  if (!imgSrc) return null

  return (
    <div className="relative mt-2 rounded-lg overflow-hidden" style={{ border:"1px solid rgba(79,137,147,0.2)" }}>
      <img src={imgSrc} alt="preview" className="w-full max-h-32 object-contain" style={{ background:"#061116" }} />
      {fileType === "video" && (
        <div className="absolute top-2 left-2 flex items-center gap-1.5">
          <div className="rec-dot" />
          <span className="font-mono text-[0.5rem]" style={{ color: REC }}>VIDEO FRAME</span>
        </div>
      )}
      <div className="absolute top-2 right-2 font-mono text-[0.45rem] px-1.5 py-0.5 rounded" style={{ background:"rgba(6,17,22,0.85)", color: TEAL }}>
        PREVIEW
      </div>
    </div>
  )
}

// ── File type badge ───────────────────────────────────────────────────────────
const TYPE_ICONS = { image:"🖼", video:"🎬", text:"📄", pdf:"📋" }
const TYPE_LABELS = { image:"IMAGE", video:"VIDEO", text:"TEXT", pdf:"PDF" }
const TYPE_COLORS = { image: TEAL, video: REC, text:"#7fb89e", pdf:"rgba(79,137,147,0.7)" }

// ── Main component ────────────────────────────────────────────────────────────
export default function AIDecoder() {
  const [file, setFile]               = useState(null)
  const [fileType, setFileType]       = useState(null)
  const [framePreview, setFramePreview] = useState(null)
  const [selectedDoc, setSelectedDoc] = useState(null)
  const [loading, setLoading]         = useState(false)
  const [loadingMsg, setLoadingMsg]   = useState("")
  const [result, setResult]           = useState(null)
  const [error, setError]             = useState(null)
  const [question, setQuestion]       = useState("")
  const [metaResult, setMetaResult]   = useState(null)
  const [metaLoading, setMetaLoading] = useState(false)
  const [docSearch, setDocSearch]     = useState("")
  const dropRef = useRef()

  useEffect(() => {
    const saved = sessionStorage.getItem("kala-decode-doc")
    if (saved) { setSelectedDoc(JSON.parse(saved)); sessionStorage.removeItem("kala-decode-doc") }
  }, [])

  const handleFile = async (f) => {
    if (!f) return
    setFile(f)
    setFramePreview(null)
    const type = getFileType(f)
    setFileType(type)
    if (type === "video") {
      try {
        const { frames } = await extractVideoFrames(f, 1)
        setFramePreview(frames[0])
      } catch { /* silent */ }
    }
  }

  const onDrop = useCallback((e) => {
    e.preventDefault()
    const f = e.dataTransfer.files[0]
    if (f) handleFile(f)
  }, [])

  const analyzeFile = async () => {
    setLoading(true); setResult(null); setError(null)
    try {
      let payload = {
        filename: file?.name || selectedDoc?.filename,
        docId: selectedDoc?.id,
      }

      if (file) {
        const type = fileType || getFileType(file)

        if (type === "text") {
          payload.content = await readFileAsText(file)
          payload.fileType = "text"

        } else if (type === "image") {
          setLoadingMsg("Reading image...")
          const { base64, mediaType } = await readFileAsBase64(file)
          payload.imageData = { base64, mediaType }
          payload.fileType = "image"
          payload.content = "[IMAGE_VISION]"

        } else if (type === "video") {
          setLoadingMsg("Extracting video frames...")
          const videoData = await extractVideoFrames(file, 3)
          payload.imageData = { ...videoData, isVideo: true }
          payload.fileType = "video"
          payload.content = "[VIDEO_VISION]"

        } else {
          // PDF — send as base64 text
          setLoadingMsg("Reading PDF...")
          const buf = await file.arrayBuffer()
          const bytes = new Uint8Array(buf)
          let binary = ""
          bytes.forEach(b => binary += String.fromCharCode(b))
          payload.content = `[BASE64_PDF]:${btoa(binary).substring(0, 50000)}`
          payload.fileType = "pdf"
        }
      } else if (selectedDoc) {
        payload.docMeta = selectedDoc
        payload.fileType = "metadata"
      }

      setLoadingMsg("Analyzing with Claude AI...")
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "API error")
      setResult(data)
    } catch (err) {
      setError(err.message)
    }
    setLoading(false)
    setLoadingMsg("")
  }

  const analyzeMetadata = async () => {
    setMetaLoading(true); setMetaResult(null)
    try {
      const res = await fetch("/api/meta-analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: question || undefined }),
      })
      const data = await res.json()
      setMetaResult(data.response)
    } catch (err) {
      setMetaResult("Error: " + err.message)
    }
    setMetaLoading(false)
  }

  const filteredDocs = DOCUMENTS.filter(d =>
    !docSearch || d.title.toLowerCase().includes(docSearch.toLowerCase()) ||
    d.id.toLowerCase().includes(docSearch.toLowerCase())
  ).slice(0, 12)

  const canAnalyze = !loading && (file || selectedDoc)

  return (
    <section id="decoder" className="min-h-screen py-16 px-4 snap-section" style={{ background:"#061116" }}>
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} className="mb-8 text-center">
          <p className="font-mono text-[0.6rem] tracking-[0.3em] mb-2" style={{ color:"rgba(79,137,147,0.7)" }}>CLAUDE AI — DOCUMENT INTELLIGENCE</p>
          <h2 className="font-poster text-5xl md:text-6xl tracking-wide" style={{ color:"#E9F3F1" }}>AI Decoder</h2>
          <p className="font-mono text-xs mt-2 max-w-md mx-auto" style={{ color:"rgba(79,137,147,0.5)" }}>
            PDF · TXT · Images · Video — Claude decodes, sees, and analyzes
          </p>
          <div className="w-16 h-px mx-auto mt-4" style={{ background: SIGNAL+"60" }} />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Left: Input */}
          <div className="space-y-4">
            {/* Drop zone */}
            <div
              ref={dropRef}
              onDrop={onDrop}
              onDragOver={e => e.preventDefault()}
              className="rounded-2xl p-6 border-2 border-dashed text-center transition-all"
              style={{ background:"rgba(24,51,59,0.15)", borderColor:"rgba(79,137,147,0.2)" }}
            >
              <div className="text-3xl mb-3 opacity-40">
                {file ? TYPE_ICONS[fileType] || "📄" : "⌬"}
              </div>
              {file ? (
                <div>
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <span className="classified-stamp text-[0.45rem]" style={{ color: TYPE_COLORS[fileType], borderColor: TYPE_COLORS[fileType]+"50", padding:"1px 6px" }}>
                      {TYPE_LABELS[fileType]}
                    </span>
                    <p className="font-mono text-xs font-bold" style={{ color:"#E9F3F1" }}>{file.name}</p>
                  </div>
                  <p className="font-mono text-[0.55rem]" style={{ color:"rgba(79,137,147,0.5)" }}>{(file.size/1024).toFixed(0)} KB</p>
                  <FilePreview file={file} fileType={fileType} framePreview={framePreview} />
                </div>
              ) : (
                <>
                  <p className="font-mono text-xs mb-3" style={{ color:"rgba(79,137,147,0.5)" }}>
                    Drop file here or browse
                  </p>
                  <div className="flex flex-wrap justify-center gap-1.5 mb-3">
                    {["PDF","TXT","PNG","JPG","MP4","MOV"].map(ext => (
                      <span key={ext} className="font-mono text-[0.45rem] px-1.5 py-0.5 rounded" style={{ background:"rgba(79,137,147,0.08)", color:"rgba(79,137,147,0.6)", border:"1px solid rgba(79,137,147,0.15)" }}>{ext}</span>
                    ))}
                  </div>
                </>
              )}
              <label className="cursor-pointer inline-block mt-2">
                <span className="px-4 py-2 rounded-lg font-mono text-xs transition-all" style={{ border:"1px solid rgba(244,181,31,0.4)", color: SIGNAL }}>
                  {file ? "CHANGE FILE" : "CHOOSE FILE"}
                </span>
                <input
                  type="file"
                  accept=".pdf,.txt,.md,.png,.jpg,.jpeg,.gif,.webp,.mp4,.mov,.avi,.webm"
                  className="hidden"
                  onChange={e => handleFile(e.target.files[0])}
                />
              </label>
            </div>

            {/* Select from vault */}
            <div className="rounded-xl p-4" style={{ background:"rgba(24,51,59,0.2)", border:"1px solid rgba(79,137,147,0.1)" }}>
              <p className="font-mono text-[0.55rem] tracking-widest mb-2" style={{ color:"rgba(79,137,147,0.5)" }}>OR SELECT FROM VAULT</p>
              <input
                type="text"
                placeholder="Search documents..."
                value={docSearch}
                onChange={e => setDocSearch(e.target.value)}
                className="w-full bg-transparent font-mono text-xs pb-1.5 mb-3 focus:outline-none border-b"
                style={{ color:"#E9F3F1", borderColor:"rgba(79,137,147,0.2)", caretColor: SIGNAL }}
              />
              <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                {filteredDocs.map(doc => (
                  <button
                    key={doc.id}
                    onClick={() => { setSelectedDoc(doc); setFile(null); setFileType("metadata") }}
                    className="w-full text-left px-2 py-1.5 rounded-lg font-mono text-[0.6rem] transition-all"
                    style={
                      selectedDoc?.id === doc.id
                        ? { background:"rgba(244,181,31,0.1)", color: SIGNAL, border:"1px solid rgba(244,181,31,0.3)" }
                        : { color:"rgba(79,137,147,0.5)", border:"1px solid transparent" }
                    }
                  >
                    <span className="mr-2" style={{ color:"rgba(79,137,147,0.35)" }}>{doc.id}</span>
                    {doc.title.substring(0,45)}{doc.title.length > 45 ? "…" : ""}
                  </button>
                ))}
              </div>
            </div>

            {/* Selected doc info */}
            {selectedDoc && !file && (
              <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} className="rounded-xl p-3" style={{ border:`1px solid ${AGENCIES[selectedDoc.agency]?.color || TEAL}30` }}>
                <p className="font-mono text-[0.5rem] tracking-widest mb-0.5" style={{ color: AGENCIES[selectedDoc.agency]?.color }}>
                  SELECTED: {selectedDoc.id}
                </p>
                <p className="font-mono text-xs font-bold" style={{ color:"#E9F3F1" }}>{selectedDoc.title}</p>
                <p className="font-mono text-[0.5rem] mt-1" style={{ color:"rgba(79,137,147,0.4)" }}>
                  Upload file for full decode · metadata assessment only
                </p>
              </motion.div>
            )}

            {/* Analyze button */}
            <button
              onClick={analyzeFile}
              disabled={!canAnalyze}
              className="w-full py-3 rounded-xl font-mono text-sm font-bold tracking-widest transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              style={{
                background: canAnalyze ? SIGNAL : "transparent",
                color: canAnalyze ? "#061116" : TEAL,
                border: canAnalyze ? "none" : `1px solid ${TEAL}40`,
                boxShadow: canAnalyze ? `0 0 24px ${SIGNAL}30` : "none",
              }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <motion.span animate={{ rotate:360 }} transition={{ repeat:Infinity, duration:1, ease:"linear" }}>⟳</motion.span>
                  {loadingMsg || "ANALYZING..."}
                </span>
              ) : "DECODE →"}
            </button>

            {error && (
              <div className="rounded-xl p-3" style={{ background:"rgba(255,30,30,0.06)", border:"1px solid rgba(255,30,30,0.3)" }}>
                <p className="font-mono text-xs" style={{ color: REC }}>⚠ {error}</p>
                <p className="font-mono text-[0.5rem] mt-1" style={{ color:"rgba(79,137,147,0.4)" }}>
                  Ensure ANTHROPIC_API_KEY is set and server is running on port 3001
                </p>
              </div>
            )}
          </div>

          {/* Right: Results */}
          <div>
            <AnimatePresence mode="wait">
              {result ? (
                <div className="rounded-2xl p-4 max-h-[70vh] overflow-y-auto" style={{ background:"rgba(24,51,59,0.2)", border:"1px solid rgba(79,137,147,0.15)" }}>
                  <AnalysisResult result={result} doc={selectedDoc || (file ? { title: file.name } : null)} />
                </div>
              ) : (
                <motion.div
                  key="empty"
                  className="rounded-2xl p-8 flex flex-col items-center justify-center text-center min-h-[300px]"
                  style={{ background:"rgba(24,51,59,0.15)", border:"1px solid rgba(79,137,147,0.1)" }}
                >
                  <div className="text-5xl mb-4 opacity-15">⌬</div>
                  <p className="font-mono text-xs mb-2" style={{ color:"rgba(79,137,147,0.5)" }}>Awaiting input</p>
                  <p className="font-mono text-[0.6rem] leading-relaxed max-w-xs" style={{ color:"rgba(79,137,147,0.3)" }}>
                    PDF, text, images, and video frames all decoded with Claude vision AI
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Meta-analysis */}
        <motion.div
          initial={{ opacity:0, y:20 }}
          whileInView={{ opacity:1, y:0 }}
          viewport={{ once:true }}
          className="mt-6 rounded-2xl p-5"
          style={{ background:"rgba(24,51,59,0.2)", border:"1px solid rgba(79,137,147,0.12)" }}
        >
          <p className="font-mono text-[0.6rem] tracking-[0.3em] mb-3" style={{ color:"rgba(79,137,147,0.6)" }}>COLLECTION INTELLIGENCE — ASK ANYTHING</p>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder='e.g. "Which documents mention Arabian Gulf 2020?" or "What patterns emerge?"'
              value={question}
              onChange={e => setQuestion(e.target.value)}
              onKeyDown={e => e.key === "Enter" && analyzeMetadata()}
              className="flex-1 bg-transparent font-mono text-xs pb-1 focus:outline-none border-b"
              style={{ color:"#E9F3F1", borderColor:"rgba(79,137,147,0.2)", caretColor: SIGNAL }}
            />
            <button
              onClick={analyzeMetadata}
              disabled={metaLoading}
              className="px-4 py-1 rounded-lg font-mono text-xs transition-all disabled:opacity-30"
              style={{ border:`1px solid ${SIGNAL}40`, color: SIGNAL }}
            >
              {metaLoading ? "⟳" : "ASK →"}
            </button>
          </div>
          <AnimatePresence>
            {metaResult && (
              <motion.div
                initial={{ opacity:0, height:0 }}
                animate={{ opacity:1, height:"auto" }}
                exit={{ opacity:0, height:0 }}
                className="mt-4 rounded-xl p-3"
                style={{ background:"rgba(24,51,59,0.3)" }}
              >
                <p className="font-mono text-xs leading-relaxed whitespace-pre-wrap" style={{ color:"#E9F3F1" }}>{metaResult}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}
