'use client'

import Image from 'next/image'
import type { Product } from '@/types'

interface ProductCardProps {
  product: Product
  onClick: () => void
}

export default function ProductCard({ product, onClick }: ProductCardProps) {
  const isWishlist = product.category === 'wishlist'
  const formattedDate = new Date(product.createdTime).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

  const handleClick = () => {
    if (product.url) {
      window.open(product.url, '_blank')
    }
  }

  return (
    <div
      onClick={handleClick}
      className={`
        group relative bg-white border border-border hover:border-accent transition-all cursor-pointer overflow-visible
        flex flex-col h-full
        ${isWishlist ? 'border-dashed' : ''}
        ${product.url ? 'cursor-pointer' : 'cursor-default'}
      `}
    >
      {/* Sticky Note on Hover */}
      {product.note && (
        <div className="absolute -top-2 -right-2 w-48 bg-[#FFF9C4] shadow-lg p-3 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-10 origin-top-right transform scale-90 group-hover:scale-100 rotate-3 group-hover:rotate-6"
          style={{
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          }}
        >
          <div className="flex flex-col justify-between min-h-24 text-xs font-mono text-ink">
            <div className="text-[10px] leading-tight line-clamp-6">
              {product.note}
            </div>

            <div className="pt-2 text-ink-lighter text-[10px] text-left">
              {formattedDate}
            </div>
          </div>
        </div>
      )}

      {/* Image */}
      <div className="relative w-full h-64 overflow-hidden flex items-center justify-center bg-paper">
        {product.coverImage ? (
          <Image
            src={product.coverImage}
            alt={product.name}
            fill
            className="object-contain opacity-60"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl text-ink-lighter">
            [ ]
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3 flex flex-col flex-1">
        {/* Spacer pushes title + footer to bottom, so title grows upward when it wraps */}
        <div className="flex-1" />

        <div className="flex items-start justify-start gap-2 mb-2">
          <h3 className="font-mono text-sm line-clamp-2 flex-1 text-ink leading-tight">
            {product.name}
          </h3>
          {isWishlist && (
            <span className="text-ink-lighter text-xs ml-auto">*</span>
          )}
        </div>

        {/* Footer: fixed bottom position across cards */}
        <div>
          <div className="flex flex-wrap items-center gap-1 mb-2 text-xs text-ink-lighter font-mono">
            <span>{product.brand}</span>
            <span>·</span>
            <span>{product.category}</span>
          </div>

          <div className="flex items-center justify-between border-t border-border pt-2">
            <p className="text-sm font-bold text-ink font-mono">
              ${product.price.toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
