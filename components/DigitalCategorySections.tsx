'use client'

import { useEffect } from 'react'
import type { Product } from '@/types'
import ProductGrid from './ProductGrid'

interface DigitalCategorySectionsProps {
  products: Product[]
  onProductClick: (product: Product) => void
  scrollToCategory?: string
}

export default function DigitalCategorySections({
  products,
  onProductClick,
  scrollToCategory,
}: DigitalCategorySectionsProps) {
  // Group products by category
  const gameProducts = products.filter((p) => p.category === 'game')
  const softwareProducts = products.filter((p) => p.category === 'software')
  const watchlistProducts = products.filter((p) => p.category === 'watchlist')

  // Scroll to section when category is clicked
  useEffect(() => {
    if (scrollToCategory) {
      if (scrollToCategory === 'all') {
        // Scroll to top when "all" is clicked
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else {
        const element = document.getElementById(`section-${scrollToCategory}`)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }
    }
  }, [scrollToCategory])

  return (
    <div className="space-y-16">
      {/* Games Section */}
      {gameProducts.length > 0 && (
        <section id="section-game">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-mono text-ink mb-6 uppercase tracking-wider">Games</h2>
          </div>
          <ProductGrid products={gameProducts} onProductClick={onProductClick} />
        </section>
      )}

      {/* Software Section */}
      {softwareProducts.length > 0 && (
        <section id="section-software">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-mono text-ink mb-6 uppercase tracking-wider">Software</h2>
          </div>
          <ProductGrid products={softwareProducts} onProductClick={onProductClick} />
        </section>
      )}

      {/* Watchlist Section */}
      {watchlistProducts.length > 0 && (
        <section id="section-watchlist">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-mono text-ink mb-6 uppercase tracking-wider">Watch List</h2>
          </div>
          <ProductGrid products={watchlistProducts} onProductClick={onProductClick} />
        </section>
      )}

      {/* No products message */}
      {gameProducts.length === 0 && softwareProducts.length === 0 && watchlistProducts.length === 0 && (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <p className="text-ink-lighter font-mono text-sm">no digital items yet</p>
          </div>
        </div>
      )}
    </div>
  )
}
