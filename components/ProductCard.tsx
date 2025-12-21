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
  const [rotateX, setRotateX] = useState(0)
  const [rotateY, setRotateY] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  // Use ticket layout for watchlist digital products
  if (isWatchlist) {
    return <TicketCard product={product} onClick={onClick} />
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || !isDigital) return

    const card = cardRef.current
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const centerX = rect.width / 2
    const centerY = rect.height / 2

    const rotateXValue = ((y - centerY) / centerY) * -10
    const rotateYValue = ((x - centerX) / centerX) * 10

    setRotateX(rotateXValue)
    setRotateY(rotateYValue)
  }

  const handleMouseLeave = () => {
    if (!isDigital) return
    setRotateX(0)
    setRotateY(0)
    setIsHovered(false)
  }

  const handleMouseEnter = () => {
    if (!isDigital) return
    setIsHovered(true)
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
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      className={`
        product-card group relative bg-white border border-border hover:border-accent transition-all cursor-pointer overflow-visible
        flex flex-col h-full
        ${isWishlist ? 'border-dashed' : ''}
        ${product.url ? 'cursor-pointer' : 'cursor-default'}
      `}
      style={isDigital ? {
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${isHovered ? 1.02 : 1})`,
        transition: 'transform 0.1s ease-out, box-shadow 0.3s ease, z-index 0s',
        boxShadow: isHovered
          ? `${rotateY * 2}px ${rotateX * 2}px 20px rgba(0,0,0,0.15)`
          : '0 2px 4px rgba(0,0,0,0.05)',
        transformStyle: 'preserve-3d',
        zIndex: isHovered ? 1000 : 1,
      } : {
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
      }}
    >
      {/* Receipt Note on Hover */}
      {product.note && (
        <div className="absolute -top-2 -right-2 w-48 bg-white shadow-lg p-2 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-[100] origin-top-right"
          style={{
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            transform: isDigital
              ? `translateX(10%) translateY(240%) scale(${isHovered ? 1 : 0.9}) translateZ(${isHovered ? '50px' : '0px'})`
              : `translateX(10%) translateY(240%) scale(${isHovered ? 1 : 0.9})`,
            transition: 'transform 0.3s ease-out',
          }}
        >
          <ReceiptNote note={product.note} date={formattedDate} />
        </div>
      )}

      {/* Image */}
      <div
        className="product-card-media relative w-full h-64 overflow-visible flex items-center justify-center"
        style={isDigital ? {
          transform: `translateZ(${isHovered ? '30px' : '0px'})`,
          transition: 'transform 0.3s ease-out',
        } : {}}
      >
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={product.name}
            fill
            className="object-contain transition-transform duration-150 ease-out will-change-transform group-hover:scale-[1.2] group-hover:-rotate-[10deg] group-hover:translate-x-[-10%] group-hover:translate-y-[-10%]"
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
