'use client'

import { useState } from 'react'
import ProductCard from './ProductCard'
import type { Product } from '@/types'

interface ProductGridProps {
  products: Product[]
  onProductClick: (product: Product) => void
}

export default function ProductGrid({ products, onProductClick }: ProductGridProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 auto-rows-fr gap-6 max-w-7xl mx-auto">
      {products.map((product, index) => (
        <div
          key={product.id}
          className="animate-fadeInUp"
          style={{
            animationDelay: `${index * 50}ms`,
            animationFillMode: 'both',
            zIndex: hoveredIndex === index ? 99999 : 1,
            position: 'relative',
          }}
        >
          <ProductCard
            product={product}
            onClick={() => onProductClick(product)}
            onHoverChange={(isHovered) => setHoveredIndex(isHovered ? index : null)}
          />
        </div>
      ))}
    </div>
  )
}
