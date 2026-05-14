import { useEffect, useMemo, useRef, useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import * as THREE from "three"

function useReducedMotion() {
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)")
    const update = () => setReducedMotion(media.matches)
    update()
    media.addEventListener("change", update)
    return () => media.removeEventListener("change", update)
  }, [])

  return reducedMotion
}

function StarLayer({ count, spread, depth, speed, colorA, colorB, reducedMotion }) {
  const ref = useRef()
  const stars = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const sizes = new Float32Array(count)
    const color = new THREE.Color()

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * spread
      positions[i * 3 + 1] = (Math.random() - 0.5) * spread * 0.62
      positions[i * 3 + 2] = -Math.random() * depth

      color.set(Math.random() > 0.72 ? colorB : colorA)
      const brightness = 0.56 + Math.random() * 0.44
      colors[i * 3] = color.r * brightness
      colors[i * 3 + 1] = color.g * brightness
      colors[i * 3 + 2] = color.b * brightness
      sizes[i] = 0.04 + Math.random() * 0.16
    }

    return { positions, colors, sizes }
  }, [colorA, colorB, count, depth, spread])

  useFrame((state, delta) => {
    if (!ref.current || reducedMotion) return

    const pos = ref.current.geometry.attributes.position
    const drift = delta * speed

    for (let i = 0; i < count; i++) {
      const zIndex = i * 3 + 2
      pos.array[zIndex] += drift * (0.45 + stars.sizes[i] * 2.7)

      if (pos.array[zIndex] > 8) {
        pos.array[i * 3] = (Math.random() - 0.5) * spread
        pos.array[i * 3 + 1] = (Math.random() - 0.5) * spread * 0.62
        pos.array[zIndex] = -depth
      }
    }

    pos.needsUpdate = true
    ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.035) * 0.018
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={stars.positions} itemSize={3} count={count} />
        <bufferAttribute attach="attributes-color" array={stars.colors} itemSize={3} count={count} />
      </bufferGeometry>
      <pointsMaterial
        vertexColors
        size={0.095}
        sizeAttenuation
        transparent
        opacity={0.98}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

export default function ImmersiveStars({
  density = 900,
  intensity = 1,
  speed = 5.5,
  className = "absolute inset-0",
}) {
  const reducedMotion = useReducedMotion()
  const count = reducedMotion ? Math.floor(density * 0.45) : density

  return (
    <div className={`${className} pointer-events-none overflow-hidden`} aria-hidden="true">
      <Canvas
        dpr={[1, 1.35]}
        gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 0, 12], fov: 58, near: 0.1, far: 120 }}
      >
        <fog attach="fog" args={["#061116", 18, 86]} />
        <StarLayer
          count={count}
          spread={42}
          depth={82}
          speed={speed * intensity}
          colorA="#E9F3F1"
          colorB="#4F8993"
          reducedMotion={reducedMotion}
        />
        <StarLayer
          count={Math.floor(count * 0.28)}
          spread={30}
          depth={54}
          speed={speed * 1.85 * intensity}
          colorA="#F4B51F"
          colorB="#22C55E"
          reducedMotion={reducedMotion}
        />
      </Canvas>
    </div>
  )
}
