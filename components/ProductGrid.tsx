import ProductCard from './ProductCard'
import type { ImageFxSettings, Product } from '@/types'

interface ProductGridProps {
  products: Product[]
  imageFx: ImageFxSettings
  onProductClick: (product: Product) => void
}

export default function ProductGrid({ products, imageFx, onProductClick }: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 auto-rows-fr gap-6 max-w-7xl mx-auto">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          imageFx={imageFx}
          onClick={() => onProductClick(product)}
        />
      ))}
    </div>
  )
}
