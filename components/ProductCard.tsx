'use client'

import Image from 'next/image'
import type { Product } from '@/types'
import { useIsDarkMode } from '@/lib/useIsDarkMode'
import { isDigitalCategory } from '@/lib/categories'

interface ProductCardProps {
  product: Product
  onClick: () => void
}

export default function ProductCard({ product, onClick }: ProductCardProps) {
  const isDark = useIsDarkMode()
  const isWishlist = product.category === 'wishlist'
  const isDigital = isDigitalCategory(product.category)
  const formattedDate = new Date(product.createdTime).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
  const imageSrc = (isDark && product.darkModeCoverImage) ? product.darkModeCoverImage : product.coverImage

  const handleClick = () => {
    if (product.url) {
      window.open(product.url, '_blank')
    }
  }

  return (
    <div
      onClick={handleClick}
      className={`
        product-card group relative bg-white border border-border hover:border-accent transition-all cursor-pointer overflow-visible
        flex flex-col h-full
        ${isWishlist ? 'border-dashed' : ''}
        ${product.url ? 'cursor-pointer' : 'cursor-default'}
      `}
    >
      {/* Sticky Note on Hover */}
      {product.note && (
        <div className="sticky-note absolute -top-2 -right-2 w-48 bg-[#FFF9C4] shadow-lg p-3 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-10 origin-top-right transform scale-90 group-hover:scale-100 rotate-3 group-hover:rotate-6 translate-x-[10%] translate-y-[120%]"
          style={{
            boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
          }}
        >
          <div className="flex flex-col justify-between min-h-24 text-xs font-mono text-ink">
            <div className="text-[12px] leading-tight line-clamp-6">
              {product.note}
            </div>

            <div className="pt-2 text-ink-lighter text-[12px] text-left">
              {formattedDate}
            </div>
          </div>
        </div>
      )}

      {/* Image */}
      <div className="product-card-media relative w-full h-64 overflow-visible flex items-center justify-center bg-white">
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={product.name}
            fill
            className="object-contain transition-transform duration-150 ease-out will-change-transform group-hover:scale-[1.2] group-hover:-rotate-[20deg] group-hover:translate-x-[-20%] group-hover:translate-y-[-10%]"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl bg-white text-[#c9c9c9]">
            [ ]
          </div>
        )}
      </div>

      {/* Content */}
      <div className="product-card-content p-3 flex flex-col flex-1">
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
            {product.brand && (
              <>
                <span>{product.brand}</span>
                <span>·</span>
              </>
            )}
            <span>{product.category}</span>
          </div>

          {!isDigital && (
            <div className="flex items-center justify-between border-t border-border pt-2">
              <p className="text-sm font-bold text-ink font-mono">
                ${product.price.toFixed(2)}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
