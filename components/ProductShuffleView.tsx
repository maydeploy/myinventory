'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import type { ImageFxSettings, Product } from '@/types'
import ProductCard from './ProductCard'

type Pos = { x: number; y: number; r: number }

function mulberry32(seed: number) {
  return function () {
    let t = seed += 0x6D2B79F5
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export default function ProductShuffleView({
  products,
  imageFx,
}: {
  products: Product[]
  imageFx: ImageFxSettings
}) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [seed, setSeed] = useState(1)
  const [positions, setPositions] = useState<Record<string, Pos>>({})

  const ids = useMemo(() => products.map(p => p.id), [products])

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const compute = () => {
      const rect = el.getBoundingClientRect()
      const width = rect.width
      // Provide enough vertical space for random layout
      const height = Math.max(900, Math.round(products.length * 220))

      const rand = mulberry32(seed)
      const next: Record<string, Pos> = {}

      for (const p of products) {
        // Keep within bounds with padding
        const pad = 24
        const cardW = Math.min(340, Math.max(240, width * 0.32))
        const cardH = 420

        const x = pad + rand() * Math.max(0, width - cardW - pad * 2)
        const y = pad + rand() * Math.max(0, height - cardH - pad * 2)
        const r = (rand() - 0.5) * 10 // -5..5 deg

        next[p.id] = { x, y, r }
      }

      setPositions(next)
      el.style.minHeight = `${height}px`
    }

    compute()
    const ro = new ResizeObserver(() => compute())
    ro.observe(el)
    return () => ro.disconnect()
  }, [products, seed])

  // Ensure we drop positions for removed items.
  useEffect(() => {
    setPositions((prev) => {
      const next: Record<string, Pos> = {}
      for (const id of ids) {
        if (prev[id]) next[id] = prev[id]
      }
      return next
    })
  }, [ids])

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-3">
        <div className="text-xs font-mono text-ink-lighter">
          shuffle mode ({products.length} items)
        </div>
        <button
          onClick={() => setSeed((s) => s + 1)}
          className="px-2 py-1 border border-border hover:bg-paper-dark transition-all text-xs text-ink-light"
        >
          [reshuffle]
        </button>
      </div>

      <div ref={ref} className="relative w-full">
        {products.map((p) => {
          const pos = positions[p.id]
          return (
            <div
              key={p.id}
              className="absolute"
              style={{
                left: pos?.x ?? 0,
                top: pos?.y ?? 0,
                transform: `rotate(${pos?.r ?? 0}deg)`,
                width: 320,
              }}
            >
              <ProductCard product={p} imageFx={imageFx} onClick={() => {}} />
            </div>
          )
        })}
      </div>
    </div>
  )
}


