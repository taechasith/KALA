import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { DOCUMENTS, STATS, AGENCIES, TYPES } from "../data/manifest"

function CountUp({ target, duration = 1500 }) {
  const [val, setVal] = useState(0)
  const ref = useRef()
  useEffect(() => {
    const start = performance.now()
    const run = (now) => {
      const p = Math.min((now - start) / duration, 1)
      setVal(Math.floor(p * p * target))
      if (p < 1) ref.current = requestAnimationFrame(run)
    }
    ref.current = requestAnimationFrame(run)
    return () => cancelAnimationFrame(ref.current)
  }, [target])
  return val
}

function AgencyBar({ agency, count, total }) {
  const info = AGENCIES[agency] || { color: "#fff", label: agency }
  const pct = ((count / total) * 100).toFixed(1)
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs font-mono">
        <span style={{ color: info.color }} className="flex items-center gap-1.5">
          <span>{info.icon}</span> {info.label}
        </span>
        <span className="text-slate-500">{count} <span className="text-slate-700">({pct}%)</span></span>
      </div>
      <div className="h-1 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${pct}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="h-full rounded-full"
          style={{ background: info.color, boxShadow: `0 0 8px ${info.color}40` }}
        />
      </div>
    </div>
  )
}

export default function StatsPanel() {
  const agencyCounts = DOCUMENTS.reduce((acc, d) => { acc[d.agency] = (acc[d.agency]||0)+1; return acc }, {})
  const typeCounts = DOCUMENTS.reduce((acc, d) => { acc[d.type] = (acc[d.type]||0)+1; return acc }, {})
  const eraCounts = DOCUMENTS.reduce((acc, d) => { if(d.era) acc[d.era] = (acc[d.era]||0)+1; return acc }, {})

  const topLocations = Object.entries(
    DOCUMENTS.filter(d=>d.location!=="Unknown"&&d.location!=="Space")
      .reduce((acc,d)=>{ acc[d.location]=(acc[d.location]||0)+1; return acc },{})
  ).sort((a,b)=>b[1]-a[1]).slice(0,6)

  const eraData = [
    { label:"WWII",        range:"1944–45", color:"#a3e635" },
    { label:"POST-WAR",    range:"1946–60", color:"#818cf8" },
    { label:"COLD WAR",    range:"1961–79", color:"#a78bfa" },
    { label:"MODERN I",    range:"1980–10", color:"#00ff88" },
    { label:"MODERN II",   range:"2011–20", color:"#00d4ff" },
    { label:"CURRENT",     range:"2021–26", color:"#ff4444" },
  ]

  return (
    <section className="relative min-h-screen overflow-hidden py-16 md:py-24 px-4 snap-section" style={{ background:"rgba(6,17,22,0.72)" }}>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 35%, rgba(79,137,147,0.08), transparent 48%), linear-gradient(180deg, rgba(6,17,22,0.35), rgba(6,17,22,0.86))" }}
      />
      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <p className="font-mono text-[0.6rem] tracking-[0.3em] mb-2" style={{ color:"rgba(79,137,147,0.7)" }}>INTELLIGENCE OVERVIEW</p>
          <h2 className="font-poster text-5xl md:text-6xl tracking-wide" style={{ color:"#E9F3F1" }}>
            Archive Intelligence
          </h2>
          <div className="w-16 h-px mx-auto mt-4" style={{ background:"rgba(244,181,31,0.4)" }} />
        </motion.div>

        {/* Big stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
          {[
            { label:"TOTAL FILES",  value: STATS.totalDocs + STATS.totalVideos, suffix:"",      color:"#4F8993" },
            { label:"PDF DOCS",     value: STATS.totalDocs,                     suffix:"",      color:"#6b8cba" },
            { label:"DOD VIDEOS",   value: STATS.totalVideos,                   suffix:"",      color:"#c87a3a" },
            { label:"YEAR SPAN",    value: 82,                                  suffix:" YR",   color:"#F4B51F" },
          ].map(({ label, value, suffix, color }) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="rounded-xl p-4 md:p-6 text-center"
              style={{ background:"rgba(24,51,59,0.25)", border:"1px solid rgba(79,137,147,0.12)" }}
            >
              <div className="font-poster text-4xl md:text-5xl leading-none mb-1" style={{ color, textShadow:`0 0 24px ${color}50` }}>
                <CountUp target={value} />{suffix}
              </div>
              <div className="font-mono text-[0.5rem] tracking-widest mt-1" style={{ color:"rgba(79,137,147,0.5)" }}>{label}</div>
            </motion.div>
          ))}
        </div>

        {/* Two columns */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* Agency breakdown */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-xl p-5"
            style={{ background:"rgba(24,51,59,0.25)", border:"1px solid rgba(79,137,147,0.12)" }}
          >
            <h3 className="font-mono text-[0.6rem] tracking-widest mb-4" style={{ color:"rgba(79,137,147,0.6)" }}>AGENCY BREAKDOWN</h3>
            <div className="space-y-3">
              {Object.entries(agencyCounts).sort((a,b)=>b[1]-a[1]).map(([agency, count]) => (
                <AgencyBar key={agency} agency={agency} count={count} total={STATS.totalDocs} />
              ))}
            </div>
          </motion.div>

          {/* Right column: era + locations */}
          <div className="space-y-4">
            {/* Era timeline */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="rounded-xl p-5"
              style={{ background:"rgba(24,51,59,0.25)", border:"1px solid rgba(79,137,147,0.12)" }}
            >
              <h3 className="font-mono text-[0.6rem] tracking-widest mb-4" style={{ color:"rgba(79,137,147,0.6)" }}>TEMPORAL DISTRIBUTION</h3>
              <div className="space-y-2.5">
                {eraData.map(({ label, range, color }) => {
                  return (
                    <div key={label} className="flex items-center gap-3">
                      <div className="w-16 text-right font-mono text-[0.55rem]" style={{ color }}>{range}</div>
                      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background:"rgba(79,137,147,0.08)" }}>
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${Math.max(((eraCounts[label] || 1) / STATS.totalDocs) * 100, 2)}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.2, ease:"easeOut", delay:0.1 }}
                          className="h-full rounded-full"
                          style={{ background: color }}
                        />
                      </div>
                      <div className="w-8 font-mono text-[0.55rem] text-right" style={{ color:"rgba(79,137,147,0.5)" }}>
                        {eraCounts[label] || "—"}
                      </div>
                    </div>
                  )
                })}
              </div>
            </motion.div>

            {/* Hot locations */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="rounded-xl p-5"
              style={{ background:"rgba(24,51,59,0.25)", border:"1px solid rgba(79,137,147,0.12)" }}
            >
              <h3 className="font-mono text-[0.6rem] tracking-widest mb-4" style={{ color:"rgba(79,137,147,0.6)" }}>HOT ZONES</h3>
              <div className="space-y-2">
                {topLocations.map(([loc, count], i) => (
                  <div key={loc} className="flex items-center gap-3">
                    <span className="font-mono text-[0.55rem] w-4 text-right" style={{ color:"rgba(79,137,147,0.35)" }}>#{i+1}</span>
                    <span className="font-mono text-xs flex-1" style={{ color:"#E9F3F1" }}>{loc}</span>
                    <div className="flex gap-0.5">
                      {Array.from({length: Math.min(count, 12)}).map((_,j) => (
                        <div key={j} className="w-1.5 h-1.5 rounded-sm" style={{ background:"#4F8993", opacity: 0.3 + j*0.06 }} />
                      ))}
                      {count > 12 && <span className="font-mono text-[0.55rem] ml-1" style={{ color:"rgba(79,137,147,0.4)" }}>+{count-12}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Redacted notice */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-4 flex items-center gap-3 rounded-xl p-4"
          style={{ background:"rgba(255,30,30,0.06)", border:"1px solid rgba(255,30,30,0.2)" }}
        >
          <span className="classified-stamp whitespace-nowrap text-[0.6rem]" style={{ color:"rgba(255,30,30,0.8)", borderColor:"rgba(255,30,30,0.4)" }}>
            REDACTED
          </span>
          <p className="font-mono text-[0.65rem]" style={{ color:"rgba(79,137,147,0.6)" }}>
            {STATS.redacted} documents contain partial or full redactions. KALA decoder uses Claude AI to reconstruct context from surrounding text and cross-references.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
