import { useEffect, useMemo, useRef, useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, PerspectiveCamera, Stars } from "@react-three/drei"
import { motion, AnimatePresence } from "framer-motion"
import * as THREE from "three"
import { DOCUMENTS, LOCATIONS, AGENCIES } from "../data/manifest"

const GLOBE_RADIUS = 2.3

function latLngToVector(lat, lng, radius = GLOBE_RADIUS, altitude = 0) {
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lng + 180) * (Math.PI / 180)
  const r = radius + altitude
  return new THREE.Vector3(
    -(r * Math.sin(phi) * Math.cos(theta)),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta)
  )
}

function useIncidentGroups() {
  return useMemo(() => {
    const groups = {}

    DOCUMENTS.forEach((doc) => {
      const loc = LOCATIONS[doc.location]
      if (!loc || doc.location === "Unknown" || doc.location === "Space") return

      if (!groups[doc.location]) {
        groups[doc.location] = {
          loc,
          docs: [],
          location: doc.location,
          vector: latLngToVector(loc.lat, loc.lng, GLOBE_RADIUS, 0.08),
        }
      }

      groups[doc.location].docs.push(doc)
    })

    return Object.values(groups).sort((a, b) => b.docs.length - a.docs.length)
  }, [])
}

function GlobeMesh({ selectedVector }) {
  const globeRef = useRef()

  useFrame((state, delta) => {
    if (!globeRef.current) return

    globeRef.current.rotation.y += delta * 0.08

    if (selectedVector) {
      const targetYaw = Math.atan2(selectedVector.x, selectedVector.z)
      globeRef.current.rotation.y = THREE.MathUtils.lerp(
        globeRef.current.rotation.y,
        targetYaw,
        0.04
      )
    }

    globeRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.18) * 0.05
  })

  return (
    <group ref={globeRef}>
      <mesh>
        <sphereGeometry args={[GLOBE_RADIUS, 64, 64]} />
        <meshStandardMaterial
          color="#0d2430"
          emissive="#11313d"
          emissiveIntensity={0.35}
          metalness={0.2}
          roughness={0.82}
        />
      </mesh>

      <mesh>
        <sphereGeometry args={[GLOBE_RADIUS + 0.03, 64, 64]} />
        <meshStandardMaterial
          color="#4F8993"
          transparent
          opacity={0.08}
          side={THREE.DoubleSide}
        />
      </mesh>

      <lineSegments>
        <edgesGeometry args={[new THREE.SphereGeometry(GLOBE_RADIUS + 0.01, 18, 18)]} />
        <lineBasicMaterial color="#2a5560" transparent opacity={0.22} />
      </lineSegments>
    </group>
  )
}

function IncidentMarkers({ groups, selected, onSelect }) {
  const markerRefs = useRef([])

  useFrame((state) => {
    groups.forEach((group, index) => {
      const marker = markerRefs.current[index]
      if (!marker) return

      const active = selected?.location === group.location
      const scale = active ? 1.3 + Math.sin(state.clock.elapsedTime * 4) * 0.08 : 1
      marker.scale.setScalar(scale)
    })
  })

  return (
    <>
      {groups.map((group, index) => {
        const agencyKey = group.docs[0]?.agency
        const color = AGENCIES[agencyKey]?.color || "#00d4ff"
        const active = selected?.location === group.location
        const radius = THREE.MathUtils.clamp(0.05 + group.docs.length * 0.008, 0.06, 0.18)
        const stemEnd = group.vector.clone().normalize().multiplyScalar(GLOBE_RADIUS + 0.02)

        return (
          <group key={group.location}>
            <line>
              <bufferGeometry
                attach="geometry"
                onUpdate={(geometry) => {
                  geometry.setFromPoints([stemEnd, group.vector])
                }}
              />
              <lineBasicMaterial color={color} transparent opacity={active ? 0.85 : 0.35} />
            </line>

            <mesh
              ref={(node) => {
                markerRefs.current[index] = node
              }}
              position={group.vector}
              onClick={(event) => {
                event.stopPropagation()
                onSelect(group)
              }}
            >
              <sphereGeometry args={[radius, 18, 18]} />
              <meshStandardMaterial
                color={color}
                emissive={color}
                emissiveIntensity={active ? 1.2 : 0.45}
                transparent
                opacity={0.95}
              />
            </mesh>
          </group>
        )
      })}
    </>
  )
}

function GlobeScene({ groups, selected, onSelect }) {
  const selectedVector = selected?.vector || null

  return (
    <>
      <color attach="background" args={["#02070a"]} />
      <fog attach="fog" args={["#02070a", 7, 16]} />
      <ambientLight intensity={0.55} color="#7ab0bf" />
      <directionalLight position={[5, 4, 6]} intensity={1.3} color="#d9f2ff" />
      <pointLight position={[-6, -2, -3]} intensity={0.8} color="#F4B51F" />

      <PerspectiveCamera makeDefault position={[0, 0.8, 7.4]} fov={38} />
      <Stars radius={40} depth={25} count={1800} factor={2.6} saturation={0} fade speed={0.35} />

      <GlobeMesh selectedVector={selectedVector} />
      <IncidentMarkers groups={groups} selected={selected} onSelect={onSelect} />

      <OrbitControls
        enablePan={false}
        minDistance={5}
        maxDistance={9}
        autoRotate={!selected}
        autoRotateSpeed={0.4}
      />
    </>
  )
}

export default function GlobeView() {
  const [selected, setSelected] = useState(null)
  const incidentGroups = useIncidentGroups()
  const totalMapped = incidentGroups.reduce((sum, group) => sum + group.docs.length, 0)

  useEffect(() => {
    if (!selected && incidentGroups.length) {
      setSelected(incidentGroups[0])
    }
  }, [incidentGroups, selected])

  return (
    <section id="globe" className="min-h-screen py-16 px-4 snap-section" style={{ background: "#061116" }}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8 text-center"
        >
          <p className="font-mono text-[0.6rem] tracking-[0.3em] mb-2" style={{ color: "rgba(79,137,147,0.7)" }}>
            GEOGRAPHIC INTELLIGENCE
          </p>
          <h2 className="font-poster text-5xl md:text-6xl tracking-wide" style={{ color: "#E9F3F1" }}>
            Global Incident Map
          </h2>
          <p className="font-mono text-xs mt-2" style={{ color: "rgba(79,137,147,0.5)" }}>
            {incidentGroups.length} zones · {totalMapped} incidents plotted on the Three.js globe
          </p>
          <div className="w-16 h-px mx-auto mt-4" style={{ background: "rgba(244,181,31,0.4)" }} />
        </motion.div>

        <div className="grid md:grid-cols-[1fr_280px] gap-4 items-start">
          <div
            className="relative h-[480px] rounded-2xl overflow-hidden border border-white/5"
            style={{ background: "radial-gradient(circle at 50% 50%, rgba(17,49,61,0.55), #02070a 70%)" }}
          >
            <Canvas
              gl={{ antialias: true }}
              onPointerMissed={() => setSelected(null)}
            >
              <GlobeScene groups={incidentGroups} selected={selected} onSelect={setSelected} />
            </Canvas>

            <div className="absolute top-3 left-3 z-10 space-y-1.5 pointer-events-none">
              {Object.entries(AGENCIES).slice(0, 5).map(([key, { color, label }]) => (
                <div key={key} className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ background: color, boxShadow: `0 0 5px ${color}80` }} />
                  <span className="font-mono text-[0.55rem] text-slate-500">{label}</span>
                </div>
              ))}
            </div>

            <div className="absolute bottom-3 right-3 z-10 font-mono text-[0.5rem] text-slate-700 pointer-events-none text-right">
              <p>drag to orbit · scroll to zoom</p>
              <p>click a beacon to inspect a zone</p>
            </div>
          </div>

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
                      <p className="font-mono text-[0.55rem] tracking-widest" style={{ color: "rgba(79,137,147,0.6)" }}>
                        INCIDENT ZONE
                      </p>
                      <h3 className="font-mono text-sm text-white font-bold mt-0.5">{selected.location}</h3>
                      <p className="font-mono text-[0.6rem] text-slate-600">
                        {selected.docs.length} incidents · {selected.loc.region}
                      </p>
                    </div>
                    <button onClick={() => setSelected(null)} className="text-slate-600 hover:text-slate-400 text-xs ml-2">
                      ×
                    </button>
                  </div>

                  <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
                    {selected.docs.map((doc) => {
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
                    onClick={() => document.getElementById("decoder")?.scrollIntoView({ behavior: "smooth", block: "start" })}
                    className="mt-3 w-full py-1.5 rounded-lg text-xs font-mono border transition-all"
                    style={{ border: "1px solid rgba(244,181,31,0.3)", color: "#F4B51F" }}
                  >
                    DECODE WITH AI →
                  </button>
                </motion.div>
              ) : (
                <motion.div key="empty" className="glass rounded-xl p-4 border border-white/5 text-center">
                  <div className="text-2xl mb-2 opacity-30">⊕</div>
                  <p className="font-mono text-xs text-slate-600">Select a beacon or a zone from the panel</p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="glass rounded-xl p-4 border border-white/5">
              <h4 className="font-mono text-[0.6rem] text-slate-600 tracking-widest mb-3">ACTIVE ZONES</h4>
              <div className="space-y-1.5">
                {incidentGroups.slice(0, 9).map((group) => {
                  const color = AGENCIES[group.docs[0]?.agency]?.color || "#00d4ff"
                  const maxCount = incidentGroups[0]?.docs.length || 1
                  const isActive = selected?.location === group.location

                  return (
                    <button
                      key={group.location}
                      onClick={() => setSelected(group)}
                      className="w-full flex items-center justify-between rounded px-1 py-1 transition-colors"
                      style={isActive ? { background: "rgba(244,181,31,0.06)" } : undefined}
                    >
                      <span className="font-mono text-[0.65rem]" style={{ color: isActive ? "#E9F3F1" : "#94a3b8" }}>
                        {group.location}
                      </span>
                      <div className="flex items-center gap-2">
                        <div
                          className="h-0.5 rounded"
                          style={{ width: `${(group.docs.length / maxCount) * 50}px`, background: `${color}60` }}
                        />
                        <span className="font-mono text-[0.6rem]" style={{ color }}>{group.docs.length}</span>
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
