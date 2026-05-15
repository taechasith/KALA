import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { DOCUMENTS, AGENCIES, TYPES, ERAS } from "../data/manifest"

const TEAL   = "#4F8993"
const SIGNAL = "#F4B51F"
const REC    = "#FF1E1E"
const ERA_COLORS = ["#8fa86b","#6b8cba","#8b6cba","#7fb89e", TEAL, REC]

// ── Pure SVG bar chart ───────────────────────────────────────────────────────
function SVGBarChart({ data, colorFn, height = 160, labelKey = "label", valueKey = "count", tooltip = true }) {
  const [hovered, setHovered] = useState(null)
  const maxVal = Math.max(...data.map(d => d[valueKey]), 1)
  const W = 600, H = height
  const barW = Math.floor(W / data.length) - 3
  const BAR_COLOR = typeof colorFn === "function"

  return (
    <div className="relative w-full" style={{ height: H + 28 }}>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="absolute inset-0 w-full" style={{ height: H }}>
        {/* Grid lines */}
        {[0.25, 0.5, 0.75, 1].map(f => (
          <line key={f} x1={0} y1={H * (1 - f)} x2={W} y2={H * (1 - f)} stroke="#18333B" strokeWidth={1} />
        ))}
        {data.map((d, i) => {
          const bh = Math.max((d[valueKey] / maxVal) * H, 1)
          const x = i * (barW + 3) + 1
          const color = BAR_COLOR ? colorFn(d, i) : colorFn
          return (
            <g key={i}>
              <rect
                x={x} y={H - bh} width={barW} height={bh}
                fill={color}
                fillOpacity={hovered === i ? 1 : 0.75}
                rx={2}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                style={{ cursor:"pointer", transition:"fill-opacity 0.15s" }}
              />
            </g>
          )
        })}
      </svg>
      {/* X-axis labels */}
      <div className="absolute bottom-0 left-0 right-0 flex" style={{ height: 24 }}>
        {data.map((d, i) => (
          <div
            key={i}
            className="flex-1 text-center font-mono leading-none overflow-hidden"
            style={{ fontSize: 8, color: hovered === i ? SIGNAL : "rgba(79,137,147,0.5)" }}
          >
            {d[labelKey]}
          </div>
        ))}
      </div>
      {/* Hover tooltip */}
      {hovered !== null && tooltip && (
        <div
          className="absolute pointer-events-none glass-heavy rounded-lg px-2 py-1.5 font-mono"
          style={{
            bottom: 32,
            left: `${Math.min((hovered / data.length) * 100 + 2, 70)}%`,
            fontSize: 10,
            border: "1px solid rgba(79,137,147,0.3)",
            whiteSpace: "nowrap",
          }}
        >
          <span style={{ color: "#E9F3F1" }}>{data[hovered][labelKey]}: </span>
          <span style={{ color: SIGNAL }}>{data[hovered][valueKey]}</span>
        </div>
      )}
    </div>
  )
}

// ── Timeline ─────────────────────────────────────────────────────────────────
function TimelineChart() {
  const data = useMemo(() => {
    const byYear = {}
    DOCUMENTS.forEach(d => {
      if (!d.year) return
      byYear[d.year] = byYear[d.year] || 0
      byYear[d.year]++
    })
    return Object.entries(byYear)
      .sort((a, b) => +a[0] - +b[0])
      .map(([year, count]) => ({ label: year, count }))
  }, [])

  return (
    <div className="glass rounded-xl p-5" style={{ border:"1px solid rgba(79,137,147,0.15)" }}>
      <p className="font-mono text-[0.55rem] tracking-[0.25em] mb-1" style={{ color:"rgba(79,137,147,0.7)" }}>TEMPORAL DISTRIBUTION</p>
      <h3 className="font-poster text-2xl mb-4" style={{ color:"#E9F3F1" }}>Incidents by Year</h3>
      <SVGBarChart
        data={data}
        colorFn={(_, i) => `hsl(${190 + i * 2}, 50%, ${40 + (i % 3) * 5}%)`}
        height={160}
      />
    </div>
  )
}

// ── Agency donut (CSS conic-gradient) ─────────────────────────────────────────
function AgencyDonut() {
  const [hover, setHover] = useState(null)
  const data = useMemo(() => {
    const counts = {}
    DOCUMENTS.forEach(d => { counts[d.agency] = (counts[d.agency] || 0) + 1 })
    return Object.entries(counts)
      .map(([agency, count]) => ({ agency, count, color: AGENCIES[agency]?.color || "#fff" }))
      .sort((a, b) => b.count - a.count)
  }, [])
  const total = data.reduce((s, d) => s + d.count, 0)

  const gradient = useMemo(() => {
    let deg = 0
    return "conic-gradient(" + data.map((d, i) => {
      const pct = (d.count / total) * 100
      const op = hover === null || hover === i ? "ee" : "33"
      const stop = `${d.color}${op} ${deg.toFixed(1)}% ${(deg + pct).toFixed(1)}%`
      deg += pct
      return stop
    }).join(", ") + ")"
  }, [data, hover, total])

  return (
    <div className="glass rounded-xl p-5" style={{ border:"1px solid rgba(79,137,147,0.15)" }}>
      <p className="font-mono text-[0.55rem] tracking-[0.25em] mb-1" style={{ color:"rgba(79,137,147,0.7)" }}>AGENCY DISTRIBUTION</p>
      <h3 className="font-poster text-2xl mb-4" style={{ color:"#E9F3F1" }}>Document Sources</h3>
      <div className="flex items-center gap-5">
        <div className="relative shrink-0" style={{ width:120, height:120 }}>
          <div className="w-full h-full rounded-full" style={{ background: gradient }} onMouseLeave={() => setHover(null)} />
          <div className="absolute rounded-full flex flex-col items-center justify-center" style={{ inset:22, background:"#061116" }}>
            <p className="font-poster text-xl leading-none" style={{ color: hover !== null ? data[hover]?.color : SIGNAL }}>
              {hover !== null ? data[hover]?.count : total}
            </p>
            <p className="font-mono text-[0.45rem] tracking-widest" style={{ color:"rgba(79,137,147,0.5)" }}>
              {hover !== null ? data[hover]?.agency : "TOTAL"}
            </p>
          </div>
        </div>
        <div className="space-y-2 flex-1 min-w-0">
          {data.map((d, i) => (
            <div
              key={d.agency}
              className="flex items-center gap-2 cursor-pointer rounded px-1 transition-opacity"
              style={{ opacity: hover === null || hover === i ? 1 : 0.35 }}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
            >
              <div className="w-2 h-2 rounded-full shrink-0" style={{ background:d.color }} />
              <span className="font-mono text-[0.6rem] flex-1 truncate" style={{ color:"#E9F3F1" }}>{d.agency}</span>
              <span className="font-poster text-lg leading-none" style={{ color:d.color }}>{d.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Location horizontal bars ──────────────────────────────────────────────────
function LocationBars() {
  const data = useMemo(() => {
    const counts = {}
    DOCUMENTS.forEach(d => { if (d.location!=="Unknown"&&d.location!=="Space") counts[d.location]=(counts[d.location]||0)+1 })
    return Object.entries(counts).sort((a,b)=>b[1]-a[1]).slice(0,10).map(([location,count])=>({location,count}))
  }, [])
  const max = data[0]?.count || 1

  return (
    <div className="glass rounded-xl p-5" style={{ border:"1px solid rgba(79,137,147,0.15)" }}>
      <p className="font-mono text-[0.55rem] tracking-[0.25em] mb-1" style={{ color:"rgba(79,137,147,0.7)" }}>GEOGRAPHIC DENSITY</p>
      <h3 className="font-poster text-2xl mb-4" style={{ color:"#E9F3F1" }}>Top Incident Zones</h3>
      <div className="space-y-2.5">
        {data.map(({ location, count }, i) => (
          <div key={location} className="flex items-center gap-3">
            <span className="font-mono text-[0.6rem] w-28 shrink-0 truncate" style={{ color:"#E9F3F1" }}>{location}</span>
            <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background:"rgba(79,137,147,0.08)" }}>
              <motion.div
                initial={{ width:0 }}
                whileInView={{ width:`${(count/max)*100}%` }}
                viewport={{ once:true }}
                transition={{ duration:0.9, delay: i*0.05, ease:"easeOut" }}
                className="h-full rounded-full"
                style={{ background:`hsl(${195 - i*5}, 55%, ${48 - i*2}%)` }}
              />
            </div>
            <span className="font-poster text-base w-6 text-right leading-none" style={{ color:SIGNAL }}>{count}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Era × Type stacked bars (pure CSS) ───────────────────────────────────────
function EraMatrix() {
  const eraKeys = Object.keys(ERAS)

  const data = useMemo(() =>
    Object.entries(TYPES).map(([type, { label }]) => {
      const eraCounts = {}
      eraKeys.forEach(era => { eraCounts[era] = DOCUMENTS.filter(d=>d.type===type&&d.era===era).length })
      const total = Object.values(eraCounts).reduce((s,v)=>s+v,0)
      return { type: label.split(" ")[0], eraCounts, total }
    }).filter(d => d.total > 0).sort((a,b) => b.total - a.total),
  [])
  const maxTotal = data[0]?.total || 1

  return (
    <div className="glass rounded-xl p-5" style={{ border:"1px solid rgba(79,137,147,0.15)" }}>
      <p className="font-mono text-[0.55rem] tracking-[0.25em] mb-1" style={{ color:"rgba(79,137,147,0.7)" }}>CLASSIFICATION MATRIX</p>
      <h3 className="font-poster text-2xl mb-4" style={{ color:"#E9F3F1" }}>Doc Type × Era</h3>
      <div className="space-y-2">
        {data.slice(0,10).map(({ type, eraCounts, total }, i) => (
          <div key={type} className="flex items-center gap-3">
            <span className="font-mono text-[0.55rem] w-20 shrink-0 truncate" style={{ color:"rgba(233,243,241,0.6)" }}>{type}</span>
            <div className="flex-1 h-3 rounded overflow-hidden flex" style={{ background:"rgba(79,137,147,0.06)" }}>
              {eraKeys.map((era, ei) => {
                const pct = (eraCounts[era] / total) * 100
                return pct > 0 ? (
                  <motion.div
                    key={era}
                    initial={{ width:0 }}
                    whileInView={{ width:`${(eraCounts[era]/maxTotal)*100}%` }}
                    viewport={{ once:true }}
                    transition={{ duration:0.8, delay:i*0.04+ei*0.02, ease:"easeOut" }}
                    className="h-full"
                    style={{ background: ERA_COLORS[ei], minWidth:2 }}
                    title={`${ERAS[era]?.label}: ${eraCounts[era]}`}
                  />
                ) : null
              })}
            </div>
            <span className="font-poster text-sm w-5 text-right leading-none" style={{ color:"rgba(79,137,147,0.6)" }}>{total}</span>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-3 mt-3 pt-3" style={{ borderTop:"1px solid rgba(79,137,147,0.08)" }}>
        {eraKeys.map((k, i) => (
          <div key={k} className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full" style={{ background:ERA_COLORS[i] }} />
            <span className="font-mono text-[0.5rem]" style={{ color:"rgba(79,137,147,0.5)" }}>{ERAS[k]?.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Key correlations panel ────────────────────────────────────────────────────
function KeyCorrelations() {
  const stats = useMemo(() => {
    const byAgency={}, byLoc={}, byYear={}
    DOCUMENTS.forEach(d => {
      byAgency[d.agency]=(byAgency[d.agency]||0)+1
      if(d.location!=="Unknown"&&d.location!=="Space") byLoc[d.location]=(byLoc[d.location]||0)+1
      if(d.year) byYear[d.year]=(byYear[d.year]||0)+1
    })
    return {
      topAgency:   Object.entries(byAgency).sort((a,b)=>b[1]-a[1])[0],
      topLocation: Object.entries(byLoc).sort((a,b)=>b[1]-a[1])[0],
      topYear:     Object.entries(byYear).sort((a,b)=>b[1]-a[1])[0],
    }
  }, [])

  return (
    <div className="glass rounded-xl p-5" style={{ border:"1px solid rgba(79,137,147,0.15)" }}>
      <p className="font-mono text-[0.55rem] tracking-[0.25em] mb-4" style={{ color:"rgba(79,137,147,0.7)" }}>KEY CORRELATIONS</p>
      <div className="space-y-5">
        {[
          { label:"PEAK AGENCY",   value:stats.topAgency?.[0],   sub:`${stats.topAgency?.[1]} docs`,     color: AGENCIES[stats.topAgency?.[0]]?.color||SIGNAL },
          { label:"HOTSPOT",       value:stats.topLocation?.[0], sub:`${stats.topLocation?.[1]} incidents`, color: TEAL },
          { label:"PEAK YEAR",     value:stats.topYear?.[0],     sub:`${stats.topYear?.[1]} records`,    color: SIGNAL },
          { label:"REDACTED",      value:`${DOCUMENTS.filter(d=>d.redacted).length}`, sub:"files withheld", color: REC },
        ].map(({ label, value, sub, color }) => (
          <div key={label}>
            <p className="font-mono text-[0.45rem] tracking-widest mb-0.5" style={{ color:"rgba(79,137,147,0.45)" }}>{label}</p>
            <p className="font-poster text-3xl leading-none" style={{ color }}>{value}</p>
            <p className="font-mono text-[0.5rem] mt-0.5" style={{ color:"rgba(233,243,241,0.35)" }}>{sub}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Main export ───────────────────────────────────────────────────────────────
export default function DataCorrelation() {
  return (
    <section className="min-h-screen py-16 px-4" style={{ background:"rgba(6,17,22,0.72)" }}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity:0, y:20 }}
          whileInView={{ opacity:1, y:0 }}
          viewport={{ once:true }}
          className="mb-8 text-center"
        >
          <p className="font-mono text-[0.6rem] tracking-[0.3em] mb-2" style={{ color:"rgba(79,137,147,0.7)" }}>INTELLIGENCE ANALYTICS</p>
          <h2 className="font-poster text-5xl md:text-6xl tracking-wide" style={{ color:"#E9F3F1" }}>Data Correlation</h2>
          <p className="font-mono text-xs mt-2 max-w-md mx-auto" style={{ color:"rgba(79,137,147,0.5)" }}>
            Pattern analysis across {DOCUMENTS.length} declassified documents
          </p>
          <div className="w-16 h-px mx-auto mt-4" style={{ background: SIGNAL+"60" }} />
        </motion.div>

        <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} className="mb-4">
          <TimelineChart />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:0.1 }}>
            <AgencyDonut />
          </motion.div>
          <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:0.15 }}>
            <LocationBars />
          </motion.div>
        </div>

        <div className="grid md:grid-cols-[1fr_200px] gap-4">
          <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:0.2 }}>
            <EraMatrix />
          </motion.div>
          <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:0.25 }}>
            <KeyCorrelations />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
