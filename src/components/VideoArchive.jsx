import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { VIDEOS } from "../data/manifest"

// Real DVIDS IDs for known UAP press releases
// IDs from PURSUE Release 1 (war.gov/ufo)
const DVIDS_IDS = {
  "DOD-V01": 1006104, "DOD-V02": 1006105, "DOD-V03": 1006106,
  "DOD-V04": 1006107, "DOD-V05": 1006110, "DOD-V06": 1006111,
  "DOD-V07": 1006060, "DOD-V08": 973045,  "DOD-V09": 977839,
  "DOD-V10": 992262,  "DOD-V11": 989429,  "DOD-V12": 988676,
  "DOD-V13": 1006063, "DOD-V14": 1006079, "DOD-V15": 1006159,
  "DOD-V16": null, "DOD-V17": null, "DOD-V18": null,
  "DOD-V19": null, "DOD-V20": null, "DOD-V21": null,
  "DOD-V22": null, "DOD-V23": null, "DOD-V24": null,
}

function formatSize(bytes) {
  if (bytes > 1e9) return `${(bytes/1e9).toFixed(1)} GB`
  if (bytes > 1e6) return `${(bytes/1e6).toFixed(0)} MB`
  return `${(bytes/1024).toFixed(0)} KB`
}

function VideoModal({ video, onClose }) {
  const dvidsId = DVIDS_IDS[video.id]
  const embedUrl = dvidsId ? `https://www.dvidshub.net/video/embed/${dvidsId}` : null
  const pageUrl  = dvidsId ? `https://www.dvidshub.net/video/${dvidsId}` : "https://www.dvidshub.net/search?q=UAP+unidentified"
  const [embedFailed, setEmbedFailed] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[70] flex items-center justify-center p-4"
      style={{ background: "rgba(6,17,22,0.97)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.93, y: 10 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.93 }}
        className="w-full max-w-4xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-3 px-1">
          <div>
            <p className="font-mono text-[0.55rem] tracking-wider mb-0.5" style={{ color: "rgba(200,122,58,0.7)" }}>{video.id}</p>
            <p className="font-mono text-sm font-bold" style={{ color: "#E9F3F1" }}>{video.title}</p>
            <p className="font-mono text-[0.55rem] mt-0.5" style={{ color: "rgba(79,137,147,0.6)" }}>
              {video.location} · {video.year || "DATE UNK"} · {formatSize(video.size)}
            </p>
          </div>
          <div className="flex items-center gap-3 ml-4">
            <div className="rec-dot" />
            <span className="font-mono text-[0.6rem]" style={{ color: "#FF1E1E" }}>REC</span>
            <button onClick={onClose} className="transition-colors text-xl" style={{ color: "rgba(79,137,147,0.6)" }}
              onMouseEnter={e => e.target.style.color="#F4B51F"} onMouseLeave={e => e.target.style.color="rgba(79,137,147,0.6)"}>✕</button>
          </div>
        </div>

        {/* Video container */}
        <div
          className="relative rounded-xl overflow-hidden"
          style={{
            aspectRatio: "16/9",
            background: "#061116",
            border: "1px solid rgba(79,137,147,0.15)",
          }}
        >
          {/* Camera frame corners */}
          <div className="absolute top-3 left-3 w-6 h-6 pointer-events-none" style={{ zIndex:5, borderTop:"2px solid rgba(244,181,31,0.4)", borderLeft:"2px solid rgba(244,181,31,0.4)" }} />
          <div className="absolute top-3 right-3 w-6 h-6 pointer-events-none" style={{ zIndex:5, borderTop:"2px solid rgba(244,181,31,0.4)", borderRight:"2px solid rgba(244,181,31,0.4)" }} />
          <div className="absolute bottom-3 left-3 w-6 h-6 pointer-events-none" style={{ zIndex:5, borderBottom:"2px solid rgba(244,181,31,0.4)", borderLeft:"2px solid rgba(244,181,31,0.4)" }} />
          <div className="absolute bottom-3 right-3 w-6 h-6 pointer-events-none" style={{ zIndex:5, borderBottom:"2px solid rgba(244,181,31,0.4)", borderRight:"2px solid rgba(244,181,31,0.4)" }} />

          {embedUrl && !embedFailed ? (
            <iframe
              src={embedUrl}
              title={video.title}
              allowFullScreen
              allow="autoplay; fullscreen"
              className="absolute inset-0 w-full h-full"
              style={{ border: "none" }}
              onError={() => setEmbedFailed(true)}
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
              {/* Thumbnail attempt */}
              {dvidsId && (
                <img
                  src={`https://www.dvidshub.net/img/thumbnail/video/${dvidsId}.jpg`}
                  alt={video.title}
                  className="absolute inset-0 w-full h-full object-cover opacity-30"
                  onError={e => e.target.style.display = "none"}
                />
              )}
              <div className="relative z-10 text-center px-6">
                <div className="font-mono text-[0.6rem] mb-3" style={{ color: "rgba(244,181,31,0.6)" }}>
                  {dvidsId ? "STREAM ON DVIDSHUB.NET" : "ID PENDING DECLASSIFICATION"}
                </div>
                <a
                  href={pageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-6 py-2.5 rounded-full font-mono text-sm font-bold tracking-widest transition-all"
                  style={{ background: "#F4B51F", color: "#061116", boxShadow:"0 0 20px rgba(244,181,31,0.3)" }}
                >
                  {dvidsId ? `WATCH ON DVIDS →` : "SEARCH ON DVIDS →"}
                </a>
              </div>
            </div>
          )}
        </div>

        {dvidsId && (
          <div className="flex items-center justify-between mt-2 px-1">
            <a href={pageUrl} target="_blank" rel="noopener noreferrer"
              className="font-mono text-[0.55rem] transition-colors"
              style={{ color: "rgba(79,137,147,0.5)" }}
              onMouseEnter={e => e.target.style.color="#F4B51F"}
              onMouseLeave={e => e.target.style.color="rgba(79,137,147,0.5)"}
            >
              dvidshub.net/video/{dvidsId} ↗
            </a>
            <p className="font-mono text-[0.55rem]" style={{ color: "rgba(79,137,147,0.4)" }}>DVIDS ID: {dvidsId}</p>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}

function VideoTile({ video, index, onClick }) {
  const dvidsId = DVIDS_IDS[video.id]
  const hue = (index * 33) % 40 + 170
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: (index % 8) * 0.04 }}
      whileHover={{ scale: 1.03, y: -2 }}
      onClick={() => onClick(video)}
      className="relative aspect-video rounded-xl overflow-hidden cursor-pointer group transition-all"
      style={{ border: "1px solid rgba(79,137,147,0.1)", background: "#061116" }}
    >
      {/* DVIDS thumbnail */}
      {dvidsId && (
        <img
          src={`https://www.dvidshub.net/img/thumbnail/video/${dvidsId}.jpg`}
          alt={video.title}
          className="absolute inset-0 w-full h-full object-cover transition-all"
          style={{ opacity: 0.55 }}
          onError={e => e.target.style.display="none"}
          loading="lazy"
        />
      )}
      {/* Gradient bg fallback */}
      <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, hsl(${hue},50%,6%) 0%, hsl(${hue+20},30%,4%) 100%)` }} />
      {/* Scan lines */}
      <div className="absolute inset-0" style={{ backgroundImage:"repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(79,137,147,0.03) 2px,rgba(79,137,147,0.03) 4px)", opacity:0.5 }} />

      {/* Play button */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center transition-all group-hover:scale-110"
          style={{ border:"1px solid rgba(244,181,31,0.4)", background:"rgba(6,17,22,0.7)", boxShadow:"0 0 20px rgba(244,181,31,0.15)" }}
        >
          <span className="ml-0.5" style={{ color: "#F4B51F" }}>▶</span>
        </div>
      </div>

      {/* Top: DOD badge */}
      <div className="absolute top-2 left-2 flex items-center gap-1.5">
        <div className="rec-dot" style={{ width:5, height:5 }} />
        <span className="classified-stamp text-[0.4rem] px-1 py-0.5" style={{ color:"rgba(200,122,58,0.7)", borderColor:"rgba(200,122,58,0.3)", fontSize:"0.4rem" }}>DOD</span>
      </div>

      {/* DVIDS badge if we have ID */}
      {dvidsId && (
        <div className="absolute top-2 right-2">
          <span className="font-mono text-[0.4rem] px-1.5 py-0.5 rounded" style={{ background:"rgba(244,181,31,0.15)", color:"rgba(244,181,31,0.7)", border:"1px solid rgba(244,181,31,0.2)" }}>DVIDS</span>
        </div>
      )}

      {/* Bottom info */}
      <div className="absolute bottom-0 left-0 right-0 p-2" style={{ background:"linear-gradient(to top, rgba(6,17,22,0.95), transparent)" }}>
        <p className="font-mono text-[0.55rem] font-medium leading-tight line-clamp-1" style={{ color:"#E9F3F1" }}>{video.title}</p>
        <p className="font-mono text-[0.45rem] mt-0.5" style={{ color:"rgba(79,137,147,0.6)" }}>{video.location} · {formatSize(video.size)}</p>
      </div>
    </motion.div>
  )
}

export default function VideoArchive() {
  const [playing, setPlaying] = useState(null)
  const totalSize = VIDEOS.reduce((s, v) => s + v.size, 0)
  const withDvids = VIDEOS.filter(v => DVIDS_IDS[v.id]).length

  return (
    <section id="video" className="min-h-screen py-16 px-4 snap-section" style={{ background: "#061116" }}>
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} className="mb-8 text-center">
          <p className="font-mono text-[0.6rem] tracking-[0.3em] mb-2" style={{ color:"rgba(200,122,58,0.7)" }}>DEPARTMENT OF DEFENSE — VIDEO ARCHIVE</p>
          <h2 className="font-poster text-5xl md:text-6xl tracking-wide" style={{ color:"#E9F3F1" }}>UAP Footage</h2>
          <p className="font-mono text-xs mt-2" style={{ color:"rgba(79,137,147,0.5)" }}>
            {VIDEOS.length} declassified videos · {formatSize(totalSize)} · {withDvids} on DVIDS
          </p>
          <div className="w-16 h-px mx-auto mt-4" style={{ background:"rgba(244,181,31,0.4)" }} />
        </motion.div>

        {/* Source notice */}
        <motion.div
          initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }}
          className="mb-6 flex items-center gap-3 rounded-xl p-3"
          style={{ background:"rgba(24,51,59,0.3)", border:"1px solid rgba(200,122,58,0.2)" }}
        >
          <span className="classified-stamp text-[0.5rem] shrink-0" style={{ color:"rgba(200,122,58,0.8)", borderColor:"rgba(200,122,58,0.4)" }}>SOURCE</span>
          <p className="font-mono text-[0.6rem] leading-relaxed" style={{ color:"rgba(79,137,147,0.7)" }}>
            Videos stream from{" "}
            <a href="https://www.dvidshub.net" target="_blank" rel="noopener noreferrer" style={{ color:"rgba(244,181,31,0.7)" }}>
              DVIDS — Defense Visual Information Distribution Service
            </a>
            , the official DOD public affairs platform. Click any tile to watch.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {VIDEOS.map((video, i) => (
            <VideoTile key={video.id} video={video} index={i} onClick={setPlaying} />
          ))}
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }}
          className="mt-8 rounded-xl p-4 flex flex-wrap gap-6 justify-center"
          style={{ background:"rgba(24,51,59,0.2)", border:"1px solid rgba(79,137,147,0.1)" }}
        >
          {[
            { label:"TOTAL VIDEOS", value: VIDEOS.length },
            { label:"TOTAL SIZE",   value: formatSize(totalSize) },
            { label:"ON DVIDS",     value: withDvids },
            { label:"SOURCE",       value: "DOD" },
            { label:"RELEASE",      value: "2026" },
          ].map(({ label, value }) => (
            <div key={label} className="text-center">
              <p className="font-poster text-2xl leading-none" style={{ color:"#F4B51F" }}>{value}</p>
              <p className="font-mono text-[0.5rem] tracking-widest mt-0.5" style={{ color:"rgba(79,137,147,0.5)" }}>{label}</p>
            </div>
          ))}
        </motion.div>
      </div>

      <AnimatePresence>
        {playing && <VideoModal video={playing} onClose={() => setPlaying(null)} />}
      </AnimatePresence>
    </section>
  )
}
