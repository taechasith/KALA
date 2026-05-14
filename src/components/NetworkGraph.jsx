import { useRef, useEffect, useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import * as d3 from "d3"
import { DOCUMENTS, AGENCIES, computeRelations } from "../data/manifest"

const AGENCY_COLORS = Object.fromEntries(
  Object.entries(AGENCIES).map(([k, v]) => [k, v.color])
)

const RELATION_LABELS = {
  location: "shared location",
  agency: "same agency",
  era: "same era",
  type: "same type",
}

export default function NetworkGraph() {
  const svgRef = useRef()
  const containerRef = useRef()
  const [selected, setSelected] = useState(null)
  const [tooltip, setTooltip] = useState(null)
  const [filter, setFilter] = useState("ALL")
  const [relationMode, setRelationMode] = useState("location")
  const [dimensions, setDimensions] = useState({ w: 800, h: 500 })

  const filteredDocs = useMemo(() =>
    filter === "ALL" ? DOCUMENTS : DOCUMENTS.filter(d => d.agency === filter),
  [filter])

  const relations = useMemo(() => computeRelations(filteredDocs), [filteredDocs])

  useEffect(() => {
    const obs = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect
      setDimensions({ w: Math.max(width, 300), h: Math.max(height, 300) })
    })
    if (containerRef.current) obs.observe(containerRef.current)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    const { w, h } = dimensions
    const svg = d3.select(svgRef.current)
    svg.selectAll("*").remove()

    const docMap = Object.fromEntries(filteredDocs.map(d => [d.id, d]))

    const nodes = filteredDocs.map(d => ({
      id: d.id,
      doc: d,
      r: Math.min(Math.max(Math.sqrt(d.size / 1e5) * 0.8, 4), 13),
    }))

    const filteredLinks = relations
      .filter(r => docMap[r.source] && docMap[r.target])
      .slice(0, 300)
      .map(r => ({ ...r }))

    // Arrow marker defs — one per agency color + default
    const defs = svg.append("defs")
    const markerAgencies = [...Object.keys(AGENCIES), "default"]
    markerAgencies.forEach(agency => {
      const color = AGENCY_COLORS[agency] || "#64748b"
      defs.append("marker")
        .attr("id", `arrow-${agency}`)
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 10)
        .attr("refY", 0)
        .attr("markerWidth", 5)
        .attr("markerHeight", 5)
        .attr("orient", "auto")
        .append("path")
        .attr("d", "M0,-5L10,0L0,5")
        .attr("fill", color)
        .attr("opacity", 0.5)
    })

    const sim = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(filteredLinks).id(d => d.id).distance(55).strength(0.12))
      .force("charge", d3.forceManyBody().strength(-70))
      .force("center", d3.forceCenter(w / 2, h / 2))
      .force("collision", d3.forceCollide(d => d.r + 4))
      .force("x", d3.forceX(w / 2).strength(0.04))
      .force("y", d3.forceY(h / 2).strength(0.04))

    const g = svg.append("g")

    const zoom = d3.zoom()
      .scaleExtent([0.15, 6])
      .on("zoom", e => g.attr("transform", e.transform))
    svg.call(zoom)

    // Links as lines with arrow markers
    const linkSel = g.append("g").attr("class", "links")
      .selectAll("line")
      .data(filteredLinks)
      .join("line")
      .attr("stroke", d => {
        const id = typeof d.source === "object" ? d.source.id : d.source
        return AGENCY_COLORS[docMap[id]?.agency] || "#64748b"
      })
      .attr("stroke-opacity", 0.18)
      .attr("stroke-width", d => Math.max(Math.sqrt(d.weight) * 0.6, 0.5))
      .attr("marker-end", d => {
        const id = typeof d.source === "object" ? d.source.id : d.source
        const agency = docMap[id]?.agency
        return `url(#arrow-${agency || "default"})`
      })
      .on("mouseenter", function(event, d) {
        d3.select(this).attr("stroke-opacity", 0.7).attr("stroke-width", d => Math.max(Math.sqrt(d.weight) * 1.2, 1.5))
        const srcId = typeof d.source === "object" ? d.source.id : d.source
        const tgtId = typeof d.target === "object" ? d.target.id : d.target
        setTooltip({
          x: event.offsetX,
          y: event.offsetY,
          text: `${srcId} → ${tgtId}`,
          sub: `${RELATION_LABELS[d.type] || d.type} · weight ${d.weight.toFixed(1)}`
        })
      })
      .on("mouseleave", function() {
        d3.select(this).attr("stroke-opacity", 0.18).attr("stroke-width", d => Math.max(Math.sqrt(d.weight) * 0.6, 0.5))
        setTooltip(null)
      })

    // Nodes
    const nodeSel = g.append("g").attr("class", "nodes")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .style("cursor", "pointer")
      .call(d3.drag()
        .on("start", (e, d) => { if (!e.active) sim.alphaTarget(0.3).restart(); d.fx = d.x; d.fy = d.y })
        .on("drag",  (e, d) => { d.fx = e.x; d.fy = e.y })
        .on("end",   (e, d) => { if (!e.active) sim.alphaTarget(0); d.fx = null; d.fy = null })
      )
      .on("click", (_, d) => setSelected(s => s?.id === d.doc.id ? null : d.doc))
      .on("mouseenter", function(event, d) {
        d3.select(this).select("circle.main").attr("fill-opacity", 1)
        // Highlight connected edges
        linkSel.attr("stroke-opacity", l => {
          const sid = typeof l.source === "object" ? l.source.id : l.source
          const tid = typeof l.target === "object" ? l.target.id : l.target
          return (sid === d.id || tid === d.id) ? 0.8 : 0.05
        })
        setTooltip({ x: event.offsetX, y: event.offsetY, text: d.doc.title, sub: `${d.doc.agency} · ${d.doc.year || "DATE UNK"} · ${d.doc.location}` })
      })
      .on("mouseleave", function() {
        d3.select(this).select("circle.main").attr("fill-opacity", 0.75)
        linkSel.attr("stroke-opacity", 0.18)
        setTooltip(null)
      })

    // Outer glow ring
    nodeSel.append("circle")
      .attr("class", "ring")
      .attr("r", d => d.r + 3)
      .attr("fill", "none")
      .attr("stroke", d => AGENCY_COLORS[d.doc.agency] || "#ffffff")
      .attr("stroke-opacity", 0.15)
      .attr("stroke-width", 1)

    // Main circle
    nodeSel.append("circle")
      .attr("class", "main")
      .attr("r", d => d.r)
      .attr("fill", d => AGENCY_COLORS[d.doc.agency] || "#ffffff")
      .attr("fill-opacity", 0.75)

    // Redacted marker
    nodeSel.filter(d => d.doc.redacted)
      .append("circle")
      .attr("r", 2)
      .attr("fill", "#ff4444")
      .attr("cx", d => d.r - 2)
      .attr("cy", d => -(d.r - 2))

    sim.on("tick", () => {
      linkSel
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => {
          const dx = d.target.x - d.source.x
          const dy = d.target.y - d.source.y
          const dist = Math.sqrt(dx*dx + dy*dy) || 1
          return d.target.x - (dx / dist) * (d.target.r + 8)
        })
        .attr("y2", d => {
          const dx = d.target.x - d.source.x
          const dy = d.target.y - d.source.y
          const dist = Math.sqrt(dx*dx + dy*dy) || 1
          return d.target.y - (dy / dist) * (d.target.r + 8)
        })
      nodeSel.attr("transform", d => `translate(${d.x},${d.y})`)
    })

    return () => sim.stop()
  }, [filteredDocs, relations, dimensions])

  return (
    <section id="network" className="min-h-screen py-16 px-4 snap-section" style={{ background:"#061116" }}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-6 text-center"
        >
          <p className="font-mono text-[0.6rem] tracking-[0.3em] mb-2" style={{ color:"rgba(79,137,147,0.7)" }}>GITNEXUS — RELATIONAL INTELLIGENCE</p>
          <h2 className="font-poster text-5xl md:text-6xl tracking-wide" style={{ color:"#E9F3F1" }}>
            Document Network
          </h2>
          <p className="font-mono text-xs mt-2 max-w-lg mx-auto" style={{ color:"rgba(79,137,147,0.5)" }}>
            Nodes = documents · arrows show data relationships · size ∝ file size · drag to explore
          </p>
          <div className="w-16 h-px mx-auto mt-4" style={{ background:"rgba(244,181,31,0.4)" }} />
        </motion.div>

        {/* Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex flex-wrap gap-2">
            {["ALL", ...Object.keys(AGENCIES)].map(a => (
              <button
                key={a}
                onClick={() => setFilter(a)}
                className="px-3 py-1 rounded-full font-mono text-xs border transition-all"
                style={
                  filter === a && a !== "ALL"
                    ? { borderColor: AGENCIES[a]?.color + "60", color: AGENCIES[a]?.color, background: AGENCIES[a]?.color + "14" }
                    : filter === a
                    ? { borderColor:"rgba(244,181,31,0.5)", background:"rgba(244,181,31,0.1)", color:"#F4B51F" }
                    : { borderColor:"rgba(79,137,147,0.12)", color:"rgba(79,137,147,0.5)" }
                }
              >
                {a === "ALL" ? "ALL" : AGENCIES[a]?.icon + " " + a}
              </button>
            ))}
          </div>
          <div className="flex gap-1.5">
            {Object.entries(RELATION_LABELS).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setRelationMode(key)}
                className={`px-2 py-0.5 rounded font-mono text-[0.6rem] border transition-all ${
                  relationMode === key
                    ? "border-indigo-500/50 bg-indigo-500/15 text-indigo-400"
                    : "border-white/10 text-slate-700 hover:text-slate-500"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-[1fr_260px] gap-4">
          {/* Graph */}
          <div
            ref={containerRef}
            className="relative h-[440px] md:h-[520px] glass rounded-2xl overflow-hidden border border-white/5"
          >
            <svg ref={svgRef} width="100%" height="100%" />

            {/* Tooltip */}
            <AnimatePresence>
              {tooltip && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute pointer-events-none z-10 glass-heavy rounded-lg px-3 py-2 border border-white/10 max-w-[220px]"
                  style={{ left: Math.min(tooltip.x + 12, dimensions.w - 240), top: Math.max(tooltip.y - 50, 8) }}
                >
                  <p className="font-mono text-[0.65rem] text-white leading-snug">{tooltip.text}</p>
                  <p className="font-mono text-[0.55rem] text-slate-500 mt-0.5">{tooltip.sub}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Legend */}
            <div className="absolute bottom-3 left-3 font-mono text-[0.5rem] text-slate-700 space-y-0.5 pointer-events-none">
              <p>{filteredDocs.length} nodes · {Math.min(relations.length, 300)} edges</p>
              <p>→ arrows show direction of relationship</p>
              <p>scroll to zoom · drag to pan</p>
            </div>

            {/* Arrow legend */}
            <div className="absolute top-3 right-3 space-y-1 pointer-events-none">
              <p className="font-mono text-[0.5rem] text-slate-700 mb-1">edge types</p>
              {Object.entries(RELATION_LABELS).map(([k, v]) => (
                <div key={k} className="flex items-center gap-1.5">
                  <div className="w-6 h-px bg-cyan-500/40" />
                  <span className="font-mono text-[0.5rem] text-slate-700">{v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Detail panel */}
          <div className="space-y-3">
            <AnimatePresence mode="wait">
              {selected ? (
                <motion.div
                  key={selected.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="glass rounded-xl p-4 border border-white/5"
                  style={{ borderColor: (AGENCIES[selected.agency]?.color || "#fff") + "30" }}
                >
                  <div className="flex justify-between items-start mb-3">
                    <span className="font-mono text-[0.55rem] tracking-widest" style={{ color: AGENCIES[selected.agency]?.color }}>
                      {selected.agency} · {selected.id}
                    </span>
                    <button onClick={() => setSelected(null)} className="text-slate-700 hover:text-slate-400 text-xs">✕</button>
                  </div>
                  <h3 className="font-mono text-sm text-white font-bold mb-3 leading-snug">{selected.title}</h3>
                  <div className="space-y-1.5 text-xs font-mono">
                    {[
                      ["TYPE",     selected.type.replace(/-/g," ").toUpperCase()],
                      ["YEAR",     selected.year || "UNKNOWN"],
                      ["LOCATION", selected.location],
                      ["ERA",      selected.era || "—"],
                      ["SIZE",     `${(selected.size/1024).toFixed(0)} KB`],
                    ].map(([k, v]) => (
                      <div key={k} className="flex gap-2">
                        <span className="text-slate-700 shrink-0 w-16">{k}</span>
                        <span className="text-slate-400">{v}</span>
                      </div>
                    ))}
                  </div>
                  {selected.redacted && (
                    <div className="mt-2">
                      <span className="classified-stamp agency-FBI text-[0.55rem]">REDACTED</span>
                    </div>
                  )}
                  {/* Related docs */}
                  <div className="mt-3 pt-3 border-t border-white/5">
                    <p className="font-mono text-[0.55rem] text-slate-700 mb-2">RELATED DOCS</p>
                    <div className="space-y-1 max-h-28 overflow-y-auto">
                      {relations
                        .filter(r => r.source === selected.id || r.target === selected.id)
                        .slice(0, 5)
                        .map(r => {
                          const otherId = r.source === selected.id ? r.target : r.source
                          const other = DOCUMENTS.find(d => d.id === otherId)
                          if (!other) return null
                          return (
                            <button
                              key={otherId}
                              onClick={() => setSelected(other)}
                              className="w-full text-left flex items-center gap-2 group"
                            >
                              <div className="w-1 h-1 rounded-full shrink-0" style={{ background: AGENCIES[other.agency]?.color || "#fff" }} />
                              <span className="font-mono text-[0.55rem] text-slate-600 group-hover:text-slate-400 transition-colors truncate">
                                {otherId} · {RELATION_LABELS[r.type]}
                              </span>
                            </button>
                          )
                        })}
                    </div>
                  </div>
                  <button
                    onClick={() => document.getElementById("decoder")?.scrollIntoView({ behavior:"smooth" })}
                    className="mt-3 w-full py-1.5 rounded-lg text-xs font-mono border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 transition-all"
                  >
                    DECODE →
                  </button>
                </motion.div>
              ) : (
                <motion.div key="empty" className="glass rounded-xl p-4 border border-white/5 text-center">
                  <div className="text-2xl mb-2 opacity-30">⬡</div>
                  <p className="font-mono text-xs text-slate-600">Click a node to inspect</p>
                  <p className="font-mono text-[0.55rem] text-slate-700 mt-2">Hover edges to see relationship type</p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="glass rounded-xl p-4 border border-white/5">
              <h4 className="font-mono text-[0.6rem] text-slate-600 tracking-widest mb-3">NETWORK STATS</h4>
              <div className="space-y-1.5 text-xs font-mono">
                <div className="flex justify-between"><span className="text-slate-600">Nodes</span><span className="text-slate-400">{filteredDocs.length}</span></div>
                <div className="flex justify-between"><span className="text-slate-600">Edges</span><span className="text-slate-400">{Math.min(relations.length, 300)}</span></div>
                <div className="flex justify-between"><span className="text-slate-600">Communities</span><span className="text-slate-400">{Object.keys(AGENCIES).length}</span></div>
                <div className="flex justify-between"><span className="text-slate-600">Arrow</span><span className="text-slate-400">→ directed</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
