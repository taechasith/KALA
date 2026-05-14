import { useState, useMemo } from "react"
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet"
import { motion, AnimatePresence } from "framer-motion"
import { DOCUMENTS, LOCATIONS, AGENCIES } from "../data/manifest"
import "leaflet/dist/leaflet.css"

function useIncidentGroups() {
  return useMemo(() => {
    const groups = {}
    DOCUMENTS.forEach(doc => {
      const loc = LOCATIONS[doc.location]
      if (!loc || !loc.lat || doc.location === "Unknown" || doc.location === "Space") return
      if (!groups[doc.location]) groups[doc.location] = { loc, docs: [], location: doc.location }
      groups[doc.location].docs.push(doc)
    })
    return Object.values(groups).sort((a, b) => b.docs.length - a.docs.length)
  }, [])
}

export default function GlobeView() {
  const [selected, setSelected] = useState(null)
  const incidentGroups = useIncidentGroups()
  const totalMapped = incidentGroups.reduce((s, g) => s + g.docs.length, 0)

  return (
    <section id="globe" className="min-h-screen py-16 px-4 snap-section" style={{ background:"#061116" }}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8 text-center"
        >
          <p className="font-mono text-[0.6rem] tracking-[0.3em] mb-2" style={{ color:"rgba(79,137,147,0.7)" }}>GEOGRAPHIC INTELLIGENCE</p>
          <h2 className="font-poster text-5xl md:text-6xl tracking-wide" style={{ color:"#E9F3F1" }}>
            Global Incident Map
          </h2>
          <p className="font-mono text-xs mt-2" style={{ color:"rgba(79,137,147,0.5)" }}>{incidentGroups.length} zones · {totalMapped} incidents mapped</p>
          <div className="w-16 h-px mx-auto mt-4" style={{ background:"rgba(244,181,31,0.4)" }} />
        </motion.div>

        <div className="grid md:grid-cols-[1fr_280px] gap-4 items-start">
          {/* Map */}
          <div className="relative h-[480px] rounded-2xl overflow-hidden border border-white/5" style={{ background:"#000" }}>
            <MapContainer
              center={[25, 45]}
              zoom={3}
              style={{ height: "100%", width: "100%", background: "#000" }}
              zoomControl={true}
              attributionControl={false}
              className="kala-map"
            >
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                subdomains="abcd"
                maxZoom={19}
              />
              {incidentGroups.map(group => {
                const agencyKey = group.docs[0]?.agency
                const color = AGENCIES[agencyKey]?.color || "#00d4ff"
                const radius = Math.min(Math.max(group.docs.length * 4, 7), 24)
                return (
                  <CircleMarker
                    key={group.location}
                    center={[group.loc.lat, group.loc.lng]}
                    radius={radius}
                    pathOptions={{
                      fillColor: color,
                      fillOpacity: 0.65,
                      color: color,
                      weight: 1.5,
                      opacity: 0.9,
                    }}
                    eventHandlers={{
                      click: () => setSelected(g => g?.location === group.location ? null : group),
                    }}
                  >
                    <Popup className="kala-popup">
                      <div style={{
                        fontFamily: "monospace", background: "#0a0a0a", color: "#e2e8f0",
                        padding: "10px 12px", minWidth: "190px", borderRadius: "8px"
                      }}>
                        <p style={{ color, fontSize: "0.6rem", letterSpacing: "0.15em", marginBottom: "6px" }}>{group.location}</p>
                        <p style={{ fontSize: "0.75rem", fontWeight: "bold", marginBottom: "6px" }}>{group.docs.length} incidents</p>
                        {group.docs.slice(0, 4).map(d => (
                          <p key={d.id} style={{ fontSize: "0.55rem", color: "#64748b", marginBottom: "2px" }}>
                            {d.id} — {d.year || "DATE UNK"}
                          </p>
                        ))}
                        {group.docs.length > 4 && (
                          <p style={{ fontSize: "0.5rem", color: "#334155", marginTop: "4px" }}>+{group.docs.length - 4} more</p>
                        )}
                      </div>
                    </Popup>
                  </CircleMarker>
                )
              })}
            </MapContainer>

            {/* Agency legend */}
            <div className="absolute top-3 left-3 z-[500] space-y-1.5 pointer-events-none">
              {Object.entries(AGENCIES).slice(0, 5).map(([key, { color, label }]) => (
                <div key={key} className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ background: color, boxShadow: `0 0 5px ${color}80` }} />
                  <span className="font-mono text-[0.55rem] text-slate-500">{label}</span>
                </div>
              ))}
            </div>

            <div className="absolute bottom-3 right-3 z-[500] font-mono text-[0.5rem] text-slate-700 pointer-events-none">
              click markers · scroll to zoom
            </div>
          </div>

          {/* Side panel */}
          <div className="space-y-3">
            <AnimatePresence mode="wait">
              {selected ? (
                <motion.div
                  key={selected.location}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="glass rounded-xl p-4 border border-white/5"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-mono text-[0.55rem] font-mono text-[0.55rem] tracking-widest" style={{ color:"rgba(79,137,147,0.6)" }}>INCIDENT ZONE</p>
                      <h3 className="font-mono text-sm text-white font-bold mt-0.5">{selected.location}</h3>
                      <p className="font-mono text-[0.6rem] text-slate-600">{selected.docs.length} incidents · {selected.loc.region}</p>
                    </div>
                    <button onClick={() => setSelected(null)} className="text-slate-600 hover:text-slate-400 text-xs ml-2">✕</button>
                  </div>
                  <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
                    {selected.docs.map(doc => {
                      const color = AGENCIES[doc.agency]?.color || "#fff"
                      return (
                        <div key={doc.id} className="flex items-start gap-2 py-1 border-b border-white/5 last:border-0">
                          <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: color }} />
                          <div className="min-w-0">
                            <p className="font-mono text-[0.6rem] text-white leading-tight">{doc.title}</p>
                            <p className="font-mono text-[0.5rem] text-slate-600">{doc.agency} · {doc.year || "DATE UNK"}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  <button
                    onClick={() => document.getElementById("decoder")?.scrollIntoView({ behavior: "smooth" })}
                    className="mt-3 w-full py-1.5 rounded-lg text-xs font-mono border font-mono text-xs transition-all" style={{ border:"1px solid rgba(244,181,31,0.3)", color:"#F4B51F" }}
                  >
                    DECODE WITH AI →
                  </button>
                </motion.div>
              ) : (
                <motion.div key="empty" className="glass rounded-xl p-4 border border-white/5 text-center">
                  <div className="text-2xl mb-2 opacity-30">⊕</div>
                  <p className="font-mono text-xs text-slate-600">Click any marker to inspect incident zone</p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="glass rounded-xl p-4 border border-white/5">
              <h4 className="font-mono text-[0.6rem] text-slate-600 tracking-widest mb-3">ACTIVE ZONES</h4>
              <div className="space-y-1.5">
                {incidentGroups.slice(0, 9).map(g => {
                  const color = AGENCIES[g.docs[0]?.agency]?.color || "#00d4ff"
                  const maxCount = incidentGroups[0].docs.length
                  return (
                    <button
                      key={g.location}
                      onClick={() => setSelected(s => s?.location === g.location ? null : g)}
                      className="w-full flex items-center justify-between hover:bg-white/3 rounded px-1 py-0.5 transition-colors"
                    >
                      <span className="font-mono text-[0.65rem] text-slate-400">{g.location}</span>
                      <div className="flex items-center gap-2">
                        <div
                          className="h-0.5 rounded"
                          style={{ width: `${(g.docs.length / maxCount) * 50}px`, background: color + "60" }}
                        />
                        <span className="font-mono text-[0.6rem]" style={{ color }}>{g.docs.length}</span>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
