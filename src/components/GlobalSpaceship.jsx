import { Suspense, useEffect, useMemo, useRef, useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Clone, useAnimations, useGLTF } from "@react-three/drei"
import * as THREE from "three"

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

function useFlightInput() {
  const [flight, setFlight] = useState({
    pointerX: 0,
    pointerY: 0,
    progress: 0,
    reducedMotion: false,
  })

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)")

    const update = () => {
      const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1)
      setFlight((current) => ({
        ...current,
        progress: clamp(window.scrollY / maxScroll, 0, 1),
        reducedMotion: media.matches,
      }))
    }

    const updatePointer = (event) => {
      const point = event.touches?.[0] || event
      setFlight((current) => ({
        ...current,
        pointerX: clamp((point.clientX / window.innerWidth) * 2 - 1, -1, 1),
        pointerY: clamp((point.clientY / window.innerHeight) * 2 - 1, -1, 1),
      }))
    }

    update()
    window.addEventListener("scroll", update, { passive: true })
    window.addEventListener("resize", update)
    window.addEventListener("pointermove", updatePointer, { passive: true })
    window.addEventListener("touchmove", updatePointer, { passive: true })
    media.addEventListener("change", update)

    return () => {
      window.removeEventListener("scroll", update)
      window.removeEventListener("resize", update)
      window.removeEventListener("pointermove", updatePointer)
      window.removeEventListener("touchmove", updatePointer)
      media.removeEventListener("change", update)
    }
  }, [])

  return flight
}

function SiteSpaceship({ flight }) {
  const root = useRef()
  const shipRef = useRef()
  const lightRef = useRef()
  const { scene, animations } = useGLTF("/spaceship.gltf")
  const shipScene = useMemo(() => scene.clone(), [scene])
  const { actions } = useAnimations(animations, root)

  useEffect(() => {
    shipScene.traverse((child) => {
      if (!child.isMesh || !child.material) return
      child.material = child.material.clone()
      child.material.transparent = true
      child.material.opacity = 0.82
      child.material.depthWrite = false
    })
  }, [shipScene])

  useEffect(() => {
    Object.values(actions || {}).forEach((action) => {
      if (!action) return
      if (flight.reducedMotion) {
        action.stop()
      } else {
        action.reset().fadeIn(0.4).play()
      }
    })

    return () => Object.values(actions || {}).forEach((action) => action?.stop())
  }, [actions, flight.reducedMotion])

  useFrame((state, delta) => {
    if (!shipRef.current) return

    const t = state.clock.elapsedTime
    const progress = clamp(flight.progress, 0, 1)
    const scrollOrbit = progress * Math.PI * 4.4
    const naturalDrift = flight.reducedMotion ? 0 : t * 0.16
    const orbit = scrollOrbit + naturalDrift

    const edgeBias = Math.sin(progress * Math.PI * 5.2)
    const baseX = Math.sin(orbit) * 8.4 + Math.sin(orbit * 0.41) * 2.1
    const baseY = Math.cos(orbit * 0.72) * 3.15 + Math.sin(orbit * 1.35) * 1.1
    const cursorAvoidX = flight.pointerX * -1.75
    const cursorFollowY = flight.pointerY * -0.85
    const bob = flight.reducedMotion ? 0 : Math.sin(t * 1.1) * 0.34
    const targetZ = THREE.MathUtils.lerp(-6.4, -2.35, (Math.sin(orbit * 0.9) + 1) / 2)

    shipRef.current.position.x = THREE.MathUtils.lerp(shipRef.current.position.x, baseX + cursorAvoidX, 0.032)
    shipRef.current.position.y = THREE.MathUtils.lerp(shipRef.current.position.y, baseY + cursorFollowY + bob, 0.034)
    shipRef.current.position.z = THREE.MathUtils.lerp(shipRef.current.position.z, targetZ, 0.03)

    const direction = Math.cos(orbit) >= 0 ? -1 : 1
    const bank = THREE.MathUtils.clamp(edgeBias * 0.48 + flight.pointerX * 0.16, -0.65, 0.65)
    shipRef.current.rotation.x = THREE.MathUtils.lerp(shipRef.current.rotation.x, 0.08 + flight.pointerY * 0.1, 0.04)
    shipRef.current.rotation.y = THREE.MathUtils.lerp(shipRef.current.rotation.y, direction * 1.05 + flight.pointerX * 0.2, 0.04)
    shipRef.current.rotation.z = THREE.MathUtils.lerp(shipRef.current.rotation.z, bank, 0.05)

    if (!flight.reducedMotion) {
      shipRef.current.rotation.y += delta * 0.05
    }

    if (lightRef.current) {
      lightRef.current.position.x = shipRef.current.position.x - 1.5
      lightRef.current.position.y = shipRef.current.position.y + 1.2
      lightRef.current.position.z = shipRef.current.position.z + 4
    }
  })

  return (
    <group ref={root}>
      <ambientLight intensity={0.68} color="#17323a" />
      <directionalLight position={[7, 8, 8]} intensity={1.15} color="#d8f6ff" />
      <pointLight ref={lightRef} intensity={1.25} color="#F4B51F" distance={16} />
      <group ref={shipRef} position={[8.8, 3.4, -5.5]} rotation={[0.08, -0.95, 0.24]} scale={flight.reducedMotion ? 0.88 : 1.06}>
        <Clone object={shipScene} />
      </group>
    </group>
  )
}

export default function GlobalSpaceship() {
  const flight = useFlightInput()

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 7 }}>
      <Canvas
        dpr={[1, 1.35]}
        gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 0, 15], fov: 42 }}
      >
        <Suspense fallback={null}>
          <SiteSpaceship flight={flight} />
        </Suspense>
      </Canvas>
    </div>
  )
}

useGLTF.preload("/spaceship.gltf")
