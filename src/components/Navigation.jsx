import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

const NAV_ITEMS = [
  { id: "hero", label: "KALA", short: "⌂" },
  { id: "stats", label: "OVERVIEW", short: "◈" },
  { id: "globe", label: "GEOMAP", short: "⊕" },
  { id: "network", label: "NETWORK", short: "⬡" },
  { id: "correlation", label: "CORRELATE", short: "◎" },
  { id: "vault", label: "VAULT", short: "▣" },
  { id: "video", label: "FOOTAGE", short: "▶" },
  { id: "decoder",    label: "DECODE",    short: "⌬" },
  { id: "birthdate",  label: "RESONANCE", short: "★" },
]

function scrollToSection(id, attempt = 0) {
  const section = document.getElementById(id)

  if (!section) {
    if (attempt < 24) {
      window.setTimeout(() => scrollToSection(id, attempt + 1), 120)
    }
    return false
  }

  section.scrollIntoView({ behavior: "smooth", block: "start" })
  window.history.replaceState(null, "", `#${id}`)
  return true
}

export default function Navigation() {
  const [active, setActive] = useState("hero")
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const sync = () => {
      const scrollTop = window.scrollY ?? document.documentElement.scrollTop
      setScrolled(scrollTop > 60)

      const activationLine = window.innerHeight * 0.38
      let bestId = NAV_ITEMS[0].id
      let bestTop = -Infinity

      for (const { id } of NAV_ITEMS) {
        const el = document.getElementById(id)
        if (!el) continue
        const rect = el.getBoundingClientRect()
        if (rect.top <= activationLine && rect.top > bestTop) {
          bestTop = rect.top
          bestId = id
        }
      }

      setActive(bestId)
    }

    let raf = null
    const onScroll = () => { if (raf) cancelAnimationFrame(raf); raf = requestAnimationFrame(sync) }
    const onResize = () => { if (raf) cancelAnimationFrame(raf); raf = requestAnimationFrame(sync) }
    const resizeObserver = new ResizeObserver(onResize)

    window.addEventListener("scroll", onScroll, { passive: true })
    document.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onResize, { passive: true })
    window.addEventListener("hashchange", sync, { passive: true })
    window.addEventListener("scrollend", sync, { passive: true })
    NAV_ITEMS.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) resizeObserver.observe(el)
    })
    sync()

    return () => {
      if (raf) cancelAnimationFrame(raf)
      resizeObserver.disconnect()
      window.removeEventListener("scroll", onScroll)
      document.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onResize)
      window.removeEventListener("hashchange", sync)
      window.removeEventListener("scrollend", sync)
    }
  }, [])

  const handleNavClick = (id) => {
    setActive(id)
    scrollToSection(id)
    setOpen(false)
  }

  return (
    <>
      <nav className="fixed right-4 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col gap-1.5">
        {NAV_ITEMS.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            aria-label={`Go to ${label}`}
            onClick={() => handleNavClick(id)}
            className="group relative flex items-center gap-2 overflow-hidden px-3 py-1.5 rounded-full font-mono text-xs transition-all duration-300 cursor-pointer"
            style={
              active === id
                ? { color: "#F4B51F", border: "1px solid rgba(244,181,31,0.4)" }
                : { color: "rgba(79,137,147,0.5)", border: "1px solid transparent" }
            }
            onMouseEnter={(e) => { if (active !== id) e.currentTarget.style.color = "rgba(233,243,241,0.7)" }}
            onMouseLeave={(e) => { if (active !== id) e.currentTarget.style.color = "rgba(79,137,147,0.5)" }}
          >
            {active === id && (
              <motion.span
                layoutId="desktop-nav-highlight"
                className="absolute inset-0 rounded-full"
                style={{ background: "rgba(244,181,31,0.12)" }}
                transition={{ type: "spring", stiffness: 420, damping: 34 }}
              />
            )}
            <span
              className="relative z-10 w-1.5 h-1.5 rounded-full transition-all"
              style={{
                background: active === id ? "#F4B51F" : "rgba(79,137,147,0.4)",
                boxShadow: active === id ? "0 0 6px rgba(244,181,31,0.8)" : "none",
              }}
            />
            <span className="relative z-10 hidden lg:block tracking-widest text-[0.6rem]">{label}</span>
          </button>
        ))}
      </nav>

      <header
        className="fixed top-0 left-0 right-0 z-50 md:hidden transition-all duration-300"
        style={scrolled ? { background: "rgba(6,17,22,0.95)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(79,137,147,0.1)" } : {}}
      >
        <div className="flex items-center justify-between px-4 py-3">
          <span className="font-poster text-2xl tracking-widest glow-signal" style={{ color: "#F4B51F" }}>KALA</span>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <div className="rec-dot" />
              <span className="font-mono text-[0.55rem]" style={{ color: "#FF1E1E" }}>REC</span>
            </div>
            <button type="button" onClick={() => setOpen(!open)} className="p-1 cursor-pointer" style={{ color: "rgba(79,137,147,0.7)" }}>
              <div className="space-y-1.5 w-5">
                <span className={`block h-px bg-current transition-all ${open ? "rotate-45 translate-y-2" : ""}`} />
                <span className={`block h-px bg-current transition-opacity ${open ? "opacity-0" : ""}`} />
                <span className={`block h-px bg-current transition-all ${open ? "-rotate-45 -translate-y-2" : ""}`} />
              </div>
            </button>
          </div>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              style={{ background: "rgba(6,17,22,0.97)", borderTop: "1px solid rgba(79,137,147,0.1)" }}
              className="px-4 pb-4"
            >
              <div className="grid grid-cols-2 gap-2 pt-3">
                {NAV_ITEMS.map(({ id, label, short }) => (
                  <button
                    key={id}
                    type="button"
                    aria-label={`Go to ${label}`}
                    onClick={() => handleNavClick(id)}
                    className="relative flex items-center gap-2 overflow-hidden px-3 py-2 rounded-lg font-mono text-xs transition-all cursor-pointer"
                    style={
                      active === id
                        ? { color: "#F4B51F", border: "1px solid rgba(244,181,31,0.3)" }
                        : { color: "rgba(79,137,147,0.6)", border: "1px solid rgba(79,137,147,0.1)" }
                    }
                  >
                    {active === id && (
                      <motion.span
                        layoutId="mobile-nav-highlight"
                        className="absolute inset-0 rounded-lg"
                        style={{ background: "rgba(244,181,31,0.1)" }}
                        transition={{ type: "spring", stiffness: 420, damping: 34 }}
                      />
                    )}
                    <span className="relative z-10 text-base">{short}</span>
                    <span className="relative z-10">{label}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  )
}
