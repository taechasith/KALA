import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { DOCUMENTS, VIDEOS, AGENCIES } from "../data/manifest"
import { SIGHTINGS, CATEGORIES, CREDIBILITY_COLORS, getZodiac, getSightingsByDate } from "../data/sightings"

const MONTH_NAMES = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"]
const DAYS_IN_MONTH = [31,29,31,30,31,30,31,31,30,31,30,31]

function pad(n) { return String(n).padStart(2,"0") }

function scrollToSection(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" })
  window.history.replaceState(null, "", `#${id}`)
}

function sendToDecoder(doc) {
  sessionStorage.setItem("kala-decode-doc", JSON.stringify(doc))
  scrollToSection("decoder")
}

// ── Doc detail modal ────────────────────────────────────────────────────────
function DocModal({ doc, onClose }) {
  const agency = AGENCIES[doc.agency] || { color: "#4F8993", label: doc.agency, icon: "◈" }
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[70] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="w-full max-w-lg rounded-2xl p-6 overflow-y-auto max-h-[90vh]"
        style={{ background: "rgba(6,17,22,0.97)", border: `1px solid ${agency.color}30`, boxShadow: `0 0 60px ${agency.color}10` }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <p className="font-mono text-[0.5rem] tracking-widest mb-1" style={{ color: agency.color }}>
              {doc.id} · {agency.label}
            </p>
            <h2 className="font-mono text-sm font-bold leading-snug" style={{ color: "#E9F3F1" }}>{doc.title}</h2>
          </div>
          <button type="button" onClick={onClose} className="text-lg ml-4 cursor-pointer transition-colors" style={{ color: "rgba(79,137,147,0.5)" }}
            onMouseEnter={e => e.currentTarget.style.color = "#E9F3F1"}
            onMouseLeave={e => e.currentTarget.style.color = "rgba(79,137,147,0.5)"}
          >✕</button>
        </div>

        {/* Meta grid */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          {[
            { k: "DOCUMENT ID", v: doc.id },
            { k: "AGENCY",      v: doc.agency },
            { k: "TYPE",        v: doc.type?.replace(/-/g," ").toUpperCase() },
            { k: "YEAR",        v: doc.year || "UNKNOWN" },
            { k: "LOCATION",    v: doc.location },
            { k: "ERA",         v: doc.era || "—" },
            { k: "FILE SIZE",   v: doc.size > 1048576 ? `${(doc.size/1048576).toFixed(1)} MB` : `${(doc.size/1024).toFixed(0)} KB` },
            { k: "STATUS",      v: doc.redacted ? "⚠ REDACTED" : "✓ DECLASSIFIED" },
          ].map(({ k, v }) => (
            <div key={k} className="rounded-lg p-2.5" style={{ background: "rgba(24,51,59,0.3)", border: "1px solid rgba(79,137,147,0.1)" }}>
              <p className="font-mono text-[0.45rem] tracking-widest mb-0.5" style={{ color: "rgba(79,137,147,0.5)" }}>{k}</p>
              <p className="font-mono text-[0.65rem]" style={{ color: "rgba(233,243,241,0.8)" }}>{v}</p>
            </div>
          ))}
        </div>

        {/* Filename */}
        <div className="rounded-lg p-3 mb-4" style={{ background: "rgba(24,51,59,0.2)", border: "1px solid rgba(79,137,147,0.1)" }}>
          <p className="font-mono text-[0.45rem] tracking-widest mb-1" style={{ color: "rgba(79,137,147,0.5)" }}>FILENAME</p>
          <p className="font-mono text-[0.55rem] break-all leading-relaxed" style={{ color: "rgba(233,243,241,0.45)" }}>{doc.filename}</p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            type="button"
            onClick={() => { sendToDecoder(doc); onClose() }}
            className="flex-1 py-2.5 rounded-xl font-mono text-xs tracking-widest transition-all cursor-pointer"
            style={{ border: "1px solid rgba(0,212,255,0.35)", color: "#00d4ff", background: "rgba(0,212,255,0.05)" }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(0,212,255,0.12)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(0,212,255,0.05)"}
          >
            DECODE WITH AI →
          </button>
          <button
            type="button"
            onClick={() => { scrollToSection("vault"); onClose() }}
            className="flex-1 py-2.5 rounded-xl font-mono text-xs tracking-widest transition-all cursor-pointer"
            style={{ border: "1px solid rgba(244,181,31,0.25)", color: "rgba(244,181,31,0.7)", background: "transparent" }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(244,181,31,0.08)"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          >
            VIEW IN VAULT →
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl font-mono text-xs cursor-pointer transition-colors"
            style={{ border: "1px solid rgba(79,137,147,0.15)", color: "rgba(79,137,147,0.5)" }}
            onMouseEnter={e => e.currentTarget.style.color = "rgba(233,243,241,0.6)"}
            onMouseLeave={e => e.currentTarget.style.color = "rgba(79,137,147,0.5)"}
          >
            CLOSE
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ── Sighting card ────────────────────────────────────────────────────────────
function SightingCard({ s, index }) {
  const [expanded, setExpanded] = useState(false)
  const cat = CATEGORIES[s.category] || CATEGORIES.UNKNOWN
  const credColor = CREDIBILITY_COLORS[s.credibility] || "#4F8993"

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.4 }}
      className="rounded-lg overflow-hidden cursor-pointer"
      style={{ background: "rgba(6,17,22,0.8)", border: "1px solid rgba(79,137,147,0.2)" }}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="font-mono text-[0.5rem] tracking-widest px-1.5 py-0.5 rounded" style={{ background: `${cat.color}15`, color: cat.color, border: `1px solid ${cat.color}30` }}>
                {cat.icon} {cat.label}
              </span>
              <span className="font-mono text-[0.5rem] tracking-widest px-1.5 py-0.5 rounded" style={{ background: `${credColor}10`, color: credColor, border: `1px solid ${credColor}25` }}>
                {s.credibility}
              </span>
            </div>
            <h4 className="font-poster text-base tracking-wider" style={{ color: "#E9F3F1" }}>{s.title}</h4>
            <p className="font-mono text-[0.6rem] mt-0.5" style={{ color: "rgba(79,137,147,0.7)" }}>
              {s.year} · {s.location}
            </p>
          </div>
          <div className="text-right shrink-0">
            <p className="font-poster text-2xl" style={{ color: "rgba(244,181,31,0.4)" }}>{s.year}</p>
            <p className="font-mono text-[0.45rem]" style={{ color: "rgba(79,137,147,0.35)" }}>TAP TO EXPAND</p>
          </div>
        </div>

        <AnimatePresence>
          {expanded && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="font-mono text-[0.65rem] leading-relaxed mt-3 pt-3"
              style={{ color: "rgba(233,243,241,0.65)", borderTop: "1px solid rgba(79,137,147,0.1)" }}
            >
              {s.description}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

// ── Archive doc card (clickable → modal) ─────────────────────────────────────
function DocCard({ doc, index, onOpen }) {
  const agency = AGENCIES[doc.agency] || { color: "#4F8993", label: doc.agency, icon: "◈" }
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.06, duration: 0.35 }}
      onClick={() => onOpen(doc)}
      className="flex items-center gap-3 px-3 py-2.5 rounded cursor-pointer group transition-all"
      style={{ background: "rgba(6,17,22,0.6)", border: "1px solid rgba(79,137,147,0.15)" }}
      onMouseEnter={e => { e.currentTarget.style.border = `1px solid ${agency.color}40`; e.currentTarget.style.background = `rgba(6,17,22,0.9)` }}
      onMouseLeave={e => { e.currentTarget.style.border = "1px solid rgba(79,137,147,0.15)"; e.currentTarget.style.background = "rgba(6,17,22,0.6)" }}
    >
      <span className="font-mono text-xs shrink-0" style={{ color: agency.color }}>{agency.icon}</span>
      <div className="flex-1 min-w-0">
        <p className="font-mono text-[0.6rem] truncate transition-colors" style={{ color: "rgba(233,243,241,0.7)" }}>{doc.title}</p>
        <p className="font-mono text-[0.5rem]" style={{ color: "rgba(79,137,147,0.5)" }}>{doc.agency} · {doc.type}</p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {doc.redacted && (
          <span className="font-mono text-[0.45rem] px-1.5 py-0.5 rounded" style={{ background: "rgba(255,30,30,0.1)", color: "#FF1E1E", border: "1px solid rgba(255,30,30,0.2)" }}>REDACTED</span>
        )}
        <span className="font-mono text-[0.5rem] opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: agency.color }}>OPEN →</span>
      </div>
    </motion.div>
  )
}

// ── Video card (clickable → footage section) ──────────────────────────────────
function VideoCard({ vid, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.06, duration: 0.35 }}
      onClick={() => scrollToSection("video")}
      className="flex items-center gap-3 px-3 py-2.5 rounded cursor-pointer group transition-all"
      style={{ background: "rgba(6,17,22,0.6)", border: "1px solid rgba(0,212,255,0.12)" }}
      onMouseEnter={e => { e.currentTarget.style.border = "1px solid rgba(0,212,255,0.35)"; e.currentTarget.style.background = "rgba(0,212,255,0.04)" }}
      onMouseLeave={e => { e.currentTarget.style.border = "1px solid rgba(0,212,255,0.12)"; e.currentTarget.style.background = "rgba(6,17,22,0.6)" }}
    >
      <span className="font-mono text-xs shrink-0" style={{ color: "#00d4ff" }}>▶</span>
      <div className="flex-1 min-w-0">
        <p className="font-mono text-[0.6rem] truncate" style={{ color: "rgba(233,243,241,0.7)" }}>{vid.title}</p>
        <p className="font-mono text-[0.5rem]" style={{ color: "rgba(0,212,255,0.45)" }}>DOD FOOTAGE · {vid.location}</p>
      </div>
      <span className="font-mono text-[0.5rem] opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: "#00d4ff" }}>VIEW →</span>
    </motion.div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
export default function BirthDatePortal() {
  const [month, setMonth] = useState("")
  const [day, setDay] = useState("")
  const [year, setYear] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [modalDoc, setModalDoc] = useState(null)

  const maxDay = month ? DAYS_IN_MONTH[parseInt(month) - 1] : 31
  const monthDay = month && day ? `${pad(month)}-${pad(day)}` : null

  const results = useMemo(() => {
    if (!monthDay) return null
    const sightings = getSightingsByDate(monthDay)
    const archiveDocs = year ? DOCUMENTS.filter(d => d.year === parseInt(year)) : []
    const archiveVideos = year ? VIDEOS.filter(v => v.year === parseInt(year)) : []
    const zodiac = getZodiac(month, day)
    return { sightings, archiveDocs, archiveVideos, zodiac }
  }, [monthDay, month, day, year])

  const elementColors = { FIRE: "#F4B51F", EARTH: "#a3e635", AIR: "#00d4ff", WATER: "#818cf8" }

  const handleSubmit = (e) => { e.preventDefault(); if (month && day) setSubmitted(true) }
  const handleReset = () => { setSubmitted(false); setMonth(""); setDay(""); setYear("") }

  return (
    <section className="min-h-screen px-4 py-24" style={{ background: "linear-gradient(180deg, #061116 0%, rgba(24,51,59,0.15) 50%, #061116 100%)" }}>
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="mb-12 text-center">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="font-mono text-[0.55rem] tracking-[0.4em] mb-3"
            style={{ color: "rgba(79,137,147,0.6)" }}
          >
            TEMPORAL RESONANCE MODULE
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-poster text-[clamp(2.5rem,8vw,5rem)] leading-none tracking-[0.08em]"
            style={{ color: "#E9F3F1" }}
          >
            BIRTH DATE<br />
            <span style={{ color: "#F4B51F" }}>RESONANCE</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="font-mono text-xs mt-4"
            style={{ color: "rgba(79,137,147,0.6)" }}
          >
            Enter birth date · Cross-reference UAP encounter history · Discover what was witnessed on your day
          </motion.p>
        </div>

        {/* Form / Results */}
        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="relative rounded-xl p-6 mb-8 cam-frame"
              style={{ background: "rgba(18,51,59,0.3)", border: "1px solid rgba(79,137,147,0.25)", backdropFilter: "blur(12px)" }}
            >
              <p className="font-mono text-[0.55rem] tracking-[0.3em] mb-6" style={{ color: "rgba(79,137,147,0.5)" }}>
                INPUT TEMPORAL COORDINATES
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {/* Month */}
                  <div>
                    <label className="block font-mono text-[0.55rem] tracking-widest mb-2" style={{ color: "rgba(79,137,147,0.6)" }}>MONTH</label>
                    <select
                      value={month}
                      onChange={e => { setMonth(e.target.value); setDay("") }}
                      required
                      className="w-full rounded-lg px-3 py-2.5 font-mono text-xs appearance-none cursor-pointer"
                      style={{ background: "rgba(6,17,22,0.8)", border: "1px solid rgba(79,137,147,0.3)", color: month ? "#E9F3F1" : "rgba(79,137,147,0.4)", outline: "none" }}
                    >
                      <option value="" disabled>SELECT</option>
                      {MONTH_NAMES.map((m, i) => (
                        <option key={i+1} value={i+1} style={{ background: "#061116" }}>{pad(i+1)} · {m}</option>
                      ))}
                    </select>
                  </div>

                  {/* Day */}
                  <div>
                    <label className="block font-mono text-[0.55rem] tracking-widest mb-2" style={{ color: "rgba(79,137,147,0.6)" }}>DAY</label>
                    <select
                      value={day}
                      onChange={e => setDay(e.target.value)}
                      required
                      disabled={!month}
                      className="w-full rounded-lg px-3 py-2.5 font-mono text-xs appearance-none cursor-pointer disabled:opacity-40"
                      style={{ background: "rgba(6,17,22,0.8)", border: "1px solid rgba(79,137,147,0.3)", color: day ? "#E9F3F1" : "rgba(79,137,147,0.4)", outline: "none" }}
                    >
                      <option value="" disabled>SELECT</option>
                      {Array.from({ length: maxDay }, (_, i) => i + 1).map(d => (
                        <option key={d} value={d} style={{ background: "#061116" }}>{pad(d)}</option>
                      ))}
                    </select>
                  </div>

                  {/* Year (optional) */}
                  <div className="col-span-2 md:col-span-1">
                    <label className="block font-mono text-[0.55rem] tracking-widest mb-2" style={{ color: "rgba(79,137,147,0.6)" }}>
                      BIRTH YEAR <span style={{ color: "rgba(79,137,147,0.35)" }}>(optional)</span>
                    </label>
                    <select
                      value={year}
                      onChange={e => setYear(e.target.value)}
                      className="w-full rounded-lg px-3 py-2.5 font-mono text-xs appearance-none cursor-pointer"
                      style={{ background: "rgba(6,17,22,0.8)", border: "1px solid rgba(79,137,147,0.3)", color: year ? "#E9F3F1" : "rgba(79,137,147,0.4)", outline: "none" }}
                    >
                      <option value="" style={{ background: "#061116" }}>SKIP</option>
                      {Array.from({ length: 83 }, (_, i) => 2026 - i).map(y => (
                        <option key={y} value={y} style={{ background: "#061116" }}>{y}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <motion.button
                  type="submit"
                  disabled={!month || !day}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 rounded-lg font-poster tracking-[0.25em] text-sm transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  style={{ background: "rgba(244,181,31,0.12)", color: "#F4B51F", border: "1px solid rgba(244,181,31,0.35)" }}
                >
                  SCAN TEMPORAL RECORD
                </motion.button>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Zodiac Banner */}
              {results?.zodiac && (() => {
                const z = results.zodiac
                const elColor = elementColors[z.element] || "#F4B51F"
                return (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="rounded-xl p-6 text-center"
                    style={{ background: "linear-gradient(135deg, rgba(6,17,22,0.9) 0%, rgba(18,51,59,0.4) 100%)", border: `1px solid ${elColor}30` }}
                  >
                    <p className="font-mono text-[0.5rem] tracking-[0.4em] mb-2" style={{ color: "rgba(79,137,147,0.5)" }}>ASTROLOGICAL PROFILE</p>
                    <div className="flex items-center justify-center gap-4 mb-3">
                      <span className="text-5xl">{z.symbol}</span>
                      <div className="text-left">
                        <h3 className="font-poster text-3xl tracking-widest" style={{ color: elColor }}>{z.sign}</h3>
                        <p className="font-mono text-[0.55rem] tracking-wider" style={{ color: "rgba(79,137,147,0.6)" }}>{z.dates}</p>
                      </div>
                    </div>
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ background: `${elColor}12`, border: `1px solid ${elColor}25` }}>
                      <span className="font-mono text-[0.5rem] tracking-widest" style={{ color: elColor }}>ELEMENT: {z.element}</span>
                    </div>
                    <p className="font-mono text-[0.65rem] mt-3" style={{ color: "rgba(233,243,241,0.5)" }}>{z.trait}</p>
                    <div className="mt-4 pt-4 flex items-center justify-center gap-2" style={{ borderTop: "1px solid rgba(79,137,147,0.1)" }}>
                      <span className="font-mono text-[0.5rem] tracking-widest" style={{ color: "rgba(79,137,147,0.4)" }}>SCANNING DATE:</span>
                      <span className="font-poster text-base tracking-widest" style={{ color: "#F4B51F" }}>
                        {MONTH_NAMES[parseInt(month)-1]} {pad(day)}{year ? ` · ${year}` : ""}
                      </span>
                    </div>
                  </motion.div>
                )
              })()}

              {/* Historical Sightings */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="font-mono text-[0.5rem] tracking-[0.3em]" style={{ color: "rgba(79,137,147,0.5)" }}>TEMPORAL MATCH · HISTORICAL RECORD</p>
                    <h3 className="font-poster text-xl tracking-wider mt-0.5" style={{ color: "#E9F3F1" }}>
                      UAP INCIDENTS ON{" "}
                      <span style={{ color: "#F4B51F" }}>{MONTH_NAMES[parseInt(month)-1]} {pad(day)}</span>
                    </h3>
                  </div>
                  <div className="text-right">
                    <p className="font-poster text-3xl" style={{ color: results?.sightings.length ? "#F4B51F" : "rgba(79,137,147,0.3)" }}>
                      {results?.sightings.length ?? 0}
                    </p>
                    <p className="font-mono text-[0.5rem]" style={{ color: "rgba(79,137,147,0.4)" }}>EVENTS FOUND</p>
                  </div>
                </div>

                {results?.sightings.length > 0 ? (
                  <div className="space-y-3">
                    {results.sightings.map((s, i) => <SightingCard key={i} s={s} index={i} />)}
                  </div>
                ) : (
                  <div className="rounded-xl p-8 text-center" style={{ background: "rgba(6,17,22,0.5)", border: "1px solid rgba(79,137,147,0.1)" }}>
                    <p className="font-poster text-2xl mb-2" style={{ color: "rgba(79,137,147,0.3)" }}>NO RECORD</p>
                    <p className="font-mono text-[0.6rem]" style={{ color: "rgba(79,137,147,0.4)" }}>
                      No documented UAP incidents on this date · Archive covers notable cases 1938–2021
                    </p>
                  </div>
                )}
              </div>

              {/* Archive Docs + Videos by Year */}
              {year && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-mono text-[0.5rem] tracking-[0.3em]" style={{ color: "rgba(79,137,147,0.5)" }}>KALA ARCHIVE · BIRTH YEAR MATCH</p>
                      <h3 className="font-poster text-xl tracking-wider mt-0.5" style={{ color: "#E9F3F1" }}>
                        DECLASSIFIED FROM{" "}
                        <span style={{ color: "#00d4ff" }}>{year}</span>
                      </h3>
                    </div>
                    <div className="text-right">
                      <p className="font-poster text-3xl" style={{ color: (results?.archiveDocs.length + results?.archiveVideos.length) ? "#00d4ff" : "rgba(79,137,147,0.3)" }}>
                        {(results?.archiveDocs.length ?? 0) + (results?.archiveVideos.length ?? 0)}
                      </p>
                      <p className="font-mono text-[0.5rem]" style={{ color: "rgba(79,137,147,0.4)" }}>FILES FOUND</p>
                    </div>
                  </div>

                  {(results?.archiveDocs.length > 0 || results?.archiveVideos.length > 0) ? (
                    <div className="space-y-2">
                      {results.archiveDocs.map((d, i) => (
                        <DocCard key={d.id} doc={d} index={i} onOpen={setModalDoc} />
                      ))}
                      {results.archiveVideos.map((v, i) => (
                        <VideoCard key={v.id} vid={v} index={results.archiveDocs.length + i} />
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-xl p-6 text-center" style={{ background: "rgba(6,17,22,0.5)", border: "1px solid rgba(79,137,147,0.1)" }}>
                      <p className="font-mono text-[0.6rem]" style={{ color: "rgba(79,137,147,0.4)" }}>
                        No declassified documents in KALA archive for {year} · Archive covers select years 1944–2026
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Bottom action bar */}
              <div className="rounded-lg px-4 py-3 flex flex-col sm:flex-row items-center gap-3" style={{ background: "rgba(6,17,22,0.4)", border: "1px solid rgba(79,137,147,0.1)" }}>
                <p className="font-mono text-[0.55rem] flex-1" style={{ color: "rgba(79,137,147,0.4)" }}>
                  {SIGHTINGS.length} incidents indexed · Click docs to open · Click videos to view footage
                </p>
                <div className="flex items-center gap-2 shrink-0">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => scrollToSection("decoder")}
                    className="font-mono text-[0.55rem] tracking-widest px-4 py-2 rounded cursor-pointer transition-all"
                    style={{ color: "#00d4ff", border: "1px solid rgba(0,212,255,0.3)", background: "rgba(0,212,255,0.06)" }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(0,212,255,0.12)"}
                    onMouseLeave={e => e.currentTarget.style.background = "rgba(0,212,255,0.06)"}
                  >
                    AI DECODER →
                  </motion.button>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="font-mono text-[0.55rem] tracking-widest px-3 py-2 rounded cursor-pointer transition-all"
                    style={{ color: "rgba(244,181,31,0.6)", border: "1px solid rgba(244,181,31,0.2)" }}
                    onMouseEnter={e => e.currentTarget.style.color = "#F4B51F"}
                    onMouseLeave={e => e.currentTarget.style.color = "rgba(244,181,31,0.6)"}
                  >
                    RESET
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Doc detail modal */}
      <AnimatePresence>
        {modalDoc && <DocModal doc={modalDoc} onClose={() => setModalDoc(null)} />}
      </AnimatePresence>
    </section>
  )
}
