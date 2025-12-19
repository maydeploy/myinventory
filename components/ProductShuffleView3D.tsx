'use client'

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useRef, useState, Suspense } from 'react'
import { RigidBody, Physics, RapierRigidBody } from '@react-three/rapier'
import * as THREE from 'three'
import type { Product } from '@/types'
import { Html } from '@react-three/drei'
import { isDigitalCategory } from '@/lib/categories'

function ProductCard3D({ product, position }: { product: Product; position: [number, number, number] }) {
  const rigidBodyRef = useRef<RapierRigidBody>(null)
  const [isDragging, setIsDragging] = useState(false)
  const { camera } = useThree()

  useFrame(({ mouse }) => {
    if (!rigidBodyRef.current || isDragging) return

    // Apply gentle force based on mouse position
    const mouseForce = new THREE.Vector3(mouse.x * 2, mouse.y * 2, 0)
    const bodyPos = rigidBodyRef.current.translation()
    const force = new THREE.Vector3(
      (mouseForce.x - bodyPos.x) * 0.05,
      (mouseForce.y - bodyPos.y) * 0.05,
      0
    )

    rigidBodyRef.current.applyImpulse(force, true)

    // Add gentle random drift
    if (Math.random() > 0.98) {
      const drift = new THREE.Vector3(
        (Math.random() - 0.5) * 0.1,
        (Math.random() - 0.5) * 0.1,
        0
      )
      rigidBodyRef.current.applyImpulse(drift, true)
    }

    // Keep rotation interesting but not too crazy
    const angVel = rigidBodyRef.current.angvel()
    if (Math.abs(angVel.z) > 2) {
      rigidBodyRef.current.setAngvel({ x: angVel.x, y: angVel.y, z: angVel.z * 0.95 }, true)
    }
  })

  const handleClick = () => {
    if (!rigidBodyRef.current) return

    // Toss the card!
    const impulse = new THREE.Vector3(
      (Math.random() - 0.5) * 5,
      (Math.random() - 0.5) * 5,
      0
    )
    rigidBodyRef.current.applyImpulse(impulse, true)

    // Add spin
    const torque = new THREE.Vector3(0, 0, (Math.random() - 0.5) * 3)
    rigidBodyRef.current.applyTorqueImpulse(torque, true)
  }

  const isDigital = isDigitalCategory(product.category)
  const imageSrc = product.coverImage

  return (
    <RigidBody
      ref={rigidBodyRef}
      position={position}
      rotation={[0, 0, (Math.random() - 0.5) * 0.5]}
      colliders="cuboid"
      restitution={0.4}
      friction={0.1}
      linearDamping={0.5}
      angularDamping={0.8}
    >
      <mesh onClick={handleClick}>
        <boxGeometry args={[2, 2.6, 0.1]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      <Html
        transform
        distanceFactor={1}
        position={[0, 0, 0.06]}
        style={{
          width: '200px',
          height: '260px',
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >
        <div
          className="bg-white border border-border p-2 rounded-none w-full h-full flex flex-col overflow-hidden"
          style={{ fontSize: '10px' }}
        >
          {/* Image */}
          <div className="flex-1 flex items-center justify-center bg-gray-50 mb-1">
            {imageSrc ? (
              <img
                src={imageSrc}
                alt={product.name}
                className="max-w-full max-h-full object-contain"
                style={{ width: 'auto', height: 'auto', maxHeight: '140px' }}
              />
            ) : (
              <div className="text-2xl text-gray-300">[ ]</div>
            )}
          </div>

          {/* Content */}
          <div className="space-y-0.5">
            <h3 className="font-mono text-[9px] line-clamp-2 text-ink leading-tight">
              {product.name}
            </h3>
            <div className="flex items-center gap-1 text-[7px] text-ink-lighter font-mono">
              {product.brand && (
                <>
                  <span>{product.brand}</span>
                  <span>·</span>
                </>
              )}
              <span>{product.category}</span>
            </div>
            {!isDigital && (
              <p className="text-[9px] font-bold text-ink font-mono">
                ${product.price.toFixed(2)}
              </p>
            )}
          </div>
        </div>
      </Html>
    </RigidBody>
  )
}

function Scene({ products }: { products: Product[] }) {
  return (
    <>
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 5, 5]} intensity={0.5} />
      <pointLight position={[-5, -5, 5]} intensity={0.3} />

      {products.map((product, i) => {
        const angle = (i / products.length) * Math.PI * 2
        const radius = Math.min(4, 2 + products.length * 0.1)
        const x = Math.cos(angle) * radius
        const y = Math.sin(angle) * radius
        const z = (Math.random() - 0.5) * 2

        return (
          <ProductCard3D
            key={product.id}
            product={product}
            position={[x, y, z]}
          />
        )
      })}

      {/* Invisible walls to contain the cards */}
      <RigidBody type="fixed" position={[0, 8, 0]}>
        <mesh visible={false}>
          <boxGeometry args={[30, 0.5, 10]} />
        </mesh>
      </RigidBody>
      <RigidBody type="fixed" position={[0, -8, 0]}>
        <mesh visible={false}>
          <boxGeometry args={[30, 0.5, 10]} />
        </mesh>
      </RigidBody>
      <RigidBody type="fixed" position={[8, 0, 0]}>
        <mesh visible={false}>
          <boxGeometry args={[0.5, 30, 10]} />
        </mesh>
      </RigidBody>
      <RigidBody type="fixed" position={[-8, 0, 0]}>
        <mesh visible={false}>
          <boxGeometry args={[0.5, 30, 10]} />
        </mesh>
      </RigidBody>
    </>
  )
}

export default function ProductShuffleView3D({ products }: { products: Product[] }) {
  const [key, setKey] = useState(0)

  const handleReshuffle = () => {
    setKey((k) => k + 1)
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-3">
        <div className="text-xs font-mono text-ink-lighter">
          3D shuffle mode ({products.length} items) • move mouse to push • click cards to toss
        </div>
        <button
          onClick={handleReshuffle}
          className="px-2 py-1 border border-border hover:bg-paper-dark transition-all text-xs text-ink-light"
        >
          [reshuffle]
        </button>
      </div>

      <div className="w-full bg-gradient-to-b from-gray-50 to-white border border-border" style={{ height: '700px' }}>
        <Canvas
          key={key}
          camera={{ position: [0, 0, 12], fov: 50 }}
          gl={{ alpha: true, antialias: true }}
        >
          <Suspense fallback={null}>
            <Physics gravity={[0, 0, 0]}>
              <Scene products={products} />
            </Physics>
          </Suspense>
        </Canvas>
      </div>

      <div className="mt-2 text-xs text-ink-lighter font-mono text-center">
        cards float in 3D space with realistic physics
      </div>
    </div>
  )
}
