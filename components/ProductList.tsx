'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { Product } from '@/types'
import { useIsDarkMode } from '@/lib/useIsDarkMode'
import { isDigitalCategory } from '@/lib/categories'
import ReceiptNote from './ReceiptNote'

interface ProductListProps {
  products: Product[]
  onProductClick: (product: Product) => void
}

export default function ProductList({ products, onProductClick }: ProductListProps) {
  return (
    <div className="space-y-2">
      {products.map((product, index) => (
        <ProductListItem
          key={product.id}
          product={product}
          onClick={() => onProductClick(product)}
          index={index}
        />
      ))}
    </div>
  )
}

function ProductListItem({
  product,
  onClick,
  index,
}: {
  product: Product
  onClick: () => void
  index: number
}) {
  const isDark = useIsDarkMode()
  const isWishlist = product.category === 'wishlist'
  const isDigital = isDigitalCategory(product.category)
  const imageSrc = (isDark && product.darkModeCoverImage) ? product.darkModeCoverImage : product.coverImage
  const isGameOrSoftware = product.category === 'game' || product.category === 'software'
  const [isHovered, setIsHovered] = useState(false)

  const handleClick = () => {
    if (product.url) {
      window.open(product.url, '_blank')
    }
  }

  return (
    <div
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        w-full flex items-center gap-3 p-3 relative group
        ${isDigital ? '' : 'border-b border-border'} hover:bg-paper-dark transition-all
        ${index % 2 === 0 ? 'bg-white' : 'bg-paper'}
        ${product.url ? 'cursor-pointer' : 'cursor-default'}
      `}
      style={{
        zIndex: isHovered ? 99999 : 1,
        position: 'relative',
      }}
    >
      {/* Receipt Note on Hover */}
      {product.note && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-80 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none origin-top transform scale-85 group-hover:scale-100"
          style={{
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.08))',
            transform: isHovered
              ? 'translate(-50%, -50%) scale(1) rotate(0deg)'
              : 'translate(-50%, -50%) scale(0.85) rotate(4deg)',
            transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease-out',
            zIndex: 100000,
          }}
        >
          <ReceiptNote note={product.note} date={product.date} />
        </div>
      )}

      {/* Thumbnail */}
      <div className="relative w-12 h-12 flex-shrink-0 border border-border flex items-center justify-center bg-white overflow-hidden">
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={product.name}
            fill
            unoptimized
            className={`${isGameOrSoftware ? 'object-cover' : 'object-contain'} ${
              isDigital ? 'grayscale group-hover:grayscale-0' : ''
            } transition-all duration-150`}
            sizes="48px"
            onError={(e) => {
              console.error('Thumbnail failed to load:', imageSrc)
              e.currentTarget.style.display = 'none'
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-lg bg-white text-[#c9c9c9]">
            [ ]
          </div>
        )}
      </div>

      {/* Name */}
      <div className="flex-1 min-w-0">
        <p className="font-mono text-sm truncate text-ink">
          {product.name}
        </p>
      </div>

      {/* Brand (if present) */}
      {product.brand && (
        <div className="w-24 hidden md:block">
          <span className="text-xs text-ink-lighter font-mono">
            {product.brand}
          </span>
        </div>
      )}

      {/* Category */}
      <div className="w-20 hidden lg:block">
        <span className="text-xs text-ink-lighter font-mono">{product.category}</span>
      </div>

      {/* Price (physical only) */}
      {!isDigital && (
        <div className="w-20 text-right">
          <span className="font-mono text-sm text-ink">${product.price.toFixed(2)}</span>
        </div>
      )}

      {isWishlist && (
        <span className="text-ink-lighter text-xs">*</span>
      )}
    </div>
  )
}
