import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { STATS } from "../data/manifest"
import GlobalSpaceship from "./GlobalSpaceship"

function TypeWriter({ text, onDone }) {
  const [displayed, setDisplayed] = useState("")

  useEffect(() => {
    let i = 0
    const iv = setInterval(() => {
      setDisplayed(text.slice(0, i + 1))
      i++
      if (i >= text.length) {
        clearInterval(iv)
        onDone?.()
      }
    }, 55)

    return () => clearInterval(iv)
  }, [text, onDone])

  return <>{displayed}<span className="cursor" style={{ color: "#F4B51F" }}>▌</span></>
}

function Timestamp() {
  const [ts, setTs] = useState("")

  useEffect(() => {
    const tick = () => setTs(new Date().toISOString().replace("T", " ").slice(0, 19) + " UTC")
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  return <span>{ts}</span>
}

function Mountains() {
  return (
    <svg
      className="absolute bottom-0 left-0 w-full pointer-events-none"
      viewBox="0 0 1440 280"
      preserveAspectRatio="none"
      style={{ zIndex: 5 }}
    >
      <defs>
        <linearGradient id="fogGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#18333B" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#18333B" stopOpacity="0.5" />
        </linearGradient>
      </defs>
      <path
        d="M0,280 L0,140 L90,90 L180,120 L270,60 L360,100 L450,50 L540,95 L630,40 L720,85 L810,35 L900,80 L990,45 L1080,90 L1170,55 L1260,100 L1350,70 L1440,110 L1440,280 Z"
        fill="#18333B"
        opacity="0.45"
      />
      <path
        d="M0,280 L0,180 L80,130 L160,165 L260,105 L360,150 L460,110 L560,145 L660,95 L760,135 L860,100 L960,140 L1060,110 L1160,145 L1260,120 L1360,155 L1440,130 L1440,280 Z"
        fill="#0d2028"
        opacity="0.8"
      />
      <path
        d="M0,280 L0,220 L70,195 L140,215 L220,180 L300,210 L390,175 L480,205 L570,185 L660,215 L750,180 L840,210 L930,190 L1020,215 L1110,195 L1200,215 L1290,200 L1380,220 L1440,210 L1440,280 Z"
        fill="#061116"
      />
      <path
        d="M0,280 L0,245 C180,235 360,248 540,240 C720,232 900,245 1080,238 C1260,231 1350,244 1440,240 L1440,280 Z"
        fill="url(#fogGrad)"
      />
    </svg>
  )
}

export default function HeroSection() {
  const [phase, setPhase] = useState(0)
  const [showStats, setShowStats] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)")
    const updateMotion = () => setReducedMotion(media.matches)
    updateMotion()
    media.addEventListener("change", updateMotion)
    return () => media.removeEventListener("change", updateMotion)
  }, [])

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 600)
    const t2 = setTimeout(() => setPhase(2), 1700)
    const t3 = setTimeout(() => setShowStats(true), 2900)
    return () => [t1, t2, t3].forEach(clearTimeout)
  }, [])

  const scrollToVault = () => document.getElementById("vault")?.scrollIntoView({ behavior: "smooth" })
  const scrollToDecoder = () => document.getElementById("decoder")?.scrollIntoView({ behavior: "smooth" })

  return (
    <section
      className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden snap-section scanline"
      style={{ background: "rgba(6,17,22,0.76)" }}
    >
      <GlobalSpaceship className="absolute inset-0" zIndex={1} />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(circle at 70% 35%, rgba(79,137,147,0.18), transparent 32%), radial-gradient(ellipse at 50% 80%, rgba(24,51,59,0.25) 0%, transparent 65%)",
          zIndex: 2,
        }}
      />

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 50% 50%, transparent 28%, rgba(6,17,22,0.76) 100%)",
          zIndex: 3,
        }}
      />

      <motion.div
        className="absolute -right-12 top-[18%] h-[34vh] w-[34vh] rounded-full pointer-events-none"
        style={{
          zIndex: 4,
          background: "radial-gradient(circle, rgba(244,181,31,0.16), transparent 65%)",
          filter: "blur(18px)",
        }}
        animate={reducedMotion ? undefined : { y: [0, 16, 0], opacity: [0.45, 0.7, 0.45] }}
        transition={{ repeat: Infinity, duration: 5.5, ease: "easeInOut" }}
      />

      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 md:px-8 py-4 pointer-events-none" style={{ zIndex: 10 }}>
        <div className="flex items-center gap-2">
          <div className="rec-dot" />
          <span className="font-mono text-[0.65rem] tracking-widest" style={{ color: "#FF1E1E" }}>REC</span>
        </div>
        <div className="font-mono text-[0.55rem] tracking-wider" style={{ color: "rgba(79,137,147,0.6)" }}>
          <Timestamp />
        </div>
        <div className="font-mono text-[0.55rem] tracking-wider" style={{ color: "rgba(244,181,31,0.5)" }}>
          PURSUE · RELEASE 1
        </div>
      </div>

      <div className="absolute pointer-events-none" style={{ top: "12%", left: "5%", width: 28, height: 28, borderTop: "2px solid rgba(244,181,31,0.35)", borderLeft: "2px solid rgba(244,181,31,0.35)", zIndex: 10 }} />
      <div className="absolute pointer-events-none" style={{ top: "12%", right: "5%", width: 28, height: 28, borderTop: "2px solid rgba(244,181,31,0.35)", borderRight: "2px solid rgba(244,181,31,0.35)", zIndex: 10 }} />
      <div className="absolute pointer-events-none" style={{ bottom: "22%", left: "5%", width: 28, height: 28, borderBottom: "2px solid rgba(244,181,31,0.35)", borderLeft: "2px solid rgba(244,181,31,0.35)", zIndex: 10 }} />
      <div className="absolute pointer-events-none" style={{ bottom: "22%", right: "5%", width: 28, height: 28, borderBottom: "2px solid rgba(244,181,31,0.35)", borderRight: "2px solid rgba(244,181,31,0.35)", zIndex: 10 }} />

      <div className="relative text-center px-4 max-w-5xl mx-auto" style={{ zIndex: 10 }}>
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: phase >= 1 ? 1 : 0, y: phase >= 1 ? 0 : -12 }}
          transition={{ duration: 0.7 }}
          className="inline-flex items-center gap-3 mb-6"
        >
          <div className="h-px w-8 opacity-50" style={{ background: "#4F8993" }} />
          <span className="classified-stamp text-[0.6rem] tracking-[0.2em]" style={{ color: "rgba(244,181,31,0.6)", borderColor: "rgba(244,181,31,0.3)" }}>
            DECLASSIFIED · PURSUE 2026
          </span>
          <div className="h-px w-8 opacity-50" style={{ background: "#4F8993" }} />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: phase >= 1 ? 1 : 0, y: 0, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="font-poster leading-none mb-3 tracking-wider glow-signal"
          style={{
            fontSize: "clamp(5.5rem, 22vw, 16rem)",
            color: "#F4B51F",
            letterSpacing: "0.08em",
          }}
        >
          KALA
        </motion.h1>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: phase >= 1 ? 1 : 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="w-full max-w-sm mx-auto h-px mb-4"
          style={{ background: "linear-gradient(90deg, transparent, #4F8993, transparent)" }}
        />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: phase >= 2 ? 1 : 0 }}
          className="font-mono text-[clamp(0.55rem,2vw,0.8rem)] tracking-[0.3em] mb-2"
          style={{ color: "rgba(79,137,147,0.8)" }}
        >
          {phase >= 2 && <TypeWriter text="PURSUING UNRESOLVED PHENOMENA · ARCHIVE 1944-2026" />}
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: phase >= 2 ? 0.45 : 0 }}
          className="font-mono text-[0.6rem] mb-8 tracking-widest"
          style={{ color: "#E9F3F1" }}
        >
          TIME · FATE · THE ABSOLUTE
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: phase >= 2 ? 1 : 0, y: phase >= 2 ? 0 : 20 }}
          transition={{ delay: 0.5 }}
          className="flex flex-wrap justify-center gap-3"
        >
          <button
            onClick={scrollToVault}
            className="px-6 py-2.5 rounded-full font-mono text-sm font-bold tracking-widest transition-all cursor-pointer"
            style={{
              background: "#F4B51F",
              color: "#061116",
              boxShadow: "0 0 24px rgba(244,181,31,0.3)",
            }}
            onMouseEnter={(e) => { e.target.style.background = "#ffc84a"; e.target.style.boxShadow = "0 0 36px rgba(244,181,31,0.5)" }}
            onMouseLeave={(e) => { e.target.style.background = "#F4B51F"; e.target.style.boxShadow = "0 0 24px rgba(244,181,31,0.3)" }}
          >
            ACCESS VAULT →
          </button>
          <button
            onClick={scrollToDecoder}
            className="px-6 py-2.5 rounded-full font-mono text-sm tracking-widest transition-all cursor-pointer"
            style={{
              background: "transparent",
              color: "#4F8993",
              border: "1px solid rgba(79,137,147,0.4)",
            }}
            onMouseEnter={(e) => { e.target.style.background = "rgba(79,137,147,0.1)"; e.target.style.borderColor = "rgba(79,137,147,0.7)" }}
            onMouseLeave={(e) => { e.target.style.background = "transparent"; e.target.style.borderColor = "rgba(79,137,147,0.4)" }}
          >
            DECODE DOCUMENT
          </button>
        </motion.div>
      </div>

      <Mountains />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: showStats ? 0.9 : 0, y: showStats ? 0 : 20 }}
        className="absolute flex justify-center gap-6 md:gap-12 px-4 flex-wrap"
        style={{ bottom: "11%", left: 0, right: 0, zIndex: 8 }}
      >
        {[
          { label: "DOCUMENTS", value: STATS.totalDocs },
          { label: "VIDEOS", value: STATS.totalVideos },
          { label: "AGENCIES", value: STATS.agencies },
          { label: "LOCATIONS", value: STATS.locations },
          { label: "YEAR SPAN", value: "82 YRS" },
        ].map(({ label, value }) => (
          <div key={label} className="text-center">
            <div className="font-poster text-2xl md:text-3xl leading-none" style={{ color: "#F4B51F" }}>{value}</div>
            <div className="font-mono text-[0.5rem] tracking-widest mt-0.5" style={{ color: "rgba(79,137,147,0.6)" }}>{label}</div>
          </div>
        ))}
      </motion.div>

      <motion.div
        className="absolute left-1/2 -translate-x-1/2"
        style={{ bottom: "3%", zIndex: 10 }}
        animate={reducedMotion ? undefined : { opacity: [0.3, 0.7, 0.3], y: [0, 5, 0] }}
        transition={{ repeat: Infinity, duration: 2.5 }}
      >
        <div className="w-px h-7 mx-auto mb-1" style={{ background: "linear-gradient(to bottom, transparent, rgba(79,137,147,0.5), transparent)" }} />
        <div className="font-mono text-[0.45rem] text-center tracking-widest" style={{ color: "rgba(79,137,147,0.4)" }}>SCROLL</div>
      </motion.div>
    </section>
  )
}
