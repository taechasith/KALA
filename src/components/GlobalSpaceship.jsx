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
    const drift = flight.reducedMotion ? 0 : t * 0.045
    const phase = progress * 3.25 + drift
    const wave = phase * Math.PI * 2
    const approach = (Math.sin(wave - Math.PI / 2) + 1) / 2
    const depth = THREE.MathUtils.smootherstep(approach, 0, 1)

    const lateral = Math.sin(wave * 0.58) * 3.1 + Math.sin(wave * 0.19 + 1.2) * 1.15
    const altitude = Math.cos(wave * 0.43 + 0.55) * 1.85 + Math.sin(wave * 0.91) * 0.52
    const cursorNudgeX = flight.pointerX * -0.95
    const cursorNudgeY = flight.pointerY * -0.55
    const bob = flight.reducedMotion ? 0 : Math.sin(t * 1.25) * 0.22
    const targetZ = THREE.MathUtils.lerp(-9.2, -1.65, depth)
    const targetScale = THREE.MathUtils.lerp(0.62, 1.42, depth)

    shipRef.current.position.x = THREE.MathUtils.lerp(shipRef.current.position.x, lateral + cursorNudgeX, 0.035)
    shipRef.current.position.y = THREE.MathUtils.lerp(shipRef.current.position.y, altitude + cursorNudgeY + bob, 0.036)
    shipRef.current.position.z = THREE.MathUtils.lerp(shipRef.current.position.z, targetZ, 0.04)
    shipRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.045)

    const yawTurn = Math.sin(wave * 0.58) * 0.34 + flight.pointerX * 0.1
    const pitch = THREE.MathUtils.lerp(-0.16, 0.18, depth) + flight.pointerY * 0.055
    const bank = THREE.MathUtils.clamp(-Math.cos(wave * 0.58) * 0.22 + flight.pointerX * 0.08, -0.32, 0.32)
    shipRef.current.rotation.x = THREE.MathUtils.lerp(shipRef.current.rotation.x, pitch, 0.045)
    shipRef.current.rotation.y = THREE.MathUtils.lerp(shipRef.current.rotation.y, Math.PI + yawTurn, 0.04)
    shipRef.current.rotation.z = THREE.MathUtils.lerp(shipRef.current.rotation.z, bank, 0.05)

    if (!flight.reducedMotion) {
      shipRef.current.rotation.x += Math.sin(t * 1.6) * delta * 0.018
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
      <group ref={shipRef} position={[2.8, 1.4, -8.4]} rotation={[-0.12, Math.PI, 0.08]} scale={flight.reducedMotion ? 0.74 : 0.86}>
        <Clone object={shipScene} />
      </group>
    </group>
  )
}

export default function GlobalSpaceship({ className = "fixed inset-0", zIndex = 7 }) {
  const flight = useFlightInput()

  return (
    <div className={`${className} pointer-events-none overflow-hidden`} style={{ zIndex }}>
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
