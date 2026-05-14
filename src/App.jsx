import { Suspense, lazy, useEffect, useState } from "react"
import { motion } from "framer-motion"
import Navigation from "./components/Navigation"
import ImmersiveStars from "./components/ImmersiveStars"
import HeroSection from "./components/HeroSection"
import StatsPanel from "./components/StatsPanel"
import ErrorBoundary from "./components/ErrorBoundary"

const GlobeView = lazy(() => import("./components/GlobeView"))
const NetworkGraph = lazy(() => import("./components/NetworkGraph"))
const DocumentVault = lazy(() => import("./components/DocumentVault"))
const VideoArchive = lazy(() => import("./components/VideoArchive"))
const AIDecoder = lazy(() => import("./components/AIDecoder"))
const DataCorrelation = lazy(() => import("./components/DataCorrelation"))

function SectionLoader({ label = "Loading..." }) {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#061116" }}>
      <div className="text-center">
        <div className="w-8 h-8 rounded-full animate-spin mx-auto mb-3" style={{ border: "1px solid rgba(79,137,147,0.2)", borderTopColor: "#F4B51F" }} />
        <p className="font-mono text-xs" style={{ color: "rgba(79,137,147,0.5)" }}>{label}</p>
      </div>
    </div>
  )
}

function EntryLoader() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      className="fixed inset-0 z-[100] overflow-hidden kala-entry"
    >
      <div className="absolute inset-0 kala-loader-grid" />
      <div className="absolute inset-0 kala-loader-stars" />
      <ImmersiveStars density={1200} intensity={1.2} speed={6.5} />
      <div className="absolute inset-x-4 top-5 flex items-center justify-between font-mono text-[0.55rem] tracking-[0.22em]" style={{ color: "rgba(79,137,147,0.68)" }}>
        <span>BOOT NODE 01</span>
        <span>CLASSIFIED ACCESS</span>
      </div>
      <motion.div
        animate={{ opacity: [0.18, 0.4, 0.18] }}
        transition={{ repeat: Infinity, duration: 2.8, ease: "easeInOut" }}
        className="absolute inset-0"
        style={{ background: "linear-gradient(180deg, transparent 0%, rgba(244,181,31,0.05) 50%, transparent 100%)" }}
      />

      <div className="relative h-full flex items-center justify-center px-6">
        <div className="relative text-center max-w-md px-8 py-10 kala-loader-panel">
          <div className="absolute inset-0 kala-loader-reticle" />
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-6"
          >
            <p className="font-mono text-[0.55rem] tracking-[0.45em] mb-3" style={{ color: "rgba(79,137,147,0.75)" }}>
              PURSUE SYSTEM / SIGNAL LOCK
            </p>
            <h1 className="font-poster text-[clamp(4rem,14vw,8rem)] leading-none tracking-[0.12em] glow-signal" style={{ color: "#F4B51F" }}>
              KALA
            </h1>
          </motion.div>

          <div className="relative h-[2px] rounded-full overflow-hidden mb-4" style={{ background: "rgba(79,137,147,0.14)" }}>
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{ repeat: Infinity, duration: 1.3, ease: "linear" }}
              className="absolute inset-y-0 w-1/2"
              style={{ background: "linear-gradient(90deg, transparent, #F4B51F, transparent)" }}
            />
          </div>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="font-mono text-[0.65rem] tracking-[0.24em]"
            style={{ color: "rgba(233,243,241,0.7)" }}
          >
            SYNCHRONIZING ARCHIVE · MAP · DECODER
          </motion.p>
          <div className="mt-6 grid grid-cols-3 gap-2 font-mono text-[0.5rem] tracking-[0.16em]" style={{ color: "rgba(233,243,241,0.55)" }}>
            <span className="kala-loader-chip">DOW</span>
            <span className="kala-loader-chip">NASA</span>
            <span className="kala-loader-chip">USAF</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function App() {
  const [booting, setBooting] = useState(true)

  useEffect(() => {
    const timer = window.setTimeout(() => setBooting(false), 2200)
    return () => window.clearTimeout(timer)
  }, [])

  if (booting) return <EntryLoader />

  return (
    <div className="min-h-screen text-evidence relative" style={{ background: "#061116" }}>
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-1/2 -left-1/4 w-[700px] h-[700px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(24,51,59,0.12), transparent)", opacity: 1 }}
        />
        <div
          className="absolute -bottom-1/4 -right-1/4 w-[600px] h-[600px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(79,137,147,0.06), transparent)", opacity: 1 }}
        />
      </div>

      <ImmersiveStars density={1300} intensity={0.48} speed={2.8} className="fixed inset-0 z-0 opacity-80" />
      <Navigation />

      <main className="relative z-10">
        <div id="hero" className="nav-target snap-section">
          <ErrorBoundary><HeroSection /></ErrorBoundary>
        </div>

        <div id="stats" className="nav-target snap-section">
          <ErrorBoundary><StatsPanel /></ErrorBoundary>
        </div>

        <div id="globe" className="nav-target snap-section">
          <ErrorBoundary>
            <Suspense fallback={<SectionLoader label="Loading geospatial data..." />}>
              <GlobeView />
            </Suspense>
          </ErrorBoundary>
        </div>

        <div id="network" className="nav-target snap-section">
          <ErrorBoundary>
            <Suspense fallback={<SectionLoader label="Computing document network..." />}>
              <NetworkGraph />
            </Suspense>
          </ErrorBoundary>
        </div>

        <div id="correlation" className="nav-target snap-section">
          <ErrorBoundary>
            <Suspense fallback={<SectionLoader label="Analyzing correlations..." />}>
              <DataCorrelation />
            </Suspense>
          </ErrorBoundary>
        </div>

        <div id="vault" className="nav-target snap-section">
          <ErrorBoundary>
            <Suspense fallback={<SectionLoader label="Opening vault..." />}>
              <DocumentVault />
            </Suspense>
          </ErrorBoundary>
        </div>

        <div id="video" className="nav-target snap-section">
          <ErrorBoundary>
            <Suspense fallback={<SectionLoader label="Loading footage archive..." />}>
              <VideoArchive />
            </Suspense>
          </ErrorBoundary>
        </div>

        <div id="decoder" className="nav-target snap-section">
          <ErrorBoundary>
            <Suspense fallback={<SectionLoader label="Initializing AI decoder..." />}>
              <AIDecoder />
            </Suspense>
          </ErrorBoundary>
        </div>
      </main>

      <footer className="py-10 px-4 text-center space-y-2" style={{ borderTop: "1px solid rgba(79,137,147,0.1)" }}>
        <p className="font-poster text-2xl tracking-widest" style={{ color: "rgba(244,181,31,0.3)" }}>KALA</p>
        <p className="font-mono text-[0.55rem] tracking-widest" style={{ color: "rgba(79,137,147,0.35)" }}>
          PURSUE ARCHIVE · RELEASE 1 · 1944-2026
        </p>
        <p className="font-mono text-[0.55rem]" style={{ color: "rgba(79,137,147,0.32)" }}>
          DATA CREDIT ·{" "}
          <a
            href="https://www.war.gov/ufo/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "rgba(244,181,31,0.75)" }}
          >
            war.gov/ufo
          </a>
        </p>
        <p className="font-mono text-[0.5rem]" style={{ color: "rgba(79,137,147,0.2)" }}>
          ALL DOCUMENTS DECLASSIFIED UNDER PRESIDENTIAL ORDER · WAR.GOV/UFO
        </p>
        <p className="font-mono text-[0.5rem]" style={{ color: "rgba(79,137,147,0.2)" }}>
          © 2026 CreativeLabTH Group · SciFact to SciFi Interfaces · CreativeDev.Lab@HSUTCC
        </p>
      </footer>
    </div>
  )
}
