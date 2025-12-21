'use client'

import ProductCard from './ProductCard'
import type { Product } from '@/types'

interface ProductGridProps {
  products: Product[]
  onProductClick: (product: Product) => void
}

export default function ProductGrid({ products, onProductClick }: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 auto-rows-fr gap-6 max-w-7xl mx-auto">
      {products.map((product, index) => (
        <div
          key={product.id}
          className="animate-fadeInUp"
          style={{
            animationDelay: `${index * 50}ms`,
            animationFillMode: 'both'
          }}
        >
          <ProductCard
            product={product}
            onClick={() => onProductClick(product)}
          />
        </div>
      ))}
    </div>
  )
}
