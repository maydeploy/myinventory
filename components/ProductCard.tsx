'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import type { Product } from '@/types'
import { useIsDarkMode } from '@/lib/useIsDarkMode'
import { isDigitalCategory } from '@/lib/categories'
import TicketCard from './TicketCard'
import ReceiptNote from './ReceiptNote'

interface ProductCardProps {
  product: Product
  onClick: () => void
}

export default function ProductCard({ product, onClick }: ProductCardProps) {
  const isDark = useIsDarkMode()
  const isWishlist = product.category === 'wishlist'
  const isWatchlist = product.category === 'watchlist'
  const isDigital = isDigitalCategory(product.category)

  const cardRef = useRef<HTMLDivElement>(null)

  // Use ticket layout for watchlist digital products
  if (isWatchlist) {
    return <TicketCard product={product} onClick={onClick} />
  }
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
      ref={cardRef}
      onClick={handleClick}
      className={`
        product-card group relative bg-white border border-border hover:border-accent transition-all cursor-pointer overflow-visible
        flex flex-col h-full
        ${isWishlist ? 'border-dashed' : ''}
        ${product.url ? 'cursor-pointer' : 'cursor-default'}
      `}
      style={{
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
      }}
    >
      {/* Receipt Note on Hover */}
      {product.note && (
        <div className="absolute -top-2 -right-2 w-48 bg-white shadow-lg p-2 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-[100] origin-top-right"
          style={{
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            transform: 'translateX(10%) translateY(240%)',
            transition: 'transform 0.3s ease-out',
          }}
        >
          <ReceiptNote note={product.note} date={formattedDate} />
        </div>
      )}

      {/* Image */}
      <div className="product-card-media relative w-full h-64 overflow-visible flex items-center justify-center">
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={product.name}
            fill
            className={`object-contain transition-transform duration-150 ease-out will-change-transform ${
              !isDigital ? 'group-hover:scale-[1.2] group-hover:-rotate-[10deg] group-hover:translate-x-[-10%] group-hover:translate-y-[-10%]' : ''
            }`}
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl text-[#c9c9c9]">
            [ ]
          </div>
        )}
      </div>

      {/* Content */}
      <div className="product-card-content p-3 flex flex-col flex-1 justify-end">
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
