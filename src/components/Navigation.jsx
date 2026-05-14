import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

const NAV_ITEMS = [
  { id:"hero",        label:"KALA",       short:"⌂" },
  { id:"stats",       label:"OVERVIEW",   short:"◈" },
  { id:"globe",       label:"GEOMAP",     short:"⊕" },
  { id:"network",     label:"NETWORK",    short:"⬡" },
  { id:"correlation", label:"CORRELATE",  short:"◎" },
  { id:"vault",       label:"VAULT",      short:"▣" },
  { id:"video",       label:"FOOTAGE",    short:"▶" },
  { id:"decoder",     label:"DECODE",     short:"⌬" },
]

export default function Navigation() {
  const [active, setActive] = useState("hero")
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    const sections = NAV_ITEMS
      .map(({ id }) => document.getElementById(id))
      .filter(Boolean)

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)

        if (visible[0]?.target?.id) setActive(visible[0].target.id)
      },
      {
        rootMargin: "-20% 0px -45% 0px",
        threshold: [0.2, 0.35, 0.5, 0.7],
      }
    )

    sections.forEach((section) => observer.observe(section))

    window.addEventListener("scroll", onScroll, { passive: true })
    onScroll()

    return () => {
      observer.disconnect()
      window.removeEventListener("scroll", onScroll)
    }
  }, [])

  const scrollTo = (id) => {
    const el = document.getElementById(id)
    if (!el) return

    const top = window.scrollY + el.getBoundingClientRect().top - 16
    window.scrollTo({ top, behavior: "smooth" })
    setActive(id)
    setOpen(false)
  }

  return (
    <>
      {/* Desktop — right sidebar */}
      <nav className="fixed right-4 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col gap-1.5">
        {NAV_ITEMS.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => scrollTo(id)}
            className="group flex items-center gap-2 px-3 py-1.5 rounded-full font-mono text-xs transition-all duration-300"
            style={
              active === id
                ? { background:"rgba(244,181,31,0.12)", color:"#F4B51F", border:"1px solid rgba(244,181,31,0.4)" }
                : { color:"rgba(79,137,147,0.5)", border:"1px solid transparent" }
            }
            onMouseEnter={e => { if (active !== id) e.currentTarget.style.color = "rgba(233,243,241,0.7)" }}
            onMouseLeave={e => { if (active !== id) e.currentTarget.style.color = "rgba(79,137,147,0.5)" }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full transition-all"
              style={{
                background: active === id ? "#F4B51F" : "rgba(79,137,147,0.4)",
                boxShadow: active === id ? "0 0 6px rgba(244,181,31,0.8)" : "none",
              }}
            />
            <span className="hidden lg:block tracking-widest text-[0.6rem]">{label}</span>
          </button>
        ))}
      </nav>

      {/* Mobile top bar */}
      <header
        className="fixed top-0 left-0 right-0 z-50 md:hidden transition-all duration-300"
        style={scrolled ? { background:"rgba(6,17,22,0.95)", backdropFilter:"blur(20px)", borderBottom:"1px solid rgba(79,137,147,0.1)" } : {}}
      >
        <div className="flex items-center justify-between px-4 py-3">
          <span className="font-poster text-2xl tracking-widest glow-signal" style={{ color:"#F4B51F" }}>KALA</span>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <div className="rec-dot" />
              <span className="font-mono text-[0.55rem]" style={{ color:"#FF1E1E" }}>REC</span>
            </div>
            <button onClick={() => setOpen(!open)} className="p-1" style={{ color:"rgba(79,137,147,0.7)" }}>
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
              initial={{ opacity:0, height:0 }}
              animate={{ opacity:1, height:"auto" }}
              exit={{ opacity:0, height:0 }}
              style={{ background:"rgba(6,17,22,0.97)", borderTop:"1px solid rgba(79,137,147,0.1)" }}
              className="px-4 pb-4"
            >
              <div className="grid grid-cols-2 gap-2 pt-3">
                {NAV_ITEMS.map(({ id, label, short }) => (
                  <button
                    key={id}
                    onClick={() => scrollTo(id)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg font-mono text-xs transition-all"
                    style={
                      active === id
                        ? { background:"rgba(244,181,31,0.1)", color:"#F4B51F", border:"1px solid rgba(244,181,31,0.3)" }
                        : { color:"rgba(79,137,147,0.6)", border:"1px solid rgba(79,137,147,0.1)" }
                    }
                  >
                    <span className="text-base">{short}</span> {label}
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
