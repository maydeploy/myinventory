'use client'

import { Canvas, useFrame, type ThreeEvent } from '@react-three/fiber'
import { OrbitControls, Html, Text } from '@react-three/drei'
import { useRef, useState, Suspense } from 'react'
import * as THREE from 'three'
import type { Product } from '@/types'

interface VHSTapeProps {
  product: Product
  position: [number, number, number]
  index: number
}

function VHSTape({ product, position, index }: VHSTapeProps) {
  const groupRef = useRef<THREE.Group>(null)
  const [isPulledOut, setIsPulledOut] = useState(false)
  const [hovered, setHovered] = useState(false)

  useFrame(() => {
    if (!groupRef.current) return

    // Animate pull out
    const targetZ = isPulledOut ? 1.5 : 0
    groupRef.current.position.z = THREE.MathUtils.lerp(
      groupRef.current.position.z,
      targetZ,
      0.1
    )

    // Animate rotation (flip to show front)
    const targetRotation = isPulledOut ? Math.PI / 2 : 0
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      targetRotation,
      0.1
    )

    // Slight hover effect
    if (hovered && !isPulledOut) {
      groupRef.current.position.z = Math.sin(Date.now() * 0.003) * 0.05 + 0.1
    }
  })

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation()
    setIsPulledOut(!isPulledOut)
  }

  // VHS color schemes - retro style
  const colors = [
    '#1a1a1a', // Black
    '#2d1b4e', // Purple
    '#1e3a5f', // Blue
    '#4a1e1e', // Maroon
    '#1e4a2e', // Green
  ]
  const tapeColor = colors[index % colors.length]

  return (
    <group ref={groupRef} position={position}>
      {/* VHS Tape Body */}
      <mesh
        onClick={handleClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <boxGeometry args={[0.15, 0.95, 0.6]} />
        <meshStandardMaterial color={tapeColor} roughness={0.8} />
      </mesh>

      {/* Spine Label Background */}
      <mesh position={[0.076, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[0.55, 0.85]} />
        <meshStandardMaterial color="#f5f5dc" roughness={0.9} />
      </mesh>

      {/* Spine Text */}
      <Text
        position={[0.077, 0, 0]}
        rotation={[0, Math.PI / 2, 0]}
        fontSize={0.045}
        color="#1a1a1a"
        anchorX="center"
        anchorY="middle"
        maxWidth={0.5}
        textAlign="center"
      >
        {product.name.toUpperCase()}
      </Text>

      {/* Brand/Studio text at bottom of spine */}
      {product.brand && (
        <Text
          position={[0.077, -0.35, 0]}
          rotation={[0, Math.PI / 2, 0]}
          fontSize={0.03}
          color="#666666"
          anchorX="center"
          anchorY="middle"
          maxWidth={0.5}
          textAlign="center"
        >
          {product.brand.toUpperCase()}
        </Text>
      )}

      {/* Front Cover (shows when pulled out) */}
      {isPulledOut && (
        <mesh position={[0, 0, 0.301]} rotation={[0, 0, 0]}>
          <planeGeometry args={[0.14, 0.9]} />
          <meshStandardMaterial color="#1a1a1a" />

          {/* Cover Art */}
          <Html
            transform
            distanceFactor={0.5}
            position={[0, 0, 0.01]}
            style={{
              width: '140px',
              height: '200px',
              pointerEvents: 'none',
            }}
          >
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 w-full h-full p-2 flex flex-col justify-between border-2 border-yellow-600">
              {product.coverImage ? (
                <img
                  src={product.coverImage}
                  alt={product.name}
                  className="w-full h-32 object-cover"
                />
              ) : (
                <div className="w-full h-32 bg-gray-700 flex items-center justify-center text-yellow-500 text-xs">
                  VHS
                </div>
              )}
              <div className="text-yellow-500 text-[8px] font-bold leading-tight">
                {product.name.toUpperCase()}
              </div>
              {product.brand && (
                <div className="text-yellow-400 text-[6px]">
                  {product.brand.toUpperCase()}
                </div>
              )}
            </div>
          </Html>
        </mesh>
      )}

      {/* VHS Label Sticker on top */}
      <mesh position={[0, 0.48, 0.15]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.12, 0.4]} />
        <meshStandardMaterial color="#ffffff" roughness={0.9} />
      </mesh>
    </group>
  )
}

function Shelf({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Shelf board */}
      <mesh position={[0, -0.55, 0.3]}>
        <boxGeometry args={[8, 0.05, 0.8]} />
        <meshStandardMaterial color="#8B4513" roughness={0.8} />
      </mesh>

      {/* Back panel */}
      <mesh position={[0, 0, -0.1]}>
        <boxGeometry args={[8, 1.2, 0.05]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.9} />
      </mesh>
    </group>
  )
}

function Scene({ products }: { products: Product[] }) {
  const shelfCount = Math.ceil(products.length / 10)

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 10, 5]} intensity={0.6} />
      <pointLight position={[-5, 5, 5]} intensity={0.3} />
      <spotLight position={[0, 5, 3]} angle={0.5} intensity={0.5} />

      {/* Create shelves and place VHS tapes */}
      {Array.from({ length: shelfCount }).map((_, shelfIndex) => {
        const tapesOnShelf = products.slice(shelfIndex * 10, (shelfIndex + 1) * 10)
        const yPosition = -shelfIndex * 1.5

        return (
          <group key={shelfIndex}>
            <Shelf position={[0, yPosition, 0]} />

            {tapesOnShelf.map((product, tapeIndex) => {
              const xPosition = -3.5 + tapeIndex * 0.8
              return (
                <VHSTape
                  key={product.id}
                  product={product}
                  position={[xPosition, yPosition + 0.05, 0.3]}
                  index={shelfIndex * 10 + tapeIndex}
                />
              )
            })}
          </group>
        )
      })}
    </>
  )
}

export default function VHSShelf({ products }: { products: Product[] }) {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-xs font-mono text-ink-lighter mb-3">
        VHS collection • click tapes to pull out • drag to look around
      </div>

      <div
        className="w-full border border-border"
        style={{
          height: '700px',
          background: 'linear-gradient(180deg, #1a1a1a 0%, #2a2a2a 100%)'
        }}
      >
        <Canvas
          camera={{ position: [0, 0, 5], fov: 50 }}
          shadows
        >
          <Suspense fallback={null}>
            <Scene products={products} />
            <OrbitControls
              enableZoom={true}
              enablePan={true}
              minDistance={3}
              maxDistance={10}
              maxPolarAngle={Math.PI / 2}
              target={[0, 0, 0]}
            />
          </Suspense>
        </Canvas>
      </div>

      <div className="mt-2 text-xs text-ink-lighter font-mono text-center">
        your watchlist as a retro VHS collection
      </div>
    </div>
  )
}
