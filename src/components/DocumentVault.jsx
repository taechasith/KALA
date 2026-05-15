import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { DOCUMENTS, AGENCIES, TYPES, warGovThumb } from "../data/manifest"

const DATA_ROOT = import.meta.env.VITE_DATA_ROOT || "/data/"

function DocCard({ doc, onClick }) {
  const agency = AGENCIES[doc.agency] || { color:"#fff", label: doc.agency, icon:"?" }
  const type = TYPES[doc.type] || { color:"#94a3b8", label: doc.type }
  const sizeKB = (doc.size / 1024).toFixed(0)
  const sizeMB = (doc.size / 1024 / 1024).toFixed(1)

  const dataUrl = `${DATA_ROOT}${encodeURIComponent(doc.filename)}`
  const thumbUrl = warGovThumb(doc.filename)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.015 }}
      transition={{ duration: 0.2 }}
      onClick={() => onClick(doc)}
      className="glass rounded-xl overflow-hidden cursor-pointer border border-white/5 hover:border-white/10 transition-all group"
      style={{ "--agency-color": agency.color }}
    >
      {/* war.gov thumbnail for all docs */}
      <div className="h-28 overflow-hidden bg-black/30 relative">
        <img
          src={thumbUrl}
          alt={doc.title}
          loading="lazy"
          onError={e => { e.currentTarget.style.display = "none" }}
          className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity"
        />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-0">
        </div>
      </div>

      <div className="p-3 md:p-4">
        {/* Top row */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-sm shrink-0 opacity-70">{agency.icon}</span>
            <span className="classified-stamp text-[0.5rem] px-1.5 py-0.5 whitespace-nowrap"
              style={{ color: agency.color, borderColor: agency.color + "50" }}>
              {agency.label}
            </span>
          </div>
          {doc.redacted && (
            <span className="classified-stamp agency-FBI text-[0.5rem] px-1.5 py-0.5 shrink-0">REDACTED</span>
          )}
        </div>

        {/* Title */}
        <h3 className="font-mono text-xs text-white font-medium mb-2 leading-snug line-clamp-2 group-hover:text-cyan-100 transition-colors">
          {doc.title}
        </h3>

        {/* Meta row */}
        <div className="flex flex-wrap gap-x-3 gap-y-1 text-[0.55rem] font-mono text-slate-600 mb-2">
          <span className="flex items-center gap-1">
            <span>◷</span> {doc.year || "DATE UNK"}
          </span>
          <span className="flex items-center gap-1">
            <span>◎</span> {doc.location}
          </span>
          <span className="flex items-center gap-1">
            <span>◈</span> {doc.era || "—"}
          </span>
        </div>

        {/* Bottom: type badge + size + view link */}
        <div className="flex items-center justify-between pt-2 border-t border-white/5">
          <span className="font-mono text-[0.5rem] px-1.5 py-0.5 rounded"
            style={{ color: type.color, background: type.color + "15" }}>
            {type.label}
          </span>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[0.55rem] text-slate-700">
              {doc.size > 1024*1024 ? `${sizeMB} MB` : `${sizeKB} KB`}
            </span>
            <a
              href={dataUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              className="font-mono text-[0.5rem] px-1.5 py-0.5 rounded border border-cyan-500/20 text-cyan-600 hover:text-cyan-400 hover:border-cyan-500/40 transition-all"
            >
              VIEW ↗
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function DocModal({ doc, onClose, onDecode }) {
  const agency = AGENCIES[doc.agency] || { color:"#fff", label: doc.agency }
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="glass-heavy rounded-2xl p-6 w-full max-w-lg border border-white/10 max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
        style={{ borderColor: agency.color + "30" }}
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="font-mono text-[0.55rem] tracking-widest mb-1" style={{ color: agency.color }}>
              {doc.id} · {agency.label}
            </p>
            <h2 className="font-mono text-base text-white font-bold leading-snug">{doc.title}</h2>
          </div>
          <button onClick={onClose} className="text-slate-600 hover:text-white transition-colors text-lg ml-4">✕</button>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          {[
            { k:"DOCUMENT ID",  v: doc.id },
            { k:"AGENCY",       v: doc.agency },
            { k:"TYPE",         v: doc.type.replace(/-/g," ").toUpperCase() },
            { k:"YEAR",         v: doc.year || "UNKNOWN" },
            { k:"LOCATION",     v: doc.location },
            { k:"ERA",          v: doc.era || "—" },
            { k:"FILE SIZE",    v: doc.size > 1048576 ? `${(doc.size/1048576).toFixed(1)} MB` : `${(doc.size/1024).toFixed(0)} KB` },
            { k:"STATUS",       v: doc.redacted ? "⚠ REDACTED" : "✓ DECLASSIFIED" },
          ].map(({ k, v }) => (
            <div key={k} className="glass rounded-lg p-2.5">
              <p className="font-mono text-[0.5rem] text-slate-600 tracking-widest mb-0.5">{k}</p>
              <p className="font-mono text-xs text-slate-300">{v}</p>
            </div>
          ))}
        </div>

        {/* war.gov cover thumbnail */}
        <div className="glass rounded-lg overflow-hidden mb-4">
          <img
            src={warGovThumb(doc.filename)}
            alt={doc.title}
            loading="lazy"
            onError={e => { e.currentTarget.parentElement.style.display = "none" }}
            className="w-full h-40 object-cover opacity-80 hover:opacity-100 transition-opacity"
          />
        </div>

        <div className="glass rounded-lg p-3 mb-4">
          <p className="font-mono text-[0.55rem] text-slate-600 tracking-widest mb-1.5">DOCUMENT</p>
          <p className="font-mono text-[0.6rem] text-slate-500 break-all leading-relaxed">{doc.filename}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <a
            href={`${DATA_ROOT}${encodeURIComponent(doc.filename)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-2.5 rounded-xl font-mono text-sm border border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/15 transition-all text-center"
          >
            VIEW DOCUMENT ↗
          </a>
          <button
            onClick={() => { onDecode(doc); onClose() }}
            className="flex-1 py-2.5 rounded-xl font-mono text-sm border border-purple-500/40 text-purple-400 hover:bg-purple-500/15 transition-all"
          >
            DECODE WITH AI →
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl font-mono text-sm border border-white/10 text-slate-500 hover:text-slate-300 transition-all"
          >
            ✕
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function DocumentVault() {
  const [search, setSearch] = useState("")
  const [agencyFilter, setAgencyFilter] = useState("ALL")
  const [typeFilter, setTypeFilter] = useState("ALL")
  const [eraFilter, setEraFilter] = useState("ALL")
  const [selected, setSelected] = useState(null)
  const [page, setPage] = useState(0)
  const PER_PAGE = 24

  const filtered = useMemo(() => {
    let docs = DOCUMENTS
    if (agencyFilter !== "ALL") docs = docs.filter(d => d.agency === agencyFilter)
    if (typeFilter !== "ALL")   docs = docs.filter(d => d.type === typeFilter)
    if (eraFilter !== "ALL")    docs = docs.filter(d => d.era === eraFilter)
    if (search) {
      const q = search.toLowerCase()
      docs = docs.filter(d =>
        d.title.toLowerCase().includes(q) ||
        d.id.toLowerCase().includes(q) ||
        d.location.toLowerCase().includes(q) ||
        d.filename.toLowerCase().includes(q)
      )
    }
    return docs
  }, [search, agencyFilter, typeFilter, eraFilter])

  const paginated = filtered.slice(page * PER_PAGE, (page + 1) * PER_PAGE)
  const totalPages = Math.ceil(filtered.length / PER_PAGE)

  const handleDecode = (doc) => {
    sessionStorage.setItem("kala-decode-doc", JSON.stringify(doc))
    document.getElementById("decoder")?.scrollIntoView({ behavior: "smooth" })
  }

  const ERAS = ["ALL", "WWII", "POSTWAR", "COLDWAR", "MODERN1", "MODERN2", "CURRENT"]
  const ERA_LABELS = { ALL:"ALL", WWII:"WW2", POSTWAR:"POST-WAR", COLDWAR:"COLD WAR", MODERN1:"MOD I", MODERN2:"MOD II", CURRENT:"2026" }

  return (
    <section className="min-h-screen py-16 px-4 snap-section" style={{ background:"rgba(6,17,22,0.72)" }}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8 text-center"
        >
          <p className="font-mono text-[0.6rem] tracking-[0.3em] mb-2" style={{ color:"rgba(79,137,147,0.7)" }}>PURSUE ARCHIVE — RELEASE 1</p>
          <h2 className="font-poster text-5xl md:text-6xl tracking-wide" style={{ color:"#E9F3F1" }}>
            Document Vault
          </h2>
          <div className="w-16 h-px mx-auto mt-4" style={{ background:"rgba(244,181,31,0.4)" }} />
        </motion.div>

        {/* Filters */}
        <div className="space-y-3 mb-6">
          {/* Search */}
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-slate-600 text-sm">⌕</span>
            <input
              type="text"
              placeholder="Search by title, ID, location, filename..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(0) }}
              className="w-full glass rounded-xl pl-8 pr-4 py-2.5 font-mono text-sm text-slate-300 placeholder-slate-700 border border-white/5 focus:border-cyan-500/30 focus:outline-none bg-transparent"
            />
          </div>

          {/* Agency filter */}
          <div className="flex flex-wrap gap-1.5">
            {["ALL", ...Object.keys(AGENCIES)].map(a => (
              <button
                key={a}
                onClick={() => { setAgencyFilter(a); setPage(0) }}
                className={`px-2.5 py-1 rounded-lg font-mono text-[0.6rem] border transition-all ${
                  agencyFilter === a ? "bg-white/10 text-white border-white/20" : "border-white/5 text-slate-600 hover:text-slate-400"
                }`}
                style={agencyFilter === a && a !== "ALL" ? { borderColor: AGENCIES[a]?.color+"50", color: AGENCIES[a]?.color } : {}}
              >
                {a === "ALL" ? "ALL AGENCIES" : `${AGENCIES[a]?.icon} ${a}`}
              </button>
            ))}
          </div>

          {/* Era + type filters row */}
          <div className="flex flex-wrap gap-1.5">
            {ERAS.map(e => (
              <button
                key={e}
                onClick={() => { setEraFilter(e); setPage(0) }}
                className={`px-2 py-0.5 rounded font-mono text-[0.55rem] border transition-all ${
                  eraFilter === e ? "bg-purple-500/15 text-purple-400 border-purple-500/30" : "border-white/5 text-slate-700 hover:text-slate-500"
                }`}
              >
                {ERA_LABELS[e]}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-4">
          <p className="font-mono text-xs text-slate-600">
            <span className="text-white">{filtered.length}</span> documents · page {page+1}/{Math.max(totalPages,1)}
          </p>
          <div className="flex gap-1.5">
            <button
              disabled={page === 0}
              onClick={() => setPage(p => p - 1)}
              className="px-2 py-1 rounded font-mono text-xs border border-white/5 text-slate-600 disabled:opacity-30 hover:text-slate-400 transition-all"
            >←</button>
            <button
              disabled={page >= totalPages - 1}
              onClick={() => setPage(p => p + 1)}
              className="px-2 py-1 rounded font-mono text-xs border border-white/5 text-slate-600 disabled:opacity-30 hover:text-slate-400 transition-all"
            >→</button>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <AnimatePresence mode="popLayout">
            {paginated.map(doc => (
              <DocCard key={doc.id} doc={doc} onClick={setSelected} />
            ))}
          </AnimatePresence>
          {paginated.length === 0 && (
            <div className="col-span-3 text-center py-16">
              <p className="font-mono text-slate-600 text-sm">No documents match filters</p>
            </div>
          )}
        </div>

        {/* Pagination bottom */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-1.5 mt-6 flex-wrap">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={`w-7 h-7 rounded font-mono text-xs border transition-all ${
                  page === i ? "bg-cyan-500/20 border-cyan-500/40 text-cyan-400" : "border-white/5 text-slate-700 hover:text-slate-400"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selected && (
          <DocModal doc={selected} onClose={() => setSelected(null)} onDecode={handleDecode} />
        )}
      </AnimatePresence>
    </section>
  )
}
