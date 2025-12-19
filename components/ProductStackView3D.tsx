'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Html } from '@react-three/drei'
import { useRef, Suspense } from 'react'
import * as THREE from 'three'
import type { Category, Product } from '@/types'
import { isDigitalCategory } from '@/lib/categories'

const categories: { value: Category; label: string; color: string }[] = [
  { value: 'tech', label: 'tech', color: '#3b82f6' },
  { value: 'home', label: 'home', color: '#10b981' },
  { value: 'essential', label: 'essential', color: '#f59e0b' },
  { value: 'wishlist', label: 'wishlist', color: '#ec4899' },
  { value: 'game', label: 'game', color: '#8b5cf6' },
  { value: 'software', label: 'software', color: '#06b6d4' },
]

function ProductStack({ product, position }: { product: Product; position: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!meshRef.current) return
    // Gentle floating animation
    meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5 + position[0]) * 0.02
  })

  const isDigital = isDigitalCategory(product.category)

  return (
    <mesh ref={meshRef} position={position}>
      <boxGeometry args={[0.8, 1.2, 0.05]} />
      <meshStandardMaterial color="#ffffff" />

      <Html
        transform
        distanceFactor={1}
        position={[0, 0, 0.03]}
        style={{
          width: '120px',
          height: '180px',
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >
        <div className="bg-white border border-gray-200 p-1 w-full h-full flex flex-col text-[6px]">
          <div className="flex-1 bg-gray-50 flex items-center justify-center mb-1">
            {product.coverImage ? (
              <img
                src={product.coverImage}
                alt={product.name}
                className="max-w-full max-h-full object-contain"
                style={{ maxHeight: '100px' }}
              />
            ) : (
              <div className="text-lg text-gray-300">[ ]</div>
            )}
          </div>
          <div className="font-mono text-ink line-clamp-2 leading-tight">
            {product.name}
          </div>
          {!isDigital && (
            <div className="font-mono font-bold text-ink text-[6px] mt-0.5">
              ${product.price.toFixed(2)}
            </div>
          )}
        </div>
      </Html>
    </mesh>
  )
}

function Shelf({
  category,
  items,
  position,
  onSelect
}: {
  category: { value: Category; label: string; color: string }
  items: Product[]
  position: [number, number, number]
  onSelect: () => void
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)

  useFrame(() => {
    if (!meshRef.current) return
    meshRef.current.scale.x = THREE.MathUtils.lerp(
      meshRef.current.scale.x,
      hovered ? 1.05 : 1,
      0.1
    )
  })

  return (
    <group position={position}>
      {/* Shelf base */}
      <mesh
        ref={meshRef}
        position={[0, -0.7, 0]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={onSelect}
      >
        <boxGeometry args={[4, 0.1, 1.2]} />
        <meshStandardMaterial color={hovered ? category.color : '#e5e7eb'} />
      </mesh>

      {/* Shelf back panel */}
      <mesh position={[0, 0, -0.6]}>
        <boxGeometry args={[4, 1.5, 0.05]} />
        <meshStandardMaterial color="#f9fafb" opacity={0.5} transparent />
      </mesh>

      {/* Label */}
      <Html position={[0, -0.5, 0.6]} center>
        <div
          className="font-mono uppercase text-xs px-2 py-1 border border-gray-300 bg-white"
          style={{ color: category.color }}
        >
          {category.label} ({items.length})
        </div>
      </Html>

      {/* Stack products on shelf */}
      {items.slice(0, 5).map((item, idx) => {
        const x = -1.5 + idx * 0.9
        const y = -0.1 + idx * 0.05 // Slight elevation for stack effect
        const z = 0 + idx * 0.02 // Slight forward offset
        return (
          <ProductStack
            key={item.id}
            product={item}
            position={[x, y, z]}
          />
        )
      })}
    </group>
  )
}

function Scene({
  categorizedProducts,
  onSelectCategory
}: {
  categorizedProducts: Array<{ category: typeof categories[0]; items: Product[] }>
  onSelectCategory: (category: Category) => void
}) {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 10, 5]} intensity={0.8} castShadow />
      <pointLight position={[-5, 5, 5]} intensity={0.3} />

      {/* Create shelves in a grid */}
      {categorizedProducts.map((cat, idx) => {
        const row = Math.floor(idx / 2)
        const col = idx % 2
        const x = col * 5 - 2.5
        const y = -row * 2.5 + 2
        const z = 0

        return (
          <Shelf
            key={cat.category.value}
            category={cat.category}
            items={cat.items}
            position={[x, y, z]}
            onSelect={() => onSelectCategory(cat.category.value)}
          />
        )
      })}
    </>
  )
}

import { useState } from 'react'

export default function ProductStackView3D({
  products,
  onSelectCategory,
}: {
  products: Product[]
  onSelectCategory: (category: Category) => void
}) {
  const categorizedProducts = categories
    .map((cat) => ({
      category: cat,
      items: products.filter((p) => p.category === cat.value),
    }))
    .filter((c) => c.items.length > 0)

  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-xs font-mono text-ink-lighter mb-3">
        3D shelf view • drag to rotate • click shelf to expand category
      </div>

      <div className="w-full bg-gradient-to-b from-gray-50 to-white border border-border" style={{ height: '700px' }}>
        <Canvas
          camera={{ position: [0, 2, 10], fov: 50 }}
          shadows
        >
          <Suspense fallback={null}>
            <Scene
              categorizedProducts={categorizedProducts}
              onSelectCategory={onSelectCategory}
            />
            <OrbitControls
              enableZoom={true}
              enablePan={true}
              minDistance={5}
              maxDistance={20}
              maxPolarAngle={Math.PI / 2}
            />
          </Suspense>
        </Canvas>
      </div>

      <div className="mt-2 text-xs text-ink-lighter font-mono text-center">
        your inventory displayed on 3D shelves
      </div>
    </div>
  )
}
