import { Suspense, lazy } from "react"
import Navigation from "./components/Navigation"
import HeroSection from "./components/HeroSection"
import StatsPanel from "./components/StatsPanel"
import ErrorBoundary from "./components/ErrorBoundary"

const GlobeView       = lazy(() => import("./components/GlobeView"))
const NetworkGraph    = lazy(() => import("./components/NetworkGraph"))
const DocumentVault   = lazy(() => import("./components/DocumentVault"))
const VideoArchive    = lazy(() => import("./components/VideoArchive"))
const AIDecoder       = lazy(() => import("./components/AIDecoder"))
const DataCorrelation = lazy(() => import("./components/DataCorrelation"))

function SectionLoader({ label = "Loading..." }) {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#061116" }}>
      <div className="text-center">
        <div className="w-8 h-8 rounded-full animate-spin mx-auto mb-3" style={{ border:"1px solid rgba(79,137,147,0.2)", borderTopColor:"#F4B51F" }} />
        <p className="font-mono text-xs" style={{ color:"rgba(79,137,147,0.5)" }}>{label}</p>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <div className="min-h-screen text-evidence relative" style={{ background:"#061116" }}>
      {/* Ambient fog blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-1/2 -left-1/4 w-[700px] h-[700px] rounded-full"
          style={{ background:"radial-gradient(circle, rgba(24,51,59,0.12), transparent)", opacity:1 }} />
        <div className="absolute -bottom-1/4 -right-1/4 w-[600px] h-[600px] rounded-full"
          style={{ background:"radial-gradient(circle, rgba(79,137,147,0.06), transparent)", opacity:1 }} />
      </div>

      <Navigation />

      <main>
        <ErrorBoundary><HeroSection /></ErrorBoundary>
        <ErrorBoundary><StatsPanel /></ErrorBoundary>

        <ErrorBoundary>
          <Suspense fallback={<SectionLoader label="Loading geospatial data..." />}>
            <GlobeView />
          </Suspense>
        </ErrorBoundary>

        <ErrorBoundary>
          <Suspense fallback={<SectionLoader label="Computing document network..." />}>
            <NetworkGraph />
          </Suspense>
        </ErrorBoundary>

        <ErrorBoundary>
          <Suspense fallback={<SectionLoader label="Analyzing correlations..." />}>
            <DataCorrelation />
          </Suspense>
        </ErrorBoundary>

        <ErrorBoundary>
          <Suspense fallback={<SectionLoader label="Opening vault..." />}>
            <DocumentVault />
          </Suspense>
        </ErrorBoundary>

        <ErrorBoundary>
          <Suspense fallback={<SectionLoader label="Loading footage archive..." />}>
            <VideoArchive />
          </Suspense>
        </ErrorBoundary>

        <ErrorBoundary>
          <Suspense fallback={<SectionLoader label="Initializing AI decoder..." />}>
            <AIDecoder />
          </Suspense>
        </ErrorBoundary>
      </main>

      {/* Footer */}
      <footer className="py-10 px-4 text-center space-y-2" style={{ borderTop:"1px solid rgba(79,137,147,0.1)" }}>
        <p className="font-poster text-2xl tracking-widest" style={{ color:"rgba(244,181,31,0.3)" }}>KALA</p>
        <p className="font-mono text-[0.55rem] tracking-widest" style={{ color:"rgba(79,137,147,0.35)" }}>
          PURSUE ARCHIVE · RELEASE 1 · 1944–2026
        </p>
        <p className="font-mono text-[0.5rem]" style={{ color:"rgba(79,137,147,0.2)" }}>
          ALL DOCUMENTS DECLASSIFIED UNDER PRESIDENTIAL ORDER · WAR.GOV/UFO
        </p>
        <p className="font-mono text-[0.5rem]" style={{ color:"rgba(79,137,147,0.2)" }}>
          © 2026 CreativeLabTH Group · SciFact to SciFi Interfaces · CreativeDev.Lab@HSUTCC
        </p>
      </footer>
    </div>
  )
}
