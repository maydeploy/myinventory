'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { useRef, useMemo } from 'react'
import * as THREE from 'three'
import { useIsDarkMode } from '@/lib/useIsDarkMode'

function FloatingShape({ position, speed, shape }: { position: [number, number, number], speed: number, shape: 'box' | 'sphere' | 'torus' }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const isDark = useIsDarkMode()

  useFrame((state) => {
    if (!meshRef.current) return

    // Gentle floating animation
    meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed) * 0.5
    meshRef.current.rotation.x += 0.001 * speed
    meshRef.current.rotation.y += 0.002 * speed

    // React to mouse movement
    const mouseX = state.mouse.x * 2
    const mouseY = state.mouse.y * 2
    meshRef.current.position.x = position[0] + mouseX * 0.1
    meshRef.current.position.z = position[2] + mouseY * 0.1
  })

  const color = isDark ? '#444444' : '#e8e8e8'

  return (
    <mesh ref={meshRef} position={position}>
      {shape === 'box' && <boxGeometry args={[0.3, 0.3, 0.3]} />}
      {shape === 'sphere' && <sphereGeometry args={[0.2, 16, 16]} />}
      {shape === 'torus' && <torusGeometry args={[0.2, 0.08, 8, 16]} />}
      <meshStandardMaterial
        color={color}
        wireframe
        transparent
        opacity={0.15}
      />
    </mesh>
  )
}

function Scene() {
  const shapes = useMemo(() => {
    const types: ('box' | 'sphere' | 'torus')[] = ['box', 'sphere', 'torus']
    return Array.from({ length: 15 }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 5,
        (Math.random() - 0.5) * 5 - 3,
      ] as [number, number, number],
      speed: 0.3 + Math.random() * 0.5,
      shape: types[Math.floor(Math.random() * types.length)],
    }))
  }, [])

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={0.3} />
      {shapes.map((shape, i) => (
        <FloatingShape key={i} {...shape} />
      ))}
    </>
  )
}

export default function Background3D() {
  return (
    <>
      {/* Keep original dot grid as fallback/base layer */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(232, 232, 232, 0.15) 2px, transparent 2px)',
          backgroundSize: '20px 20px',
          backgroundPosition: '0 0',
        }}
      />

      {/* 3D Canvas overlay */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <Canvas
          camera={{ position: [0, 0, 5], fov: 50 }}
          style={{ background: 'transparent' }}
        >
          <Scene />
        </Canvas>
      </div>
    </>
  )
}
